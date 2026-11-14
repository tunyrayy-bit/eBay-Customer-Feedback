import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { EmailQuestionConfig } from '../data/questions';

interface EmailQuestionProps {
  question: EmailQuestionConfig;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  inputRef?: (el: HTMLInputElement | null) => void;
}

/**
 * Optional email input configured with email keyboard attributes and format validation.
 */
export const EmailQuestion: React.FC<EmailQuestionProps> = ({
  question,
  value,
  error,
  onChange,
  inputRef,
}) => {
  const inputId = `${question.id}-input`;
  const helperId = `${question.id}-helper`;
  const errorId = `${question.id}-error`;
  const describedBy = error ? `${helperId} ${errorId}` : helperId;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-[16px] sm:text-[17px] font-semibold text-[#191919] leading-snug mb-1.5"
      >
        {question.numberLabel}. {question.text}
      </label>

      <p id={helperId} className="text-sm text-[#707070] mb-3">
        {question.helperText}
      </p>

      <input
        ref={inputRef}
        id={inputId}
        name={question.id}
        type="email"
        inputMode="email"
        autoComplete="email"
        value={value}
        placeholder={question.placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={`w-full min-h-[48px] rounded-xl border bg-white px-3.5 py-2.5 text-base text-[#191919] placeholder:text-[#707070]/80 transition-colors duration-150
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0968F6]
          ${
            error
              ? 'border-[#C82829] focus-visible:outline-[#C82829]'
              : 'border-[#D6D6D6] hover:border-[#707070] focus:border-[#0968F6]'
          }`}
      />

      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="mt-2.5 flex items-center gap-1.5 text-sm font-medium text-[#C82829]"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
