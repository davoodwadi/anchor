"use client";

import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/shared/wake-variants";
import { cn } from "@/lib/utils";

export function DashboardButton() {
  const router = useRouter();

  const dashboard = () => {
    router.push("/dashboard");
  };
  console.log();
  return (
    <Button
      onClick={dashboard}
      aria-label="Dashboard"
      className={cn(buttonVariants({ color: 700 }), "gap-2")}
    >
      <LayoutDashboard className="size-4 shrink-0" />
      <span className="hidden sm:inline">Dashboard</span>
    </Button>
  );
}
