// Shapes of the Edmingle API responses (copied from MHB's app/core/api.ts,
// trimmed to the fields this site reads).

export interface CourseTag {
  id: number;
  label: string;
  type: number;
  value: string[];
}

export interface CourseBundle {
  bundle_id: number;
  bundle_name: string;
  bundle_description: string;
  cost: number;
  actual_cost: number;
  striked_cost: number;
  institution_bundle_id: number;
  student_count: number;
  free_preview_allowed: number;
  pretty_name: string;
  img_url: string;
  currency_symbol: string;
  rating: number;
  num_of_rating: number;
  tags: CourseTag[];
  position?: number;
}

export interface InstituteCourse {
  department_id: number;
  department_name: string;
  course_bundles: CourseBundle[];
}

export interface GetAllCoursesRes {
  code: number;
  message: string;
  count: number;
  institute_courses: InstituteCourse[];
}

export interface CourseDetails {
  institution_bundle_id: number;
  bundle_id: number;
  bundle_name: string;
  bundle_description: string;
  bundle_overview: string;
  cost: string;
  actual_cost: string;
  striked_cost: string;
  student_count: number;
  free_preview_allowed: number;
  pretty_name: string;
  img_url: string | null;
  currency_symbol: string;
  rating: number;
  num_of_rating: number;
  enable_buy_now?: number;
}

export interface CourseDetailsResponse {
  code: number;
  message: string;
  bundle: CourseDetails;
  tags: CourseTag[];
}

/** A "subject" inside a bundle. */
export interface CourseContent {
  course_id: number;
  name: string;
  description: string;
}

export interface Resource {
  material_id: number;
  file_name: string;
  material_name: string;
  exercise_name: string;
  type: string;
  resource_type: number; // 5 = exercise / quiz
  display_index: number;
  freepreview: number;
  duration_seconds: number;
}

export interface Section {
  section_id: number;
  section_name: string;
  display_index: number;
  resources: Resource[];
}

export interface CourseCurriculumResponse {
  code: number;
  message: string;
  course_curriculum: {
    course_id: string;
    total_time: number;
    resources: Section[];
  };
}

/** One subject's curriculum, as returned by getFullCurriculum(). */
export interface SubjectCurriculum {
  id: number;
  name: string;
  totalTime: number;
  sections: Section[];
}
