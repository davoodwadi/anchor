import { Suspense } from "react";
import { QuizLoader } from "./quiz-loader";
import Loading from "./loading";

export default function TakeQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-body">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<Loading />}>
          <QuizLoader params={params} />
        </Suspense>
      </div>
    </div>
  );
}
