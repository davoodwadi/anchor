import { Suspense } from "react";
import { Atmosphere } from "@/components/aw2/atmosphere";
import { MindPlace } from "@/components/landing/mind-place";
import {
  LandingAuth,
  LandingAuthFallback,
} from "@/components/landing/landing-auth";

export default function Home() {
  return (
    <div className="aw-desk relative min-h-svh text-aw-text font-ui selection:bg-aw-sage selection:text-aw-bg">
      {/* Darken the left half so the menu reads over the lamp light */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(8,8,8,.96)_0%,rgba(8,8,8,.86)_30%,rgba(8,8,8,.25)_58%,transparent_75%)] max-xl:bg-[rgba(8,8,8,.7)]"
      />
      <Atmosphere />
      <MindPlace
        auth={
          <Suspense fallback={<LandingAuthFallback />}>
            <LandingAuth />
          </Suspense>
        }
      />
      <footer className="relative z-10 flex flex-wrap justify-between gap-4 px-4 md:px-10 py-7 border-t border-white/[.06] font-ui text-[13px] uppercase tracking-[.14em] text-aw-text-3">
        <span>Anchor</span>
        <span>
          Created by{" "}
          <a
            href="https://www.davoodwadi.com"
            target="_blank"
            rel="noreferrer"
            className="text-aw-text-2 hover:text-aw-text"
          >
            Davood Wadi
          </a>
        </span>
      </footer>
    </div>
  );
}
