"use client";

import { useState } from "react";
import { QrCode, Copy, Share2, RefreshCw } from "lucide-react";
import Modal from "@/app/components/shared/Modal";

type CodeStatus = "active" | "expired" | "used";
type PageContext = "tag" | "activation";

type ListProps = {
    name: string;
    description: string;
    status: CodeStatus;
    code: string;
    page: PageContext;
    onCopy?: (code: string) => void;
    onShare?: (code: string) => void;
};

const statusStyles: Record<CodeStatus, string> = {
    active: "bg-primary/10 text-primary",
    expired: "bg-secondary text-muted",
    used: "bg-accent text-accent-foreground",
};

export default function List({
    name,
    description,
    status,
    code,
    page,
    onCopy,
    onShare,
}: ListProps) {
    const [renewOpen, setRenewOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleRenewPayment = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setRenewOpen(false);
        }, 1200);
    };

    const showRenew = page === "activation" && status === "expired";

    return (
        <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary">
                <QrCode size={20} className="text-foreground" />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                        {name}
                    </p>
                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[status]}`}
                    >
                        {status}
                    </span>
                </div>
                <p className="truncate text-sm text-muted">{description}</p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
                {showRenew ? (
                    <button
                        type="button"
                        onClick={() => setRenewOpen(true)}
                        className="btn btn-primary h-8 gap-1.5 px-2.5 text-xs"
                    >
                        <RefreshCw size={14} strokeWidth={2} />
                        Renew
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            aria-label="Copy code"
                            onClick={() => onCopy?.(code)}
                            className="btn btn-ghost !p-2"
                        >
                            <Copy size={18} />
                        </button>
                        <button
                            type="button"
                            aria-label="Share"
                            onClick={() => onShare?.(code)}
                            className="btn btn-ghost !p-2"
                        >
                            <Share2 size={18} />
                        </button>
                    </>
                )}
            </div>

            <Modal
                open={renewOpen}
                onClose={() => setRenewOpen(false)}
                title="Renew tag"
                description={`Renew "${name}" to reactivate this tag.`}
                footer={
                    <div className="pb-3 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setRenewOpen(false)}
                            className="btn btn-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleRenewPayment}
                            disabled={processing}
                            className="btn btn-primary"
                        >
                            {processing ? "Processing..." : "Pay & Renew"}
                        </button>
                    </div>
                }
            >
                <div className="space-y-2 pb-6">
                    <p className="text-sm text-muted">
                        Renewing this tag will extend its validity. Payment integration
                        is not wired up yet this is a placeholder flow.
                    </p>
                </div>
            </Modal>
        </div>
    );
}