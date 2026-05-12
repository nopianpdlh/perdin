"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlobeHemisphereWestIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks";
import { initStorage } from "@/lib/storage";

export default function LoginPage() {
  const { session, login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initStorage();
  }, []);

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const ok = login(username, password);
    if (!ok) {
      setError("Username atau password salah.");
      toast.error("Login gagal. Periksa username atau password.");
      setLoading(false);
      return;
    }
    toast.success("Login berhasil. Mengarahkan ke dashboard...");
    router.replace("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-cyan-900 to-cyan-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-cyan-100">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-cyan-700 rounded-xl mb-4 text-white">
              <GlobeHemisphereWestIcon size={30} weight="duotone" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">PERDIN</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sistem Manajemen Perjalanan Dinas
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                 className="input-base"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                 className="input-base"
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
               className="w-full bg-cyan-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-cyan-800 transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? "Masuk..." : "Masuk"}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3">
              Akun Demo
            </p>
            <div className="space-y-1.5 text-xs text-gray-500">
              <div className="flex justify-between bg-gray-50 rounded px-3 py-1.5">
                <span className="font-medium">Admin</span>
                <span className="font-mono">admin / admin123</span>
              </div>
              <div className="flex justify-between bg-gray-50 rounded px-3 py-1.5">
                <span className="font-medium">SDM</span>
                <span className="font-mono">sdm01 / sdm123</span>
              </div>
              <div className="flex justify-between bg-gray-50 rounded px-3 py-1.5">
                <span className="font-medium">Pegawai</span>
                <span className="font-mono">pegawai01 / pegawai123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
