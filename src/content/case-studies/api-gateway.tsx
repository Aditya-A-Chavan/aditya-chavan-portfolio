import type { ReactNode } from "react";
import { IncidentReport } from "@/components/ui/IncidentReport";
import { GatewayFlow } from "@/components/visuals/GatewayFlow";
import type { CaseStudy } from "./types";

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

const apiGateway: CaseStudy = {
  slug: "api-gateway",
  metaLine: "ALLHOME · 2026 · PRODUCTION · ROLE: DESIGNED & LED DELIVERY",
  quickFacts: {
    role: "Designed and led delivery",
    timeline: "Jun – Aug 2026",
    team: "Sole repository contributor",
    stack: "Java, Spring Boot, Apache Camel, Python, Prefect, PostgreSQL, Cloud Run, Cloud SQL, Secret Manager",
  },
  sections: [
    {
      id: "the-problem",
      title: "The problem",
      content: (
        <Prose>
          <p>
            AllHome’s business organisations each run their own CRM organisation, and each one had drifted: different custom fields, different pipelines, different values in the same dropdown. Internal tools needed to write into all of them, and a tool that guesses at field names will quietly write bad data or fail in confusing ways.
          </p>
          <p>
            There was a second job too. Data from a source system had to reach a partner system on a schedule, and the source data was not clean.
          </p>
          <p>
            I designed a governed gateway that checks every write against the target organisation’s live schema before anything reaches the vendor, and a scheduled data-sync pipeline with a validation gate in front of the partner.
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
            <li>An empty repository and a short window. The sync had to be live first and the gateway after it.</li>
            <li>Eight organisations whose schemas differ and keep changing, so nothing could be hand-maintained per organisation.</li>
            <li>Callers need the outcome of a write in the same request, which rules out a queue in front of the gateway.</li>
            <li>Management wanted full traceability, because many more integrations were expected to follow this one.</li>
            <li>A cloud security policy that applied to my own setup, including how credentials and keys could be created.</li>
            <li>A small, known group of internal developers as the callers, not the public.</li>
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
            I designed this, wrote the specifications and decision records, set the rules the code had to follow, ran it in production and reviewed what shipped. Much of the code was produced from written plans I specified and approved, rather than typed line by line by me. Design, contracts, data model and operations are the parts I can defend in depth, so those are the parts I describe here.
          </p>
          <GatewayFlow />

          <Sub>Contract by reflection</Sub>
          <p>
            I rejected the idea of a hand-maintained schema. The gateway reads each organisation’s live field and layout definitions from the CRM itself, stores the raw response, then a normalised form, with a time-to-live. A write is validated against that before any call to the CRM is made. When an organisation adds a field, the contract updates itself.
          </p>

          <Sub>Permissions you can read</Sub>
          <p>
            An API key has a client and a set of scopes. A scope has four dot-separated segments: tool, brand, module and operation. Wildcards work from the brand segment down, never on the tool, and matching is additive, so a key holds exactly what its scopes add up to. A denied request gets a precise 403.
          </p>
          <Snippet>{`crm.brandA.deals.create     one action in one brand
crm.brandA.deals.*          any operation on one module
crm.brandA.*                any module in one brand`}</Snippet>
          <p>
            Wildcards are convenient and dangerous, because they widen silently. A new module appears and an existing key now covers it. So the model has controls built in: wildcard keys are flagged as privileged, the audit records the concrete action rather than the wildcard that allowed it, and an expansion report surfaces grants that have widened without anyone choosing it. Keys are self-service, but only for developers on a small allow-list.
          </p>

          <Sub>One schema per pipeline</Sub>
          <p>
            The first real use exposed three vendor data-model gaps. The one I led the redesign for: the schema endpoint returned one merged set of fields per module, but each organisation runs several pipelines with different fields and different stage values. I switched reflection to the layouts definition, re-keyed the cache by layout with a zero-downtime migration, and added an optional layout parameter to the schema endpoint. I ruled that writes keep validating against the union of all layouts, so existing behaviour was not silently tightened. That is permissive, and I recorded it as open.
          </p>
          <p>
            The second gap was a catalog that over-promised: a module nested under its parent record was listed as if it supported ordinary create, read, update and delete. I contained it immediately with the permission model, by issuing keys scoped only to the modules that behave regularly, so irregular ones were hidden from that key’s catalog. The permanent fix is written up as an open issue.
          </p>

          <Sub>Idempotency keys that tell the truth</Sub>
          <p>
            A batch that was sent twice reported the same record as “created” twice. I questioned the duplicate and traced it to idempotency keys derived from content: an identical batch replayed the original response, and the counts were inflated. I changed upsert objects to random per-batch keys, which is safe because the target upserts anyway, and wrote a rule that objects that are not idempotent must keep content-derived keys.
          </p>

          <Sub>An audit trail that is a debugging tool</Sub>
          <p>
            For every record the pipeline stores the source payload, the transformed payload and the target’s response, in one transaction, with 30-day retention. I built it to a management directive for traceability, and then it paid for itself the first time something failed. The story is in the hard problems below.
          </p>

          <Sub>Decision log excerpts</Sub>
          <p>
            The project has 18 numbered decisions and 15 rules. Three that I would defend in an interview:
          </p>
          <ul className={list}>
            <li>
              <span className="text-fg">No dbt.</span> The analytics service already merges every finance organisation and can run SQL, so the transforms run there. A separate warehouse would be one more thing to operate. The cost: transforms are limited to what that SQL can express, and I would revisit the choice if multi-step modelling appears.
            </li>
            <li>
              <span className="text-fg">Synchronous only.</span> Callers need the outcome in the same request, so the gateway answers directly instead of queueing. That is a documented exception to my own queue-only rule. The cost: nothing buffers if the vendor is slow, so a circuit breaker and throttle stand in.
            </li>
            <li>
              <span className="text-fg">Native field names.</span> My first idea was canonical commands translated per connector. Once I saw that callers already spoke the CRM’s own field names, I narrowed it to native mode. Callers are coupled to the vendor’s names, and insulating them is explicitly out of scope.
            </li>
          </ul>
          <p>
            Two of the rules made extension cheap. Configuration lives only in config files or the registry, and a new capability may only land through four defined extension points. The proof is that eight organisations were onboarded with one migration and no code.
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
            These are the problems that showed up when the platform met real traffic and real data. Each one collapses to its header row.
          </p>

          <IncidentReport
            defaultOpen
            title="A crash on an undocumented response shape"
            status="RESOLVED"
            impact="The first live push to the partner system failed."
            detection="The run failed with a missing-key error in the push step, and the failed run was recorded."
            investigation={[
              "Read the failed run and saw the push step looking for a job identifier in the response.",
              "Compared that with what the partner’s API actually sent: when a request is replayed under an idempotency key, it returns the stored result inline with the items, not a job envelope.",
              "Checked the partner’s documentation and found that behaviour is not described there.",
            ]}
            rootCause="The code assumed every response was a job envelope. The partner API returns a different, undocumented shape when it replays a stored result."
            fix="The push step now accepts both shapes, and builds a final result from the inline items when it gets the replay form."
            followUps="The next live push created 100 records. The lesson I wrote down: vendor APIs lie by omission, so every response shape the code depends on should be handled explicitly."
          />

          <IncidentReport
            title="Two sync runs racing each other"
            status="RESOLVED"
            impact="Two runs of the sync overlapped and produced a batch of record failures."
            detection="Record failures appeared in a live sync run."
            investigation={[
              "Lined the failures up against the run history and found two runs active at the same time.",
              "Confirmed that nothing in the deployment stopped a second run starting while the first was still going.",
            ]}
            rootCause="The deployment allowed overlapping runs, so two runs were working at the same time."
            fix="I set the deployment’s concurrency limit to one."
            followUps="Resolved by constraint rather than by redesign. I documented the gotcha in the runbook."
          />

          <IncidentReport
            title="The admin endpoint that failed only in production"
            status="RESOLVED"
            impact="The admin endpoint that refreshes the cached schema returned 400 for every input after deployment."
            detection="I found it during my own live verification after the deploy. The tests had passed and had not caught it."
            investigation={[
              "Reproduced it against the deployed service: every request failed, whatever the body.",
              "Ruled out two hypotheses first, and wrote them into the fix’s commit message so nobody retraces them.",
              "Found that the global JSON binding mode in the running service delivered the request body to the handler as a generic map, a shape the handler did not handle.",
            ]}
            rootCause="A service-wide JSON binding setting changed how the request body arrived, and the handler only understood the shape the tests supplied."
            fix="The handler now accepts the body in the shape the framework really delivers."
            followUps="The lesson: a green test run does not cover framework-level configuration, so live verification against the deployed service stays part of how I ship."
          />

          <IncidentReport
            title="The bad source record, found through the audit trail"
            status="PARTIAL"
            impact="One record failed in a live run with no obvious cause, and nothing in the logs explained it."
            detection="It surfaced as a single failed record in a live sync run."
            investigation={[
              "Looked the record up in the per-record audit trail, which holds the source payload, the transformed payload and the partner’s response side by side.",
              "Compared the three layers for that record to see where the outcome diverged from what we sent.",
              "Queried the source data for other records sharing the same identifier, and found two different customers carrying one value that should be unique.",
            ]}
            rootCause="Two customers in the source system shared an identifier that is supposed to be unique. The pipeline did what it should and the failure traced back to that."
            fix="Diagnosed. The data fix belongs to the source system, so it was not something to patch around in the pipeline."
            followUps="Marked partial for that reason: the failure is explained, not repaired by me. The trail is why it took three queries and not an afternoon, and it is the main reason I built it as a data model instead of log lines."
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
            <li>An empty repository to a production gateway in under two months.</li>
            <li>Eight organisations onboarded with one migration and no code changes.</li>
            <li>The validation gate stopped 843 of 1,345 source records before they reached the partner system, each with a recorded reason. 502 were valid.</li>
            <li>The first live push created 100 records.</li>
            <li>Four production issues found in the first real use.</li>
            <li>262 automated Java tests and 18 Python tests.</li>
          </ul>
          <p>
            I have not yet pulled request volume, rejection counts or latency out of the audit tables, so those numbers are left out until I have run the queries.
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
            <li>Make writes validate against the specific layout, not the union of all of them, so a wrong stage value for one pipeline is rejected.</li>
            <li>Fix the catalog properly, so it never lists operations a module cannot perform, instead of relying on scoped keys to hide them.</li>
            <li>Run the measurements I listed: invalid writes stopped before the vendor, duplicates absorbed, latency per endpoint and running cost.</li>
          </ul>
        </Prose>
      ),
    },
  ],
};

export default apiGateway;
