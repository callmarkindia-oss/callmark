"use client"

import Link from "next/link";
import {
  Bell,
  QrCode,
  Store,
  Compass,
  Tag,
  Shield,
  Package,
  Car,
  DoorOpen,
  Backpack,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { RectangularSkelton } from "@/app/components/shared/skelton";
import ActivateBanner from "@/app/components/shared/ActivateBanner";

/**
 * Single icon treatment used across the page:
 * 20px icon, 1.75 stroke, inside a 36px circle.
 */
function IconBadge({
  Icon,
  className = "",
}: {
  Icon: LucideIcon;
  className?: string;
}) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary ${className}`}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </span>
  );
}

const popularTags: { label: string; blurb: string; Icon: LucideIcon }[] = [
  {
    label: "Vehicle Tag",
    Icon: Car,
    blurb: "Let people reach you without seeing your number.",
  },
  {
    label: "Door QR",
    Icon: DoorOpen,
    blurb: "For homes, shops and offices — visitors contact you directly.",
  },
  {
    label: "Personal QR",
    Icon: Backpack,
    blurb: "Attach to bags, keys or anything worth returning.",
  },
];

const quickActions: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/scan", label: "Scan QR", Icon: QrCode },
  { href: "/shop", label: "Shop Tags", Icon: Store },
  { href: "/how-it-works", label: "How It Works", Icon: Compass },
];

const shortcuts: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/my-tags", label: "My Tags", Icon: Tag },
  { href: "/my-orders", label: "My Orders", Icon: Package },
];

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 pt-[calc(env(safe-area-inset-top,0px)+1.25rem)] pb-[calc(env(safe-area-inset-bottom,0px)+6rem)] md:gap-8 md:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Good afternoon</p>
            {loading ? (
              <RectangularSkelton customStyle="w-30 h-4" />
            ) : (
              <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                {user?.fname} {user?.lname}
              </h1>
            )}
          </div>
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="btn btn-ghost flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface !p-0 text-primary"
          >
            <Bell className="h-5 w-5" strokeWidth={1.75} />
          </Link>
        </header>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivateBanner />
          </div>

          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:grid-rows-3">
            {quickActions.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface py-4 text-sm font-medium transition-colors hover:bg-accent lg:flex-row lg:justify-start lg:gap-4 lg:px-6 lg:text-base"
              >
                <IconBadge Icon={Icon} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-base font-semibold md:text-lg">Popular tags</h2>
            <Link
              href="/shop"
              className="text-sm font-medium text-primary hover:text-primary-hover"
            >
              See all
            </Link>
          </div>
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
            {popularTags.map(({ label, blurb, Icon }) => (
              <Link
                key={label}
                href="/shop"
                className="flex w-44 shrink-0 flex-col gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-accent md:w-auto md:p-5"
              >
                <IconBadge Icon={Icon} />
                <div>
                  <p className="text-sm font-medium md:text-base">{label}</p>
                  <p className="mt-1 text-xs leading-snug text-muted md:text-sm">
                    {blurb}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          <section className="grid grid-cols-2 gap-3 md:gap-4 lg:col-span-2">
            {shortcuts.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5 transition-colors hover:bg-accent md:px-5 md:py-5"
              >
                <IconBadge Icon={Icon} />
                <span className="text-sm font-medium md:text-base">{label}</span>
              </Link>
            ))}
          </section>

          <section className="flex items-start gap-3 rounded-xl border border-border bg-secondary px-4 py-4 md:px-5">
            <IconBadge Icon={Shield} className="bg-surface" />
            <p className="text-sm leading-snug text-secondary-foreground">
              Your number stays private. Anyone who scans your tag can call or
              message you without ever seeing it.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}