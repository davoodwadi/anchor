import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const chip =
  "inline-flex items-center gap-2.5 bg-[rgba(30,32,31,.7)] px-3 py-2 font-ui text-[18px] uppercase tracking-[.06em] text-aw-text hover:bg-[rgba(46,49,47,.8)]";

/** Top-right account chip for the landing page. */
export async function LandingAuth() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    return (
      <Link href="/dashboard" className={chip}>
        Dashboard
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/auth/sign-up"
        className="hidden sm:inline font-ui text-[16px] uppercase tracking-[.06em] text-aw-text-2 hover:text-aw-text"
      >
        Sign up
      </Link>
      <Link href="/auth/login" className={chip}>
        Sign in
      </Link>
    </div>
  );
}

export function LandingAuthFallback() {
  return <span className={`${chip} invisible`}>Sign in</span>;
}
