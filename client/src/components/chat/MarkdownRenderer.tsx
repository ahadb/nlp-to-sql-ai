import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Clean up the content to remove empty lines and fix formatting
  const cleanContent = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')
    .join('\n')
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
    .replace(/^\s*[-*]\s*$/gm, '') // Remove empty bullet points
    .replace(/^\s*\d+\.\s*$/gm, '') // Remove empty numbered lists
    .trim();

  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom styling for different markdown elements
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-white mb-4 mt-6 border-b border-gray-600/30 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-white mb-3 mt-6 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium text-blue-400 mb-2 mt-4">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-medium text-gray-300 mb-2 mt-3">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 mb-3 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-300 mb-3 space-y-1 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-300 mb-3 space-y-1 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => {
            // Filter out empty or whitespace-only children
            const hasContent = React.Children.toArray(children).some(child => 
              typeof child === 'string' ? child.trim() !== '' : true
            );
            
            if (!hasContent) return null;
            
            return (
              <li className="text-gray-300 leading-relaxed">
                {children}
              </li>
            );
          },
          strong: ({ children }) => (
            <strong className="font-semibold text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-blue-300">
              {children}
            </em>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-800/50 text-green-400 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className={className}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 overflow-x-auto mb-4">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500/50 pl-4 py-2 bg-blue-500/5 rounded-r-lg mb-4">
              <div className="text-gray-300 italic">
                {children}
              </div>
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-600/30 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-800/50">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-700/50">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-800/30">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-600/30">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-gray-300 border-b border-gray-700/30">
              {children}
            </td>
          ),
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-blue-400 hover:text-blue-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr className="border-gray-600/30 my-6" />
          ),
          // Custom components for special formatting
          div: ({ children, className }) => {
            if (className?.includes('highlight')) {
              return (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
                  <div className="text-yellow-300 text-sm">
                    {children}
                  </div>
                </div>
              );
            }
            return <div className={className}>{children}</div>;
          }
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
