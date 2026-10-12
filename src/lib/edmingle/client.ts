// ---------------------------------------------------------------------------
// Edmingle API client — the Astro version of MHB's app/core/api.ts.
//
// Uses plain fetch (Webflow Cloud runs on Cloudflare Workers, where axios is
// not recommended). Every call has a timeout and retries, and results are
// cached for the length of the build, so each URL is fetched only once.
// ---------------------------------------------------------------------------
import { EDMINGLE } from '../../config/edmingle';
import type {
  CourseBundle,
  CourseContent,
  CourseCurriculumResponse,
  CourseDetailsResponse,
  GetAllCoursesRes,
  InstituteCourse,
  SubjectCurriculum,
} from './types';

const TIMEOUT_MS = 15_000;
const RETRIES = 2;
const cache = new Map<string, Promise<unknown>>();

async function getJSON<T>(path: string): Promise<T> {
  const url = `${EDMINGLE.apiUrl}${path}`;
  if (!cache.has(url)) {
    const request = (async () => {
      let lastError: unknown;
      for (let attempt = 0; attempt <= RETRIES; attempt++) {
        try {
          const res = await fetch(url, {
            headers: { Accept: 'application/json' },
            signal: AbortSignal.timeout(TIMEOUT_MS),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return (await res.json()) as T;
        } catch (error) {
          lastError = error;
          if (attempt < RETRIES) await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        }
      }
      throw new Error(`Edmingle request failed: ${url}\n  ${String(lastError)}`);
    })();
    // Don't keep failed requests in the cache.
    request.catch(() => cache.delete(url));
    cache.set(url, request);
  }
  return cache.get(url) as Promise<T>;
}

/** Runs async jobs with at most `limit` running at once (Workers allow 6). */
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

/** All departments with their course bundles (MHB: getAllCourses). */
export async function getAllCourses(): Promise<InstituteCourse[]> {
  const data = await getJSON<GetAllCoursesRes>(
    `/institute/${EDMINGLE.instituteId}/courses?get_tags=1&get_student_count=1`,
  );
  return data.institute_courses ?? [];
}

/** Every bundle in one flat list, with its department name attached. */
export async function getAllBundles(): Promise<(CourseBundle & { department_name: string })[]> {
  const departments = await getAllCourses();
  const seen = new Set<number>();
  const bundles: (CourseBundle & { department_name: string })[] = [];
  for (const dept of departments) {
    for (const bundle of dept.course_bundles ?? []) {
      if (seen.has(bundle.institution_bundle_id)) continue; // a bundle can sit in 2 departments
      seen.add(bundle.institution_bundle_id);
      bundles.push({ ...bundle, department_name: dept.department_name });
    }
  }
  return bundles;
}

/** One bundle's details + custom fields (MHB: getCourseDetails). */
export function getCourseDetails(bundleId: number | string) {
  return getJSON<CourseDetailsResponse>(`/organization/bundles/${bundleId}`);
}

/** The subjects inside a bundle (MHB: getCourseID). */
export async function getCourseSubjects(bundleId: number | string): Promise<CourseContent[]> {
  const data = await getJSON<{ courses?: CourseContent[] }>(`/public/tutor/courses/all/${bundleId}`);
  return data.courses ?? [];
}

/** One subject's sections and resources (MHB: getCourseCurriculum). */
export function getCourseCurriculum(bundleId: number | string, courseId: number | string) {
  return getJSON<CourseCurriculumResponse>(
    `/public/tutor/class/curriculum/${courseId}?institution_bundle_id=${bundleId}`,
  );
}

/** Subjects + their curricula for a bundle (MHB: getData in courses/[slug]). */
export async function getFullCurriculum(bundleId: number | string): Promise<SubjectCurriculum[]> {
  const subjects = await getCourseSubjects(bundleId);
  return mapLimit(subjects, 4, async (subject) => {
    const data = await getCourseCurriculum(bundleId, subject.course_id);
    return {
      id: subject.course_id,
      name: subject.name,
      totalTime: Number(data.course_curriculum?.total_time) || 0,
      sections: data.course_curriculum?.resources ?? [],
    };
  });
}
