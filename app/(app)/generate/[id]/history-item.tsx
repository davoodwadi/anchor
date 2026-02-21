import { GeneratedContent } from "@/types/QuizTypes";
import { MarkdownComponent } from "@/components/markdown/markdown-component";
import { QuizDisplay } from "@/components/quiz/quiz-display";
import { Separator } from "@/components/ui/separator";

export function HistoryItem({ item }: { item: GeneratedContent }) {
  // console.log("item", item);
  return (
    <div className="shadow-sm my-6">
      {/* 1. Render the Content */}
      <div className="">
        {item.type === "explanation" ? (
          <MarkdownComponent>{item.content as string}</MarkdownComponent>
        ) : (
          <QuizDisplay data={JSON.parse(item.content) as any} />
        )}
      </div>
    </div>
  );
}
