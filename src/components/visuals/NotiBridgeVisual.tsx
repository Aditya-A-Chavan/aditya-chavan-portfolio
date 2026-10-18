"use client";

import Image from "next/image";
import { useVisualTimeline } from "./useVisualTimeline";

// Pairing story on a loop: laptop shows a QR code, the phone scans it, the two find each other on the Wi-Fi, a notification crosses over.
function build(tl: gsap.core.Timeline) {
  tl.set("[data-qr]", { opacity: 0 }, 0)
    .set("[data-link]", { strokeDashoffset: 1 }, 0)
    .set("[data-paired],[data-pk],[data-toast]", { opacity: 0 }, 0)
    .set("[data-pk]", { x: 0 }, 0)
    .to("[data-qr]", { opacity: 1, duration: 0.4 }, 0.2)
    .to("[data-link]", { strokeDashoffset: 0, duration: 0.8 }, 1)
    .to("[data-qr]", { opacity: 0, duration: 0.3 }, 1.9)
    .to("[data-paired]", { opacity: 1, duration: 0.3 }, 2)
    .to("[data-pk]", { opacity: 1, duration: 0.2 }, 2.8)
    .to("[data-pk]", { x: 194, duration: 0.9, ease: "power1.inOut" }, 2.8)
    .to("[data-pk]", { opacity: 0, duration: 0.2 }, 3.7)
    .to("[data-toast]", { opacity: 1, duration: 0.3 }, 3.7);
}

export function NotiBridgeVisual({ className = "" }: { className?: string }) {
  const ref = useVisualTimeline<SVGSVGElement>(build, { loop: true, repeatDelay: 1.2 });
  const qr = [
    [0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [1, 2], [2, 2],
  ];

  return (
    <div className={`overflow-hidden rounded-lg border border-line bg-panel ${className}`}>
      <Image
        src="/notibridge.png"
        width={1884}
        height={1016}
        sizes="(min-width: 1024px) 40vw, (min-width: 768px) 90vw, 100vw"
        alt="Screenshot of the NotiBridge project site: connect your desktop and mobile notifications, local Wi-Fi only, no external server."
        className="block h-auto w-full"
      />
      <svg
        ref={ref}
        viewBox="0 0 400 130"
        role="img"
        aria-label="Animated pairing diagram: the laptop shows a QR code, the phone scans it, the two devices find each other over the local Wi-Fi with mDNS, then a notification travels from the phone to the laptop with no cloud in between."
        className="block h-auto w-full border-t border-line"
      >
        <rect x={40} y={14} width={44} height={80} rx={8} className="fill-bg stroke-soft" strokeWidth={1.5} />
        <circle cx={62} cy={84} r={2} className="fill-soft" />
        <text x={62} y={118} textAnchor="middle" fontSize={11} className="fill-muted font-mono">
          phone
        </text>

        <rect x={284} y={24} width={88} height={56} rx={5} className="fill-bg stroke-soft" strokeWidth={1.5} />
        <path d="M274 88 H382" className="fill-none stroke-soft" strokeWidth={1.5} strokeLinecap="round" />
        <text x={328} y={118} textAnchor="middle" fontSize={11} className="fill-muted font-mono">
          laptop
        </text>
        <g data-qr opacity={0} className="fill-accent">
          {qr.map(([c, r]) => (
            <rect key={`${c}${r}`} x={314 + c * 9} y={39 + r * 9} width={7} height={7} />
          ))}
        </g>
        <text data-paired x={328} y={56} textAnchor="middle" fontSize={11} className="fill-accent font-mono">
          paired
        </text>
        <g data-toast>
          <rect x={292} y={32} width={72} height={14} rx={3} className="fill-accent/20 stroke-accent" />
          <text x={328} y={42} textAnchor="middle" fontSize={8} className="fill-fg font-mono">
            new message
          </text>
        </g>

        <path data-link pathLength={1} style={{ strokeDasharray: 1 }} d="M88 54 H280" className="fill-none stroke-accent" strokeWidth={1.5} />
        <text x={184} y={44} textAnchor="middle" fontSize={11} className="fill-muted font-mono">
          wi-fi · mDNS
        </text>
        <text x={184} y={76} textAnchor="middle" fontSize={11} className="fill-muted font-mono">
          no cloud
        </text>
        <circle data-pk opacity={0} cx={88} cy={54} r={4.5} className="fill-accent" />
      </svg>
    </div>
  );
}
