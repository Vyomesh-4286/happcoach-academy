// ---------------------------------------------------------------------------
// Course content. One entry per course; the page at /courses/[slug] reads it.
// Later you can replace this file with a fetch from the Webflow CMS API
// (see README) without touching any component.
// ---------------------------------------------------------------------------

export type LessonType =
  | 'video-screen'
  | 'video'
  | 'audio'
  | 'quiz'
  | 'doc'
  | 'zip'
  | 'ppt'
  | 'link'
  | 'docx'
  | 'image'
  | 'pdf';

export interface Lesson {
  title: string;
  type: LessonType;
  duration: string;
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface Topic {
  title: string;
  modules: Module[];
}

export interface Testimonial {
  quote: string;
  name: string;
  avatar?: string;
  rating: number;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Course {
  slug: string;
  category: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  tagline: string;
  description: string;
  rating: number;
  learners: string;
  duration: string;
  price: string;
  priceNote: string;
  image: string;
  imageAlt: string;
  cardEyebrow: string;
  enrollLabel: string;
  enrollHref: string;
  guarantee: string;
  includes: string[];
  overview: { title: string; text: string }[];
  curriculum: {
    summary: string;
    topics: Topic[];
    downloadHref: string;
  };
  testimonials: Testimonial[];
  related: string[];
  faqIntro: string;
  faqs: Faq[];
  contactHref: string;
}

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.';

const foundationLessons: Lesson[] = [
  { title: 'What is Design Thinking and why it matters', type: 'video-screen', duration: '8 minutes' },
  { title: 'The 5-stage framework: Empathise, Define, Ideate, Prototype, Test', type: 'video', duration: '5 minutes' },
  { title: 'How Design Thinking differs from traditional problem solving', type: 'audio', duration: '12 minutes' },
  { title: 'Real-world applications across industries', type: 'quiz', duration: '6 minutes' },
  { title: 'Common misconceptions and how to avoid them', type: 'doc', duration: '5 minutes' },
  { title: 'The Design Thinking mindset', type: 'zip', duration: '2 minutes' },
  { title: 'Overview of tools and resources used in this course', type: 'ppt', duration: '4 minutes' },
  { title: 'The 5-stage framework: Empathise, Define, Ideate, Prototype, Test', type: 'link', duration: '6 minutes' },
  { title: 'How Design Thinking differs from traditional problem solving', type: 'docx', duration: '3 minutes' },
  { title: 'Real-world applications across industries', type: 'image', duration: '15 minutes' },
  { title: 'The Design Thinking mindset', type: 'pdf', duration: '20 minutes' },
];

const sampleModules = (prefix: string): Module[] => [
  { title: `${prefix} — key ideas`, lessons: foundationLessons.slice(0, 4) },
  { title: `${prefix} — in practice`, lessons: foundationLessons.slice(4, 8) },
];

export const courses: Course[] = [
  {
    slug: 'design-thinking-innovation',
    category: 'Innovation',
    eyebrow: 'Happ Coach Academy',
    title: 'Design Thinking',
    titleAccent: 'Innovation',
    tagline: 'Unlock creative solutions through innovative design thinking techniques.',
    description:
      'This course walks you through the complete Design Thinking process with practical tools, live examples, and a hands-on capstone project you can showcase in your portfolio.',
    rating: 4.8,
    learners: '9,612 learners',
    duration: '1 hr 9 min',
    price: '₹300/-',
    priceNote: 'Full Course',
    image: 'images/courses/design-thinking-hero.jpg',
    imageAlt: 'Two students working on notes at classroom desks',
    cardEyebrow: 'Your next big idea starts here',
    enrollLabel: 'Enroll now and start learning!',
    enrollHref: '#enroll',
    guarantee: '100% money-back guarantee',
    includes: ['13 Learning topics', '34+ Practical resources', 'Real-world examples & tools'],
    overview: [
      {
        title: 'Ideal audience',
        text: "You're full of ideas but struggle to turn them into structured, actionable solutions. This course gives you the framework to move from thinking to doing.",
      },
      {
        title: 'How will this help you?',
        text: "You're building something new and want to validate ideas faster, reduce costly mistakes, and create products people actually want.",
      },
    ],
    curriculum: {
      summary: '13 Topics • 34 Modules + 120 Resources',
      downloadHref: '#',
      topics: [
        {
          title: '1. Foundations of Design Thinking',
          modules: [
            { title: 'Header', lessons: foundationLessons },
            { title: 'What is Design Thinking and why it matters', lessons: foundationLessons.slice(0, 5) },
            { title: 'The 5-stage framework: Empathise, Define, Ideate, Prototype, Test', lessons: foundationLessons.slice(2, 7) },
            { title: 'Real-world applications across industries', lessons: foundationLessons.slice(3, 8) },
            { title: 'The Design Thinking mindset', lessons: foundationLessons.slice(6, 11) },
          ],
        },
        { title: '2. Testing & Iteration', modules: sampleModules('Testing') },
        { title: '3. Design Sprints in Practice', modules: sampleModules('Sprints') },
        { title: '4. Facilitation & Workshop Design', modules: sampleModules('Facilitation') },
        { title: '5. Capstone Project & Portfolio', modules: sampleModules('Capstone') },
      ],
    },
    testimonials: [
      { quote: "I've done a lot of online courses, but this one actually changed how I approach my work. The empathy mapping session alone was worth the price. I came back to it three times.", name: 'Dyan P.', avatar: 'images/courses/avatar-1.jpg', rating: 5 },
      { quote: 'The structure is perfect — not too academic, not too surface level. I finished the course in two weekends and immediately applied it in a team workshop. My manager was impressed.', name: 'Dhurmil Bhojani', avatar: 'images/courses/avatar-2.jpg', rating: 5 },
      { quote: "What I loved most was how the instructor explains things — clear, practical and engaging. I didn't want to stop.", name: 'Akshay Kumar', avatar: 'images/courses/avatar-3.jpg', rating: 5 },
      { quote: 'Great course, content is heavy and dense so materials could use a little more fine tuning in the delivery of the content. Other than that, instructor is really good in explaining concepts.', name: 'Viral K', avatar: 'images/courses/avatar-4.jpg', rating: 5 },
      { quote: '"I was sceptical about yet another design thinking course. But this one delivers. The sprint module alone is something I now run with my team every quarter."', name: 'Nirav M', avatar: 'images/courses/avatar-5.jpg', rating: 5 },
      { quote: '"Finally, a course that treats you like an intelligent adult. No filler content, real examples, and a capstone project that helped me land my next role."', name: 'Karan A', avatar: 'images/courses/avatar-6.jpg', rating: 5 },
    ],
    related: ['design-thinking-for-ld', 'workplace-happiness', 'design-thinking-innovation', 'fuelling-growth-mindset'],
    faqIntro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
    faqs: Array.from({ length: 6 }, () => ({ question: 'Question text goes here', answer: lorem })),
    contactHref: '/contact-us',
  },
];

// Lightweight cards for "Explore More Courses". Add every course here.
export interface CourseCard {
  slug: string;
  title: string;
  text: string;
  price: string;
  priceNote: string;
  tag: string;
  image: string;
}

export const courseCards: CourseCard[] = [
  { slug: 'design-thinking-for-ld', title: 'Design Thinking for L&D', text: 'Explore leadership strategies to inspire and empower your team.', price: '₹300/-', priceNote: 'Full Course', tag: 'E-Learning', image: 'images/courses/card-ld.jpg' },
  { slug: 'workplace-happiness', title: 'Workplace Happiness', text: 'Unlock creative solutions through innovative design thinking techniques.', price: '₹300/-', priceNote: 'Full Course', tag: 'Innovation', image: 'images/courses/card-happiness.jpg' },
  { slug: 'design-thinking-innovation', title: 'Design Thinking Innovation', text: 'Unlock creative solutions through innovative design thinking techniques.', price: '₹300/-', priceNote: 'Full Course', tag: 'Innovation', image: 'images/courses/card-innovation.jpg' },
  { slug: 'fuelling-growth-mindset', title: 'Fuelling Growth Mindset', text: 'Cultivate a growth mindset to drive personal and professional development.', price: '₹300/-', priceNote: 'Full Course', tag: 'Mindset', image: 'images/courses/card-mindset.jpg' },
];

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);
