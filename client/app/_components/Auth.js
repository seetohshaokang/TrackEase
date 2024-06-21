"use client";

import { getIdToken, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, provider } from "../_firebase/firebaseConfig";

function Auth() {
  const router = useRouter();

  function signInWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // const token = result.user.accessToken;

        getIdToken(result.user).then((idToken) => {
          console.log(idToken);
          localStorage.setItem("token", idToken);
          alert("You have successfully logged in!");
          router.push("/tasks");
        });
        /*
        localStorage.setItem("token", token); // Store token in localStorage
        alert("You have successfully logged in!"); // Alert user of successful login
        router.push("/tasks");
        // Handle successful login here
        */
      })
      .catch((error) => {
        console.error(error);
        // Handle errors here
      });
  }

  function signOutUser() {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("token"); // Remove token from local storage
        console.log("User signed out");
        alert("You have successfully logged out!"); // Alert user of successful logout
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <button className="btn btn-outline btn-success mt-5" onClick={signInWithGoogle}>Sign in with Google </button>
    </div>
  );
}
export default Auth;
