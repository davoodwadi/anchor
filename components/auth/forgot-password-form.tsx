"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";
import { AuthCard, AuthError, AuthField, AuthSubmit } from "./auth-card";

export function ForgotPasswordForm() {
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
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard
        title="Check your email"
        lede="If an account uses that address, a link to set a new password is on its way."
        footer={<Link href="/auth/login">Back to sign in</Link>}
      />
    );
  }

  return (
    <AuthCard
      title="Reset password"
      lede="Enter your email and we'll send a link to set a new password."
      footer={<Link href="/auth/login">Back to sign in</Link>}
    >
      <form onSubmit={handleForgotPassword} className="grid gap-6">
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
        <AuthError message={error} />
        <AuthSubmit pending={isLoading} pendingText="Sending…">
          Send reset link
        </AuthSubmit>
      </form>
    </AuthCard>
  );
}
