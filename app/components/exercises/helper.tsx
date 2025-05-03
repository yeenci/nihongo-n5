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

