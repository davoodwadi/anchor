import { format } from "date-fns";
import type { createClient } from "@/lib/supabase/server";

export type StudySession = { id: string; title: string; date: string };

/** Title given to a session row before it has any content. */
export const NEW_SESSION_TITLE = "New Session";

/**
 * The user's study sessions, newest first. Sessions with no messages are left
 * out, since a row is created every time someone opens a new study page.
 */
export async function listStudySessions(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  limit: number,
): Promise<StudySession[]> {
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("id, title, created_at, chat_messages!inner(id)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1, { referencedTable: "chat_messages" })
    .limit(limit);

  if (error) {
    console.error("Error fetching study sessions:", error);
    return [];
  }

  return (data ?? []).map((s) => ({
    id: s.id,
    title:
      !s.title?.trim() || s.title === NEW_SESSION_TITLE
        ? "Untitled session"
        : s.title,
    // Formatted here so server and browser render the same text
    date: format(new Date(s.created_at), "MMM d"),
  }));
}
