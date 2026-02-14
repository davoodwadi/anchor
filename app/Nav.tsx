import { EnvVarWarning } from "@/components/env-var-warning";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";

export default function Nav() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <Suspense>
        <AuthButton />
      </Suspense>
    </nav>
  );
}
