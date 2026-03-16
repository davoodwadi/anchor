"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/shared/wake-variants";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      console.log("error", error);
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <>
          <div className="relative overflow-hidden border border-white/10 bg-black/40 p-8 backdrop-blur-md rounded-none">
            <div className="absolute left-0 top-0 h-[2px] w-full opacity-50" />
            <div className="mb-2 text-center text-2xl font-black uppercase tracking-widest text-white">
              Check Your Email
            </div>
            <div className="text-center text-sm font-medium tracking-wide text-zinc-400">
              Password reset instructions sent.
            </div>
          </div>

          <div className="border border-white/10 bg-black/20 p-6 backdrop-blur-md rounded-none">
            <p className="text-sm leading-7 text-zinc-300">
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="relative overflow-hidden border border-white/10 bg-black/40 p-8 backdrop-blur-md rounded-none">
            <div className="absolute left-0 top-0 h-[2px] w-full opacity-50" />
            <div className="mb-2 text-center text-2xl font-black uppercase tracking-widest text-white">
              Reset Your Password
            </div>
            <div className="text-center text-sm font-medium tracking-wide text-zinc-400">
              Enter your email and we&apos;ll send you a reset link.
            </div>
          </div>

          <div className="border border-white/10 bg-black/20 p-6 backdrop-blur-md rounded-none">
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-300"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-none border-white/10 bg-black/40 px-4 text-white shadow-none placeholder:text-zinc-500 focus-visible:border-neon-red-600 focus-visible:ring-0"
                  />
                </div>
                {error && (
                  <p className="border border-neon-red-600/50 bg-neon-red-950/40 px-4 py-3 text-sm font-medium text-zinc-100">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className={buttonVariants({ variant: "large", color: 600 })}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send reset email"}
                </Button>
              </div>
              <div className="mt-6 border-t border-white/10 pt-4 text-center text-sm text-zinc-400">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-neon-red-300"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
