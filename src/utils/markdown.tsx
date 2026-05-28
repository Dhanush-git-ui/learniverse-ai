import React from 'react';

/**
 * Parses a simple markdown subset (bold, inline code, bullet lists, newlines)
 * into safe, structured React elements without dangerouslySetInnerHTML.
 */
export const renderMarkdown = (text: string): React.ReactNode => {
  if (!text) return null;

  // Split paragraphs by double newlines
  const paragraphs = text.split('\n\n');

  return paragraphs.map((paragraph, pIdx) => {
    const lines = paragraph.split('\n');
    
    // Check if the lines form a bulleted list
    const isList = lines.length > 0 && lines.every(line => {
      const trimmed = line.trim();
      return trimmed === '' || trimmed.startsWith('- ') || trimmed.startsWith('* ');
    });

    if (isList && paragraph.trim() !== '') {
      return (
        <ul key={pIdx} className="list-disc pl-5 mb-3 space-y-1">
          {lines
            .filter(line => line.trim() !== '')
            .map((line, lIdx) => {
              const cleanLine = line.trim().replace(/^[-*]\s+/, '');
              return (
                <li key={lIdx} className="text-sm leading-relaxed">
                  {parseInlineFormatting(cleanLine)}
                </li>
              );
            })}
        </ul>
      );
    }

    // Standard paragraph with line-breaks preserved
    return (
      <p key={pIdx} className="mb-3 text-sm leading-relaxed last:mb-0">
        {lines.map((line, lIdx) => (
          <React.Fragment key={lIdx}>
            {lIdx > 0 && <br />}
            {parseInlineFormatting(line)}
          </React.Fragment>
        ))}
      </p>
    );
  });
};

const parseInlineFormatting = (text: string): React.ReactNode[] => {
  const tokens: React.ReactNode[] = [];
  let currentIndex = 0;
  
  // Match bold **text** or inline code `text`
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    const matchStr = match[0];
    
    if (matchIndex > currentIndex) {
      tokens.push(text.substring(currentIndex, matchIndex));
    }
    
    if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
      const boldText = matchStr.slice(2, -2);
      tokens.push(
        <strong key={matchIndex} className="font-semibold text-gray-900 dark:text-white">
          {boldText}
        </strong>
      );
    } else if (matchStr.startsWith('`') && matchStr.endsWith('`')) {
      const codeText = matchStr.slice(1, -1);
      tokens.push(
        <code key={matchIndex} className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded font-mono text-xs text-red-600 dark:text-red-400">
          {codeText}
        </code>
      );
    }
    
    currentIndex = regex.lastIndex;
  }
  
  if (currentIndex < text.length) {
    tokens.push(text.substring(currentIndex));
  }
  
  return tokens.length > 0 ? tokens : [text];
};
