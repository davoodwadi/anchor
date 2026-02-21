import { Suspense } from "react";
import { AuthButton } from "@/components/auth/auth-button";

export default function Nav() {
  return (
    <nav className="w-full flex justify-center items-center border-b border-b-foreground/10 h-12 md:h-16">
      <div className="w-full lg:w-5/6 mx-auto px-5 sm:px-6 md:px-8 min-w-0">
        <Suspense>
          <AuthButton />
        </Suspense>
      </div>
    </nav>
  );
}
