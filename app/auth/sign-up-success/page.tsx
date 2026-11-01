import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";

export default function Page() {
  return (
    <AuthCard
      title="Check your email"
      lede="We sent a link to confirm your account. Open it to reach your dashboard."
      footer={<Link href="/auth/login">Back to sign in</Link>}
    />
  );
}
