import { MargIntro } from "@/components/case-study/MargIntro";
import type { CaseStudy } from "./types";

const P = "mb-5 leading-relaxed text-soft";
const H3 = "mt-8 mb-3 font-mono text-xs tracking-[0.08em] text-muted uppercase";
const UL = "mb-5 list-disc space-y-2 pl-5 text-soft marker:text-muted";

const FLOW: { title: string; text: string }[] = [
  { title: "A verified ambulance starts a trip.", text: "In the ambulance app, a trip from A to B begins." },
  { title: "The backend plans the route.", text: "The routing engine works out the path the ambulance will take." },
  { title: "The proximity engine finds the officers.", text: "Every traffic officer within 100 metres of that route is selected." },
  { title: "The notification engine alerts them.", text: "Each officer gets an advance alert with the ambulance's live location and an ETA to their position, over WebSockets." },
  { title: "The officer responds.", text: "From the police app they tap ACK, CLEARED or UNABLE. The control room sees the trip, and every step goes into the audit log." },
];

function CorridorDiagram() {
  return (
    <figure className="my-8 rounded-md border border-line-strong bg-panel p-4 md:p-6">
      <svg
        viewBox="0 0 640 220"
        className="h-auto w-full"
        role="img"
        aria-label="A route from point A to point B with a corridor 100 metres wide around it. Three officers: two inside the corridor are alerted, one outside is not."
      >
        <path d="M50 160 H220 L360 80 H590" className="fill-none stroke-line-strong" strokeWidth="56" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        <path d="M50 160 H220 L360 80 H590" className="fill-none stroke-accent" strokeWidth="2" strokeDasharray="6 6" strokeLinejoin="round" />
        <circle cx="50" cy="160" r="9" className="fill-amber" />
        <rect x="581" y="71" width="18" height="18" className="fill-fg" />
        <circle cx="140" cy="160" r="7" className="fill-accent" />
        <circle cx="300" cy="100" r="7" className="fill-accent" />
        <circle cx="470" cy="95" r="7" className="fill-accent" />
        <circle cx="400" cy="178" r="7" className="fill-none stroke-muted" strokeWidth="2" />
        <text x="50" y="196" textAnchor="middle" className="fill-fg font-mono" fontSize="18">A</text>
        <text x="590" y="52" textAnchor="middle" className="fill-fg font-mono" fontSize="18">B</text>
      </svg>
      <figcaption className="mt-4 font-mono text-xs leading-relaxed text-muted">
        <span className="text-amber">●</span> ambulance &nbsp; <span className="text-accent">●</span> officer inside the 100 m corridor, alerted &nbsp;{" "}
        <span className="text-muted">○</span> officer outside it, not alerted
      </figcaption>
    </figure>
  );
}

const marg: CaseStudy = {
  slug: "marg",
  metaLine: "PERSONAL · 2026 · SYSTEM DESIGN · STATUS: IN DESIGN",
  quickFacts: {
    role: "Designer (solo)",
    timeline: "Jan – Feb 2026",
    team: "Solo",
    stack: "Planned: Android apps, real-time backend, WebSockets, proximity engine",
  },
  intro: <MargIntro />,
  sections: [
    {
      id: "who-and-what",
      title: "Who it's for, and what it does",
      content: (
        <>
          <p className={P}>
            MARG is built for one group of people: the traffic police. The officers standing at a junction are the ones who can actually
            clear a road, and the problem I watched was that they find out about an ambulance when it is already stuck. So I designed
            MARG around them, not around the ambulance driver and not around the public.
          </p>
          <p className={P}>
            When a verified ambulance starts a trip from A to B, every traffic officer within 100 metres of the route gets an advance
            alert, with the ambulance&apos;s live location and an ETA to their position. A control-room dashboard lets the police watch
            active trips.
          </p>
          <h3 className={H3}>What it deliberately does not do</h3>
          <ul className={UL}>
            <li>It does not control traffic signals.</li>
            <li>It does not enforce anything. It informs officers; what they do next is their call.</li>
            <li>It has no public access. Only verified ambulances and authorised police can use it.</li>
            <li>The control room only observes. There is no approve or reject step.</li>
          </ul>
          <p className={P}>The idea in one line: assist the police, never automate them.</p>
        </>
      ),
    },
    {
      id: "components",
      title: "Four components, and how an alert flows",
      content: (
        <>
          <p className={P}>I designed four components. None of them is implemented yet.</p>
          <ul className={UL}>
            <li>
              <span className="text-fg">Ambulance Android app.</span> Where a verified ambulance starts a trip and shares its location.
            </li>
            <li>
              <span className="text-fg">Traffic Police Android app.</span> Receives the alert and lets the officer answer with ACK, CLEARED or UNABLE.
            </li>
            <li>
              <span className="text-fg">Control Room web dashboard.</span> Monitors active trips. Observation only.
            </li>
            <li>
              <span className="text-fg">Backend.</span> Auth, trip management, a routing engine, a proximity engine, a notification engine and
              audit logging. The planned transport is HTTPS plus WebSockets for GPS and alerts.
            </li>
          </ul>
          <h3 className={H3}>From ambulance to officer</h3>
          <ol className="mb-5 space-y-4">
            {FLOW.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-x-2">
                <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="leading-relaxed text-soft">
                  <span className="text-fg">{step.title}</span> {step.text}
                </span>
              </li>
            ))}
          </ol>
          <CorridorDiagram />
        </>
      ),
    },
    {
      id: "principles",
      title: "Design principles and non-goals",
      content: (
        <>
          <h3 className={H3}>Principles</h3>
          <ul className={UL}>
            <li>
              <span className="text-fg">Assist, don&apos;t automate.</span> No signal control, no enforcement. The officer stays in charge.
            </li>
            <li>
              <span className="text-fg">No infrastructure dependency.</span> No CCTV, RFID or signal integration, so another city could adopt it
              without rebuilding anything on the road.
            </li>
            <li>
              <span className="text-fg">Verified and authorised only.</span> Ambulances are verified and police are authorised. There is no public access.
            </li>
            <li>
              <span className="text-fg">Accountability by design.</span> Everything is written to an audit log.
            </li>
            <li>
              <span className="text-fg">Intentionally minimal scope.</span> A small system is easier to make reliable, and reliability is the whole point here.
            </li>
          </ul>
          <h3 className={H3}>Non-goals</h3>
          <ul className={UL}>
            <li>Controlling or overriding traffic signals.</li>
            <li>Replacing or directing police decisions.</li>
            <li>Any integration with CCTV, RFID or signal infrastructure.</li>
            <li>Access for the general public.</li>
            <li>Approve or reject powers in the control room.</li>
          </ul>
        </>
      ),
    },
    {
      id: "status",
      title: "Status and where it goes next",
      content: (
        <>
          <p className={P}>
            The design is done and the build hasn&apos;t started. There is no code yet, so this is a system design, not a shipped product.
          </p>
          <p className={P}>What exists is the thinking, written down:</p>
          <ul className={UL}>
            <li>a vision document and a problem statement,</li>
            <li>the system architecture, with ASCII diagrams,</li>
            <li>
              a stakeholder brief addressed to Mumbai Traffic Police, with flow, sequence, proximity and non-goals diagrams.
            </li>
          </ul>
          <p className={P}>The technology stack is still to be decided, apart from the planned HTTPS and WebSockets transport.</p>
        </>
      ),
    },
  ],
};

export default marg;
