"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/shared/wake-variants";
import { cn } from "@/lib/utils";

export function LoginButton() {
  const router = useRouter();

  const login = async () => {
    router.push("/auth/login");
  };

  return (
    <Button
      onClick={login}
      className={cn(buttonVariants({ color: 700 }), "gap-2")}
    >
      Sign in
    </Button>
  );
}
