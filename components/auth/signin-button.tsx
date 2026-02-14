"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LoginButton() {
  const router = useRouter();

  const login = async () => {
    router.push("/auth/login");
  };

  return <Button onClick={login}>Sign in</Button>;
}
