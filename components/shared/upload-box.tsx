"use client";

import { CheckCircle2, UploadCloud } from "lucide-react";
import { uploadBox } from "@/components/ui/upload-box.styles";

type UploadBoxProps = {
  fileName: string | null;
  extractedText?: string | null;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
};

export function UploadBox({
  fileName,
  extractedText,
  disabled,
  onChange,
  error = false,
}: UploadBoxProps) {
  const state = error ? "error" : fileName ? "selected" : "empty";

  return (
    <div className="relative">
      <input
        id="file"
        name="file"
        type="file"
        accept=".pdf"
        onChange={onChange}
        className="hidden"
        disabled={disabled}
        // required
      />

      <label htmlFor="file" className={uploadBox({ state })}>
        {extractedText ? (
          <SelectedState
            fileName={fileName}
            extractedText={extractedText}
            disabled={disabled}
          />
        ) : (
          <EmptyState />
        )}
      </label>
    </div>
  );
}

function SelectedState({
  fileName,
  extractedText,
  disabled,
}: {
  fileName?: string | null;
  extractedText?: string | null;
  disabled?: boolean | null;
}) {
  // console.log(extractedText);
  return (
    <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      <p className="text-sm font-bold text-foreground text-center px-4 line-clamp-3 break-all whitespace-normal">
        {extractedText}
      </p>

      {!disabled && (
        <p className="text-xs text-primary uppercase font-bold mt-1 tracking-widest">
          Click to Replace
        </p>
      )}
    </div>
  );
}

function EmptyState({ extractedText }: { extractedText?: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-foreground">
      {extractedText ? (
        <p className="text-sm font-bold text-foreground text-center px-4 line-clamp-3 break-all whitespace-normal">
          {extractedText}
        </p>
      ) : (
        <>
          <UploadCloud className="w-10 h-10 mb-3" />
          <p className="text-sm uppercase font-bold tracking-wide">
            Click to upload PDF
          </p>
        </>
      )}
    </div>
  );
}
