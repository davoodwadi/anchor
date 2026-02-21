"use client";

import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function DashboardButton() {
  const router = useRouter();

  const dashboard = () => {
    router.push("/dashboard");
  };

  return (
    <Button onClick={dashboard} aria-label="Dashboard" className="gap-2">
      <LayoutDashboard className="size-4 shrink-0" />
      <span className="hidden sm:inline">Dashboard</span>
    </Button>
  );
}
