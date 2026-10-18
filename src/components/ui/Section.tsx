// Standard page section: anchor id, horizontal gutters (16px on phones) and content capped at 1440px.
export function Section({ id, children, className = "", labelledBy }: { id?: string; children: React.ReactNode; className?: string; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`mx-auto w-full max-w-[1440px] scroll-mt-20 px-4 py-20 sm:px-6 md:py-28 lg:px-10 ${className}`}>
      {children}
    </section>
  );
}
