import type { CaseStudy } from "./types";
import { projects } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { NotiBridgeVisual } from "@/components/visuals/NotiBridgeVisual";

const project = projects.find((p) => p.slug === "notibridge");
const NOTION = "https://www.notion.so/NotiBridge-25195941ca91803cbd4ac7f97fc34ea1";

function Code({ label, children }: { label: string; children: string }) {
  return (
    <figure className="my-6 min-w-0">
      <figcaption className="mb-2 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">{label}</figcaption>
      <pre
        tabIndex={0}
        className="max-w-full overflow-x-auto rounded-md border border-line-strong bg-panel p-4 font-mono text-[13px] leading-relaxed text-soft"
      >
        <code className="font-mono">{children}</code>
      </pre>
    </figure>
  );
}

// The highlight travels through the three states. It only runs when the visitor has not asked for reduced motion.
const STATE_CSS = `
@keyframes nb-active {
  0%, 30% { border-color: var(--color-accent); background-color: color-mix(in srgb, var(--color-accent) 10%, transparent); }
  36%, 100% { border-color: var(--color-line-strong); background-color: transparent; }
}
@media (prefers-reduced-motion: no-preference) {
  .nb-state { animation: nb-active 9s infinite; }
}
`;

const STATES = [
  { name: "UNPAIRED", note: "mDNS on, waiting for a QR scan", delay: "0s" },
  { name: "PAIRED", note: "mDNS off, persistent WebSocket up", delay: "3s" },
  { name: "PAIRED_DISCONNECTED", note: "mDNS on, looking for the desktop", delay: "6s" },
];
const EDGES = ["QR scan, PAIR accepted", "connection lost"];

function StateMachine() {
  return (
    <figure className="my-8 min-w-0 rounded-md border border-line-strong bg-panel p-4 sm:p-6">
      <style>{STATE_CSS}</style>
      <ol aria-hidden="true" className="grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:gap-3">
        {STATES.flatMap((s, i) => {
          const node = (
            <li
              key={s.name}
              className="nb-state h-full rounded-md border border-line-strong p-3"
              style={{ animationDelay: s.delay }}
            >
              <span className="block font-mono text-xs break-words text-fg">{s.name}</span>
              <span className="mt-1 block text-[13px] leading-snug text-muted">{s.note}</span>
            </li>
          );
          if (i === STATES.length - 1) return [node];
          return [
            node,
            <li key={`e${i}`} className="px-2 py-1 text-center font-mono text-[11px] text-accent md:px-0">
              <span className="md:hidden">↓ </span>
              {EDGES[i]}
              <span className="hidden md:block">→</span>
            </li>,
          ];
        })}
      </ol>
      <figcaption className="mt-5 text-sm text-muted">
        Connection states. The phone starts UNPAIRED, becomes PAIRED after a successful QR pairing, and moves to
        PAIRED_DISCONNECTED when the connection drops. From there it re-resolves the desktop and authenticates to get
        back to PAIRED. Unpairing returns it to UNPAIRED. mDNS runs only in UNPAIRED and PAIRED_DISCONNECTED.
      </figcaption>
    </figure>
  );
}

const study: CaseStudy = {
  slug: "notibridge",
  metaLine: "PERSONAL · 2025 · ANDROID + DESKTOP · ROLE: SOLE DEVELOPER",
  quickFacts: {
    role: "Sole developer",
    timeline: "Mar – Jul 2025",
    team: "Solo project",
    stack: "Kotlin, Java 21, JavaFX, mDNS, WebSockets",
  },
  sections: [
    {
      id: "problem",
      title: "The problem",
      content: (
        <>
          <p>
            Many tools that mirror phone notifications to a computer send everything through the cloud. Your messages
            leave the phone, sit on someone else&apos;s server, and come back to your laptop. I wanted the opposite:
            the phone and the laptop talk directly to each other over the Wi-Fi they already share, and nothing leaves
            the network.
          </p>
          <p>
            NotiBridge does that. It mirrors Android notifications to a desktop app with no cloud and no internet
            connection. You pair the two devices once with a QR code, and after that they find each other on their own.
          </p>
        </>
      ),
    },
    {
      id: "constraints",
      title: "Constraints",
      content: (
        <ul>
          <li>No server in the middle. With no cloud, the two devices have to find each other themselves.</li>
          <li>The desktop&apos;s IP address is not stable. It changes when you switch networks or restart the router.</li>
          <li>Only the phone I paired may send notifications, and notification text is private.</li>
          <li>Pairing data has to be stored encrypted on both sides.</li>
          <li>Two platforms, two languages: Kotlin on Android and Java on the desktop, speaking one protocol.</li>
        </ul>
      ),
    },
    {
      id: "what-i-built",
      title: "What I built",
      content: (
        <>
          <h3>Two apps and a protocol</h3>
          <p>
            The Android app is written in Kotlin. It reads notifications with a <code>NotificationListenerService</code>,
            scans the pairing QR code with ZXing, uses Android&apos;s own NSD for mDNS, and runs a foreground service. The
            desktop app is Java 21 with JavaFX. It shows the QR code and displays incoming notifications.
          </p>
          <p>
            The protocol is documented in the repository: pairing, authentication, notification sending, the persistent
            connection, reconnection, re-authentication and state management each have their own flow document.
          </p>
          <div className="my-8">
            <NotiBridgeVisual />
          </div>

          <h3>QR pairing</h3>
          <p>
            When you start pairing, the desktop generates a random 256-bit pairing key and a device UUID, advertises
            itself over mDNS, and shows a QR code. The phone scans it, resolves the desktop&apos;s IP address, and sends
            a <code>PAIR</code> request. Values below are placeholders.
          </p>
          <Code label="PAIR request, phone to desktop">{`{
  "request": "PAIR",
  "device_id": "<desktop UUID from the QR code>",
  "phone_id": "<UUID the phone generates>",
  "pairing_key": "<256-bit key from the QR code>"
}`}</Code>
          <p>If the pairing key matches, the desktop stores the phone&apos;s ID and answers:</p>
          <Code label="Success response, desktop to phone">{`{
  "status": "SUCCESS",
  "message": "Device paired successfully"
}`}</Code>

          <h3>Authentication after pairing</h3>
          <p>
            From then on the pairing key is not used again. The phone identifies itself with its <code>phone_id</code>,
            and the desktop checks it before accepting anything. Only a paired phone can send notifications.
          </p>
          <Code label="Notification, phone to desktop">{`{
  "request": "NOTIFICATION",
  "phone_id": "<UUID stored at pairing>",
  "notification_data": {
    "title": "New Message",
    "body": "Hey! How are you?",
    "app": "WhatsApp"
  }
}`}</Code>
          <p>Pairing data is stored encrypted with AES on both sides.</p>
        </>
      ),
    },
    {
      id: "hard-problems",
      title: "Hard problems",
      content: (
        <>
          <h3>The desktop&apos;s IP keeps changing</h3>
          <p>
            If the phone remembered an IP address, it would break the first time the laptop joined a different network
            or the router restarted. So the phone never relies on a hardcoded address. The desktop advertises a service
            named <code>&lt;DEVICE_ID&gt;._notibridge._tcp.local</code> over mDNS, and the phone looks that name up.
          </p>
          <p>
            Looking the name up on every message would be wasteful, so the phone caches the IP it resolved during
            pairing and uses it first. Only if the cached address fails does it fall back to mDNS and resolve again.
          </p>

          <h3>A connection that survives network changes</h3>
          <p>
            Pairing and discovery are only the start. The two apps then keep a persistent WebSocket connection, and I
            modelled the connection as a small state machine so each situation has a defined behaviour.
          </p>
          <StateMachine />
          <p>
            mDNS runs only while the phone is unpaired or disconnected, and stops once the WebSocket is up. All later
            traffic goes over that connection. After a Wi-Fi change, the phone waits a set number of seconds before it
            re-resolves the desktop.
          </p>

          <h3>The build story: it took several tries</h3>
          <p>
            I changed approach more than once. I started with raw TCP, moved to a Python desktop prototype, and ended up
            with the Java and JavaFX app. On the phone I started with JmDNS and switched to Android&apos;s native NSD.
          </p>
          <p>
            The repository history shows it honestly. One commit just says &quot;NOTHING WORKS&quot;. Another reads
            &quot;MDNS not working yet, auto reauth pending, security pending&quot;. A later one says pairing and
            authentication logic is now working completely.
          </p>
        </>
      ),
    },
    {
      id: "results",
      title: "Results",
      content: (
        <>
          <p>
            Pairing and notification delivery work, and the protocol is written down: pairing, authentication,
            reconnection and the state flows. The repository has 43 commits, all mine.
          </p>
          <p>
            One thing is unfinished. My last commits on the persistent connection note that auto-connect broke, so I
            would not call automatic reconnection complete. The last functional work was in June 2025, with a small
            website change in July.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {project?.source && <ButtonLink href={project.source}>Source on GitHub ↗</ButtonLink>}
            {project?.live && <ButtonLink href={project.live}>Project site ↗</ButtonLink>}
            <ButtonLink href={NOTION}>Notion write-up ↗</ButtonLink>
          </div>
        </>
      ),
    },
    {
      id: "next",
      title: "What I'd do next",
      content: (
        <>
          <p>
            Fix auto-reconnect first. The reconnection flow is already documented, so the target is clear: after a Wi-Fi
            change, the code should follow the state machine above and reconnect without the user doing anything.
          </p>
          <p>
            Then I would test that path end to end, switching networks and restarting the router on purpose, before
            adding anything new.
          </p>
        </>
      ),
    },
  ],
};

export default study;
