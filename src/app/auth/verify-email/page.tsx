"use client";

import { Suspense, useState, useEffect } from "react";
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
function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [emailParam]);

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
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
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
                <span className="text-blue-400 font-medium">{email}</span>
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
                <p className="text-green-400 text-sm text-center">{success}</p>
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

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
                className={`h-4 w-4 mr-2 ${isResending ? "animate-spin" : ""}`}
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
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
