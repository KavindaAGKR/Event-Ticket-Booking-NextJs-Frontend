"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Shield, RefreshCw } from "lucide-react";
import {
  verifyEmail,
  resendVerificationCode,
} from "@/services/auth/authServices";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const emailParam = searchParams?.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(value);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit verification code");
      setIsLoading(false);
      return;
    }

    try {
      const result = await verifyEmail({
        email,
        code: verificationCode,
      });

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          router.push("/auth/signin?verified=true");
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || countdown > 0) return;

    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      const result = await resendVerificationCode(email);

      if (result.success) {
        setSuccess("Verification code sent to your email");
        setCountdown(60); // 60 sec
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const formatVerificationCode = (value: string) => {
    return value.replace(/(.{3})/g, "$1 ").trim();
  };

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-indigo-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/auth/signup"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign Up
          </Link>
        </div>

        <Card className="bg-gray-900/50 backdrop-blur-md border-gray-700">
          <CardHeader className="text-center">
            {/* Email Icon */}
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>

            <CardTitle className="text-2xl font-bold text-white">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-gray-400">
              {email ? (
                <>
                  We've sent a verification code to{" "}
                  <span className="text-purple-400 font-medium">{email}</span>
                </>
              ) : (
                "Please enter your email and verification code"
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!email && (
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-300"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label
                  htmlFor="verificationCode"
                  className="text-sm font-medium text-gray-300"
                >
                  Verification Code
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="000 000"
                    value={formatVerificationCode(verificationCode)}
                    onChange={handleVerificationCodeChange}
                    className="pl-10 bg-gray-800 border-gray-600 text-white text-center text-lg font-mono tracking-widest"
                    maxLength={7}
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>
              {success && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                  <p className="text-green-400 text-sm text-center">
                    {success}
                  </p>
                </div>
              )}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            {/* Resend Code */}
            <div className="text-center space-y-3">
              <p className="text-gray-400 text-sm">Didn't receive the code?</p>

              <Button
                variant="outline"
                size="sm"
                onClick={handleResendCode}
                disabled={isResending || countdown > 0 || !email}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    isResending ? "animate-spin" : ""
                  }`}
                />
                {countdown > 0
                  ? `Resend in ${countdown}s`
                  : isResending
                  ? "Sending..."
                  : "Resend Code"}
              </Button>

              <p className="text-xs text-gray-500">
                Check your spam folder if you don't see the email
              </p>
            </div>

            <div className="text-center pt-4 border-t border-gray-600">
              <p className="text-gray-400 text-sm">
                Already verified?{" "}
                <Link
                  href="/auth/signin"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
