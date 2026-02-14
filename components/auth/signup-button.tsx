"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SignupButton() {
  const router = useRouter();

  const signup = async () => {
    router.push("/auth/sign-up");
  };

  return <Button onClick={signup}>Sign up</Button>;
}
