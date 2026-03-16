import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images → alt text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links → link text
    .replace(/`{3}[\s\S]*?`{3}/g, "") // fenced code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // italic
    .replace(/~~(.*?)~~/g, "$1") // strikethrough
    .replace(/^[-*+]\s+/gm, "") // unordered list markers
    .replace(/^\d+\.\s+/gm, "") // ordered list markers
    .replace(/^>\s+/gm, "") // blockquotes
    .replace(/^[-*_]{3,}\s*$/gm, "") // horizontal rules
    .replace(/\|/g, " ") // table pipes
    .replace(/\n{2,}/g, "\n") // collapse extra newlines
    .trim();
}
