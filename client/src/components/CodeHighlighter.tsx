// HighlightedCode.tsx
import React from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

interface Props {
  code: string;
  language: string;
}

const HighlightedCode = ({ code, language }: Props) => {
  // Highlight the code directly
  const highlightedCode = hljs.highlight(code, { language }).value;

  return (
    <pre className="m-0 p-4">
      <code
        className={`language-${language}`}
        style={{ backgroundColor: "transparent" }}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </pre>
  );
};

export default HighlightedCode;
