import { GeneratedContent } from "@/types/QuizTypes";
import { MarkdownComponent } from "@/components/markdown/markdown-component";
import { QuizDisplay } from "@/components/quiz/quiz-display";
import { DynamicTypewriterStream } from "@/components/shared/dynamic-typewriter-stream";
import type { Dispatch, SetStateAction } from "react";

export function HistoryItem({
  item,
  isLastItem,
  isLoading,
  setIsLoading,
}: {
  item: GeneratedContent;
  isLastItem: boolean;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  // console.log("item", item);
  // console.log("isLastItem", isLastItem);
  // if (isLastItem) {
  //   console.log("item", item);
  // }
  const shouldStream = item.type === "explanation" && isLoading && isLastItem;

  return (
    <div className="shadow-sm my-6">
      {/* 1. Render the Content */}
      <div className="">
        {item.type === "explanation" ? (
          <DynamicTypewriterStream
            text={item.content as string}
            plain={true}
            speed="xfast"
            className="
        max-w-3xl mx-auto
        p-8 md:p-12
        rounded-none border
        bg-card text-card-foreground
        shadow-sm transition-all
        text-base leading-7 my-5 text-card-foreground
      "
            cursorClassName="bg-red-500"
            shouldStream={shouldStream}
            onComplete={() => setIsLoading(false)}
          />
        ) : (
          <QuizDisplay data={JSON.parse(item.content) as any} />
        )}
      </div>
    </div>
  );
}
