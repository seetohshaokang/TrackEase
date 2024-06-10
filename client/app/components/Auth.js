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
        console.log("User signed out");
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
