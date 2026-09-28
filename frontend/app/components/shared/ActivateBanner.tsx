import Link from "next/link";
import { ArrowRight } from "lucide-react";

const QR = [
    "000000110100000",
    "000001001000000",
    "000000111000000",
    "000001100100000",
    "000001011000000",
    "110101101011010",
    "011010011101001",
    "101110100110110",
    "010011011001011",
    "110100110110101",
    "000001011010110",
    "000000110110101",
    "000001001011010",
    "000001110100110",
    "000000101101011",
];

const QR_X = 355;
const QR_Y = 103;
const CELL = 4;

function Finder({ x, y }: { x: number; y: number }) {
    return (
        <>
            <rect x={x} y={y} width="20" height="20" rx="4" fill="#141414" />
            <rect x={x + 4} y={y + 4} width="12" height="12" rx="2" fill="#F4F2EA" />
            <rect x={x + 7} y={y + 7} width="6" height="6" rx="1.5" fill="#141414" />
        </>
    );
}

function BannerArt() {
    return (
        <svg
            aria-hidden
            viewBox="0 0 480 260"
            className="pointer-events-none absolute right-0 top-0 h-full w-auto max-w-none text-primary"
            fill="none"
        >
            <defs>
                <pattern id="ab-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M24 0H0V24" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
                </pattern>
                <linearGradient id="ab-fade" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
                    <stop offset="0.75" stopColor="#fff" stopOpacity="1" />
                </linearGradient>
                <mask id="ab-mask">
                    <rect width="480" height="260" fill="url(#ab-fade)" />
                </mask>
            </defs>

            <rect width="480" height="260" fill="url(#ab-grid)" mask="url(#ab-mask)" />

            <circle cx="392" cy="132" r="190" fill="currentColor" fillOpacity="0.04" />
            <circle cx="392" cy="132" r="140" fill="currentColor" fillOpacity="0.07" />
            <circle cx="392" cy="132" r="92" fill="currentColor" fillOpacity="0.12" />

            <path
                d="M318 68V52h16M466 68V52h-16M318 202v16h16M466 202v16h-16"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <g transform="rotate(-9 392 135)">
                <rect x="345" y="79" width="96" height="128" rx="16" fill="currentColor" />
                <rect x="337" y="71" width="96" height="128" rx="16" fill="#F4F2EA" />
                <rect x="374" y="80" width="22" height="8" rx="4" fill="#141414" fillOpacity="0.9" />

                <Finder x={QR_X} y={QR_Y} />
                <Finder x={QR_X + 40} y={QR_Y} />
                <Finder x={QR_X} y={QR_Y + 40} />
                {QR.map((row, r) =>
                    row.split("").map((v, c) =>
                        v === "1" ? (
                            <rect
                                key={`${r}-${c}`}
                                x={QR_X + c * CELL}
                                y={QR_Y + r * CELL}
                                width="3.4"
                                height="3.4"
                                rx="0.7"
                                fill="#141414"
                            />
                        ) : null,
                    ),
                )}

                <rect x="355" y="173" width="36" height="4" rx="2" fill="#141414" fillOpacity="0.85" />
                <rect x="355" y="181" width="22" height="3" rx="1.5" fill="#141414" fillOpacity="0.3" />
            </g>

            <circle cx="326" cy="72" r="16" fill="currentColor" />
            <g
                transform="translate(317.5 63.5) scale(0.71)"
                stroke="#141414"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </g>

            <circle cx="458" cy="204" r="16" className="fill-surface" stroke="currentColor" strokeWidth="2" />
            <g
                transform="translate(449.5 195.5) scale(0.71)"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </g>
        </svg>
    );
}

export default function ActivateBanner() {
    return (
        <Link
            href="/activate"
            className="group relative block h-full overflow-hidden rounded-3xl border border-border bg-surface p-5 outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary md:p-8"
        >
            <BannerArt />

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent"
            />

            <div className="relative z-10 max-w-[58%]">
                <p className="text-xs font-medium text-muted md:text-sm">New tag in hand?</p>
                <p className="mt-1.5 text-[1.75rem] font-bold leading-[1.1] tracking-tight text-foreground md:text-4xl">
                    Activate
                    <br />
                    your tag
                </p>
                <p className="mt-2 text-sm leading-snug text-muted md:text-base">
                    Scan, verify, done in two minutes.
                </p>

                <span className="mt-4 inline-flex h-11 items-center gap-3 rounded-full bg-primary pl-5 pr-1.5 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary-hover md:mt-6">
                    Activate now
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground text-primary">
                        <ArrowRight
                            size={16}
                            strokeWidth={2.25}
                            className="transition-transform motion-safe:group-hover:translate-x-0.5"
                        />
                    </span>
                </span>
            </div>
        </Link>
    );
}