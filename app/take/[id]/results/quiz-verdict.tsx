import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shared/card-wake";
import { cardVariants } from "@/components/shared/wake-variants";

interface QuizVerdictProps {
  score: number;
  total: number;
  studentId: string;
}

export default function QuizVerdict({
  score,
  total,
  studentId,
}: QuizVerdictProps) {
  const percentage = Math.round((score / total) * 100);

  return (
    <Card className={cardVariants({ variant: "results" })}>
      <CardHeader className="bg-primary text-primary-foreground text-center py-6">
        <CardTitle className="text-5xl uppercase font-black tracking-tighter">
          Report Finalized
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8 pt-10 pb-10">
        {/* Score */}
        <div className="text-8xl font-black text-foreground font-heading tracking-tighter">
          {percentage}%
        </div>

        <div className="text-xl uppercase tracking-widest text-muted-foreground font-bold">
          {score} / {total} Correct
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-muted border-2 border-border">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-muted/30 border border-border w-full text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
            CASE FILE ARCHIVED FOR ID:{" "}
            <span className="text-foreground font-bold">{studentId}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
