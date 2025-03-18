"use client";

import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation"; // ✅ FIXED


export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <button onClick={handleLogout} className="cursor-pointer bg-red-500 text-white p-2 rounded">
      Logout
    </button>
  );
}
