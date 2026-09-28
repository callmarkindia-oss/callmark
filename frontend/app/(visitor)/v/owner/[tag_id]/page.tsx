"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
    Check,
    Loader2,
    MessageCircle,
    MessageSquareText,
    ShieldCheck,
    TriangleAlert,
    User,
} from "lucide-react"

import { APIENDPOINT } from "@/config/Backend"
import { useApiCall } from "@/hooks/useApiCall"
import { ownerInital } from "@/types/visitor_types"
import { RectangularSkelton } from "@/app/components/shared/skelton"

type Channel = "whatsapp" | "sms"
type OwnerState = "loading" | "ready" | "missing"

const MAX_LENGTH = 200
const DEFAULT_MESSAGE = "Someone scanned your tag and would like to contact you."

const quickMessages = [
    "Please contact me when you can.",
    "I found something that belongs to you.",
    "Your vehicle needs attention.",
]

const channelLabel: Record<Channel, string> = {
    whatsapp: "WhatsApp",
    sms: "SMS",
}

export default function VisitorPage() {
    const { tag_id } = useParams()
    const tagID = tag_id?.toString() ?? ""
    const { makeApiCall } = useApiCall()

    const [owner, setOwner] = useState<ownerInital>()
    const [ownerState, setOwnerState] = useState<OwnerState>("loading")

    const [message, setMessage] = useState("")
    const [sending, setSending] = useState<Channel | null>(null)
    const [sentVia, setSentVia] = useState<Channel | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchInitials = async () => {
            try {
                const res = await makeApiCall(
                    "GET",
                    APIENDPOINT.DisplayInitialNameForVisitors(tagID)
                )
                if (res.success) {
                    setOwner(res.data)
                    setOwnerState("ready")
                } else {
                    setOwnerState("missing")
                }
            } catch {
                setOwnerState("missing")
            }
        }
        fetchInitials()
    }, [tagID])

    const ownerName = [owner?.fname, owner?.lname].filter(Boolean).join(" ")
    const initials = `${owner?.fname?.[0] ?? ""}${owner?.lname?.[0] ?? ""}`.toUpperCase()

    const send = async (channel: Channel) => {
        setError(null)
        setSending(channel)

        const endpoint =
            channel === "whatsapp"
                ? APIENDPOINT.CreateVisitorWhatsapp(tagID)
                : APIENDPOINT.CreateVisitorSMS(tagID)

        try {
            const res = await makeApiCall("POST", endpoint, {
                message: message.trim() || DEFAULT_MESSAGE,
            })

            if (res.success) {
                setSentVia(channel)
                setMessage("")
                if (channel === "whatsapp" && typeof res.data?.url === "string") {
                    window.location.assign(res.data.url)
                }
            } else {
                setError("We couldn't send your message. Please try again.")
            }
        } catch {
            setError("Something went wrong. Check your connection and try again.")
        } finally {
            setSending(null)
        }
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="mx-auto flex min-h-screen max-w-md flex-col px-5">
                {ownerState === "missing" ? (
                    <section className="mt-16">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-muted">
                            <TriangleAlert className="h-5 w-5" strokeWidth={1.75} />
                        </span>
                        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
                            This tag isn&apos;t available
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                            The tag may be inactive or the code may have been damaged. Try scanning it again.
                        </p>
                    </section>
                ) : (
                    <>
                        <section className="mt-4">
                            <p className="mt-5 text-sm text-muted">You&apos;re contacting</p>
                            {ownerState === "loading" ? (
                                <div className="mt-1.5">
                                    <RectangularSkelton customStyle="w-40 h-7" />
                                </div>
                            ) : (
                                <h1 className="mt-0.5 text-2xl font-semibold tracking-tight">
                                    {ownerName || "Tag owner"}
                                </h1>
                            )}
                            <p className="mt-2 text-sm leading-relaxed text-muted">
                                Send a quick message. The owner is notified as soon as you send it.
                            </p>
                        </section>

                        {sentVia ? (
                            <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
                                    <Check className="h-5 w-5" strokeWidth={2.25} />
                                </span>
                                <h2 className="mt-4 text-lg font-semibold tracking-tight">Message sent</h2>
                                <p className="mt-1 text-sm leading-relaxed text-muted">
                                    {ownerName || "The owner"} has been notified on {channelLabel[sentVia]}. They&apos;ll get back to you if needed.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSentVia(null)}
                                    className="btn btn-secondary mt-5 h-11 w-full rounded-xl"
                                >
                                    Send another message
                                </button>
                            </section>
                        ) : (
                            <section className="mt-8">
                                <div className="flex items-baseline justify-between">
                                    <label htmlFor="visitor-message" className="text-sm font-medium">
                                        Message <span className="font-normal text-muted">(optional)</span>
                                    </label>
                                    <span className="text-xs tabular-nums text-muted-light">
                                        {message.length}/{MAX_LENGTH}
                                    </span>
                                </div>

                                <textarea
                                    id="visitor-message"
                                    rows={4}
                                    maxLength={MAX_LENGTH}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Hi, I scanned your tag. Please contact me."
                                    className="mt-2 w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-light transition-colors focus:border-primary focus-visible:outline-none"
                                />

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {quickMessages.map((text) => {
                                        const selected = message === text
                                        return (
                                            <button
                                                key={text}
                                                type="button"
                                                onClick={() => setMessage(text)}
                                                aria-pressed={selected}
                                                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${selected
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border text-muted hover:border-primary/50 hover:text-foreground"
                                                    }`}
                                            >
                                                {text}
                                            </button>
                                        )
                                    })}
                                </div>

                                {error && (
                                    <p
                                        role="alert"
                                        className="mt-4 flex items-start gap-2 rounded-xl border border-danger/40 bg-danger/10 px-3.5 py-3 text-sm text-foreground"
                                    >
                                        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" strokeWidth={2} />
                                        {error}
                                    </p>
                                )}

                                <div className="mt-6 flex flex-col gap-3">
                                    <button
                                        type="button"
                                        onClick={() => send("whatsapp")}
                                        disabled={sending !== null || ownerState === "loading"}
                                        className="btn btn-primary h-12 w-full rounded-xl text-[15px] font-semibold"
                                    >
                                        {sending === "whatsapp" ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <MessageCircle className="h-5 w-5" strokeWidth={2} />
                                        )}
                                        Send on WhatsApp
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => send("sms")}
                                        disabled={sending !== null || ownerState === "loading"}
                                        className="btn btn-secondary h-12 w-full rounded-xl border-border text-[15px]"
                                    >
                                        {sending === "sms" ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <MessageSquareText className="h-5 w-5 text-primary" strokeWidth={1.75} />
                                        )}
                                        Send as SMS
                                    </button>
                                </div>
                            </section>
                        )}
                    </>
                )}

                <footer className="pt-8 text-center text-xs text-muted-light">
                    Delivered securely through CallMark
                </footer>
            </div>
        </main>
    )
}