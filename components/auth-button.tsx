import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { DashboardButton } from "./dashboard-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";
export async function AuthButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <div className="flex items-center justify-between w-full">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        {user && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground">
              Welcome back
            </span>
            <span className="text-sm font-semibold text-foreground truncate max-w-[240px]">
              {user.email}
            </span>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <DashboardButton />
            <LogoutButton />
          </>
        ) : (
          <>
            <Button asChild variant="outline">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild variant="default">
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
