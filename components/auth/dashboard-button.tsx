"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function DashboardButton() {
  const router = useRouter();

  const dashboard = async () => {
    router.push("/dashboard");
  };

  return <Button onClick={dashboard}>Dashboard</Button>;
}
