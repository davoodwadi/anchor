import { Suspense } from "react";
import { AuthButton } from "@/components/auth/auth-button";

export default function Nav() {
  return (
    <nav className="w-full flex justify-center items-center border-b border-b-foreground/10 h-12 md:h-16">
      <Suspense>
        <AuthButton />
      </Suspense>
    </nav>
  );
}
