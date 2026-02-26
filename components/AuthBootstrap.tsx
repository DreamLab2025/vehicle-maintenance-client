"use client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AuthBootstrap() {
  const { initAuthFromStorage } = useAuth();
  useEffect(() => {
    initAuthFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
