"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import API from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();

  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post(
        "/auth/register",
        form
      );

      login(
        res.data.token,
        res.data.user
      );

      router.push("/");
    } catch (error: any) {
      alert(
        error.response?.data?.error ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16">
      <div className="bg-white rounded-2xl shadow-sm p-8 border">
        <h1 className="text-3xl font-bold mb-6">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Name"
            className="w-full border rounded-xl p-3"

            value={form.name}

            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-xl p-3"

            value={form.email}

            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl p-3"

            value={form.password}

            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold"
          >
            {loading
              ? "Creating..."
              : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}