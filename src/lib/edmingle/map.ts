// ---------------------------------------------------------------------------
// Turns Edmingle API data into the `Course` / `CourseCard` shapes that the
// page components already use. Components never see raw API data.
// ---------------------------------------------------------------------------
import { EDMINGLE } from '../../config/edmingle';
import { getExtras } from '../../data/course-extras';
import { courses as sampleCourses } from '../../data/courses';
import type { Course, CourseCard, Lesson, LessonType, Module, Topic } from '../../data/courses';
import { cleanHtml, toText, truncate } from '../html';
import type { CourseBundle, CourseDetailsResponse, CourseTag, Resource, Section, SubjectCurriculum } from './types';

const FALLBACK_IMAGE = 'images/courses/design-thinking-hero.jpg';

// ---------- slugs: "<pretty_name>-<institution_bundle_id>", like MHB ----------
const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-');

export const toSlug = (b: { pretty_name?: string; bundle_name: string; institution_bundle_id: number }) =>
  `${slugify(b.pretty_name || b.bundle_name) || 'course'}-${b.institution_bundle_id}`;

/** "design-thinking-innovation-12345" → 12345 (MHB: extractInstBundleId). */
export const bundleIdFromSlug = (slug: string): number | null => {
  const match = /-(\d+)$/.exec(slug);
  return match ? Number(match[1]) : null;
};

// ---------- formatting ----------
export function formatPrice(amount: number | string, symbol = '₹'): string {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return 'Free';
  const value = Number.isInteger(n) ? n.toLocaleString('en-IN') : n.toFixed(2);
  return symbol === '₹' || symbol === 'INR' ? `₹${value}/-` : `${symbol}${value}`;
}

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds) return '';
  const minutes = Math.round(totalSeconds / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h ? `${h} hr` : '', m ? `${m} min` : ''].filter(Boolean).join(' ') || '1 min';
}

const lessonMinutes = (seconds: number) => {
  if (!seconds) return '';
  const m = Math.max(1, Math.round(seconds / 60));
  return `${m} ${m === 1 ? 'minute' : 'minutes'}`;
};

/** Edmingle MIME type → icon name (same groups as MHB's TypeIcon.tsx). */
export function lessonType(r: Pick<Resource, 'type' | 'resource_type'>): LessonType {
  const t = (r.type || '').toLowerCase();
  if (r.resource_type === 5) return 'quiz';
  if (t.startsWith('video/') || t === 'vimeo' || t === 'youtube') return 'video';
  if (t.startsWith('audio/')) return 'audio';
  if (t.startsWith('image/')) return 'image';
  if (t === 'application/pdf') return 'pdf';
  if (t === 'text/plain') return 'doc';
  if (t.includes('word') || t.includes('msword') || t.includes('excel') || t.includes('spreadsheet')) return 'docx';
  if (t.includes('powerpoint') || t.includes('presentation')) return 'ppt';
  if (t.includes('zip') || t.includes('rar')) return 'zip';
  if (t === 'external_url' || t === 'link') return 'link';
  return 'quiz';
}

/** Title split for the two-colour heading: "Design Thinking Innovation" → ["Design Thinking", "Innovation"]. */
function splitTitle(name: string): [string, string] {
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return [name.trim(), ''];
  return [words.slice(0, -1).join(' '), words[words.length - 1]];
}

const tagValue = (tags: CourseTag[] | undefined, id: number): string[] =>
  id ? (tags?.find((t) => t.id === id)?.value ?? []).filter(Boolean) : [];

const byIndex = <T extends { display_index?: number }>(a: T, b: T) =>
  (a.display_index ?? 0) - (b.display_index ?? 0);

// ---------- curriculum ----------
const toLesson = (r: Resource): Lesson => ({
  title: toText(r.resource_type === 5 ? r.exercise_name : r.material_name || r.file_name) || 'Untitled',
  type: lessonType(r),
  duration: lessonMinutes(Number(r.duration_seconds) || 0),
});

const sectionLessons = (s: Section) => [...(s.resources ?? [])].sort(byIndex).map(toLesson);

/**
 * Edmingle: bundle → subjects → sections → resources.
 * Design:   topics → modules → lessons.
 * With several subjects: subject = topic, section = module.
 * With one subject:      section = topic, lessons sit directly under it.
 */
function buildCurriculum(subjects: SubjectCurriculum[]) {
  let topics: Topic[];
  if (subjects.length > 1) {
    topics = subjects.map((subject, i) => ({
      title: `${i + 1}. ${toText(subject.name)}`,
      modules: [...subject.sections].sort(byIndex).map(
        (s): Module => ({ title: toText(s.section_name), lessons: sectionLessons(s) }),
      ),
    }));
  } else {
    const sections = [...(subjects[0]?.sections ?? [])].sort(byIndex);
    topics = sections.map((s, i) => ({ title: `${i + 1}. ${toText(s.section_name)}`, lessons: sectionLessons(s) }));
  }

  const moduleCount = topics.reduce((n, t) => n + (t.modules?.length ?? 0), 0);
  const lessonCount = topics.reduce(
    (n, t) => n + (t.lessons?.length ?? 0) + (t.modules ?? []).reduce((m, mod) => m + mod.lessons.length, 0),
    0,
  );
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const summary = [
    plural(topics.length, 'Topic'),
    moduleCount ? plural(moduleCount, 'Module') : '',
  ]
    .filter(Boolean)
    .join(' • ') + (lessonCount ? ` + ${plural(lessonCount, 'Resource')}` : '');

  const seconds =
    subjects.reduce((n, s) => n + s.totalTime, 0) ||
    subjects.reduce((n, s) => n + s.sections.reduce((m, sec) => m + (sec.resources ?? []).reduce((k, r) => k + (Number(r.duration_seconds) || 0), 0), 0), 0);

  return { topics, summary, topicCount: topics.length, lessonCount, seconds };
}

// ---------- public mappers ----------
export function toCard(b: CourseBundle & { department_name?: string }): CourseCard {
  return {
    slug: toSlug(b),
    title: toText(b.bundle_name),
    text: truncate(toText(b.bundle_description), 110),
    price: formatPrice(b.cost, b.currency_symbol),
    priceNote: EDMINGLE.priceNote,
    tag: toText(tagValue(b.tags, EDMINGLE.tagIds.category)[0] || b.department_name || ''),
    image: b.img_url || FALLBACK_IMAGE,
  };
}

export function toCourse(
  details: CourseDetailsResponse,
  subjects: SubjectCurriculum[],
  listBundle?: CourseBundle & { department_name?: string },
): Course {
  const b = details.bundle;
  const tags = details.tags ?? [];
  const extras = getExtras(b.institution_bundle_id);
  const name = toText(b.bundle_name);
  const [title, titleAccent] = splitTitle(name);
  const curriculum = buildCurriculum(subjects);

  // Overview cards: from your Edmingle custom fields, else the course overview.
  const overview = EDMINGLE.tagIds.overview
    .map(({ id, title }) => {
      const html = cleanHtml(tagValue(tags, id).join(''));
      return { title, text: toText(html), html };
    })
    .filter((item) => item.text);
  if (!overview.length && toText(b.bundle_overview)) {
    overview.push({ title: 'About this course', text: toText(b.bundle_overview), html: cleanHtml(b.bundle_overview) });
  }

  const cost = Number(b.cost);
  const striked = Number(b.striked_cost);
  const learners = Number(b.student_count) || Number(listBundle?.student_count) || 0;

  return {
    slug: toSlug(b),
    edmingleBundleId: b.institution_bundle_id,
    freePreview: Number(b.free_preview_allowed) === 1,
    category: toText(tagValue(tags, EDMINGLE.tagIds.category)[0] || listBundle?.department_name || ''),
    eyebrow: extras.eyebrow,
    title,
    titleAccent,
    tagline: toText(b.bundle_description),
    description: toText(tagValue(tags, EDMINGLE.tagIds.heroDescription).join(' ')),
    rating: Number(b.rating) || 0,
    learners: learners ? `${learners.toLocaleString('en-IN')} learners` : '',
    duration: formatDuration(curriculum.seconds),
    price: formatPrice(cost, b.currency_symbol),
    priceStrike: striked > cost ? formatPrice(striked, b.currency_symbol) : undefined,
    priceNote: EDMINGLE.priceNote,
    image: b.img_url || FALLBACK_IMAGE,
    imageAlt: name,
    cardEyebrow: extras.cardEyebrow,
    enrollLabel: cost > 0 ? extras.enrollLabel : extras.freeEnrollLabel,
    enrollHref: '#enroll',
    guarantee: extras.guarantee,
    includes: [
      curriculum.topicCount ? `${curriculum.topicCount} Learning topic${curriculum.topicCount === 1 ? '' : 's'}` : '',
      curriculum.lessonCount ? `${curriculum.lessonCount}+ Practical resources` : '',
      ...extras.includesExtra,
    ].filter(Boolean),
    overview,
    curriculum: {
      summary: curriculum.summary,
      topics: curriculum.topics,
      downloadHref: extras.curriculumPdf,
    },
    testimonials: extras.testimonials,
    related: [],
    faqIntro: extras.faqIntro,
    faqs: extras.faqs,
    contactHref: extras.contactHref,
  };
}

// ---------- dummy content for gaps (EDMINGLE.fillMissingWithSample) ----------

/** Fills empty fields with the sample course, so the full design always shows. */
export function fillWithSample(course: Course): Course {
  if (!EDMINGLE.fillMissingWithSample) return course;
  const s = sampleCourses[0];
  const hasCurriculum = course.curriculum.topics.some(
    (t) => (t.lessons?.length ?? 0) > 0 || (t.modules ?? []).some((m) => m.lessons.length > 0),
  );
  return {
    ...course,
    category: course.category || s.category,
    tagline: course.tagline || s.tagline,
    description: course.description || s.description,
    rating: course.rating || s.rating,
    learners: course.learners || s.learners,
    duration: course.duration || s.duration,
    includes: hasCurriculum ? course.includes : s.includes,
    overview: course.overview.length ? course.overview : s.overview,
    curriculum: hasCurriculum
      ? course.curriculum
      : { ...s.curriculum, downloadHref: course.curriculum.downloadHref },
    testimonials: course.testimonials.length ? course.testimonials : s.testimonials,
    faqs: course.faqs.length ? course.faqs : s.faqs,
  };
}

/** Builds a minimal details response from a course-list entry (used if the details call fails). */
export function detailsFromListBundle(b: CourseBundle): CourseDetailsResponse {
  return {
    code: 200,
    message: 'from course list',
    tags: b.tags ?? [],
    bundle: {
      institution_bundle_id: b.institution_bundle_id,
      bundle_id: b.bundle_id,
      bundle_name: b.bundle_name,
      bundle_description: b.bundle_description,
      bundle_overview: '',
      cost: String(b.cost ?? 0),
      actual_cost: String(b.actual_cost ?? 0),
      striked_cost: String(b.striked_cost ?? 0),
      student_count: b.student_count,
      free_preview_allowed: b.free_preview_allowed,
      pretty_name: b.pretty_name,
      img_url: b.img_url,
      currency_symbol: b.currency_symbol,
      rating: b.rating,
      num_of_rating: b.num_of_rating,
    },
  };
}
