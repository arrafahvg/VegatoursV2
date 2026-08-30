import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

// Renders Markdown (bold, bullets, paragraphs, headings, links, ...) on the
// public side. Since the site uses Tailwind's preflight reset, each element is
// styled explicitly.
const components = {
  p: ({ node, ...props }) => <p className="text-sm text-muted-foreground leading-relaxed mb-3 last:mb-0" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
  em: ({ node, ...props }) => <em className="italic" {...props} />,
  a: ({ node, ...props }) => (
    <a className="text-primary underline hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 mb-3 last:mb-0" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 mb-3 last:mb-0" {...props} />,
  li: ({ node, ...props }) => <li className="text-sm text-muted-foreground leading-relaxed" {...props} />,
  h1: ({ node, ...props }) => <h1 className="text-xl font-serif font-semibold text-foreground mb-2" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-lg font-serif font-semibold text-foreground mb-2" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-base font-serif font-semibold text-foreground mb-2" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-2 border-primary pl-3 italic text-muted-foreground mb-3 last:mb-0" {...props} />
  ),
  hr: ({ node, ...props }) => <hr className="my-4 border-border" {...props} />,
  code: ({ inline, node, ...props }) =>
    inline ? (
      <code className="bg-muted px-1.5 py-0.5 rounded text-[12px]" {...props} />
    ) : (
      <code className="block bg-muted p-3 rounded-lg text-[12px] whitespace-pre-wrap mb-3 last:mb-0" {...props} />
    ),
};

export default function MarkdownView({ children, className }) {
  return (
    <div className={cn('space-y-0', className)}>
      <ReactMarkdown components={components}>{children || ''}</ReactMarkdown>
    </div>
  );
}