"use client";

import React from "react";

interface RichTextProps {
  content: string;
}

function parseInlineMarkdown(text: string): React.ReactNode {
  if (!text) return "";

  const parts = text.split(/(\[.*?\]\(.*?\))/g);

  return (
    <>
      {parts.map((part, index) => {
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          return (
            <a
              key={index}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-red hover:underline dark:text-brand-gold"
            >
              {linkMatch[1]}
            </a>
          );
        }

        const boldParts = part.split(/(\*\*.*?\*\*)/g);
        return (
          <React.Fragment key={index}>
            {boldParts.map((boldPart, boldIndex) => {
              const boldMatch = boldPart.match(/\*\*(.*?)\*\*/);
              if (boldMatch) {
                return (
                  <strong key={boldIndex} className="font-bold text-gray-900 dark:text-white">
                    {boldMatch[1]}
                  </strong>
                );
              }

              const italicParts = boldPart.split(/(\*.*?\*)/g);
              return (
                <React.Fragment key={boldIndex}>
                  {italicParts.map((italicPart, italicIndex) => {
                    const italicMatch = italicPart.match(/\*(.*?)\*/);
                    if (italicMatch) {
                      return (
                        <em key={italicIndex} className="italic">
                          {italicMatch[1]}
                        </em>
                      );
                    }
                    return italicPart;
                  })}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default function RichText({ content }: RichTextProps) {
  if (!content) return null;

  const parts = content.split(/(!\[.*?\]\(.*?\))/g);

  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        const markdownImageMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
        if (markdownImageMatch) {
          const [, alt, url] = markdownImageMatch;
          return (
            <div key={index} className="my-6 overflow-hidden rounded-xl border border-gray-100 shadow-md dark:border-gray-800">
              <img src={url} alt={alt || "Görsel"} className="max-h-[500px] w-full object-cover" />
              {alt && (
                <p className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-center text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                  {alt}
                </p>
              )}
            </div>
          );
        }

        return (
          <React.Fragment key={index}>
            {part.split("\n").map((line, lineIndex) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              const isImageUrl =
                /^https?:\/\/.*\.(jpg|jpeg|png|webp|gif|svg)(?:\?.*)?$/i.test(trimmed) ||
                /^\/uploads\/[a-zA-Z0-9_/-]+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(trimmed);

              if (isImageUrl) {
                return (
                  <div key={lineIndex} className="my-6 overflow-hidden rounded-xl border border-gray-100 shadow-md dark:border-gray-800">
                    <img src={trimmed} alt="İçerik görseli" className="max-h-[500px] w-full object-cover" />
                  </div>
                );
              }

              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={lineIndex} className="mb-2 mt-5 text-lg font-bold leading-tight text-gray-900 dark:text-gray-100">
                    {parseInlineMarkdown(trimmed.substring(4))}
                  </h3>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={lineIndex} className="mb-3 mt-6 border-b border-gray-100 pb-1.5 text-xl font-bold leading-tight text-gray-900 dark:border-gray-800 dark:text-gray-100">
                    {parseInlineMarkdown(trimmed.substring(3))}
                  </h2>
                );
              }
              if (trimmed.startsWith("# ")) {
                return (
                  <h1 key={lineIndex} className="mb-4 mt-8 text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                    {parseInlineMarkdown(trimmed.substring(2))}
                  </h1>
                );
              }
              if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
                return (
                  <ul key={lineIndex} className="my-1 ml-2 list-inside list-disc">
                    <li className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      {parseInlineMarkdown(trimmed.substring(2))}
                    </li>
                  </ul>
                );
              }

              return (
                <p key={lineIndex} className="mb-2 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  {parseInlineMarkdown(line)}
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}
