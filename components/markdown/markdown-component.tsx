import Markdown from "react-markdown";

interface MarkdownComponentProps {
  children: string;
}

export function MarkdownComponent({ children }: MarkdownComponentProps) {
  return (
    <div
      className="
        max-w-3xl mx-auto
        p-8 md:p-12
        rounded-none border
        bg-card text-card-foreground
        shadow-sm transition-all
      "
    >
      <Markdown
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-10 mb-5 text-card-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-7 mb-3 text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-medium mt-6 mb-3 text-foreground">
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="text-base leading-7 my-5 text-card-foreground">
              {children}
            </p>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc pl-6 my-5 space-y-3">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 my-5 space-y-3">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-base leading-7 text-card-foreground/80">
              {children}
            </li>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-secondary underline underline-offset-2 hover:text-primary/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-muted pl-5 my-6 italic text-muted-foreground">
              {children}
            </blockquote>
          ),

          // Code
          code: ({ className, children }) => {
            const isBlock = className?.includes("language-");
            return isBlock ? (
              <code
                className={`block bg-muted rounded-md p-4 my-6 text-sm leading-6 overflow-x-auto ${className}`}
              >
                {children}
              </code>
            ) : (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-muted rounded-md p-4 my-6 overflow-x-auto">
              {children}
            </pre>
          ),

          // Horizontal Rule
          hr: () => <hr className="my-8 border-border" />,

          // Strong / Emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}
