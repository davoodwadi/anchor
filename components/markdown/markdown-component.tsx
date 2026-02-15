import Markdown from "react-markdown";

interface MarkdownComponentProps {
  children: string;
}

export function MarkdownComponent({ children }: MarkdownComponentProps) {
  return <Markdown>{children}</Markdown>;
}
