"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MaintenancePage() {
  const router = useRouter();
  
  // Redirect to the new maintenance flow
  // The [categoryId] route now handles the full flow starting with vehicle selection
  // Using "new" as a special categoryId that triggers the new flow
  useEffect(() => {
    router.replace("/maintenance/new");
  }, [router]);
  
  return null;
}
