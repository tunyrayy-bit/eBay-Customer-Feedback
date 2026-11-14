import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { TextQuestionConfig } from '../data/questions';

interface TextQuestionProps {
  question: TextQuestionConfig;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  inputRef?: (el: HTMLTextAreaElement | null) => void;
}

/**
 * Multi-line text area question with 16px+ font size (prevents mobile zoom),
 * live character counter, and accessible inline validation feedback.
 */
export const TextQuestion: React.FC<TextQuestionProps> = ({
  question,
  value,
  error,
  onChange,
  inputRef,
}) => {
  const inputId = `${question.id}-input`;
  const errorId = `${question.id}-error`;
  const counterId = `${question.id}-counter`;
  const describedBy = error ? `${counterId} ${errorId}` : counterId;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-[16px] sm:text-[17px] font-semibold text-[#191919] leading-snug mb-3"
      >
        <span>
          {question.numberLabel}. {question.text}
        </span>
        {question.required && (
          <span className="text-[#C82829] ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <textarea
        ref={inputRef}
        id={inputId}
        name={question.id}
        rows={4}
        maxLength={question.maxLength}
        value={value}
        placeholder={question.placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-required={question.required ? 'true' : undefined}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={`w-full rounded-xl border bg-white px-3.5 py-3 text-base text-[#191919] placeholder:text-[#707070]/80 leading-relaxed resize-y min-h-[112px] transition-colors duration-150
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0968F6]
          ${
            error
              ? 'border-[#C82829] focus-visible:outline-[#C82829]'
              : 'border-[#D6D6D6] hover:border-[#707070] focus:border-[#0968F6]'
          }`}
      />

      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {error && (
            <p
              id={errorId}
              role="alert"
              aria-live="polite"
              className="flex items-center gap-1.5 text-sm font-medium text-[#C82829]"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </p>
          )}
        </div>
        <span
          id={counterId}
          className="text-[13px] text-[#707070] tabular-nums shrink-0"
        >
          {value.length} / {question.maxLength}
        </span>
      </div>
    </div>
  );
};
