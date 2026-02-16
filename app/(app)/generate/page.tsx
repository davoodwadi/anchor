// app/generate/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function GenerateRootPage() {
  await connection();

  const supabase = await createClient();

  // 1. Check Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 2. Create a new Session in the DB
  const { data: session, error } = await supabase
    .from("chat_sessions")
    .insert({
      user_id: user.id,
      title: "New Session", // You can update this later based on the quiz topic
    })
    .select("id")
    .single();

  if (error || !session) {
    console.error("Failed to create session:", error);
    // Handle error gracefully (maybe redirect to an error page or show a message)
    return <div>Error creating session. Please try again.</div>;
  }

  // 3. Redirect to the dynamic route
  redirect(`/generate/${session.id}`);
}
