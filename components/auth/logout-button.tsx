"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Button onClick={logout} aria-label="Logout" className="gap-2">
      <LogOut className="size-4 shrink-0" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
}
