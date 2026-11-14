import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';
import type { SelectQuestionConfig } from '../data/questions';

interface SelectQuestionProps {
  question: SelectQuestionConfig;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  selectRef?: (el: HTMLSelectElement | null) => void;
}

/**
 * Native <select> dropdown for optimal mobile picker UX, with accessible label and error state.
 */
export const SelectQuestion: React.FC<SelectQuestionProps> = ({
  question,
  value,
  error,
  onChange,
  selectRef,
}) => {
  const selectId = `${question.id}-select`;
  const errorId = `${question.id}-error`;

  return (
    <div>
      <label
        htmlFor={selectId}
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

      <div className="relative">
        <select
          ref={selectRef}
          id={selectId}
          name={question.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-required={question.required ? 'true' : undefined}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={`w-full min-h-[48px] appearance-none rounded-xl border bg-white pl-3.5 pr-10 py-2.5 text-base cursor-pointer transition-colors duration-150
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0968F6]
            ${value === '' ? 'text-[#707070]' : 'text-[#191919]'}
            ${
              error
                ? 'border-[#C82829] focus-visible:outline-[#C82829]'
                : 'border-[#D6D6D6] hover:border-[#707070] focus:border-[#0968F6]'
            }`}
        >
          <option value="" disabled>
            {question.placeholder}
          </option>
          {question.options.map((option) => (
            <option key={option} value={option} className="text-[#191919]">
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          className="w-5 h-5 text-[#707070] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
          aria-hidden="true"
        />
      </div>

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
