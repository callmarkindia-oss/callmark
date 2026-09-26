import Link from "next/link";
import Image from "next/image";
import { Bell, QrCode, Store, Compass, Tag, Shield, Package, ArrowRight } from "lucide-react";

const popularTags = [
  {
    label: "Vehicle Tag",
    blurb: "Let people reach you without seeing your number.",
  },
  {
    label: "Door QR",
    blurb: "For homes, shops and offices — visitors contact you directly.",
  },
  {
    label: "Personal QR",
    blurb: "Attach to bags, keys or anything worth returning.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-5 pt-[calc(env(safe-area-inset-top,0px)+1.25rem)] pb-[calc(env(safe-area-inset-bottom,0px)+6rem)]">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Good afternoon</p>
            <h1 className="text-xl font-semibold tracking-tight">Rahul</h1>
          </div>
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="btn btn-ghost h-10 w-10 !p-0 rounded-full border border-border"
          >
            <Bell className="h-5 w-5" strokeWidth={1.75} />
          </Link>
        </header>

        <Link
          href="/activate"
          className="group relative flex items-center justify-between gap-3 rounded-2xl bg-primary/20 py-5 pl-5 pr-2 text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
              New tag in hand?
            </p>
            <p className="mt-1 text-2xl font-bold leading-snug">Activate your tag</p>
            <p className="mt-1 text-md text-primary-foreground/70">
              Scan, verify, done in two minutes.
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
              Activate now
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5"><ArrowRight size={16} /></span>
            </span>
          </div>
          <Image
            src="/3d_qr_light.png"
            alt=""
            aria-hidden
            width={500}
            height={500}
            className="pointer-events-none -mt-3 -mr-4 h-32 w-32 shrink-0 object-contain drop-shadow-xl transition-transform duration-300 group-hover:-translate-y-1 sm:h-36 sm:w-36"
          />
        </Link>

        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/scan"
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface py-4 text-sm font-medium transition-colors hover:bg-accent"
          >
            <QrCode className="h-5 w-5" strokeWidth={1.75} />
            Scan QR
          </Link>
          <Link
            href="/shop"
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface py-4 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Store className="h-5 w-5" strokeWidth={1.75} />
            Shop Tags
          </Link>
          <Link
            href="/how-it-works"
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface py-4 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Compass className="h-5 w-5" strokeWidth={1.75} />
            How It Works
          </Link>
        </div>

        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-base font-semibold">Popular tags</h2>
            <Link href="/shop" className="text-sm text-muted hover:text-foreground">
              See all
            </Link>
          </div>
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {popularTags.map(({ label, blurb }) => (
              <Link
                key={label}
                href="/shop"
                className="flex w-44 shrink-0 flex-col gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-accent"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Tag className="h-4.5 w-4.5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="mt-1 text-xs leading-snug text-muted">{blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <Link
            href="/my-tags"
            className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3.5 transition-colors hover:bg-accent"
          >
            <span className="text-sm font-medium">My Tags</span>
            <Tag className="h-4 w-4 text-muted" strokeWidth={1.75} />
          </Link>
          <Link
            href="/my-orders"
            className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3.5 transition-colors hover:bg-accent"
          >
            <span className="text-sm font-medium">My Orders</span>
            <Package className="h-4 w-4 text-muted" strokeWidth={1.75} />
          </Link>
        </section>

        <section className="flex items-start gap-3 rounded-xl bg-secondary px-4 py-4">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-muted" strokeWidth={1.75} />
          <p className="text-sm leading-snug text-secondary-foreground">
            Your number stays private. Anyone who scans your tag can call or message you
            without ever seeing it.
          </p>
        </section>
      </div>
    </div>
  );
}