import Link from "next/link";
import type { ReactNode } from "react";
import { StatusDot } from "@/components/ui/StatusDot";
import { about, certifications, experience, profile, projects, skills } from "@/content/site";

export const PROMPT = "aditya@portfolio:~$";
export const SUGGESTIONS = ["help", "whoami", "ls projects", "contact"];
export const CLEAR = Symbol("clear");

export type Entry = { id: number; cmd: string | null; out: ReactNode };

// Side effects a command can trigger; supplied by the Terminal component.
export type Actions = {
  close: () => void;
  navigate: (href: string) => void;
  hire: () => void;
};

export const WELCOME = (
  <>
    Welcome to aditya-chavan-portfolio — type <span className="text-accent">help</span> to see what I can do.
  </>
);

const HELP: [string, string][] = [
  ["help", "list every command"],
  ["whoami", "who I am, in two lines"],
  ["ls projects", "list projects with their status"],
  ["open <project>", "open a case study, e.g. open notibridge"],
  ["cat about.txt", "read the about text"],
  ["experience", "work and education log"],
  ["skills", "skills by group"],
  ["certs", "certifications with verify links"],
  ["contact", "email, phone and socials"],
  ["contact --email", "copy my email address"],
  ["sudo hire aditya", "jump to the contact form"],
  ["marg", "the story behind MARG"],
  ["clear", "clear the screen"],
  ["exit", "close the terminal"],
];

const COMMANDS = [
  "help", "whoami", "ls projects", "open ", "cat about.txt", "experience", "skills", "certs",
  "contact", "contact --email", "sudo hire aditya", "marg", "clear", "exit",
];

const normalize = (raw: string) => raw.trim().replace(/\s+/g, " ").toLowerCase();

const firstSentence = (text: string) => text.split(/(?<=[.!?])\s+/)[0];

function commonPrefix(items: string[]) {
  return items.reduce((prefix, item) => {
    let i = 0;
    while (i < prefix.length && prefix[i] === item[i]) i++;
    return prefix.slice(0, i);
  });
}

// Tab completion for command names and, after `open `, project slugs.
export function complete(value: string) {
  const v = value.replace(/^\s+/, "").replace(/\s+/g, " ").toLowerCase();
  if (!v) return value;
  const pool = v.startsWith("open ") ? projects.map((p) => `open ${p.slug}`) : COMMANDS;
  const matches = pool.filter((c) => c.startsWith(v));
  return matches.length ? commonPrefix(matches) : value;
}

const linkClass = "text-accent underline underline-offset-2 hover:text-fg";

function Ext({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a href={href} className={linkClass} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

const Muted = ({ children }: { children: ReactNode }) => <span className="text-muted">{children}</span>;

// Runs one command line. Returns the output to print, or CLEAR to wipe the screen.
export async function run(raw: string, act: Actions): Promise<ReactNode | typeof CLEAR> {
  const input = normalize(raw);

  if (input.startsWith("open ") || input === "open") {
    const query = input.slice(5).trim();
    if (!query) return "usage: open <project>";
    const project = projects.find((p) => p.slug === query || p.shortName === query);
    if (!project) return `project not found: ${query}. Try ls projects.`;
    act.navigate(`/work/${project.slug}`);
    return `opening ${project.shortName}…`;
  }

  switch (input) {
    case "help":
      return (
        <dl className="grid grid-cols-[max-content_1fr] gap-x-4">
          {HELP.map(([cmd, desc]) => (
            <div key={cmd} className="contents">
              <dt className="text-accent">{cmd}</dt>
              <dd className="text-soft">{desc}</dd>
            </div>
          ))}
        </dl>
      );

    case "whoami":
      return about.intro.split(/(?<=\.)\s+/).map((line) => <p key={line}>{line}</p>);

    case "ls projects":
      return (
        <ul>
          {projects.map((p) => (
            <li key={p.slug} className="flex items-center gap-2">
              <StatusDot health={p.health} />
              <span className="min-w-[10.5rem]">{p.shortName}</span>
              <Muted>{p.status}</Muted>
            </li>
          ))}
        </ul>
      );

    case "cat about.txt":
      return [about.intro, ...about.paragraphs].map((text) => <p key={text} className="mb-2 last:mb-0">{text}</p>);

    case "experience":
      return experience.map((item) => (
        <div key={item.id} className="mb-3 last:mb-0">
          <p>
            <Muted>[{item.dates}]</Muted> <span className="text-fg">{item.org}</span> — {item.role}
          </p>
          {item.summary && <p className="text-soft">{item.summary}</p>}
          {item.bullets.map((b) => (
            <p key={b} className="pl-4 text-soft -indent-4">
              <span className="text-accent">- </span>
              {b}
            </p>
          ))}
        </div>
      ));

    case "skills":
      return skills.map((s) => (
        <p key={s.group}>
          <span className="text-accent">{s.group}:</span> {s.items.join(", ")}
        </p>
      ));

    case "certs":
      return certifications.map((c) => (
        <p key={c.href}>
          {c.name} <Muted>· {c.issuer} · {c.date}</Muted> <Ext href={c.href}>verify</Ext>
        </p>
      ));

    case "contact":
      return (
        <>
          <p>
            <Muted>email </Muted>
            <Ext href={`mailto:${profile.email}`}>{profile.email}</Ext>
          </p>
          <p>
            <Muted>phone </Muted>
            <Ext href={profile.phone.href}>{profile.phone.display}</Ext>
          </p>
          {profile.socials.map((s) => (
            <p key={s.label}>
              <Muted>{s.label.toLowerCase()} </Muted>
              <Ext href={s.href}>{s.href.replace(/^https?:\/\/(www\.)?/, "")}</Ext>
            </p>
          ))}
        </>
      );

    case "contact --email":
      try {
        await navigator.clipboard.writeText(profile.email);
        return <span className="text-accent">copied to clipboard ✓</span>;
      } catch {
        return (
          <>
            couldn&apos;t copy automatically: <Ext href={`mailto:${profile.email}`}>{profile.email}</Ext>
          </>
        );
      }

    case "sudo hire aditya":
      act.hire();
      return <span className="text-accent">permission granted.</span>;

    case "marg": {
      const marg = projects.find((p) => p.slug === "marg");
      if (!marg?.story) return "marg: story unavailable.";
      return (
        <>
          <p>{firstSentence(marg.story)}</p>
          <Link href={`/work/${marg.slug}`} className={linkClass} onClick={act.close}>
            {marg.caseStudyLabel} →
          </Link>
        </>
      );
    }

    case "clear":
      return CLEAR;

    case "exit":
      act.close();
      return null;

    case "":
      return null;

    default:
      return `command not found: ${raw.trim().split(/\s+/)[0]}. Type help.`;
  }
}
