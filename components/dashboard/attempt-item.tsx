import { format } from "date-fns";
import { User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AttemptDetails } from "./attempt-details";

interface AttemptItemProps {
  attempt: {
    id: string;
    student_number: string;
    score: number;
    total: number;
    submitted_at: string;
    attempt_answers: any[];
  };
}

export function AttemptItem({ attempt }: AttemptItemProps) {
  // console.log("attempt", attempt);
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value={attempt.id}
        className="border-2 border-foreground bg-background mb-2"
      >
        <AccordionTrigger className="hover:no-underline px-4 py-3 hover:bg-muted/50 transition-colors data-[state=open]:bg-foreground data-[state=open]:text-background group">
          <div className="flex items-center justify-between w-full pr-4">
            {/* Left Side: Identity */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 border border-primary group-data-[state=open]:border-background group-data-[state=open]:bg-background/20">
                <User className="w-4 h-4 text-primary group-data-[state=open]:text-background" />
              </div>
              <div className="text-left">
                <div className="font-heading font-bold uppercase text-lg leading-none">
                  {attempt.student_number}
                </div>
                <div className="font-mono text-xs opacity-70 mt-1 uppercase">
                  {format(new Date(attempt.submitted_at), "MMM d, HH:mm")}
                </div>
              </div>
            </div>

            {/* Right Side: Score */}
            <div className="font-heading font-bold text-2xl">
              {attempt.score} / {attempt.total}{" "}
              <span className="text-sm font-body font-normal opacity-70">
                pts
              </span>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="p-0">
          <AttemptDetails answers={attempt.attempt_answers} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
