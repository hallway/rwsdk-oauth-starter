"use client";

import { setupAuthClient } from "@/lib/auth-client";

export function SignoutButton() {
  const authClient = setupAuthClient("http://localhost:5173");

  const handleSignOut = () => {
    authClient.signOut().then(() => { console.log("signed out"); window.location.reload(); });
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Logout
    </button>
  );
}