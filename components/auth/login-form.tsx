"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard, AuthError, AuthField, AuthSubmit } from "./auth-card";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
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
    <AuthCard
      title="Sign in"
      lede="Welcome back. Your quizzes are where you left them."
      footer={
        <>
          No account yet? <Link href="/auth/sign-up">Create one</Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="grid gap-6">
        <AuthField
          id="email"
          label="Email"
          type="email"
          placeholder="you@university.ca"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aside={
            <Link
              href="/auth/forgot-password"
              className="font-ui font-medium text-[14px] uppercase tracking-[.06em] text-aw-text-3 hover:text-aw-text"
            >
              Forgot password?
            </Link>
          }
        />
        <AuthError message={error} />
        <AuthSubmit pending={isLoading} pendingText="Signing in…">
          Sign in
        </AuthSubmit>
      </form>
    </AuthCard>
  );
}
