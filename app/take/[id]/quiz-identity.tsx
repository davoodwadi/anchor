"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card-wake";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { cardVariants, buttonVariants } from "@/components/wake-variants";

export function QuizIdentity({ onStart }: { onStart: (id: string) => void }) {
  const [localId, setLocalId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localId.trim()) onStart(localId.trim());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row gap-2 items-center">
            <User className="w-5 h-5" />
            Subject Identification
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="student-id"
              className="uppercase font-bold text-xs tracking-widest text-muted-foreground"
            >
              Agent ID / Student Number
            </Label>
            <Input
              id="student-id"
              placeholder="ENTER ID..."
              value={localId}
              onChange={(e) => setLocalId(e.target.value)}
              className="font-mono text-xl uppercase h-14 border-2 border-border rounded-none focus-visible:ring-0 focus-visible:border-primary"
              autoComplete="off"
            />
          </div>
          <Button
            type="submit"
            className={buttonVariants({ variant: "large" })}
            disabled={!localId}
          >
            Initialize Assessment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
