// src/app/lib/helper.tsx (or your chosen path)
import React, { Fragment } from "react"; // Import Fragment

export const renderExamples = (text: string | undefined | null): React.ReactNode => {
  if (!text) return null; // Return null or an empty Fragment if text is empty

  // Split the input text by newline characters first
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, lineIndex) => (
        <Fragment key={`line-${lineIndex}`}>
          {lineIndex > 0 && <br />} {/* Add a line break before subsequent lines */}
          {processLineForExamples(line, `line-${lineIndex}`)}
        </Fragment>
      ))}
    </>
  );
};

// Helper function to process a single line for example highlighting
const processLineForExamples = (lineText: string, baseKey: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  const regex = /（　(.*?)　）/g; // Regex for full-width parentheses and spaces
  let lastIndex = 0;
  let match;
  let partIndex = 0;

  while ((match = regex.exec(lineText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`${baseKey}-text-${partIndex++}`}>
          {lineText.substring(lastIndex, match.index)}
        </span>
      );
    }
    parts.push(
      <span
        key={`${baseKey}-underline-${partIndex++}`}
        className="font-medium text-primary"
      >
        {"　"}
        <span className="underline">{match[1]}</span>
        {"　"}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < lineText.length) {
    parts.push(
      <span key={`${baseKey}-text-${partIndex++}`}>{lineText.substring(lastIndex)}</span>
    );
  }

  return parts;
};