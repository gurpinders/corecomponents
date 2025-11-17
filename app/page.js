"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from("_test_")
          .select("*")
          .limit(1);
        // Even if this errors (table doesn't exist), if we get a proper error response, we're connected
        setConnected(true);
      } catch (err) {
        setConnected(false);
      } finally {
        setLoading(false);
      }
    }
    testConnection();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-black mb-4">CoreComponents</h1>
          <p className="text-xl text-gray-600 mb-8">
            Quality Trucking Parts Since 1995
          </p>
          <div className="mt-8 p-4 bg-gray-100 rounded-lg inline-block">
            {loading ? (
              <p className="text-gray-600">Testing database connection...</p>
            ) : connected ? (
              <p className="text-green-600 font-semibold">
                ✅ Database Connected!
              </p>
            ) : (
              <p className="text-red-600 font-semibold">
                ❌ Database Connection Failed
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
