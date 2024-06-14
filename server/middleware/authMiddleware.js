const admin = require("../config/firebaseAdminConfig");

exports.checkAuth = (req, res, next) => {
  // console.log(req);
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  const token = req.headers.authorization.split("Bearer ")[1];
  // console.log("Token received: ", token); // Log token for debugging
  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.user = decodedToken;
      // console.log("Decoded token:", decodedToken);
      next();
    })
    .catch((error) =>
      res.status(403).json({ error: "Unauthorized", details: error })
    );
};
