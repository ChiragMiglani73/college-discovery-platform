

"use client";

import { useEffect } from "react";

import toast from "react-hot-toast";

export default function AlertProvider() {
  useEffect(() => {
    window.alert = (message?: string) => {
      toast(message || "");
    };
  }, []);

  return null;
}