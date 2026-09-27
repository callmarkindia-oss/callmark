"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
};

const CLOSE_DRAG_THRESHOLD = 120;
const CLOSE_VELOCITY_THRESHOLD = 0.5;

export default function Modal({
    open,
    onClose,
    title,
    description,
    children,
    footer,
}: ModalProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    const [dragY, setDragY] = useState(0);
    const [dragging, setDragging] = useState(false);
    const dragState = useRef({
        startY: 0,
        lastY: 0,
        lastT: 0,
        velocity: 0,
        active: false,
    });

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

    useEffect(() => {
        if (open) setDragY(0);
    }, [open]);

    const handlePointerDown = (e: React.PointerEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest("button, a, input, textarea, select")) return;

        dragState.current = {
            startY: e.clientY,
            lastY: e.clientY,
            lastT: performance.now(),
            velocity: 0,
            active: true,
        };
        setDragging(true);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragState.current.active) return;

        const delta = e.clientY - dragState.current.startY;
        const clamped = Math.max(0, delta);

        const now = performance.now();
        const dt = now - dragState.current.lastT;
        if (dt > 0) {
            dragState.current.velocity = (e.clientY - dragState.current.lastY) / dt;
        }
        dragState.current.lastY = e.clientY;
        dragState.current.lastT = now;

        setDragY(clamped);
    };

    const endDrag = () => {
        if (!dragState.current.active) return;
        dragState.current.active = false;
        setDragging(false);

        const shouldClose =
            dragY > CLOSE_DRAG_THRESHOLD ||
            dragState.current.velocity > CLOSE_VELOCITY_THRESHOLD;

        if (shouldClose) {
            onClose();
        }
        setDragY(0);
    };

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
            style={{
                backgroundColor: dragging
                    ? `rgba(0,0,0,${0.5 * (1 - Math.min(dragY / 300, 1))})`
                    : undefined,
            }}
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
                className="w-full max-w-md rounded-t-2xl border-t border-border bg-surface p-5 shadow-xl sm:rounded-2xl touch-none"
                style={{
                    paddingBottom: "env(safe-area-inset-bottom, 1.25rem)",
                    transform: `translateY(${dragY}px)`,
                    transition: dragging ? "none" : "transform 0.25s ease-out",
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
            >
                <div className="flex items-center justify-center mb-4 cursor-grab active:cursor-grabbing">
                    <div className="bg-muted w-20 h-1 rounded-full" />
                </div>
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
                    </div>
                )}

                <div className="text-sm text-foreground">{children}</div>

                {footer && (
                    <div className="mt-5 flex items-center justify-end gap-2 border-t border-border pt-4 pb-2">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}