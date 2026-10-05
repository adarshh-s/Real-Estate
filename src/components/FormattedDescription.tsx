import type { ReactNode } from 'react';

interface FormattedDescriptionProps {
  text?: string;
  className?: string;
}

export function FormattedDescription({ text, className = '' }: FormattedDescriptionProps) {
  if (!text) return null;

  const lines = text.split('\n').map((l) => l.trim());
  const elements: ReactNode[] = [];
  let currentBullets: string[] = [];

  const flushBullets = () => {
    if (currentBullets.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-3 space-y-2 pl-0.5">
          {currentBullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/75">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span>{formatInline(bullet)}</span>
            </li>
          ))}
        </ul>,
      );
      currentBullets = [];
    }
  };

  const formatInline = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) {
      flushBullets();
      continue;
    }

    if (line.startsWith('### ') || line.startsWith('## ')) {
      flushBullets();
      const heading = line.replace(/^#{2,3}\s+/, '');
      elements.push(
        <h3 key={`h3-${elements.length}`} className="mt-7 mb-2 font-display text-xl text-ink">
          {heading}
        </h3>,
      );
    } else if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      const item = line.replace(/^[•\-\*]\s+/, '');
      currentBullets.push(item);
    } else {
      flushBullets();
      elements.push(
        <p key={`p-${elements.length}`} className="mt-3 text-[15px] leading-relaxed text-ink/70">
          {formatInline(line)}
        </p>,
      );
    }
  }

  flushBullets();

  return <div className={`max-w-2xl ${className}`}>{elements}</div>;
}
