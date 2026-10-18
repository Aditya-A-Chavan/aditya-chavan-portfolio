import type { ReactNode } from "react";
import { IncidentReport } from "@/components/ui/IncidentReport";
import { CrmPlatformDiagram } from "@/components/visuals/CrmPlatformDiagram";
import type { CaseStudy } from "./types";

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[0.85em] text-fg">{children}</code>;
}

function Snippet({ children }: { children: string }) {
  return <pre className="overflow-x-auto rounded-md border border-line bg-panel px-4 py-3 font-mono text-[13px] leading-relaxed text-fg">{children}</pre>;
}

function Sub({ children }: { children: ReactNode }) {
  return <h3 className="mt-10 font-display text-xl text-fg">{children}</h3>;
}

function Prose({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

const list = "list-disc space-y-2 pl-5";

const crmPlatform: CaseStudy = {
  slug: "crm-platform",
  metaLine: "ALLHOME · 2026 · PRODUCTION · ROLE: BUILT & OPERATED",
  quickFacts: {
    role: "Backend developer (SWE Intern → AI Engineer)",
    timeline: "Mar 2026 – present",
    team: "Primary developer, small team",
    stack: "Java 21, Spring Boot, Apache Camel, PostgreSQL, Firestore, Cloud Run, Cloud Tasks, GitHub Actions",
  },
  sections: [
    {
      id: "the-problem",
      title: "The problem",
      content: (
        <Prose>
          <p>
            AllHome runs several brands, and each brand lives in its own organisation inside a SaaS CRM. Staff needed to work across all of them as one system: one board, one set of rules, one place to see who is allowed to do what.
          </p>
          <p>
            The CRM is a good place to keep customer records. It is a poor place to build a multi-organisation workflow on top of. It has no transactions, no idempotency keys and no conditional writes, so a lost response leaves you not knowing whether a record exists. Two services can overwrite each other’s changes without noticing.
          </p>
          <p>
            I built the platform that sits over those six organisations and makes them behave like one. The CRM stays the system of record. The platform keeps only coordination state: rules, receipts, audit and authorization.
          </p>
        </Prose>
      ),
    },
    {
      id: "constraints",
      title: "Constraints",
      content: (
        <Prose>
          <ul className={list}>
            <li>No transactions across organisations, and no ETags or idempotency keys inside one. Correctness had to be built on top.</li>
            <li>A vendor API with undocumented behaviour. I found several of those quirks in production, and each one became a test.</li>
            <li>Six organisations in production from the start. One slow or broken organisation must not take down a page that also reads from the other five.</li>
            <li>A security model that had to change while people were using it, without locking anyone out.</li>
            <li>When the outcome of a call is uncertain, the system has to fail closed rather than guess.</li>
          </ul>
        </Prose>
      ),
    },
    {
      id: "what-i-built",
      title: "What I built",
      content: (
        <Prose>
          <p>
            A Java 21 and Spring Boot platform, with Postgres and Firestore for coordination state, running on Cloud Run. I was the primary developer; one teammate contributed a handful of commits. Here is the shape of it, then the four pieces I think matter most.
          </p>
          <CrmPlatformDiagram />

          <Sub>Receipts for writes that span two organisations</Sub>
          <p>
            One user action can create a record in one organisation and then a linked deal in another. If the second call times out, I cannot tell whether it landed. A blind retry might create a duplicate. Giving up might leave half the work done.
          </p>
          <p>
            So every operation gets a durable receipt in Firestore. The receipt moves through a sealed set of 12 transitions. Two of its states are explicitly <Code>unknown</Code>: the outcome of an external call is not known. The only way out of an unknown state is a read-only reconciliation that looks at the CRM and proves what happened. Before every external call, the platform writes a dispatch marker saying it is about to make that call.
          </p>
          <Snippet>{`marker → create in org A → marker → create in org B → COMPLETE → 201`}</Snippet>
          <p>
            Claims on a receipt use compare-and-set with leases and attempt fencing, so two concurrent resumes cannot both dispatch. The caller gets its <Code>201</Code> only after <Code>COMPLETE</Code> is written durably. The Camel entry points never redeliver, so retries only ever happen through the receipt.
          </p>

          <Sub>A write fence for an API with no ETags</Sub>
          <p>
            Required-field rules per pipeline stage have to hold on every write. The CRM’s update call has no <Code>If-Match</Code>, so two instances could each check the rules against a stale read and then overwrite each other. I built the missing concurrency control in Postgres, with one fence row per record.
          </p>
          <Snippet>{`reserve → read → evaluate → write → finalise`}</Snippet>
          <p>
            The reserve step claims the record. The write is a single update, with no database connection held while it runs. The finalise step is a compare-and-set that only succeeds if the fence is still ours. Rules live in a versioned store that reconciles itself against the CRM’s metadata by content hash, and checks fail closed if the metadata version does not match. After launch I added a release path for reservations that failed before they could finalise.
          </p>

          <Sub>Switching permission engines in production</Sub>
          <p>
            Access control had to move from fixed roles to configurable policies: brand scope, own, team or reporting-tree records, parent-record readability and masked fields. I did not want a big-bang switch across six live organisations.
          </p>
          <ul className={list}>
            <li>The new engine is deny-by-default at the catalog level and masks fields it should not show.</li>
            <li>A shadow comparator runs the new engine next to the old one on real requests, stores only the differences and never affects the response.</li>
            <li>Readiness gates decide when a resource may cut over, so nobody gets locked out on the strength of a hunch.</li>
            <li>Ownership resolves from either a platform user id or the CRM owner’s email, so no data backfill was needed.</li>
            <li>List pages use batch evaluation rather than one check per row and per field. The story of why is in the hard problems below.</li>
          </ul>

          <Sub>Performance across six organisations</Sub>
          <p>
            Pages that read from six organisations used to pay each one’s latency in sequence. A bounded parallel fan-out replaced that, so a page now waits only for its slowest organisation, and a broken organisation degrades its own part of the page and gets reported instead of sinking the response. Board pagination moved into a single query in the CRM’s own query language, which took a board interaction from about 25 CRM calls down to 1 or 2 at roughly 5,000 projects.
          </p>

          <Sub>An audit log nobody can forget to write</Sub>
          <p>
            Rather than asking every code path to remember to audit, a Spring post-processor wraps every CRM client in a proxy. Each successful create, update and delete is captured with its before-state and request context. Database triggers reject UPDATE and DELETE on the audit rows, so the log is append-only even against my own code.
          </p>
        </Prose>
      ),
    },
    {
      id: "hard-problems",
      title: "Hard problems",
      content: (
        <div>
          <p className="text-soft">
            These are the production problems that taught me the most. I have written them up the way I would write a postmortem. Each one collapses to its header row.
          </p>

          <IncidentReport
            defaultOpen
            title="The token that expired early"
            status="RESOLVED"
            impact="The board failed with 401 errors for up to an hour, even though the cached access token had not expired."
            detection="It surfaced as 401s from the CRM while every expiry check on our side said the token was still valid."
            investigation={[
              "Ruled out expiry first: the token we held was well inside its lifetime.",
              "Found that the vendor keeps only a bounded pool of live tokens per OAuth client.",
              "Confirmed that minting a token somewhere else on the same client, such as from a local script, silently evicts the one the service is holding.",
              "Concluded that no expiry check can see this, because the state lives in the provider.",
            ]}
            rootCause="The vendor silently evicts live tokens when another token is minted on the same OAuth client, so a token can die long before its expiry time."
            fix="Token refresh now runs under a per-organisation lock and reuses a token another thread has already minted, so concurrent failures do not stampede the provider. Every CRM client retries once on a 401."
            followUps="Tests cover the 401-then-200 path in the CRM clients, so the retry cannot quietly disappear."
          />

          <IncidentReport
            title="Nobody could sign in after a deploy"
            status="RESOLVED"
            impact="After a production deploy, nobody could sign in."
            detection="Reported straight after the deploy, as a total sign-in failure."
            investigation={[
              "Checked the frontend’s API base first, since a wrong host would look exactly like this.",
              "Checked the auth environment on the service itself.",
              "Checked what the deploy had done to the environment, and found two overlapping faults: the deploy flag replaced the whole set of environment variables instead of merging into it, which dropped the auth settings, and separately staging had raced a merge and ended up with mixed auth settings.",
            ]}
            rootCause="The deploy used the Cloud Run flag that replaces the entire environment, so every variable not listed in the workflow was deleted, including the auth configuration."
            fix="The production workflow now merges environment variables instead of replacing them."
            followUps="A comment in the workflow records the incident right next to the line that caused it, so the next person to edit it sees why."
          />

          <IncidentReport
            title="A 20× slowdown from per-field permission checks"
            status="PARTIAL"
            impact="An endpoint went from about 0.8 s to 15–42 s after a release, in both staging and production."
            detection="It showed up as a clear latency regression on one endpoint, in both environments, straight after a release."
            investigation={[
              "Used request logs per Cloud Run revision to narrow the regression to a single commit.",
              "Traced the code and found the permission check ran once per field and once per brand.",
              "Found that each of those checks rebuilt the organisation graph from Firestore.",
              "Corrected the original ticket, whose first theory about the cause was wrong.",
            ]}
            rootCause="Authorization was evaluated per field and per brand, and every evaluation re-read the organisation graph, so one request turned into a pile of repeated lookups."
            fix="One batched authorization per form, parallel searches across brands, and stage context resolved once per destination. I then applied the same pattern to the contact pages."
            followUps="Partial because I have no measurement after the fix. The fix shipped and the cause is understood, but I have not recorded p50 and p95 for it, so I will not quote a number. Doing that is first on my list."
          />

          <IncidentReport
            title="Past meetings that vanished"
            status="RESOLVED"
            impact="A project showed no meetings, while the CRM clearly had one."
            detection="A project page showed no meetings for a project that had one in the CRM."
            investigation={[
              "Saw that the related-list endpoint returned 204 No Content, while the module list did show the event.",
              "Established that the related-list endpoint only returns upcoming activities. That is not documented.",
              "Fixed it, and four days later the same bug came back.",
            ]}
            rootCause="An undocumented vendor behaviour: the endpoint silently omits past activities, so any code built on it forgets the past."
            fix="I deleted the client method outright so that endpoint could not be called a third time, and added a regression test. Later I replaced full module sweeps with targeted queries filtered on the parent record, after finding that field is filterable when its sibling is not."
            followUps="The deleted code path and the test are the guard. When a bug returns, deleting the way to cause it is stronger than leaving a comment."
          />

          <IncidentReport
            title="The 50-column query limit"
            status="RESOLVED"
            impact="One brand’s 52-field layout made every list scan for that brand fail with a 502."
            detection="It surfaced as 502s on one brand’s lists while the other brands worked."
            investigation={[
              "Looked at what differed for that brand and found a layout with 52 fields.",
              "Found that the CRM’s query language caps a SELECT at 50 columns, and the scan was selecting every field.",
              "Saw the risk in simply trimming the list: authorization depends on ownership columns, and dropping those would break access checks.",
            ]}
            rootCause="The vendor caps a query at 50 selected columns, and one layout had 52."
            fix="A prioritised projection. Ownership columns are mandatory, the scan fails closed if those alone exceed the cap, and layouts under the cap are untouched. When fields overflow, the result can hide data but can never expose it."
            followUps="The projection lives next to the query builder and is tested against it. Overflow can only under-disclose, by design."
          />
        </div>
      ),
    },
    {
      id: "results",
      title: "Results",
      content: (
        <Prose>
          <ul className={list}>
            <li>CRM calls per board interaction went from about 25 to 1 or 2, at roughly 5,000 projects.</li>
            <li>A page across six organisations waits only for its slowest one, not the sum of all six.</li>
            <li>A 200-row page used to spend about 38 seconds in rule context before batch evaluation replaced per-row checks.</li>
            <li>A bug that created a duplicate project on every ingestion run is gone.</li>
            <li>The backend test suite went from nothing to more than 2,300 tests in four months, including concurrency tests against embedded Postgres and the Firestore emulator.</li>
          </ul>
          <p>
            I am deliberately not quoting latency after the fixes. I do not have those measurements yet, and I would rather leave the number out than guess it.
          </p>
        </Prose>
      ),
    },
    {
      id: "what-id-do-next",
      title: "What I’d do next",
      content: (
        <Prose>
          <ul className={list}>
            <li>Measure. Record p50 and p95 for the endpoints fixed in the slowdown, count CRM calls per page view, and see how often receipts actually end in an unknown state.</li>
            <li>Handle rate limiting properly. The hand-written CRM clients repeat the same timeout and retry logic, and none of them understands a 429 or a retry-after header. I would pull that into one shared layer.</li>
            <li>Give the dead-letter queues a consumer. They are written to today, but nothing replays them.</li>
            <li>Cache the organisation graph and metadata snapshots, which are re-read several times per request, and bound the fan-out queue.</li>
            <li>Give the first record in a two-step create the same idempotency treatment as the second. A lost response on that step still needs manual handling.</li>
          </ul>
        </Prose>
      ),
    },
  ],
};

export default crmPlatform;
