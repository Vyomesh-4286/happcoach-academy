// ---------------------------------------------------------------------------
// Edmingle API settings — same API that mhbacademy.com uses.
//
// Fill these in from your Happ Coach Edmingle account. None of them are
// secrets (they're visible in the browser on any Edmingle site), so you can
// either paste them here or set them as environment variables:
//   - locally: in a .env file (see .env.example)
//   - on Webflow Cloud: app → environment → Environment variables
// Environment variables win over the values written here.
//
// Leave `apiUrl` empty to keep using the local data in src/data/courses.ts.
// ---------------------------------------------------------------------------

const env = (key: string): string | undefined => {
  const fromVite = (import.meta.env as Record<string, string | undefined>)[key];
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  const fromProcess = proc?.env?.[key];
  return (fromVite || fromProcess || '').trim() || undefined;
};

export const EDMINGLE = {
  /** e.g. "https://happcoach-api.edmingle.com/nuSource/api/v1" (MHB: myhealthbuddy-api…) */
  apiUrl: (env('EDMINGLE_API_URL') ?? '').replace(/\/+$/, ''),

  /** Your institute ID (MHB uses 3835). */
  instituteId: Number(env('EDMINGLE_INSTITUTE_ID') ?? 0),

  /**
   * Your Edmingle subdomain, e.g. "happcoach" for happcoach.edmingle.com.
   * Turns on the Edmingle sign-up / Buy Now popup, exactly like MHB.
   */
  subdomain: env('PUBLIC_EDMINGLE_SUBDOMAIN') ?? '',

  /**
   * Custom fields ("tags") you create in Edmingle for each course.
   * Find each ID in the API response for a course (`tags[].id`) — MHB uses
   * 382 for "What you'll learn", 384 for duration, etc. 0 = not used.
   */
  tagIds: {
    /** Pill next to "Happ Coach Academy" in the hero (e.g. "Innovation"). */
    category: 0,
    /** Grey paragraph under the tagline in the hero. */
    heroDescription: 0,
    /** Overview cards, shown in this order. */
    overview: [
      { id: 0, title: 'Ideal audience' },
      { id: 0, title: 'How will this help you?' },
    ],
  },

  /** Text shown after the price, as in the design. */
  priceNote: 'Full Course',

  /**
   * Fill anything a course is missing in Edmingle (overview, curriculum,
   * description, rating…) with the sample content from src/data/courses.ts,
   * so every page shows the full design while you test.
   * ⚠️ Set to false before launch, so real pages never show dummy content.
   */
  fillMissingWithSample: true,
};

export const isEdmingleEnabled = () => Boolean(EDMINGLE.apiUrl && EDMINGLE.instituteId);
