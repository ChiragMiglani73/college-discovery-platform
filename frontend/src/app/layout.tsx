import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import AlertProvider from "@/components/AlertProvider";

export const metadata: Metadata = {
  title: "EduSearch — College Discovery Platform",
  description: "Find, compare and decide your dream college in India",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <AuthProvider>
          <Toaster
  position="top-right"
  toastOptions={{
    className:
      "rounded-2xl shadow-2xl border border-gray-200",

    style: {
      background: "#111827",
      color: "#fff",
      padding: "16px",
      fontSize: "14px",
    },

    success: {
      style: {
        background: "#10B981",
        color: "#fff",
      },

      iconTheme: {
        primary: "#fff",
        secondary: "#10B981",
      },
    },

    error: {
      style: {
        background: "#EF4444",
        color: "#fff",
      },

      iconTheme: {
        primary: "#fff",
        secondary: "#EF4444",
      },
    },
  }}
/>
          <AlertProvider />
          <Navbar />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
          <footer className="bg-white border-t border-gray-100 py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
              <p className="font-heading font-semibold text-gray-700 text-base mb-1">EduSearch</p>
              <p>© 2026 College Discovery Platform · Built with Next.js, Node.js & PostgreSQL</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
