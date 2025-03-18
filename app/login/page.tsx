"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth"; // Added signOut import
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!keepLoggedIn) {
      timeout = setTimeout(() => {
        signOut(auth);
        router.push("/login");
      }, 60000); // 1-minute auto-logout
    }
    return () => clearTimeout(timeout);
  }, [keepLoggedIn, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      setError("Login failed: " + (error as Error).message); // Typecast the error
    }
  };

  const handleForgotPassword = async () => {
    if (email.trim() === "") {
      setError("Please enter your email to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setError("Password reset email sent!");
    } catch (error: any) {
      setError("Error sending password reset email: " + (error as Error).message); // Typecast the error
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
            className="mr-2"
          />
          <label>Keep me logged in</label>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Sign In
        </button>
        <div className="mt-2 text-center">
          <button
            type="button"
            className="text-blue-500"
            onClick={() => setForgotPassword(!forgotPassword)}
          >
            Forgot Password?
          </button>
        </div>
        <div className="mt-2 text-center">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className="text-blue-500"
              onClick={() => router.push("/register")}
            >
              Register here
            </button>
          </p>
        </div>
        {forgotPassword && (
          <div className="mt-4">
            <button
              type="button"
              className="text-blue-500"
              onClick={handleForgotPassword}
            >
              Reset Password
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
