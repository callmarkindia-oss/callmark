"use client";

import { QrCode, Copy, Share2 } from "lucide-react";

type CodeStatus = "active" | "expired" | "used";

type ListProps = {
    name: string;
    description: string;
    status: CodeStatus;
    code: string;
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
    onCopy,
    onShare,
}: ListProps) {
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
            </div>
        </div>
    );
}