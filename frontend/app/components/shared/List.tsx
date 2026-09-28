"use client";

import { useState } from "react";
import { QrCode, Copy, Share2, RefreshCw, Loader2 } from "lucide-react";
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

const statusText: Record<CodeStatus, string> = {
    active: "text-success",
    expired: "text-danger",
    used: "text-muted",
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
                theme: { color: "#FACC15" },
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

    const iconButton =
        "flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors " +
        "hover:bg-secondary hover:text-foreground";

    return (
        <div className="flex items-center gap-3.5 rounded-2xl bg-surface px-4 py-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <QrCode
                    size={20}
                    strokeWidth={1.75}
                    className={status === "expired" ? "text-muted-light" : "text-primary"}
                />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium leading-tight text-foreground">
                    {name}
                </p>
                <p className="mt-1 flex items-center gap-1.5 truncate text-[13px] leading-tight text-muted">
                    <span className="truncate">{description}</span>
                    <span aria-hidden className="text-muted-light">
                        ·
                    </span>
                    <span className={`shrink-0 font-medium capitalize ${statusText[status]}`}>
                        {status}
                    </span>
                </p>
            </div>

            <div className="flex shrink-0 items-center">
                {showRenew ? (
                    <button
                        type="button"
                        onClick={() => setRenewOpen(true)}
                        className="btn btn-primary h-9 gap-1.5 rounded-full px-4 text-[13px] font-semibold"
                    >
                        <RefreshCw size={14} strokeWidth={2.25} />
                        Renew
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            aria-label="Copy code"
                            onClick={() => onCopy?.(code)}
                            className={iconButton}
                        >
                            <Copy size={17} strokeWidth={1.75} />
                        </button>
                        <button
                            type="button"
                            aria-label="Share"
                            onClick={() => onShare?.(code)}
                            className={iconButton}
                        >
                            <Share2 size={17} strokeWidth={1.75} />
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
                    <div className="flex gap-3 pb-3">
                        <button
                            type="button"
                            onClick={() => setRenewOpen(false)}
                            disabled={processing}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleRenewPayment}
                            disabled={processing}
                            className="btn btn-primary min-w-32 font-semibold"
                        >
                            {processing ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Processing
                                </>
                            ) : (
                                "Pay & Renew"
                            )}
                        </button>
                    </div>
                }
            >
                <div className="space-y-2 pb-6">
                    <p className="text-sm text-muted">
                        Renewing this tag will extend its validity.
                    </p>
                    {error && (
                        <p role="alert" className="text-sm text-danger">
                            {error}
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}