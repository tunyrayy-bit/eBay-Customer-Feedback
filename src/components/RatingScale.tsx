import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { RatingQuestionConfig } from '../data/questions';

interface RatingScaleProps {
  question: RatingQuestionConfig;
  value: number | null;
  error?: string;
  onChange: (value: number) => void;
  firstInputRef?: (el: HTMLInputElement | null) => void;
}

/**
 * Accessible rating scale built with native radio inputs styled as tappable buttons.
 * Supports keyboard arrow-key navigation and meets >=44x44px touch target requirements.
 */
export const RatingScale: React.FC<RatingScaleProps> = ({
  question,
  value,
  error,
  onChange,
  firstInputRef,
}) => {
  const options = Array.from(
    { length: question.max - question.min + 1 },
    (_, i) => question.min + i,
  );
  const isElevenPoint = options.length > 5;
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

      <div
        className={
          isElevenPoint
            ? 'grid grid-cols-6 sm:grid-cols-11 gap-1.5 sm:gap-2'
            : 'grid grid-cols-5 gap-2 sm:gap-3'
        }
      >
        {options.map((score, index) => {
          const inputId = `${question.id}-option-${score}`;
          const isSelected = value === score;

          return (
            <div key={score} className="relative">
              <input
                ref={index === 0 ? firstInputRef : undefined}
                type="radio"
                id={inputId}
                name={question.id}
                value={score}
                checked={isSelected}
                onChange={() => onChange(score)}
                className="sr-only peer"
              />
              <label
                htmlFor={inputId}
                className={`flex items-center justify-center w-full min-h-[48px] min-w-[44px] rounded-xl border text-base font-semibold tabular-nums cursor-pointer select-none transition-colors duration-150
                  peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0968F6]
                  ${
                    isSelected
                      ? 'bg-[#0968F6] border-[#0968F6] text-white shadow-xs'
                      : error
                        ? 'bg-white border-[#C82829]/70 text-[#191919] hover:border-[#0968F6] hover:bg-[#D4E4FB]/35'
                        : 'bg-white border-[#D6D6D6] text-[#191919] hover:border-[#0968F6] hover:bg-[#D4E4FB]/35'
                  }`}
              >
                {score}
              </label>
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-4 text-[13px] text-[#707070]">
        <span>{question.minLabel}</span>
        <span className="text-right">{question.maxLabel}</span>
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
