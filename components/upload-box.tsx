"use client";

import { CheckCircle2, UploadCloud } from "lucide-react";
import { uploadBox } from "./ui/upload-box.styles";

type UploadBoxProps = {
  fileName: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
};

export function UploadBox({
  fileName,
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
        required
      />

      <label htmlFor="file" className={uploadBox({ state })}>
        {fileName ? <SelectedState fileName={fileName} /> : <EmptyState />}
      </label>
    </div>
  );
}

function SelectedState({ fileName }: { fileName: string }) {
  return (
    <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      <div className="p-3 bg-background border-2 border-secondary rounded-full mb-2">
        <CheckCircle2 className="w-6 h-6 text-secondary" />
      </div>

      <p className="text-sm font-bold text-foreground text-center px-4 truncate max-w-[250px]">
        {fileName}
      </p>

      <p className="text-xs text-primary uppercase font-bold mt-1 tracking-widest">
        Click to Replace
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-foreground">
      <UploadCloud className="w-10 h-10 mb-3" />
      <p className="text-sm uppercase font-bold tracking-wide">
        Click to upload PDF
      </p>
    </div>
  );
}
