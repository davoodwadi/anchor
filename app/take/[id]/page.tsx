import { Suspense } from "react";
import { Atmosphere } from "@/components/aw2/atmosphere";
import { QuizLoader } from "./quiz-loader";
import Loading from "./loading";

export default function TakeQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="aw-desk relative min-h-svh text-aw-text font-ui selection:bg-aw-sage selection:text-aw-bg">
      {/* Darken the left so the question list reads over the lamp light */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(8,8,8,.96)_0%,rgba(8,8,8,.85)_22%,rgba(8,8,8,.15)_42%,transparent_60%,rgba(8,8,8,.5)_100%)] max-md:bg-[rgba(8,8,8,.55)]"
      />
      <Atmosphere />
      <div className="relative z-10">
        <Suspense fallback={<Loading />}>
          <QuizLoader params={params} />
        </Suspense>
      </div>
    </div>
  );
}
