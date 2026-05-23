"use client";

import { Suspense } from "react";
import CompareContent from "./CompareContent";

export default function ComparePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompareContent />
    </Suspense>
  );
}