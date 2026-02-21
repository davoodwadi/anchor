import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/card-wake";
import { Eye, Calendar } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { wait } from "@/lib/utils";

export async function QuizList() {
  // await wait(50000);
  const supabase = await createClient();

  // 1. Fetch User
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // 2. Fetch Quizzes (Intentionally slow? No, but let's assume it takes time)
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("*")
    .eq("instructor_id", user.id)
    .order("created_at", { ascending: false });

  if (!quizzes?.length) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <p className="text-muted-foreground mb-4">
            You haven't created any quizzes yet.
          </p>
          <Link href="/create">
            <Button variant="outline">Get Started</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <Link key={quiz.id} href={`/quiz/${quiz.id}`} className="block group">
          <Card className="h-full transition-colors hover:bg-muted/50 hover:border-primary/50 rounded-none">
            <CardHeader>
              <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                {quiz.title}
              </CardTitle>
              <CardDescription className="flex items-center mt-2">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(quiz.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
