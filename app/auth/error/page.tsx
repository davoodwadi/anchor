import { Suspense } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return params?.error ? (
    <p className="font-typed text-[15px] text-aw-text-2 break-words">
      Code: {params.error}
    </p>
  ) : null;
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <AuthCard
      title="Something went wrong"
      lede="We couldn't complete that sign-in step. Try again, or request a new link."
      footer={<Link href="/auth/login">Back to sign in</Link>}
    >
      <Suspense>
        <ErrorContent searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}
