"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/shared/wake-variants";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="relative overflow-hidden border border-white/10 bg-black/40 p-8 backdrop-blur-md rounded-none">
        <div className="absolute left-0 top-0 h-[2px] w-full opacity-50" />
        <div className="mb-2 text-center text-2xl font-black uppercase tracking-widest text-white">
          Reset Your Password
        </div>
        <div className="text-center text-sm font-medium tracking-wide text-zinc-400">
          Please enter your new password below.
        </div>
      </div>

      <div className="border border-white/10 bg-black/20 p-6 backdrop-blur-md rounded-none">
        <form onSubmit={handleForgotPassword}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-[0.05em] text-zinc-300"
              >
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {isLoading ? "Saving..." : "Save New Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
