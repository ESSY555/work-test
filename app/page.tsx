"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth } from "../app/lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // Import icons

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State for password visibility

    useEffect(() => {
        let timeout: NodeJS.Timeout | number;
        if (!keepLoggedIn) {
            timeout = setTimeout(() => {
                signOut(auth);
                router.push("/");
            }, 60000);
        }
        return () => clearTimeout(timeout);
    }, [keepLoggedIn, router]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/dashboard");
        } catch (error) {
            if (error instanceof Error) {
                setError("Login failed: " + error.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
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
        } catch (error) {
            if (error instanceof Error) {
                setError("Error sending password reset email: " + error.message);
            } else {
                setError("An unknown error occurred.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-500 p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Login</h2>
                {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm text-center mb-4">{error}</motion.p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <label className="block text-gray-700 -pb-2">Email</label>
                    <motion.input
                        whileFocus={{ scale: 1.05 }}
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <label className="block text-gray-700">Password</label>
                    <div className="relative">
                        <motion.input
                            whileFocus={{ scale: 1.05 }}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded-lg p-3 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={keepLoggedIn}
                                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                                className="mr-2"
                            />
                            Keep me logged in
                        </label>
                        <button
                            type="button"
                            className="text-blue-500 hover:underline"
                            onClick={() => setForgotPassword(!forgotPassword)}
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {/* Sign In Button with Loader */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className={`cursor-pointer bg-blue-500 text-white font-semibold py-3 w-full rounded-lg hover:bg-blue-600 transition flex justify-center items-center ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.372 0 0 5.372 0 12h4z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </motion.button>
                </form>

                <p className="text-center text-sm mt-4">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        className="cursor-pointer text-blue-500 hover:underline"
                        onClick={() => router.push("/register")}
                    >
                        Register here
                    </button>
                </p>

                {forgotPassword && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
                        <button
                            type="button"
                            className="text-blue-500 hover:underline"
                            onClick={handleForgotPassword}
                        >
                            Reset Password
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
