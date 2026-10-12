// ---------------------------------------------------------------------------
// One place the pages ask for course data. It reads from the Edmingle API
// when src/config/edmingle.ts / .env is filled in, and from src/data/ when
// it isn't — so the site keeps working while you set the API up.
//
// The terminal says which one is in use when the site starts:
//   [courses] Using Edmingle API → … (institute 3835)
//   [courses] Using LOCAL data — EDMINGLE_API_URL / EDMINGLE_INSTITUTE_ID not set
// ---------------------------------------------------------------------------
import { EDMINGLE, isEdmingleEnabled } from '../config/edmingle';
import { courseCards, courses, type Course, type CourseCard } from '../data/courses';
import { getAllBundles, getCourseDetails, getFullCurriculum } from './edmingle/client';
import { bundleIdFromSlug, detailsFromListBundle, fillWithSample, toCard, toCourse, toSlug } from './edmingle/map';
import type { SubjectCurriculum } from './edmingle/types';

const RELATED_COUNT = 4;

let announced = false;
function announce() {
  if (announced) return;
  announced = true;
  console.log(
    isEdmingleEnabled()
      ? `\n[courses] Using Edmingle API → ${EDMINGLE.apiUrl} (institute ${EDMINGLE.instituteId})\n`
      : '\n[courses] Using LOCAL data — EDMINGLE_API_URL / EDMINGLE_INSTITUTE_ID not set (see .env.example)\n',
  );
}

// ---------- local data: every card gets a page ----------
// Cards without their own entry in courses.ts get a page built from the
// sample course, so no card in the list leads to a 404.
function localCourses(): Course[] {
  const sample = courses[0];
  const extra = courseCards
    .filter((card) => !courses.some((c) => c.slug === card.slug))
    .map((card): Course => {
      const words = card.title.split(/\s+/);
      return {
        ...sample,
        slug: card.slug,
        title: words.length > 1 ? words.slice(0, -1).join(' ') : card.title,
        titleAccent: words.length > 1 ? words[words.length - 1] : '',
        tagline: card.text,
        category: card.tag,
        price: card.price,
        image: card.image,
        imageAlt: card.title,
        related: courseCards.filter((c) => c.slug !== card.slug).map((c) => c.slug),
      };
    });
  return [...courses, ...extra];
}

// ---------- public API ----------

/** Cards for every course (course list page + "Explore More Courses"). */
export async function getCourseCards(): Promise<CourseCard[]> {
  announce();
  if (!isEdmingleEnabled()) return courseCards;
  const bundles = await getAllBundles();
  return bundles.map(toCard);
}

/** Every course URL slug, for getStaticPaths. */
export async function getCourseSlugs(): Promise<string[]> {
  announce();
  if (!isEdmingleEnabled()) return localCourses().map((c) => c.slug);
  const bundles = await getAllBundles();
  return bundles.map(toSlug);
}

/** Everything one course page needs. Returns null if the course doesn't exist. */
export async function getCoursePage(slug: string): Promise<{ course: Course; related: CourseCard[] } | null> {
  announce();
  if (!isEdmingleEnabled()) {
    const course = localCourses().find((c) => c.slug === slug);
    if (!course) return null;
    const related = course.related
      .filter((s) => s !== slug)
      .map((s) => courseCards.find((c) => c.slug === s))
      .filter((c): c is CourseCard => Boolean(c))
      .slice(0, RELATED_COUNT);
    return { course, related };
  }

  const bundleId = bundleIdFromSlug(slug);
  if (!bundleId) return null;

  // The course list is required; if it fails the build stops (last good version stays live).
  const bundles = await getAllBundles();
  const listBundle = bundles.find((b) => b.institution_bundle_id === bundleId);

  // Details and curriculum are best-effort: one broken course shouldn't block the whole site.
  let details = await getCourseDetails(bundleId).catch((error) => {
    console.warn(`[courses] Details failed for ${bundleId} — using course-list data.\n  ${error}`);
    return null;
  });
  if (!details?.bundle) {
    if (!listBundle) return null;
    details = detailsFromListBundle(listBundle);
  }
  const subjects: SubjectCurriculum[] = await getFullCurriculum(bundleId).catch((error) => {
    console.warn(`[courses] Curriculum failed for ${bundleId}.\n  ${error}`);
    return [];
  });

  const course = fillWithSample(toCourse(details, subjects, listBundle));

  // Same department first, then the rest; never the current course.
  const others = bundles.filter((b) => b.institution_bundle_id !== bundleId);
  const sameDept = others.filter((b) => b.department_name === listBundle?.department_name);
  const rest = others.filter((b) => b.department_name !== listBundle?.department_name);
  const related = [...sameDept, ...rest].slice(0, RELATED_COUNT).map(toCard);

  return { course, related };
}
