"use client";

import {
  GoogleAuthProvider,
  getIdToken,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../_firebase/firebaseConfig";

export function signOutUser() {
  return signOut(auth)
    .then(() => {
      localStorage.removeItem("firebaseToken"); // Remove firebase token
      console.log("removed firebaseToken");
      localStorage.removeItem("googleAccessToken");
      console.log("removed googleAccessToken");
      alert("You have successfully logged out!"); // Alert user of successful logout
    })
    .catch((error) => {
      console.error("Sign-out error:", error);
      alert("Failed to sign out.");
    });
}

function Auth() {
  const router = useRouter();

  async function signInWithGoogle() {
    // Configure Google Provider to request access to Google Calendar
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/calendar");

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const googleAccessToken = credential.accessToken;

      const idToken = await getIdToken(result.user, true);
      console.log("Firebase ID Token:", idToken);
      console.log("Google Access Token:", googleAccessToken);

      // Store both tokens in localStorage
      localStorage.setItem("firebaseToken", idToken);
      localStorage.setItem("googleAccessToken", googleAccessToken);
      alert("You have successfully logged in!");
      router.push("/tasks");
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  }

  return (
    <div>
      <button className="btn btn-success text-white btn-lg mt-5" onClick={signInWithGoogle}>Sign in with Google </button>
    </div>
  );
}
export default Auth;
