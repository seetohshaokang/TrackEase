import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../_firebase/firebaseConfig";
import Auth, { signOutUser } from "./../_components/Auth";

// Mock Firebase Auth functions and next/router
jest.mock("firebase/auth");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Auth Component", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockRouterPush });

    // Mock console.error and window.alert
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("renders the Sign in with Google button", () => {
    render(<Auth />);
    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
  });

  test("calls signInWithGoogle when button is clicked", async () => {
    const mockUser = {
      uid: "123",
      getIdToken: jest.fn().mockResolvedValue("mockIdToken"),
    };
    const mockSignInWithPopup = signInWithPopup.mockResolvedValue({
      user: mockUser,
      credential: {
        accessToken: "mockAccessToken",
      },
    });

    render(<Auth />);
    fireEvent.click(screen.getByText("Sign in with Google"));

    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalledWith(
        auth,
        expect.any(GoogleAuthProvider)
      );
    });

    // Adding debug logs to check the values
    console.log("Firebase ID Token:", localStorage.getItem("firebaseToken"));
    console.log(
      "Google Access Token:",
      localStorage.getItem("googleAccessToken")
    );

    expect(localStorage.getItem("firebaseToken")).toBe("mockIdToken");
    expect(localStorage.getItem("googleAccessToken")).toBe("mockAccessToken");
    expect(mockRouterPush).toHaveBeenCalledWith("/tasks");
  });

  test("handles error during sign-in", async () => {
    const mockSignInWithPopup = signInWithPopup.mockRejectedValue(
      new Error("Sign-in error")
    );

    render(<Auth />);
    fireEvent.click(screen.getByText("Sign in with Google"));

    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalledWith(
        auth,
        expect.any(GoogleAuthProvider)
      );
    });

    expect(console.error).toHaveBeenCalledWith(
      "Error during sign-in:",
      new Error("Sign-in error")
    );
  });

  test("calls signOutUser and clears tokens on sign out", async () => {
    const mockSignOut = signOut.mockResolvedValue();

    await signOutUser();

    expect(mockSignOut).toHaveBeenCalledWith(auth);
    expect(localStorage.getItem("firebaseToken")).toBeNull();
    expect(localStorage.getItem("googleAccessToken")).toBeNull();
    expect(window.alert).toHaveBeenCalledWith(
      "You have successfully logged out!"
    );
  });

  test("handles error during sign out", async () => {
    const mockSignOut = signOut.mockRejectedValue(new Error("Sign-out error"));

    await signOutUser();

    expect(mockSignOut).toHaveBeenCalledWith(auth);
    expect(console.error).toHaveBeenCalledWith(
      "Sign-out error:",
      new Error("Sign-out error")
    );
    expect(window.alert).toHaveBeenCalledWith("Failed to sign out.");
  });
});
