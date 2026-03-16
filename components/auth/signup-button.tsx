"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/shared/wake-variants";
import { cn } from "@/lib/utils";

export function SignupButton() {
  const router = useRouter();

  const signup = async () => {
    router.push("/auth/sign-up");
  };

  return (
    <Button
      onClick={signup}
      className={cn(buttonVariants({ color: 700 }), "gap-2")}
    >
      Sign up
    </Button>
  );
}
