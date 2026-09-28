"use client";

import { useState } from "react";
import { QrCode, Copy, Share2, RefreshCw } from "lucide-react";
import Modal from "@/app/components/shared/Modal";
import { APIENDPOINT } from "@/config/Backend";
import { useApiCall } from "@/hooks/useApiCall";
import { useRazorpayScript } from "@/hooks/useRazorpayScript";

type CodeStatus = "active" | "expired" | "used";
type PageContext = "tag" | "activation";

type ListProps = {
    tagId: string;
    name: string;
    description: string;
    status: CodeStatus;
    code: string;
    page: PageContext;
    onCopy?: (code: string) => void;
    onShare?: (code: string) => void;
    onRenewed?: (tagId: string, expiryAt: string) => void;
};

const statusStyles: Record<CodeStatus, string> = {
    active: "bg-success/15 text-[#178A38]",
    expired: "bg-danger/10 text-danger",
    used: "bg-accent text-accent-foreground",
};

export default function List({
    tagId,
    name,
    description,
    status,
    code,
    page,
    onCopy,
    onShare,
    onRenewed,
}: ListProps) {
    const [renewOpen, setRenewOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { makeApiCall } = useApiCall();
    const razorpayReady = useRazorpayScript();

    const showRenew = page === "activation" && status === "expired";

    const handleRenewPayment = async () => {
        if (!razorpayReady) {
            setError("Payment gateway is still loading, try again in a moment.");
            return;
        }

        setError(null);
        setProcessing(true);

        try {
            const orderRes = await makeApiCall(
                "POST",
                APIENDPOINT.CreateRenewalOrder(tagId)
            );

            if (!orderRes.success) {
                setError("Could not start payment. Try again.");
                setProcessing(false);
                return;
            }

            const { order_id, amount, currency, key_id } = orderRes.data;

            const rzp = new window.Razorpay({
                key: key_id,
                order_id,
                amount,
                currency,
                name: "Tag renewal",
                description: `Renew "${name}"`,
                handler: async (paymentResult: {
                    razorpay_order_id: string;
                    razorpay_payment_id: string;
                    razorpay_signature: string;
                }) => {
                    try {
                        const verifyRes = await makeApiCall(
                            "POST",
                            APIENDPOINT.VerifyRenewalPayment(tagId),
                            {
                                tag_id: tagId,
                                razorpay_order_id: paymentResult.razorpay_order_id,
                                razorpay_payment_id: paymentResult.razorpay_payment_id,
                                razorpay_signature: paymentResult.razorpay_signature,
                            }
                        );

                        if (!verifyRes.success) {
                            setError("Payment verification failed. Contact support if you were charged.");
                            setProcessing(false);
                            return;
                        }

                        onRenewed?.(tagId, verifyRes.data.expiry_at);
                        setRenewOpen(false);
                    } catch {
                        setError("Payment verification failed. Contact support if you were charged.");
                    } finally {
                        setProcessing(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setProcessing(false);
                    },
                },
                theme: { color: "#0A5CFF" },
            });

            rzp.on("payment.failed", () => {
                setError("Payment failed. Please try again.");
                setProcessing(false);
            });

            rzp.open();
        } catch {
            setError("Could not start payment. Try again.");
            setProcessing(false);
        }
    };

    return (
        <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary">
                <QrCode size={20} className="text-primary" />
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
                            className="btn btn-ghost !p-2 text-muted hover:text-accent-foreground"
                        >
                            <Copy size={18} />
                        </button>
                        <button
                            type="button"
                            aria-label="Share"
                            onClick={() => onShare?.(code)}
                            className="btn btn-ghost !p-2 text-muted hover:text-accent-foreground"
                        >
                            <Share2 size={18} />
                        </button>
                    </>
                )}
            </div>

            <Modal
                open={renewOpen}
                onClose={() => {
                    if (!processing) setRenewOpen(false);
                }}
                title="Renew tag"
                description={`Renew "${name}" to reactivate this tag.`}
                footer={
                    <div className="pb-3 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setRenewOpen(false)}
                            disabled={processing}
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
                        Renewing this tag will extend its validity
                    </p>
                    {error && <p className="text-sm text-danger">{error}</p>}
                </div>
            </Modal>
        </div>
    );
}