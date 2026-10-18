"use client";

import { useEffect, useRef, useState } from "react";
import { contact, profile } from "@/content/site";

type Currency = "INR" | "USD";
type Values = {
  name: string;
  email: string;
  message: string;
  workTypes: string[];
  timeline: string;
  currency: Currency;
  budget: string;
  link: string;
};
type TextField = "name" | "email" | "message" | "link";
type Errors = Partial<Record<TextField, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const STORAGE_KEY = "contact-brief-draft";
const EMPTY: Values = { name: "", email: "", message: "", workTypes: [], timeline: "", currency: "INR", budget: "", link: "" };

const REQUIRED = "Please fill this in.";
const BAD_EMAIL = "That email doesn't look right.";
const BAD_LINK = "That link doesn't look right.";

function isValidLink(value: string) {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (!v.name.trim()) errors.name = REQUIRED;
  if (!v.email.trim()) errors.email = REQUIRED;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = BAD_EMAIL;
  if (!v.message.trim()) errors.message = REQUIRED;
  if (v.link.trim() && !isValidLink(v.link.trim())) errors.link = BAD_LINK;
  return errors;
}

const prompt = "mb-2 flex flex-wrap items-baseline gap-x-2 font-mono text-sm text-soft";
const optional = "text-xs text-muted";
const control =
  "block min-h-11 w-full rounded-md border bg-panel px-3 py-2.5 font-mono text-base text-fg placeholder:text-muted/70 focus:border-accent focus-visible:outline-offset-0";
const chipBase =
  "inline-flex min-h-11 items-center rounded-full border px-4 font-mono text-sm transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent";
const chipOff = "border-line-strong text-soft hover:border-fg";
const chipOn = "border-accent bg-accent/10 text-accent";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 font-mono text-sm text-danger">
      {message}
    </p>
  );
}

function Spinner() {
  return <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-bg/30 border-t-bg" />;
}

function ChoiceGroup({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={legend} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label key={o} className="relative">
          <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="peer sr-only" />
          <span className={`${chipBase} ${value === o ? chipOn : chipOff}`}>{o}</span>
        </label>
      ))}
    </div>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const restored = useRef(false);
  const focusName = useRef(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const sentRef = useRef<HTMLParagraphElement>(null);

  // Restore the draft once on mount (deferred so the first render matches the server render).
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) setValues({ ...EMPTY, ...(JSON.parse(saved) as Partial<Values>) });
      } catch {
        // Storage unavailable or draft corrupt: start empty.
      }
      restored.current = true;
    });
  }, []);

  // Keep the draft while typing.
  useEffect(() => {
    if (!restored.current || status === "sent") return;
    try {
      if (JSON.stringify(values) === JSON.stringify(EMPTY)) sessionStorage.removeItem(STORAGE_KEY);
      else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {
      // Storage unavailable: the draft just isn't kept.
    }
  }, [values, status]);

  useEffect(() => {
    if (status === "sent") sentRef.current?.focus();
    if (status === "idle" && focusName.current) {
      focusName.current = false;
      nameRef.current?.focus();
    }
  }, [status]);

  const setText = (field: TextField, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const toggleWork = (type: string) =>
    setValues((v) => ({ ...v, workTypes: v.workTypes.includes(type) ? v.workTypes.filter((t) => t !== type) : [...v.workTypes, type] }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(values);
    setErrors(found);
    const first = (["name", "email", "message", "link"] as const).find((f) => found[f]);
    if (first) {
      document.getElementById(`cf-${first}`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.send(
        contact.emailjs.serviceId,
        contact.emailjs.templateId,
        {
          from_name: values.name.trim(),
          from_email: values.email.trim(),
          message: values.message.trim(),
          to_name: profile.name,
          work_types: values.workTypes.join(", ") || "Not specified",
          timeline: values.timeline || "Not specified",
          budget: values.budget ? `${values.budget} (${values.currency})` : "Not specified",
          link: values.link.trim() || "Not provided",
        },
        { publicKey: contact.emailjs.publicKey },
      );
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Nothing to clear.
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-md border border-line-strong bg-panel p-6 md:p-8">
        <p ref={sentRef} tabIndex={-1} role="status" className="font-mono text-base text-accent">
          {`> brief received. I'll reply within ${profile.replyTime}.`}
        </p>
        <button
          type="button"
          onClick={() => {
            focusName.current = true;
            setValues(EMPTY);
            setErrors({});
            setStatus("idle");
          }}
          className="mt-4 inline-flex min-h-11 items-center font-mono text-sm text-fg underline decoration-line-strong underline-offset-4 hover:text-accent hover:decoration-accent"
        >
          Send another
        </button>
      </div>
    );
  }

  const sending = status === "sending";
  const textField = (field: TextField, extra: Record<string, string>) => ({
    id: `cf-${field}`,
    name: field,
    value: values[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setText(field, e.target.value),
    "aria-invalid": errors[field] ? (true as const) : undefined,
    "aria-describedby": errors[field] ? `cf-${field}-error` : undefined,
    className: `${control} ${errors[field] ? "border-danger" : "border-line-strong"}`,
    ...extra,
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-7 rounded-md border border-line-strong bg-panel/40 p-5 md:p-8">
      <div>
        <label htmlFor="cf-name" className={prompt}>
          <span className="text-accent" aria-hidden="true">$</span>
          <span>name:</span>
          <span aria-hidden="true" className="text-muted">*</span>
        </label>
        <input ref={nameRef} type="text" autoComplete="name" required aria-required="true" {...textField("name", {})} />
        <FieldError id="cf-name-error" message={errors.name} />
      </div>

      <div>
        <label htmlFor="cf-email" className={prompt}>
          <span className="text-accent" aria-hidden="true">$</span>
          <span>email:</span>
          <span aria-hidden="true" className="text-muted">*</span>
        </label>
        <input type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required aria-required="true" {...textField("email", {})} />
        <FieldError id="cf-email-error" message={errors.email} />
      </div>

      <div>
        <label htmlFor="cf-message" className={prompt}>
          <span className="text-accent" aria-hidden="true">$</span>
          <span>What are you building?</span>
          <span aria-hidden="true" className="text-muted">*</span>
        </label>
        <textarea rows={4} required aria-required="true" placeholder="A booking API for my clinic's app" {...textField("message", {})} />
        <FieldError id="cf-message-error" message={errors.message} />
      </div>

      <fieldset>
        <legend className={prompt}>
          <span className="text-accent" aria-hidden="true">$</span>
          <span>What kind of work?</span>
          <span className={optional}>(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {contact.workTypes.map((t) => {
            const on = values.workTypes.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => toggleWork(t)}
                className={`${chipBase} ${on ? chipOn : chipOff}`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className={prompt}>
          <span className="text-accent" aria-hidden="true">$</span>
          <span>timeline:</span>
          <span className={optional}>(optional)</span>
        </legend>
        <ChoiceGroup legend="Timeline" name="timeline" options={contact.timelines} value={values.timeline} onChange={(timeline) => setValues((v) => ({ ...v, timeline }))} />
      </fieldset>

      <fieldset>
        <legend className={prompt}>
          <span className="text-accent" aria-hidden="true">$</span>
          <span>budget:</span>
          <span className={optional}>(optional)</span>
        </legend>
        <div className="mb-3">
          <ChoiceGroup
            legend="Currency"
            name="currency"
            options={["INR", "USD"]}
            value={values.currency}
            onChange={(currency) => setValues((v) => (v.currency === currency ? v : { ...v, currency: currency as Currency, budget: "" }))}
          />
        </div>
        <ChoiceGroup legend="Budget" name="budget" options={contact.budgets[values.currency]} value={values.budget} onChange={(budget) => setValues((v) => ({ ...v, budget }))} />
      </fieldset>

      <div>
        <label htmlFor="cf-link" className={prompt}>
          <span className="text-accent" aria-hidden="true">$</span>
          <span>link:</span>
          <span className="text-xs text-muted">existing app, design, doc</span>
          <span className={optional}>(optional)</span>
        </label>
        <input type="url" inputMode="url" autoComplete="url" autoCapitalize="none" spellCheck={false} placeholder="https://" {...textField("link", {})} />
        <FieldError id="cf-link-error" message={errors.link} />
      </div>

      <div>
        <button
          type="submit"
          disabled={sending}
          aria-busy={sending}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-bg transition-colors hover:bg-[#6ee7a0] disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto"
        >
          {sending ? (
            <>
              <Spinner />
              Sending…
            </>
          ) : (
            "Send brief →"
          )}
        </button>
        {status === "error" && (
          <p role="alert" className="mt-4 font-mono text-sm text-danger">
            Something went wrong. Email me directly at{" "}
            <a href={`mailto:${profile.email}`} className="break-all underline underline-offset-4">
              {profile.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
