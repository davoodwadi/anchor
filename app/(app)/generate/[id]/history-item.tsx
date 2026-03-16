import { GeneratedContent } from "@/types/QuizTypes";
import { MarkdownComponent } from "@/components/markdown/markdown-component";
import { QuizDisplay } from "@/components/quiz/quiz-display";
import { DynamicTypewriterStream } from "@/components/shared/dynamic-typewriter-stream";
import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

export function HistoryItem({
  item,
  isLastItem,
  isLoadingTypewriter,
  setIsLoadingTypewriter,
}: {
  item: GeneratedContent;
  isLastItem: boolean;
  isLoadingTypewriter: boolean;
  setIsLoadingTypewriter: Dispatch<SetStateAction<boolean>>;
}) {
  // console.log("item", item);
  // console.log("isLastItem", isLastItem);
  // if (isLastItem) {
  //   console.log("item", item);
  // }

  useEffect(() => {
    // If a new item is added and it's not an explanation, there is no typewriter stream
    // to call onComplete. We must instantly turn off isLoadingTypewriter.
    if (isLastItem && isLoadingTypewriter && item.type !== "explanation") {
      setIsLoadingTypewriter(false);
    }
  }, [isLastItem, isLoadingTypewriter, item.type, setIsLoadingTypewriter]);

  const shouldStream =
    item.type === "explanation" && isLoadingTypewriter && isLastItem;

  return (
    <div className="shadow-sm my-6">
      {/* 1. Render the Content */}
      <div className="">
        {item.type === "explanation" ? (
          <DynamicTypewriterStream
            text={item.content as string}
            plain={true}
            speed="medium"
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
            onComplete={() => setIsLoadingTypewriter(false)}
          />
        ) : (
          <QuizDisplay data={JSON.parse(item.content) as any} />
        )}
      </div>
    </div>
  );
}
