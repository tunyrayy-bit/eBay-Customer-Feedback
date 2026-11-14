/**
 * Centralized question definitions and TypeScript types for the eBay Customer Feedback form.
 * Wording, options, and validation limits can be edited here without touching UI components.
 */

export type QuestionId =
  | 'q1'
  | 'q2'
  | 'q3'
  | 'q4'
  | 'q5'
  | 'q6'
  | 'q7'
  | 'q8'
  | 'q9'
  | 'q10'
  | 'q11'
  | 'q12';

export type QuestionType = 'rating' | 'textarea' | 'radio' | 'chips' | 'select' | 'email';

export interface BaseQuestion {
  id: QuestionId;
  numberLabel: string;
  text: string;
  required: boolean;
  type: QuestionType;
}

export interface RatingQuestionConfig extends BaseQuestion {
  type: 'rating';
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
}

export interface TextQuestionConfig extends BaseQuestion {
  type: 'textarea';
  maxLength: number;
  placeholder: string;
  showCounter?: boolean;
}

export interface RadioQuestionConfig extends BaseQuestion {
  type: 'radio';
  options: readonly ['Yes', 'Partly', 'No'];
}

export interface ChipsQuestionConfig extends BaseQuestion {
  type: 'chips';
  options: readonly string[];
  exclusiveOption: string;
  otherOption: string;
  otherPlaceholder: string;
}

export interface SelectQuestionConfig extends BaseQuestion {
  type: 'select';
  placeholder: string;
  options: readonly string[];
}

export interface EmailQuestionConfig extends BaseQuestion {
  type: 'email';
  helperText: string;
  placeholder: string;
}

export type QuestionConfig =
  | RatingQuestionConfig
  | TextQuestionConfig
  | RadioQuestionConfig
  | ChipsQuestionConfig
  | SelectQuestionConfig
  | EmailQuestionConfig;

export const QUESTIONS: readonly QuestionConfig[] = [
  {
    id: 'q1',
    numberLabel: 'Q1',
    text: 'Overall, how satisfied are you with your eBay shopping experience?',
    required: true,
    type: 'rating',
    min: 1,
    max: 5,
    minLabel: '1 = Very dissatisfied',
    maxLabel: '5 = Very satisfied',
  },
  {
    id: 'q2',
    numberLabel: 'Q2',
    text: 'What is the primary reason for your satisfaction rating?',
    required: true,
    type: 'textarea',
    maxLength: 1000,
    placeholder: 'Share what stood out most during your shopping experience...',
    showCounter: true,
  },
  {
    id: 'q3',
    numberLabel: 'Q3',
    text: 'How likely are you to recommend shopping on eBay to a friend or colleague?',
    required: true,
    type: 'rating',
    min: 0,
    max: 10,
    minLabel: '0 = Not at all likely',
    maxLabel: '10 = Extremely likely',
  },
  {
    id: 'q4',
    numberLabel: 'Q4',
    text: 'What is the main reason for your recommendation score?',
    required: true,
    type: 'textarea',
    maxLength: 1000,
    placeholder: 'Tell us why you gave this score...',
    showCounter: true,
  },
  {
    id: 'q5',
    numberLabel: 'Q5',
    text: "Did the item condition and delivery match the seller's listing description?",
    required: true,
    type: 'radio',
    options: ['Yes', 'Partly', 'No'] as const,
  },
  {
    id: 'q6',
    numberLabel: 'Q6',
    text: 'What specific aspects of the item condition, packaging, or delivery could be improved?',
    required: false,
    type: 'textarea',
    maxLength: 1000,
    placeholder: 'Optional — share any details about condition, packaging, or shipping...',
    showCounter: true,
  },
  {
    id: 'q7',
    numberLabel: 'Q7',
    text: "How do you rate eBay's pricing, seller fees, and overall value for money?",
    required: true,
    type: 'rating',
    min: 1,
    max: 5,
    minLabel: '1 = Very poor',
    maxLabel: '5 = Excellent',
  },
  {
    id: 'q8',
    numberLabel: 'Q8',
    text: 'Which other shopping platforms do you use regularly? (pick as many as apply)',
    required: false,
    type: 'chips',
    options: [
      'Amazon',
      'Walmart',
      'Etsy',
      'Facebook Marketplace',
      'Temu',
      'AliExpress',
      'Shein',
      'Target',
      'Best Buy',
      'Mercari',
      'Poshmark',
      'OfferUp',
      'Jumia',
      'Konga',
      'Other',
      'None of these',
    ],
    exclusiveOption: 'None of these',
    otherOption: 'Other',
    otherPlaceholder: 'Please specify',
  },
  {
    id: 'q9',
    numberLabel: 'Q9',
    text: 'What do other platforms do better than eBay?',
    required: false,
    type: 'textarea',
    maxLength: 1000,
    placeholder: 'Optional — tell us what works well on other platforms...',
    showCounter: true,
  },
  {
    id: 'q10',
    numberLabel: 'Q10',
    text: 'What area should eBay prioritize improving most?',
    required: true,
    type: 'select',
    placeholder: 'Select an area',
    options: [
      'Item condition accuracy',
      'Delivery speed and tracking',
      'Packaging quality',
      'Pricing and fees',
      'Seller quality and trust',
      'Returns and refunds',
      'Buyer protection and dispute resolution',
      'Search and finding products',
      'Website / app ease of use',
      'Customer service',
      'Payment options',
      'Other',
    ],
  },
  {
    id: 'q11',
    numberLabel: 'Q11',
    text: 'What is the single most important improvement eBay should make to enhance your experience?',
    required: true,
    type: 'textarea',
    maxLength: 1000,
    placeholder: 'Describe the one change that would make the biggest difference...',
    showCounter: true,
  },
  {
    id: 'q12',
    numberLabel: 'Q12',
    text: 'Email address (optional)',
    required: false,
    type: 'email',
    helperText: "Only if you'd like us to follow up with you.",
    placeholder: 'name@example.com',
  },
];

export interface FeedbackAnswers {
  q1: number | null;
  q2: string;
  q3: number | null;
  q4: string;
  q5: 'Yes' | 'Partly' | 'No' | '';
  q6: string;
  q7: number | null;
  q8: string[];
  q8Other: string;
  q9: string;
  q10: string;
  q11: string;
  q12: string;
}

export interface FeedbackPayload {
  q1: number;
  q2: string;
  q3: number;
  q4: string;
  q5: 'Yes' | 'Partly' | 'No';
  q6: string;
  q7: number;
  q8: string;
  q9: string;
  q10: string;
  q11: string;
  q12: string;
}

export type ValidationErrors = Partial<Record<QuestionId, string>>;

export function createInitialAnswers(): FeedbackAnswers {
  return {
    q1: null,
    q2: '',
    q3: null,
    q4: '',
    q5: '',
    q6: '',
    q7: null,
    q8: [],
    q8Other: '',
    q9: '',
    q10: '',
    q11: '',
    q12: '',
  };
}
