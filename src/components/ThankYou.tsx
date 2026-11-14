import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

interface ThankYouProps {
  onReset: () => void;
}

/**
 * Confirmation view displayed after a successful feedback submission.
 * Scrolls to top and moves focus to the confirmation heading for screen-reader clarity.
 */
export const ThankYou: React.FC<ThankYouProps> = ({ onReset }) => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    headingRef.current?.focus();
  }, []);

  return (
    <section
      aria-labelledby="thank-you-heading"
      className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-2xl px-6 py-10 sm:px-10 sm:py-12 text-center"
    >
      <div
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#0968F6] text-white"
        aria-hidden="true"
      >
        <Check className="h-9 w-9 stroke-[2.75]" />
      </div>

      <h2
        id="thank-you-heading"
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl sm:text-[28px] font-bold text-[#191919] tracking-tight focus:outline-none"
      >
        Thank you for your feedback!
      </h2>

      <p className="mt-3 max-w-md mx-auto text-base text-[#707070] leading-relaxed">
        We really appreciate you taking the time to help us improve eBay. Your response has been recorded.
      </p>

      <div className="mt-8">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 rounded-full bg-[#0968F6] hover:bg-[#0654BA] active:bg-[#0654BA] text-white font-bold text-base cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0968F6]"
        >
          Submit another response
        </button>
      </div>
    </section>
  );
};
