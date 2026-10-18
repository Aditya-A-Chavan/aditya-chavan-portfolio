import type { CaseStudy } from "./types";
import { projects } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CurriculumPipeline } from "@/components/visuals/CurriculumPipeline";

const project = projects.find((p) => p.slug === "curriculum-generator");

const PANEL = "rounded-md border border-line-strong bg-panel p-4 sm:p-5";
const PANEL_LABEL = "font-mono text-[11px] tracking-[0.08em] text-muted uppercase";
const PANEL_LIST = "mt-3 list-disc space-y-2 pl-5 text-[15px] leading-snug text-soft marker:text-muted";

const study: CaseStudy = {
  slug: "curriculum-generator",
  metaLine: "TEAM PROJECT · 2025 · AI / RAG · ROLE: BACKEND",
  quickFacts: {
    role: "Backend developer (36 of 54 commits)",
    timeline: "Nov 2025",
    team: "Team of four",
    stack: "Python, Flask, Redis + RQ, MongoDB, ChromaDB, SentenceTransformers, React",
  },
  sections: [
    {
      id: "problem",
      title: "The problem",
      content: (
        <>
          <p>
            Turning a pile of reference material into a structured course outline takes days. CurriculumGenerator takes
            course PDFs and returns a structured curriculum, saved with its title, hours and modules so you can come back
            to it later.
          </p>
          <p>
            This was a team project. I wrote most of the backend, and I say below exactly what was mine and what was my
            teammates&apos;.
          </p>
        </>
      ),
    },
    {
      id: "constraints",
      title: "Constraints",
      content: (
        <ul>
          <li>A generation takes long enough that a normal web request would time out before it finished.</li>
          <li>The answer has to come from the uploaded material, so retrieval has to happen before generation.</li>
          <li>The app needs a predictable shape back, so the model must return curriculum JSON in a fixed schema.</li>
          <li>The background worker has to run on Windows, macOS and Linux.</li>
        </ul>
      ),
    },
    {
      id: "what-i-built",
      title: "What I built",
      content: (
        <>
          <h3>From PDF to curriculum</h3>
          <p>Every generation runs the same pipeline:</p>
          <div className="my-8">
            <CurriculumPipeline />
          </div>
          <ol>
            <li>PyMuPDF extracts the text from the uploaded PDFs.</li>
            <li>The text is split into chunks, either overlapping or paragraph-aware.</li>
            <li>SentenceTransformers turns each chunk into an embedding.</li>
            <li>The embeddings are stored in ChromaDB.</li>
            <li>A strict prompt, with the retrieved material, makes the model return the curriculum as JSON in a fixed schema.</li>
          </ol>

          <h3>The API and the job queue</h3>
          <p>
            The backend is a Flask API with endpoints to list all curricula, fetch one by id, and export one as a PDF.
            Generation does not run inside the request. It runs as a job on a Redis queue using RQ, and a worker picks it
            up. MongoDB keeps the curriculum history and its metadata.
          </p>

          <h3>My part and the team&apos;s</h3>
          <p>
            The repository I link is my fork of a teammate&apos;s original. It has 54 commits, and 36 of them are mine.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className={PANEL}>
              <span className={`block ${PANEL_LABEL}`}>What I did</span>
              <ul className={PANEL_LIST}>
                <li>Backend API and the job flow</li>
                <li>Prompt and model updates</li>
                <li>Fix for a bug that overwrote data in the database</li>
                <li>Timeout tuning on both frontend and backend</li>
                <li>Fix for a PDF flag bug</li>
                <li>Viewing past curricula from history</li>
                <li>The export-PDF endpoint</li>
                <li>Parsing curricula that arrive as a string or as an object</li>
              </ul>
            </div>
            <div className={PANEL}>
              <span className={`block ${PANEL_LABEL}`}>What my teammates did</span>
              <ul className={PANEL_LIST}>
                <li>Suhani Jagtap: the frontend, the PDFs and the export styling. It is her original repository.</li>
                <li>Aarnav and arpitchhabra003 also contributed to the project.</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "hard-problems",
      title: "Hard problems",
      content: (
        <>
          <h3>Generations that outlast a request</h3>
          <p>
            A long generation and a web request do not fit together: the request times out while the model is still
            working. The job queue solves this by separating the two. The API accepts the request and puts a job on the
            queue, and the worker does the slow part. I also tuned the timeouts on both the frontend and the backend so
            neither side gave up early.
          </p>

          <h3>A worker that runs on every OS</h3>
          <p>
            RQ&apos;s standard <code>Worker</code> forks a process for each job, and Windows cannot fork.{" "}
            <code>SimpleWorker</code> runs jobs inside the worker process instead. The worker code in{" "}
            <code>core/worker.py</code> picks <code>SimpleWorker</code> on Windows and macOS and <code>Worker</code> on
            Linux, so the same code starts anywhere.
          </p>

          <h3>Bugs in the data path</h3>
          <p>
            The rest of my work was in how data moved around: a bug where the database was being overwritten, a
            bug with the PDF flag, and curriculum data that could come back as either a string or an object and needed
            parsing for both.
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
            Generation works end to end: upload PDFs, get a structured curriculum, see it in the history later, and export
            it as a PDF. Of the 54 commits in the repository, 36 are mine.
          </p>
          {project?.source && (
            <div className="mt-6">
              <ButtonLink href={project.source}>Source on GitHub ↗</ButtonLink>
            </div>
          )}
        </>
      ),
    },
    {
      id: "next",
      title: "What I'd do next",
      content: (
        <>
          <p>
            Add tests around curriculum parsing. It has to handle two formats, which is exactly where regressions hide.
          </p>
          <p>
            Then compare the two chunking modes, overlapping and paragraph-aware, on the same PDFs, and keep the one that
            gives better curricula.
          </p>
        </>
      ),
    },
  ],
};

export default study;
