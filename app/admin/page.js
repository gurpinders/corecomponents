"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, signOut } from "@/lib/auth";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { user: currentUser } = await getUser();
      if (!currentUser) {
        router.push("/admin/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login')
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-black mb-4">Admin Dashboard</h1>
      <p className="text-gray-600">Welcome, {user?.email}!</p>
      <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4">Logout</button>
    </div>
  );
}
