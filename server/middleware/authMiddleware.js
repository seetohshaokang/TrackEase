const admin = require("../config/firebaseAdminConfig");
const axios = require("axios");

exports.checkFirebaseAuth = (req, res, next) => {
  console.log("Headers received:", req.headers);
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    // Backend logging
    console.log("Unauthorized: No Firebase Token Provided ");
    return res
      .status(403)
      .json({ error: "Unauthorized: No Firebase Token Provided" });
  }
  const firebaseToken = req.headers.authorization.split("Bearer ")[1];
  console.log("Firebase Token received: ", firebaseToken); // Log token for debugging

  admin
    .auth()
    .verifyIdToken(firebaseToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      console.log("Decoded token:", decodedToken);
      next();
    })
    .catch((error) => {
      if (error.code === "auth/id-token-expired") {
        console.error("Firebase token has expired:", error);
        res.status(401).json({
          error: "Unauthorized",
          details: "Firebase ID token expired. Please refresh your token",
        });
      } else {
        console.error("Firebase token verification failed:", error);
        res.status(403).json({ error: "Unauthorized", details: error.message });
      }
    });
};

exports.requireGoogleToken = (req, res, next) => {
  console.log("Headers received:", req.headers);
  const googleAccessTokenHeader = req.headers["google-token"];
  console.log("Google Access Token Header:", googleAccessTokenHeader);
  if (
    !googleAccessTokenHeader ||
    !googleAccessTokenHeader.startsWith("Bearer ")
  ) {
    console.error(
      "Unauthorized: No or improperly formatted Google Access Token Provided"
    );
    return res.status(403).json({
      error:
        "Unauthorized: No or improperly formatted Google Access Token Provided",
    });
  }

  const googleAccessToken = googleAccessTokenHeader.split("Bearer ")[1].trim();
  console.log("Google access token received: ", googleAccessToken);

  // Validate the token with Google's OAuth2 endpoint
  axios
    .get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${googleAccessToken}`
    )
    .then((response) => {
      const data = response.data;
      if (data.error) {
        throw new Error(data.error);
      }
      // Attach google access token
      req.headers["google-token-clean"] = googleAccessToken;
      next();
    })
    .catch((error) => {
      console.error("Failed to verify Google Token:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request Data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      res.status(500).json({
        error: "Failed to verify Google Token",
        details: error.message,
      });
    });
};
