"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { aw } from "./shell";

export function SignOutButton() {
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <button onClick={signOut} className={aw.chip}>
      Sign out
    </button>
  );
}
