import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { RadioQuestionConfig } from '../data/questions';

interface RadioGroupProps {
  question: RadioQuestionConfig;
  value: 'Yes' | 'Partly' | 'No' | '';
  error?: string;
  onChange: (value: 'Yes' | 'Partly' | 'No') => void;
  firstInputRef?: (el: HTMLInputElement | null) => void;
}

/**
 * Accessible radio group rendered as large tappable option cards (>=48px height).
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  question,
  value,
  error,
  onChange,
  firstInputRef,
}) => {
  const errorId = `${question.id}-error`;

  return (
    <fieldset
      aria-required={question.required ? 'true' : undefined}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? errorId : undefined}
      className="border-0 p-0 m-0 min-w-0"
    >
      <legend className="text-[16px] sm:text-[17px] font-semibold text-[#191919] leading-snug mb-3.5 w-full">
        <span>
          {question.numberLabel}. {question.text}
        </span>
        {question.required && (
          <span className="text-[#C82829] ml-1" aria-hidden="true">
            *
          </span>
        )}
      </legend>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {question.options.map((option, index) => {
          const inputId = `${question.id}-${option.toLowerCase()}`;
          const isSelected = value === option;

          return (
            <div key={option} className="relative">
              <input
                ref={index === 0 ? firstInputRef : undefined}
                type="radio"
                id={inputId}
                name={question.id}
                value={option}
                checked={isSelected}
                onChange={() => onChange(option)}
                className="sr-only peer"
              />
              <label
                htmlFor={inputId}
                className={`flex items-center gap-3 w-full min-h-[48px] px-4 py-3 rounded-xl border text-base font-medium cursor-pointer select-none transition-colors duration-150
                  peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0968F6]
                  ${
                    isSelected
                      ? 'bg-[#D4E4FB]/55 border-[#0968F6] text-[#191919] font-semibold'
                      : error
                        ? 'bg-white border-[#C82829]/70 text-[#191919] hover:border-[#0968F6] hover:bg-[#D4E4FB]/25'
                        : 'bg-white border-[#D6D6D6] text-[#191919] hover:border-[#0968F6] hover:bg-[#D4E4FB]/25'
                  }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 transition-colors duration-150 ${
                    isSelected ? 'border-[#0968F6]' : 'border-[#707070]'
                  }`}
                >
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0968F6]" />
                  )}
                </span>
                <span>{option}</span>
              </label>
            </div>
          );
        })}
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
    </fieldset>
  );
};
