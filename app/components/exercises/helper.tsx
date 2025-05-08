export const renderExamples = (text: string | undefined | null): React.ReactNode[] => {
  if (!text) return [];

  const parts: React.ReactNode[] = [];
  const regex = /（　(.*?)　）/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }
    parts.push(
      <span
        key={`underline-${match.index}`}
        className="font-medium text-primary"
      >
        {"　"}
        <span className="underline">{match[1]}</span>
        {"　"}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>
    );
  }

  return parts;
};

export const renderExamplesTable = (
  items: string[]
): React.ReactNode[] => {

  if (!items) return [];

  const regex = /（　(.*?)　）/; // No 'g' flag, we test each item individually

  return items.map((item, index) => {
    const match = item.match(regex);
    if (match && match[1]) { // Check match[1] to ensure content was captured
      return (
        <td
          key={`underline-${index}-${item}`} // More robust key
          className="p-2 border font-medium text-primary text-center" // Added padding, border, and centering
        >
          {"　"} {/* Original spacing, keep if desired */}
          <span className="underline">{match[1]}</span>
          {"　"} {/* Original spacing */}
        </td>
      );
    } else {
      return (
        <td key={`text-${index}-${item}`} className="p-2 border text-center"> {/* Added padding, border, and centering */}
          {item}
        </td>
      );
    }
  });
};

