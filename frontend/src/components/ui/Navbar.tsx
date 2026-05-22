"use client";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  GraduationCap,
  Scale,
  Brain,
  Search,
  Bookmark,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";

import { useState } from "react";

const links = [
  {
    href: "/",
    label: "Colleges",
    icon: Search,
  },

  {
    href: "/compare",
    label: "Compare",
    icon: Scale,
  },

  {
    href: "/predict",
    label: "Predictor",
    icon: Brain,
  },
];

export default function Navbar() {
  const pathname =
    usePathname();

  const router = useRouter();

  const { user, logout } =
    useAuth();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const handleLogout = () => {
    logout();

    router.push("/");

    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link
          href="/"

          className="flex items-center gap-2.5 group shrink-0"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors">

            <GraduationCap className="w-5 h-5 text-white" />
          </div>

          <span className="font-heading font-bold text-gray-900 text-lg">
            Edu
            <span className="text-indigo-600">
              Search
            </span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">

          {links.map(
            ({
              href,
              label,
              icon: Icon,
            }) => (
              <Link
                key={href}

                href={href}

                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",

                  pathname === href
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <Icon className="w-4 h-4" />

                {label}
              </Link>
            )
          )}
        </div>
        <div className="hidden md:flex items-center gap-3">

          {user ? (
            <>

              <div className="flex items-center gap-2 text-sm text-gray-700">

                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">

                  <User className="w-4 h-4 text-indigo-600" />
                </div>

                <span className="font-medium">
                  {user.name}
                </span>
              </div>

              <Link
                href="/saved"

                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",

                  pathname === "/saved"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <Bookmark className="w-4 h-4" />

                Saved
              </Link>

              <button
                onClick={
                  handleLogout
                }

                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />

                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"

                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>

              <Link
                href="/register"

                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() =>
            setMobileOpen(
              !mobileOpen
            )
          }

          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {mobileOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 shadow-lg">

          <div className="flex flex-col gap-2">

            {links.map(
              ({
                href,
                label,
                icon: Icon,
              }) => (
                <Link
                  key={href}

                  href={href}

                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }

                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",

                    pathname === href
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-5 h-5" />

                  {label}
                </Link>
              )
            )}
          </div>

          <div className="border-t border-gray-100 pt-3">

            {user ? (
              <div className="space-y-3">

                <div className="flex items-center gap-3 px-2">

                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">

                    <User className="w-5 h-5 text-indigo-600" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {user.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/saved"

                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }

                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  <Bookmark className="w-5 h-5" />

                  Saved Items
                </Link>

                <button
                  onClick={
                    handleLogout
                  }

                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5" />

                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">

                <Link
                  href="/login"

                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }

                  className="w-full text-center border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Login
                </Link>

                <Link
                  href="/register"

                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }

                  className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}