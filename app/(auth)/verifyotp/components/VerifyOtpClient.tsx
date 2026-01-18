"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Mail, RefreshCw } from "lucide-react";

import { maskEmail } from "@/utils/email/maskEmail";
import { REGEX_EMAIL } from "@/utils/const/RegexStorage";
import { useAuthClient } from "@/hooks/useAuthClient";
import InputOTPCustom from "@/components/customized/input-otp/input-otp";

/* ===================== HELPERS ===================== */

function isEmail(key: string): boolean {
  return REGEX_EMAIL.test(key);
}

function maskKey(key: string): string {
  return isEmail(key) ? maskEmail(key) : key;
}

/* ===================== CLIENT PAGE ===================== */

export default function VerifyOtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyKey = searchParams.get("key") ?? "";

  const { verifyOtp, loading, error } = useAuthClient();

  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);

  /* ---------- Redirect if missing key ---------- */
  useEffect(() => {
    if (!verifyKey) {
      router.push("/register");
    }
  }, [verifyKey, router]);

  /* ---------- Cooldown timer ---------- */
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    const result = await verifyOtp(verifyKey, otp);
    if (result.success) {
      router.push("/login");
    }
  };

  const handleResendOtp = () => {
    if (cooldown > 0) return;
    setOtp("");
    setCooldown(60);
    // call resend OTP API here
  };

  if (!verifyKey) return null;

  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-none border-none">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Verify Your Account</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">A verification code has been sent to</p>
            <Badge variant="outline" className="border-primary text-primary bg-primary/5">
              {maskKey(verifyKey)}
            </Badge>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <Label className="block text-center">Enter verification code</Label>
              <InputOTPCustom
                value={otp}
                onChange={setOtp}
                maxLength={6}
                disabled={loading}
                autoFocus
                className="flex justify-center"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={otp.length !== 6 || loading} className="w-full border border-gray-300">
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>

          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">Didn’t receive the code?</p>

            <Button variant="outline" disabled={cooldown > 0} onClick={handleResendOtp} className="w-full">
              {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
            </Button>

            <p className="text-xs text-muted-foreground">Please check your spam folder if you don’t see the email.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
