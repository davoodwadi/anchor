import Link from "next/link";
import { TutorialStep } from "./tutorial-step";
import { ArrowUpRight } from "lucide-react";

export function SignUpUserSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="Create your first quiz">
        <p>
          Head over to the{" "}
          <Link
            href="/dashboard"
            className="font-bold hover:underline text-foreground/80"
          >
            Dashboard
          </Link>{" "}
          page and create your first quiz. It&apos;s okay if this is just for
          you for now. Your awesome quiz will have plenty of users later!
        </p>
      </TutorialStep>
    </ol>
  );
}
