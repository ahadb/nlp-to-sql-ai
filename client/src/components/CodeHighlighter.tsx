import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

interface Props {
  code: string;
  language: string;
}

const HighlightedCode = ({ code, language }: Props) => {
  // Format SQL with proper indentation
  const formatSQL = (sql: string) => {
    const lines = sql.trim().split('\n');
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // Main SQL keywords should be at the start of the line
      const mainKeywords = /^(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|UNION|WITH)/i;
      const joinKeywords = /^(INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|JOIN)/i;
      
      if (mainKeywords.test(trimmed) || joinKeywords.test(trimmed)) {
        return trimmed;
      } else {
        // Indent everything else
        return '    ' + trimmed;
      }
    });
    
    return formattedLines.join('\n');
  };

  const formattedSQL = language === 'sql' ? formatSQL(code) : code;
  const highlightedCode = hljs.highlight(formattedSQL, { language }).value;

  return (
    <pre className="m-0 p-4 text-gray-200 whitespace-pre-wrap break-words bg-gray-950 rounded-lg">
      <code
        className={`language-${language} hljs`}
        style={{ backgroundColor: "transparent" }}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </pre>
  );
};

export default HighlightedCode;
