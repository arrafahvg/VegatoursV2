import React, { useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import MarkdownView from '@/components/MarkdownView';
import { Bold, Italic, List, ListOrdered, Heading2, Minus, Link as LinkIcon, Eye, PenLine } from 'lucide-react';

function ToolBtn({ onClick, title, active, children }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={title}
      onClick={onClick}
      className={`h-8 w-8 ${active ? 'bg-primary/15 text-primary' : 'text-muted-foreground'}`}
    >
      {children}
    </Button>
  );
}

export default function RichTextEditor({ value = '', onChange, placeholder }) {
  const ref = useRef(null);
  const [preview, setPreview] = useState(false);

  // Insert markdown at the cursor, wrapping any selected text for inline ops.
  const insert = (before, after = '') => {
    const ta = ref.current;
    const cur = value ?? '';
    if (!ta) {
      onChange(cur + before + after);
      return;
    }
    const start = ta.selectionStart ?? cur.length;
    const end = ta.selectionEnd ?? cur.length;
    const sel = cur.slice(start, end);
    const next = cur.slice(0, start) + before + sel + after + cur.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + before.length + sel.length + after.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  // Block insert: apply to the current line(s) before the cursor.
  const block = (prefix) => {
    const ta = ref.current;
    const cur = value ?? '';
    if (!ta) {
      onChange(cur + `\n${prefix} `);
      return;
    }
    const start = ta.selectionStart ?? cur.length;
    // Find start of current line
    const lineStart = cur.lastIndexOf('\n', start - 1) + 1;
    const next = cur.slice(0, lineStart) + prefix + ' ' + cur.slice(lineStart);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = lineStart + prefix.length + 1;
      ta.setSelectionRange(pos, pos);
    });
  };

  const link = () => {
    const ta = ref.current;
    const cur = value ?? '';
    const sel = ta ? cur.slice(ta.selectionStart ?? 0, ta.selectionEnd ?? 0) : '';
    insert('[', `](https://${sel || 'example.com'})`);
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-muted/40 border-b border-border">
        <ToolBtn title="Bold (**text**)" onClick={() => insert('**', '**')}><Bold className="w-4 h-4" /></ToolBtn>
        <ToolBtn title="Italic (*text*)" onClick={() => insert('*', '*')}><Italic className="w-4 h-4" /></ToolBtn>
        <ToolBtn title="Bullet list (- item)" onClick={() => block('-')}><List className="w-4 h-4" /></ToolBtn>
        <ToolBtn title="Numbered list (1. item)" onClick={() => block('1.')}><ListOrdered className="w-4 h-4" /></ToolBtn>
        <ToolBtn title="Heading (## Heading)" onClick={() => block('##')}><Heading2 className="w-4 h-4" /></ToolBtn>
        <ToolBtn title="Link ([text](url))" onClick={link}><LinkIcon className="w-4 h-4" /></ToolBtn>
        <ToolBtn title="Horizontal rule (---)" onClick={() => insert('\n---\n')}><Minus className="w-4 h-4" /></ToolBtn>
        <div className="flex-1" />
        <ToolBtn title={preview ? 'Edit' : 'Preview'} active={preview} onClick={() => setPreview(v => !v)}>
          {preview ? <PenLine className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </ToolBtn>
      </div>

      {preview ? (
        <div className="p-3 min-h-[120px]">
          <MarkdownView>{value}</MarkdownView>
        </div>
      ) : (
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Supports **bold**, *italics*, - bullet lists, and paragraphs…'}
          rows={5}
          className="border-0 rounded-none focus-visible:ring-0 resize-y"
        />
      )}
    </div>
  );
}