"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
};

export default function Modal({
    open,
    onClose,
    title,
    description,
    children,
    footer,
}: ModalProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;

        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            role="presentation"
        >
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
                className="w-full max-w-md rounded-t-2xl border border-border bg-surface p-5 shadow-xl sm:rounded-2xl"
                style={{ paddingBottom: "env(safe-area-inset-bottom, 1.25rem)" }}
            >
                {(title || description) && (
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                            {title && (
                                <h2
                                    id="modal-title"
                                    className="text-base font-semibold text-foreground"
                                >
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p className="mt-1 text-sm text-muted">{description}</p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="btn btn-ghost h-8 w-8 shrink-0 !p-0 rounded-full"
                        >
                            <X size={16} strokeWidth={1.75} />
                        </button>
                    </div>
                )}

                <div className="text-sm text-foreground">{children}</div>

                {footer && (
                    <div className="mt-5 flex items-center justify-end gap-2 border-t border-border pt-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}