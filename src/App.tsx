import React, { useMemo, useRef, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import {
  QUESTIONS,
  createInitialAnswers,
  type FeedbackAnswers,
  type FeedbackPayload,
  type QuestionId,
  type ValidationErrors,
} from './data/questions';
import { RatingScale } from './components/RatingScale';
import { TextQuestion } from './components/TextQuestion';
import { RadioGroup } from './components/RadioGroup';
import { ChipGroup } from './components/ChipGroup';
import { SelectQuestion } from './components/SelectQuestion';
import { EmailQuestion } from './components/EmailQuestion';
import { ThankYou } from './components/ThankYou';

// Single configuration constant for the Google Apps Script Web App endpoint.
const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwiV16EYf32TDF10EbLw2ZCtOHoIi2mi1M3zVjfuiJG_aoe_X4NIy_wSh0TaR-IUGzB/exec';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function App() {
  const [answers, setAnswers] = useState<FeedbackAnswers>(createInitialAnswers);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [summaryBannerMessage, setSummaryBannerMessage] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const cardRefs = useRef<Partial<Record<QuestionId, HTMLDivElement | null>>>({});
  const inputRefs = useRef<Partial<Record<QuestionId, HTMLElement | null>>>({});

  // Count how many of the 12 questions currently have a non-empty response.
  const answeredCount = useMemo(() => {
    let count = 0;
    if (answers.q1 !== null) count += 1;
    if (answers.q2.trim().length > 0) count += 1;
    if (answers.q3 !== null) count += 1;
    if (answers.q4.trim().length > 0) count += 1;
    if (answers.q5 !== '') count += 1;
    if (answers.q6.trim().length > 0) count += 1;
    if (answers.q7 !== null) count += 1;
    if (answers.q8.length > 0) count += 1;
    if (answers.q9.trim().length > 0) count += 1;
    if (answers.q10 !== '') count += 1;
    if (answers.q11.trim().length > 0) count += 1;
    if (answers.q12.trim().length > 0) count += 1;
    return count;
  }, [answers]);

  const progressPercent = Math.round((answeredCount / QUESTIONS.length) * 100);

  // Clear a question's error as soon as the user provides a valid value.
  const clearQuestionError = (id: QuestionId, nextIsValid: boolean) => {
    if (!nextIsValid) return;
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      if (Object.keys(next).length === 0) {
        setSummaryBannerMessage(null);
      }
      return next;
    });
  };

  const validateAll = (current: FeedbackAnswers): ValidationErrors => {
    const nextErrors: ValidationErrors = {};

    if (current.q1 === null) nextErrors.q1 = 'This question is required.';
    if (current.q2.trim().length === 0) nextErrors.q2 = 'This question is required.';
    if (current.q3 === null) nextErrors.q3 = 'This question is required.';
    if (current.q4.trim().length === 0) nextErrors.q4 = 'This question is required.';
    if (current.q5 === '') nextErrors.q5 = 'This question is required.';
    if (current.q7 === null) nextErrors.q7 = 'This question is required.';
    if (current.q10 === '') nextErrors.q10 = 'This question is required.';
    if (current.q11.trim().length === 0) nextErrors.q11 = 'This question is required.';

    const trimmedEmail = current.q12.trim();
    if (trimmedEmail.length > 0 && !EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.q12 = 'Please enter a valid email address.';
    }

    return nextErrors;
  };

  const buildPayload = (current: FeedbackAnswers): FeedbackPayload => {
    const trimmedOther = current.q8Other.trim();
    const formattedPlatforms = current.q8.map((platform) => {
      if (platform === 'Other' && trimmedOther.length > 0) {
        return `Other: ${trimmedOther}`;
      }
      return platform;
    });

    return {
      q1: current.q1 as number,
      q2: current.q2.trim(),
      q3: current.q3 as number,
      q4: current.q4.trim(),
      q5: current.q5 as 'Yes' | 'Partly' | 'No',
      q6: current.q6.trim(),
      q7: current.q7 as number,
      q8: formattedPlatforms.join(', '),
      q9: current.q9.trim(),
      q10: current.q10,
      q11: current.q11.trim(),
      q12: current.q12.trim(),
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setNetworkError(null);

    const validationErrors = validateAll(answers);
    const errorKeys = Object.keys(validationErrors) as QuestionId[];

    if (errorKeys.length > 0) {
      setErrors(validationErrors);
      const hasRequiredErrors = errorKeys.some((key) => key !== 'q12');
      setSummaryBannerMessage(
        hasRequiredErrors
          ? 'Please answer the required questions'
          : 'Please enter a valid email address.',
      );

      // Find first invalid question in form order, smooth-scroll, and focus it.
      const firstInvalid = QUESTIONS.find((q) => validationErrors[q.id]);
      if (firstInvalid) {
        const cardEl = cardRefs.current[firstInvalid.id];
        const controlEl = inputRefs.current[firstInvalid.id];
        cardEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        controlEl?.focus({ preventScroll: true });
      }
      return;
    }

    setErrors({});
    setSummaryBannerMessage(null);

    // Honeypot check: silently pretend success without calling Apps Script.
    if (honeypot.trim().length > 0) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildPayload(answers);

      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      setIsSubmitted(true);
    } catch {
      setNetworkError(
        'Something went wrong. Your answers are still here. Please try again.',
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAnswers(createInitialAnswers());
    setHoneypot('');
    setErrors({});
    setSummaryBannerMessage(null);
    setNetworkError(null);
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      {/* Top white bar with eBay logo */}
      <header className="w-full bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[720px] mx-auto px-3.5 sm:px-6 py-3.5 flex items-center justify-between">
          <img
            src="https://i.ibb.co/4RDMc9Qg/download.png"
            alt="eBay logo"
            style={{ height: '40px', width: 'auto' }}
          />
        </div>
      </header>

      {/* Light-blue eBay Customer Service style title band */}
      <section className="w-full bg-[#D4E4FB]">
        <div className="max-w-[720px] mx-auto px-3.5 sm:px-6 py-7 sm:py-9">
          <h1 className="text-[28px] sm:text-[34px] font-bold text-[#191919] tracking-tight leading-tight">
            Customer Feedback
          </h1>
          <p className="mt-2.5 text-[15px] sm:text-base text-[#191919]/90 leading-relaxed">
            Tell us about your recent shopping experience. It takes about 3 minutes. Questions marked with{' '}
            <span className="text-[#C82829] font-semibold" aria-hidden="true">
              *
            </span>
            <span className="sr-only">an asterisk</span> are required.
          </p>
        </div>
      </section>

      {/* Main centered column */}
      <main className="flex-1 w-full max-w-[720px] mx-auto px-3.5 sm:px-6 py-6 sm:py-8">
        {isSubmitted ? (
          <ThankYou onReset={handleReset} />
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-[#707070] mb-2">
                <span className="font-medium text-[#191919] tabular-nums">
                  {answeredCount} of {QUESTIONS.length} answered
                </span>
                <span className="tabular-nums">{progressPercent}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={answeredCount}
                aria-valuemin={0}
                aria-valuemax={QUESTIONS.length}
                aria-label="Survey completion progress"
                className="w-full h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-[#0968F6] rounded-full transition-all duration-200 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Validation summary banner */}
            {summaryBannerMessage && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#C82829] bg-[#C82829]/5 px-4 py-3.5 text-sm sm:text-[15px] font-medium text-[#C82829]"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{summaryBannerMessage}</span>
              </div>
            )}

            {/* Network failure banner */}
            {networkError && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#C82829] bg-[#C82829]/5 px-4 py-3.5 text-sm sm:text-[15px] font-medium text-[#C82829]"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{networkError}</span>
              </div>
            )}

            {/* Visually hidden honeypot field */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Question cards */}
            <div className="space-y-4 sm:space-y-5">
              {QUESTIONS.map((question) => {
                const error = errors[question.id];
                const cardClassName = `bg-[#F7F7F7] rounded-2xl border p-3.5 sm:p-6 transition-colors duration-150 ${
                  error ? 'border-[#C82829]' : 'border-[#E5E5E5]'
                }`;

                return (
                  <div
                    key={question.id}
                    ref={(el) => {
                      cardRefs.current[question.id] = el;
                    }}
                    className={cardClassName}
                  >
                    {question.type === 'rating' && (
                      <RatingScale
                        question={question}
                        value={
                          question.id === 'q1'
                            ? answers.q1
                            : question.id === 'q3'
                              ? answers.q3
                              : answers.q7
                        }
                        error={error}
                        onChange={(val) => {
                          setAnswers((prev) => ({ ...prev, [question.id]: val }));
                          clearQuestionError(question.id, true);
                        }}
                        firstInputRef={(el) => {
                          inputRefs.current[question.id] = el;
                        }}
                      />
                    )}

                    {question.type === 'textarea' && (
                      <TextQuestion
                        question={question}
                        value={
                          answers[
                            question.id as 'q2' | 'q4' | 'q6' | 'q9' | 'q11'
                          ]
                        }
                        error={error}
                        onChange={(val) => {
                          setAnswers((prev) => ({ ...prev, [question.id]: val }));
                          if (question.required) {
                            clearQuestionError(
                              question.id,
                              val.trim().length > 0,
                            );
                          }
                        }}
                        inputRef={(el) => {
                          inputRefs.current[question.id] = el;
                        }}
                      />
                    )}

                    {question.type === 'radio' && (
                      <RadioGroup
                        question={question}
                        value={answers.q5}
                        error={error}
                        onChange={(val) => {
                          setAnswers((prev) => ({ ...prev, q5: val }));
                          clearQuestionError('q5', true);
                        }}
                        firstInputRef={(el) => {
                          inputRefs.current.q5 = el;
                        }}
                      />
                    )}

                    {question.type === 'chips' && (
                      <ChipGroup
                        question={question}
                        selected={answers.q8}
                        otherText={answers.q8Other}
                        onChange={(nextSelected, nextOtherText) => {
                          setAnswers((prev) => ({
                            ...prev,
                            q8: nextSelected,
                            q8Other: nextOtherText,
                          }));
                        }}
                      />
                    )}

                    {question.type === 'select' && (
                      <SelectQuestion
                        question={question}
                        value={answers.q10}
                        error={error}
                        onChange={(val) => {
                          setAnswers((prev) => ({ ...prev, q10: val }));
                          clearQuestionError('q10', val !== '');
                        }}
                        selectRef={(el) => {
                          inputRefs.current.q10 = el;
                        }}
                      />
                    )}

                    {question.type === 'email' && (
                      <EmailQuestion
                        question={question}
                        value={answers.q12}
                        error={error}
                        onChange={(val) => {
                          setAnswers((prev) => ({ ...prev, q12: val }));
                          const trimmed = val.trim();
                          clearQuestionError(
                            'q12',
                            trimmed.length === 0 || EMAIL_REGEX.test(trimmed),
                          );
                        }}
                        inputRef={(el) => {
                          inputRefs.current.q12 = el;
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit button */}
            <div className="mt-8 flex justify-center sm:justify-start">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto min-w-[220px] min-h-[48px] px-8 py-3 rounded-full bg-[#0968F6] hover:bg-[#0654BA] active:bg-[#0654BA] disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold text-base inline-flex items-center justify-center gap-2.5 cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0968F6]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      className="w-5 h-5 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit feedback</span>
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E5E5E5] bg-white">
        <div className="max-w-[720px] mx-auto px-3.5 sm:px-6 py-5 text-sm text-[#707070]">
          Your feedback helps us make eBay better.
        </div>
      </footer>
    </div>
  );
}
