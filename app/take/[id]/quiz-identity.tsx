"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shared/card-wake";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { cardVariants, buttonVariants } from "@/components/shared/wake-variants";
import { FormField } from "@/components/shared/form-field";

export function QuizIdentity({ onStart }: { onStart: (id: string) => void }) {
  const [localId, setLocalId] = useState("");

  const handleSubmit = (e: React.SyntheticEvent) => {
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
          <FormField label="Agent ID / Student Number" htmlFor="student-id">
            <Input
              id="student-id"
              name="title"
              value={localId}
              placeholder="ENTER ID..."
              onChange={(e) => setLocalId(e.target.value)}
              autoComplete="off"
              required
            />
          </FormField>

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
