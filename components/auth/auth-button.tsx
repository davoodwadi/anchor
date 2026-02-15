import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { DashboardButton } from "./dashboard-button";
import { SignupButton } from "./signup-button";
import { LoginButton } from "./signin-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";
export async function AuthButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <div className="flex items-center justify-between w-full px-2">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        {user && (
          <div className="hidden md:flex md:flex-col leading-tight">
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
            <LoginButton />
            <SignupButton />
          </>
        )}
      </div>
    </div>
  );
}
