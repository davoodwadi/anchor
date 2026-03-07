import { Hero } from "@/components/layout/hero";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import Link from "next/link";

import Footer from "@/app/Footer";
import Nav from "@/app/Nav";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-16 md:gap-24 lg:gap-40 items-center">
        <Nav />
        <div className="flex-1 flex flex-col gap-16 md:gap-24 lg:gap-40 p-5">
          <Hero />
          <main className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-xl mb-4">Next steps</h2>
            <SignUpUserSteps />
          </main>
        </div>

        <Footer />
      </div>
    </main>
  );
}
