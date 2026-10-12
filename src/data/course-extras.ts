// ---------------------------------------------------------------------------
// Content that Edmingle doesn't store: testimonials, FAQs and fixed labels.
// (MHB does the same — its FAQs live in app/core/phs-faqs.ts.)
//
// `defaults` applies to every course. To change one course, add an entry to
// `byBundleId` using its Edmingle institution_bundle_id (the number at the end
// of the course URL, e.g. /courses/design-thinking-innovation-12345 → 12345).
// ---------------------------------------------------------------------------
import { courses, type Faq, type Testimonial } from './courses';

export interface CourseExtras {
  eyebrow: string;
  cardEyebrow: string;
  enrollLabel: string;
  freeEnrollLabel: string;
  guarantee: string;
  /** Third line under "Your course includes" (the first two are counted from the curriculum). */
  includesExtra: string[];
  testimonials: Testimonial[];
  faqIntro: string;
  faqs: Faq[];
  contactHref: string;
  /** Link for "Download full curriculum". Empty = button hidden. */
  curriculumPdf: string;
}

const sample = courses[0];

export const defaults: CourseExtras = {
  eyebrow: 'Happ Coach Academy',
  cardEyebrow: 'Your next big idea starts here',
  enrollLabel: 'Enroll now and start learning!',
  freeEnrollLabel: 'Enrol for free',
  guarantee: '100% money-back guarantee',
  includesExtra: ['Real-world examples & tools'],
  testimonials: sample.testimonials,
  faqIntro: sample.faqIntro,
  faqs: sample.faqs,
  contactHref: '/contact-us',
  curriculumPdf: '',
};

export const byBundleId: Record<number, Partial<CourseExtras>> = {
  // 12345: {
  //   faqs: [{ question: 'Do I get a certificate?', answer: 'Yes …' }],
  //   curriculumPdf: 'https://…/design-thinking-curriculum.pdf',
  // },
};

export const getExtras = (bundleId?: number): CourseExtras => ({
  ...defaults,
  ...(bundleId ? byBundleId[bundleId] : undefined),
});
