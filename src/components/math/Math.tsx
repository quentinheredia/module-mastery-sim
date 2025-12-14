import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export function Math({
  latex,
  block = true,
}: {
  latex: string;
  block?: boolean;
}) {
  // Wrap plain LaTeX into markdown math fences so the plugins can render it
  const md = block ? `$$\n${latex}\n$$` : `$${latex}$`;

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {md}
      </ReactMarkdown>
    </div>
  );
}
