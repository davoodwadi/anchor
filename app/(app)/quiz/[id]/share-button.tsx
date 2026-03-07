"use client";

import { Check, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { WakeButton } from "@/components/shared/wake-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { Copy } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ShareButton({ quizId }: { quizId: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [copied, setCopied] = useState(false);

  const link = mounted ? `${window.location.origin}/take/${quizId}` : "";

  const handleCopy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <WakeButton
          variant="primary"
          className="w-full flex justify-center py-5"
        >
          <span className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </span>
        </WakeButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-black border-neon-red-900 rounded-none shadow-[0_0_20px_rgba(255,0,0,0.15)]">
        <DialogHeader>
          <DialogTitle className="text-white uppercase tracking-wider font-bold">
            Share Quiz
          </DialogTitle>
          <DialogDescription className="text-zinc-400 font-mono text-sm">
            Scan the QR code to take the quiz.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-4">
          {mounted && link && (
            <div className="p-4 bg-white">
              <QRCode
                value={link}
                size={200}
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
          )}
          <div className="flex items-center space-x-2 w-full">
            <div className="grid flex-1 gap-2">
              <Input
                id="link"
                value={link}
                readOnly
                className="bg-zinc-900 border-zinc-800 text-white rounded-none focus-visible:ring-neon-red-500 font-mono text-sm"
              />
            </div>
            <WakeButton
              onClick={handleCopy}
              variant={copied ? "primary" : "secondary"}
              className="px-3"
            >
              <span className="sr-only">Copy</span>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </WakeButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
