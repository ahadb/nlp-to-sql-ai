// HighlightedCode.tsx
import React from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

interface Props {
  code: string;
  language: string;
}

const HighlightedCode = ({ code, language }: Props) => {
  // Highlight the code directly
  const highlightedCode = hljs.highlight(code, { language }).value;

  return (
    <pre className="m-0 p-4 text-gray-200">
      <code
        className={`language-${language}`}
        style={{ backgroundColor: "transparent", color: "#e5e7eb" }}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </pre>
  );
};

export default HighlightedCode;
