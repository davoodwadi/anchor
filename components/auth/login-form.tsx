"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/shared/wake-variants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("clicked");
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      console.log("trying to call supabase.auth.signInWithPassword");
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("called supabase.auth.signInWithPassword", error);
      if (error) throw error;
      router.refresh();
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
          Login
        </div>
        <div className="text-center text-sm font-medium tracking-wide text-zinc-400">
          Enter your credentials to return to the dashboard.
        </div>
      </div>

      <div className="border border-white/10 bg-black/20 p-6 backdrop-blur-md rounded-none">
        <form onSubmit={handleLogin}>
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

            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-4">
                <Label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-300"
                >
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>
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
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-neon-red-300"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
