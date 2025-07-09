"use client";
export const dynamic = "force-dynamic";
import Navbar from "../../components/Navbar";
import SuccessClient from "./SuccessClient";
import { Suspense } from "react";

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessClient />
      </Suspense>
    </>
  );
}
