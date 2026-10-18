"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { scrollToId } from "@/lib/scroll";

type Props = {
  href: string; // "#section" scrolls on the current page, "/path" is a route, "https://…" opens in a new tab
  children: React.ReactNode;
  variant?: "primary" | "outline" | "text";
  className?: string;
  focusSelector?: string; // for "#…" links: element inside the target to focus after scrolling
  onClick?: () => void;
};

const styles = {
  primary: "bg-accent text-bg hover:bg-[#6ee7a0] px-5 py-3 rounded-md",
  outline: "border border-line-strong text-fg hover:border-fg px-5 py-3 rounded-md",
  text: "text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent hover:text-accent",
};

export function ButtonLink({ href, children, variant = "outline", className = "", focusSelector, onClick }: Props) {
  const router = useRouter();
  const cls = `inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium transition-colors ${styles[variant]} ${className}`;

  if (href.startsWith("#")) {
    // On the home page this scrolls; on other pages the section doesn't exist, so go to "/#section".
    return (
      <a
        href={`/${href}`}
        className={cls}
        onClick={(e) => {
          onClick?.();
          e.preventDefault();
          if (!scrollToId(href.slice(1), { focusSelector })) router.push(`/${href}`);
        }}
      >
        {children}
      </a>
    );
  }
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} onClick={onClick}>
      {children}
    </Link>
  );
}
