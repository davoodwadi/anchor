/** Read the text out of an uploaded PDF or Markdown file, in the browser. */
export async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const isPdf = file.type === "application/pdf" || name.endsWith(".pdf");
  const isMarkdown =
    file.type === "text/markdown" ||
    name.endsWith(".md") ||
    name.endsWith(".markdown");

  if (isMarkdown) return file.text();
  if (!isPdf) {
    throw new Error("Unsupported file type. Upload a PDF or Markdown file.");
  }

  // Dynamic import to prevent SSR server crash
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() })
    .promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText +=
      content.items.map((item) => ("str" in item ? item.str : "")).join(" ") +
      "\n\n";
  }
  return fullText;
}
