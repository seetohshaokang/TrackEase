"use client";

import { signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, provider } from "./../firebase/firebaseConfig";

function Auth() {
  const router = useRouter();

  function signInWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        const token = result.user.accessToken;
        localStorage.setItem("token", token); // Store token in localStorage
        alert("You have successfully logged in!"); // Alert user of successful login
        router.push("/tasks");
        // Handle successful login here
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
      <button onClick={signInWithGoogle}>Sign in with Google </button>
      <button onClick={signOutUser}>Sign out</button>
    </div>
  );
}
export default Auth;
