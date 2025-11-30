"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useEffect } from "react";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Access denied. Admin only.</p>
      </div>
    );
  }

  return <AdminLayout title="Admin Dashboard">{children}</AdminLayout>;
}
