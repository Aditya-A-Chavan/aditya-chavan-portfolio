// Single source of truth for site copy. Used by the home page, the mini-terminal,
// case-study pages and SEO files. Copy comes from portfolioWebsite.md (planning repo).

export type Health = "green" | "amber";

export const profile = {
  name: "Aditya Chavan",
  firstName: "Aditya",
  role: "Software Developer",
  currentRole: "AI Engineer at AllHome",
  email: "adityachavan271@gmail.com",
  phone: { display: "+91 70397 08120", href: "tel:+917039708120" },
  location: "Mumbai",
  basedIn: "Based in Mumbai · working worldwide",
  timezone: "Asia/Kolkata",
  availability: "FREELANCE: ACCEPTING PROJECTS",
  replyTime: "48 hours",
  siteUrl: "https://aditya-chavan-portfolio.vercel.app",
  socials: [
    { label: "GitHub", href: "https://github.com/Aditya-A-Chavan" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aditya-a-chavan/" },
    { label: "LeetCode", href: "https://leetcode.com/Aditya-A-Chavan/" },
  ],
} as const;

// Section ids double as nav anchors. Keep in sync with legacy hash redirects.
export const nav = [
  { label: "About", id: "about" },
  { label: "Work", id: "work" },
  { label: "Experience", id: "experience" },
  { label: "Services", id: "services" },
  { label: "Contact", id: "contact" },
] as const;

export const hero = {
  pitchBefore: "I'm a Mumbai-based software developer who builds ",
  pitchAccent: "backends that stay correct when the systems around them don't",
  pitchAfter: ": APIs, data pipelines and cloud services that you can trust in production.",
  roleLine: "Software Developer · currently AI Engineer at AllHome",
  logLines: [
    "200 OK · 41ms",
    "receipt COMPLETE",
    "fence finalised",
    "audit row written",
    "metadata synced",
    "batch eval · 1 query",
  ],
};

export const marquee = [
  { lead: "SOFTWARE DEVELOPER", rest: "JAVA · SPRING BOOT · PYTHON" },
  { lead: "BACKEND SYSTEMS", rest: "POSTGRES · FIRESTORE · REDIS" },
  { lead: "SHIPPED ON GOOGLE CLOUD", rest: "CLOUD RUN · CLOUD SQL · CLOUD TASKS" },
  { lead: "AI ENGINEER @ ALLHOME", rest: "" },
];

export type Metric = { label: string; display: string; caption: string; countTo?: number; suffix?: string };

export const about = {
  intro:
    "I'm Aditya, a software developer from Mumbai. I joined AllHome as a software engineering intern in January 2026, earned a full-time offer, and now work there as an AI Engineer, building the backend systems a multi-brand business runs on.",
  paragraphs: [
    "I like the hard parts of backend work: writes that have to land exactly once, permissions that must never leak, and third-party APIs that behave differently from their documentation. I design first, write down the decisions, then build and run what I ship.",
    "For clients, that means one person who can take a product from idea to production on Google Cloud, and who stays around to keep it running.",
  ],
  metrics: [
    { label: "crm_calls/view", display: "25 → 2", caption: "CRM calls per page interaction, after a query redesign" },
    { label: "tests_passing", display: "2,300+", caption: "automated backend tests written and maintained", countTo: 2300, suffix: "+" },
    { label: "orgs_zero_code", display: "8", caption: "business organisations onboarded with zero new code", countTo: 8 },
    { label: "orgs_unified", display: "6", caption: "CRM organisations unified behind one API", countTo: 6 },
  ] satisfies Metric[],
  chips: [
    "Java", "Spring Boot", "Python", "TypeScript", "PostgreSQL", "Firestore", "Redis",
    "Apache Camel", "Google Cloud Run", "Cloud SQL", "GitHub Actions", "Docker",
  ],
};

export type ExperienceItem = {
  id: string;
  dates: string;
  org: string;
  role: string;
  figure?: string;
  figureCaption?: string;
  summary?: string;
  bullets: string[];
  chips: string[];
};

export const experience: ExperienceItem[] = [
  {
    id: "allhome",
    dates: "JAN 2026 – PRESENT",
    org: "AllHome",
    role: "SWE Intern → AI Engineer",
    figure: "PPO",
    figureCaption: "Joined as an intern, converted to full-time.",
    bullets: [
      "Built and operate a Java and Spring Boot platform that unifies six CRM organisations behind one API, with more than 2,300 automated tests.",
      "Designed crash-safe workflows for writes that span two systems with no shared transactions, so uncertain outcomes become explicit states instead of blind retries.",
      "Rolled out a policy-based permission system for record and field access, switched on gradually behind a shadow comparison so nobody was locked out.",
      "Designed and led delivery of an API gateway and data-sync platform on Google Cloud, from an empty repository to production in under two months.",
      "Traced production outages and slowdowns to root cause, including a vendor silently revoking login tokens and a 20× latency regression.",
    ],
    chips: ["Java 21", "Spring Boot", "Apache Camel", "PostgreSQL", "Firestore", "Google Cloud", "GitHub Actions"],
  },
  {
    id: "kjsce",
    dates: "2022 – 2026",
    org: "K.J. Somaiya College of Engineering",
    role: "B.Tech, Information Technology",
    summary: "Mumbai. Built NotiBridge, CurriculumGenerator and MARG alongside coursework.",
    bullets: [],
    chips: [],
  },
];

export type Project = {
  slug: string;
  number: string;
  name: string;
  shortName: string;
  meta: string;
  health: Health;
  status: string;
  trace: string;
  summary: string;
  story?: string;
  parts: { label: string; text: string }[];
  stack: string[];
  caseStudyLabel: string;
  source?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    slug: "crm-platform",
    number: "01",
    name: "Multi-Org CRM Platform",
    shortName: "crm-platform",
    meta: "ALLHOME · 2026 · PRODUCTION",
    health: "green",
    status: "prod · 6 orgs",
    trace: "→ 200 OK · crm-platform · 6 orgs",
    summary: "One API over six separate CRM organisations, built so writes stay correct even when the CRM gives no guarantees.",
    parts: [
      { label: "Problem", text: "The business runs several brands, each in its own CRM organisation. Staff needed one system across all of them, but the CRM has no transactions, no idempotency keys and no conditional writes." },
      { label: "What I built", text: "A Java and Spring Boot platform with a crash-safe receipt workflow for two-step writes across organisations, an optimistic-concurrency \"write fence\" in Postgres, a policy engine for record and field access, and an audit log that captures every write automatically." },
      { label: "Outcome", text: "CRM calls per board interaction cut from about 25 to 1–2; a page across six organisations now waits only for the slowest one; more than 2,300 automated tests." },
    ],
    stack: ["Java 21", "Spring Boot", "Apache Camel", "PostgreSQL", "Firestore", "Cloud Run", "Cloud Tasks", "GitHub Actions"],
    caseStudyLabel: "Read case study",
  },
  {
    slug: "api-gateway",
    number: "02",
    name: "API Gateway & Data-Sync Platform",
    shortName: "api-gateway",
    meta: "ALLHOME · 2026 · PRODUCTION",
    health: "green",
    status: "prod · 8 orgs",
    trace: "→ 200 OK · api-gateway · 8 orgs",
    summary: "A governed gateway that checks every write against each organisation's live schema before it reaches the vendor, plus a scheduled data sync.",
    parts: [
      { label: "Problem", text: "Eight business organisations each had different, drifting custom fields, and internal tools needed a safe way to write into them." },
      { label: "What I built", text: "Designed and led delivery of a gateway that reads each organisation's schema from the CRM itself, a permission grammar with wildcards and audit controls, a per-record audit trail, and a data-sync pipeline with a validation gate." },
      { label: "Outcome", text: "Empty repository to production in under two months; eight organisations onboarded with one migration and no code changes; the validation gate stopped 843 of 1,345 bad source records before they reached a partner system." },
    ],
    stack: ["Java", "Spring Boot", "Apache Camel", "Python", "Prefect", "PostgreSQL", "Cloud Run", "Cloud SQL", "Secret Manager"],
    caseStudyLabel: "Read case study",
  },
  {
    slug: "notibridge",
    number: "03",
    name: "NotiBridge",
    shortName: "notibridge",
    meta: "PERSONAL · 2025 · ANDROID + DESKTOP",
    health: "green",
    status: "p2p · offline",
    trace: "→ 200 OK · notibridge · p2p",
    summary: "Your phone's notifications on your laptop, fully offline: no cloud, no internet, just your Wi-Fi.",
    parts: [
      { label: "Problem", text: "Notification-mirroring tools route everything through the cloud. I wanted it peer-to-peer and private." },
      { label: "What I built", text: "A Kotlin Android app and a Java desktop app that pair by scanning a QR code, find each other on the network with mDNS even when IP addresses change, and keep an encrypted persistent connection with a reconnect state machine." },
      { label: "Outcome", text: "A documented protocol (pairing, authentication, reconnection, state flows) and working pairing and notification delivery." },
    ],
    stack: ["Kotlin", "Android", "Java 21", "JavaFX", "mDNS", "WebSockets", "TCP", "AES"],
    caseStudyLabel: "Read case study",
    source: "https://github.com/Aditya-A-Chavan/NotiBridge",
    live: "https://aditya-a-chavan.github.io/NotiBridge/",
  },
  {
    slug: "marg",
    number: "04",
    name: "MARG — Mumbai Ambulance Rapid Gateway",
    shortName: "marg",
    meta: "PERSONAL · 2026 · SYSTEM DESIGN",
    health: "amber",
    status: "in design",
    trace: "→ 202 Accepted · marg · in design",
    summary: "It started with an ambulance stuck in traffic.",
    story:
      "I once watched an ambulance sit in Mumbai traffic, siren screaming, going nowhere. Nobody was being careless. The cars had nowhere to go, and the officers at the junction had no idea it was coming until it was already stuck. Somewhere inside was someone whose minutes were running out. I couldn't stop thinking about it.",
    parts: [
      { label: "What I designed", text: "A coordination platform that alerts every traffic officer within 100 metres of an ambulance's route before it arrives, with its live location and ETA, plus a control-room view. It assists the police; it never takes control of signals or decisions." },
      { label: "Status", text: "System design complete (vision, architecture, stakeholder brief for Mumbai Traffic Police); build not started." },
    ],
    stack: ["Android apps", "Real-time backend", "WebSockets", "Geospatial proximity engine"],
    caseStudyLabel: "Read the story",
  },
  {
    slug: "curriculum-generator",
    number: "05",
    name: "CurriculumGenerator",
    shortName: "curriculum-generator",
    meta: "TEAM PROJECT · 2025 · AI / RAG",
    health: "green",
    status: "team · rag",
    trace: "→ 200 OK · curriculum-generator · rag",
    summary: "Upload course PDFs, get a structured curriculum back.",
    parts: [
      { label: "Problem", text: "Turning a pile of reference material into a structured course outline takes days." },
      { label: "What I built", text: "The backend of a team project: a retrieval-augmented pipeline (PDF text → chunks → embeddings in ChromaDB → a strict prompt that returns curriculum JSON), an async job queue on Redis so long generations don't time out, history in MongoDB and PDF export." },
      { label: "Outcome", text: "Working end-to-end generation with saved history and export. Built with three teammates; I wrote most of the backend (36 of 54 commits)." },
    ],
    stack: ["Python", "Flask", "Redis + RQ", "MongoDB", "ChromaDB", "SentenceTransformers", "React"],
    caseStudyLabel: "Read case study",
    source: "https://github.com/Aditya-A-Chavan/CurriculumGenerator",
  },
];

export const services = [
  { code: "S/01", title: "Backend systems & APIs", text: "APIs and services in Java/Spring Boot or Python, with proper auth, permissions and audit trails, built to stay correct under failure.", proof: "→ 2,300+ tests on a six-org platform", href: "/work/crm-platform" },
  { code: "S/02", title: "Products on Google Cloud", text: "From empty repo to production: Cloud Run, Cloud SQL, CI/CD, secrets and monitoring, set up so deploys are boring.", proof: "→ gateway live in under two months", href: "/work/api-gateway" },
  { code: "S/03", title: "Data pipelines & automation", text: "Scheduled jobs and syncs that validate data before it moves, retry safely and leave a trail you can debug.", proof: "→ 843 bad records stopped before they shipped", href: "/work/api-gateway" },
  { code: "S/04", title: "Real-time & networked apps", text: "WebSockets, device-to-device communication and apps that work offline.", proof: "→ NotiBridge: peer-to-peer, no cloud", href: "/work/notibridge" },
];

export const processSteps = [
  { step: "scope", text: "A short call to agree what we're building. You get a written scope, timeline and price." },
  { step: "build", text: "Weekly preview links so you see progress every week, and decisions written down as we go." },
  { step: "ship", text: "Tested, deployed to production, with a handover walkthrough." },
  { step: "run", text: "A bug-fix window after launch, and help keeping it running if you need it." },
];

export const skills = [
  { group: "Languages", items: ["Java", "Python", "TypeScript", "Kotlin", "SQL"] },
  { group: "Backend", items: ["Spring Boot", "Apache Camel", "Flask", "REST APIs", "WebSockets"] },
  { group: "Data", items: ["PostgreSQL", "Firestore", "Redis", "MongoDB", "ChromaDB"] },
  { group: "Cloud & delivery", items: ["Google Cloud Run", "Cloud SQL", "Cloud Tasks", "Secret Manager", "GitHub Actions", "Docker", "Prefect"] },
  { group: "Practices", items: ["Idempotency & safe retries", "Permission systems", "Audit trails", "Testing (JUnit, Mockito, pytest)"] },
];

export const certifications = [
  { name: "Architecting with Google Kubernetes Engine: Production", issuer: "Google", date: "Oct 2024", href: "https://www.coursera.org/account/accomplishments/records/Y9FX6BS4MP53" },
  { name: "AWS: CI/CD Pipelines and Deployment Strategies", issuer: "Whizlabs", date: "Oct 2024", href: "https://www.coursera.org/account/accomplishments/records/713RJQJGY8KL" },
  { name: "DevOps Capstone Project", issuer: "IBM", date: "Oct 2024", href: "https://www.coursera.org/account/accomplishments/records/GB2K17J03BSP" },
];

export const contact = {
  headline: ["GOT SOMETHING", "THAT HAS TO WORK?"],
  workTypes: ["Backend / API", "Cloud setup", "Data pipeline", "Real-time app", "AI feature", "Something else"],
  timelines: ["ASAP", "Within a month", "1–3 months", "Just exploring"],
  budgets: {
    INR: ["Under ₹50k", "₹50k–2L", "₹2L–5L", "₹5L+", "Not sure yet"],
    USD: ["Under $1k", "$1k–3k", "$3k–8k", "$8k+", "Not sure yet"],
  },
  // EmailJS identifiers are public by design (restrict allowed origins in the EmailJS dashboard).
  emailjs: {
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "W5cqtjXav8sYyUF1r",
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "service_3qtmldc",
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "template_v7xy9qv",
  },
};
