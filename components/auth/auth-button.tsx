import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { DashboardButton } from "./dashboard-button";
import { SignupButton } from "./signup-button";
import { LoginButton } from "./signin-button";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { Suspense } from "react";
export async function AuthButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <div className="flex items-center justify-between w-full min-w-0 px-2">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 min-w-0">
        <ThemeSwitcher />

        {user && (
          <div className="hidden sm:flex flex-col leading-tight min-w-0 max-w-[240px]">
            <span className="text-xs md:text-sm font-semibold text-foreground">
              Welcome back
            </span>
            <span className="text-xs md:text-sm font-semibold text-foreground truncate" title={user.email}>
              {user.email}
            </span>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 flex-shrink-0">
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
