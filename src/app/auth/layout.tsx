import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - myEvents",
  description:
    "Sign in or create your myEvents account to discover and book amazing events.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-950">{children}</div>;
}
