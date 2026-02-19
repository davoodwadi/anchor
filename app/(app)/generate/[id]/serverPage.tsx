import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
// import { connection } from "next/server";
import { Suspense } from "react";
import ClientPage from "./clientPage";
import { GeneratedContent } from "@/actions/generate-actions";

export default async function ServerPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const supabase = await createClient();

  // Fetch user on the server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  //   console.log("user", user);
  // We fetch messages to restore the chat if the user refreshes
  const { data: messages, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
  }

  // 3. Transform DB messages to your UI format
  const initialHistory: GeneratedContent[] = (messages || []).map((msg) => ({
    id: msg.id,
    type: msg.type as "quiz" | "explanation" | "user",
    content: msg.content,
    // If you saved file_data in DB, map it here, otherwise undefined
    file: msg.file_data || undefined,
    extractedText: msg.extracted_text || null,
  }));

  // Pass the user object to the client component
  return (
    <Suspense>
      <ClientPage user={user} sessionId={id} initialHistory={initialHistory} />
    </Suspense>
  );
}
