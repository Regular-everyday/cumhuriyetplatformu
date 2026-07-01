"use client";

import { useRef } from "react";

interface MarkdownTextareaProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export default function MarkdownTextarea({
  value,
  onChange,
  placeholder = "İçerik yazın...",
  rows = 6,
  className = "",
}: MarkdownTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insertFormat(before: string, after = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const replacement = before + selectedText + after;
    const nextValue =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    onChange(nextValue);

    setTimeout(() => {
      textarea.focus();
      const cursorStart = start + before.length;
      textarea.setSelectionRange(cursorStart, cursorStart + selectedText.length);
    }, 0);
  }

  const buttons = [
    { label: "B", title: "Kalın", onClick: () => insertFormat("**", "**"), className: "font-bold" },
    { label: "I", title: "Eğik", onClick: () => insertFormat("*", "*"), className: "italic font-serif" },
    { label: "H2", title: "Başlık", onClick: () => insertFormat("## ", "\n"), className: "text-[11px] font-bold" },
    { label: "Link", title: "Bağlantı", onClick: () => insertFormat("[", "](https://)") },
    { label: "Resim", title: "Görsel", onClick: () => insertFormat("![Açıklama](", ")") },
  ];

  return (
    <div className={`flex flex-col rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <div className="flex items-center gap-1 rounded-t-lg border-b border-gray-200 bg-gray-50 px-2 py-1.5 dark:border-gray-700 dark:bg-gray-900/50">
        {buttons.map((button) => (
          <button
            key={button.title}
            type="button"
            title={button.title}
            onClick={button.onClick}
            className={`flex h-7 items-center justify-center rounded px-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${button.className ?? ""}`}
          >
            {button.label}
          </button>
        ))}
        <span className="ml-auto mr-1 select-none text-[10px] text-gray-400 dark:text-gray-500">
          Markdown desteklenir
        </span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-b-lg border-0 bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-0 dark:text-gray-100"
      />
    </div>
  );
}
