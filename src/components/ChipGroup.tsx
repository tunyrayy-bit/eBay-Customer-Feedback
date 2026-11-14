import React from 'react';
import { Check } from 'lucide-react';
import type { ChipsQuestionConfig } from '../data/questions';

interface ChipGroupProps {
  question: ChipsQuestionConfig;
  selected: string[];
  otherText: string;
  onChange: (nextSelected: string[], nextOtherText: string) => void;
}

/**
 * Multi-select checkbox chips with mutual exclusion for "None of these"
 * and a conditional "Please specify" text input when "Other" is checked.
 */
export const ChipGroup: React.FC<ChipGroupProps> = ({
  question,
  selected,
  otherText,
  onChange,
}) => {
  const isOtherSelected = selected.includes(question.otherOption);
  const otherInputId = `${question.id}-other-input`;

  const handleToggle = (option: string) => {
    const isCurrentlySelected = selected.includes(option);

    if (option === question.exclusiveOption) {
      // Selecting "None of these" clears all other chips and any "Other" text.
      if (isCurrentlySelected) {
        onChange([], '');
      } else {
        onChange([question.exclusiveOption], '');
      }
      return;
    }

    // Selecting any other chip unchecks "None of these".
    const withoutExclusive = selected.filter(
      (item) => item !== question.exclusiveOption,
    );

    if (isCurrentlySelected) {
      const next = withoutExclusive.filter((item) => item !== option);
      const nextOther = option === question.otherOption ? '' : otherText;
      onChange(next, nextOther);
    } else {
      onChange([...withoutExclusive, option], otherText);
    }
  };

  return (
    <fieldset className="border-0 p-0 m-0 min-w-0">
      <legend className="text-[16px] sm:text-[17px] font-semibold text-[#191919] leading-snug mb-3.5 w-full">
        {question.numberLabel}. {question.text}
      </legend>

      <div className="flex flex-wrap gap-2">
        {question.options.map((option) => {
          const inputId = `${question.id}-${option.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          const isChecked = selected.includes(option);

          return (
            <div key={option} className="relative">
              <input
                type="checkbox"
                id={inputId}
                name={question.id}
                value={option}
                checked={isChecked}
                onChange={() => handleToggle(option)}
                className="sr-only peer"
              />
              <label
                htmlFor={inputId}
                className={`inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-full border text-[15px] font-medium cursor-pointer select-none transition-colors duration-150
                  peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#0968F6]
                  ${
                    isChecked
                      ? 'bg-[#0968F6] border-[#0968F6] text-white'
                      : 'bg-white border-[#D6D6D6] text-[#191919] hover:border-[#0968F6] hover:bg-[#D4E4FB]/35'
                  }`}
              >
                {isChecked && (
                  <Check className="w-4 h-4 shrink-0 stroke-[2.5]" aria-hidden="true" />
                )}
                <span>{option}</span>
              </label>
            </div>
          );
        })}
      </div>

      {isOtherSelected && (
        <div className="mt-3.5">
          <label
            htmlFor={otherInputId}
            className="block text-sm font-medium text-[#191919] mb-1.5"
          >
            {question.otherPlaceholder}
          </label>
          <input
            id={otherInputId}
            type="text"
            maxLength={120}
            value={otherText}
            placeholder={question.otherPlaceholder}
            onChange={(e) => onChange(selected, e.target.value)}
            className="w-full sm:max-w-sm min-h-[48px] rounded-xl border border-[#D6D6D6] bg-white px-3.5 py-2.5 text-base text-[#191919] placeholder:text-[#707070]/80 transition-colors duration-150 hover:border-[#707070] focus:border-[#0968F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0968F6]"
          />
        </div>
      )}
    </fieldset>
  );
};
