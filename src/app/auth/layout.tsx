import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - EventTix",
  description:
    "Sign in or create your EventTix account to discover and book amazing events.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-950">{children}</div>;
}
