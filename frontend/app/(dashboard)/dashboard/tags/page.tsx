"use client";

import List from "@/app/components/shared/List";
import Modal from "@/app/components/shared/Modal";
import { RectangularSkelton } from "@/app/components/shared/skelton";
import { APIENDPOINT } from "@/config/Backend";
import { useApiCall } from "@/hooks/useApiCall";
import { TagType } from "@/types/tag_types";
import { ArrowLeft, Car, Check, DoorOpen, Plus, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

const tagTypes = [
    {
        value: "Vehicle",
        label: "Vehicle Tag",
        description: "For cars and bikes",
        icon: Car,
    },
    {
        value: "Home",
        label: "Door QR",
        description: "For homes, shops and offices",
        icon: DoorOpen,
    },
    {
        value: "Personal",
        label: "Personal QR",
        description: "For bags, keys and belongings",
        icon: UserRound,
    },
] as const;

type TagTypeValue = (typeof tagTypes)[number]["value"];

export default function Tags() {
    const [tags, setTags] = useState<TagType[]>([]);
    const [loading, setLoading] = useState(true);
    const { makeApiCall } = useApiCall();

    const [createOpen, setCreateOpen] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedType, setSelectedType] = useState<TagTypeValue | null>(null);
    const [identifier, setIdentifier] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchTags = async () => {
            setLoading(true);
            try {
                const res = await makeApiCall(
                    "GET",
                    APIENDPOINT.GetAllTags
                );

                if (res.success) {
                    setTags(res.data ?? []);
                }
            } catch (error) {
                console.error("Failed to fetch tags:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    const resetCreateFlow = () => {
        setStep(1);
        setSelectedType(null);
        setIdentifier("");
    };

    const closeModal = () => {
        setCreateOpen(false);
        resetCreateFlow();
    };

    const handleCreateTag = async () => {
        if (!selectedType || !identifier.trim()) return;

        setSubmitting(true);
        try {
            const res = await makeApiCall("POST", APIENDPOINT.CreateTag, {
                tag_type: selectedType,
                identifier: identifier.trim(),
            });

            if (res.success) {
                setTags((prev) => [...prev, res.data]);
                closeModal();
            }
        } catch (error) {
            console.error("Failed to create tag:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <ArrowLeft size={18} />
                    <h3 className="text-base font-semibold">Tags</h3>
                </div>

                {!loading && tags.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        className="btn btn-primary h-9 gap-1.5 px-3 text-xs"
                    >
                        <Plus size={15} strokeWidth={2} />
                        Create Tag
                    </button>
                )}
            </div>

            <div className="space-y-4 pt-4">
                {loading ? (
                    <>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <RectangularSkelton
                                key={i}
                                customStyle="h-16 w-full rounded-xl"
                            />
                        ))}
                    </>
                ) : tags.length > 0 ? (
                    tags.map((tag) => (
                        <List
                            key={tag.tag_token}
                            name={tag.identifier}
                            description={tag.tag_type}
                            status={tag.is_active ? "active" : "expired"}
                            code={tag.tag_token}
                        />
                    ))
                ) : (
                    <div className="flex h-[70dvh] flex-col items-center justify-center gap-4 text-center">
                        <div className="space-y-1">
                            <p className="text-lg font-medium">No tags yet</p>
                            <p className="max-w-64 text-sm text-muted">
                                Create your first tag to start receiving calls and messages
                                without sharing your number.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setCreateOpen(true)}
                            className="btn btn-primary gap-1.5"
                        >
                            <Plus size={16} strokeWidth={2} />
                            Create Tag
                        </button>
                    </div>
                )}
            </div>

            <Modal
                open={createOpen}
                onClose={closeModal}
                title={step === 1 ? "Choose tag type" : "Name your tag"}
                description={
                    step === 1
                        ? "What are you attaching this tag to?"
                        : "Give it a name so you can recognize it later."
                }
                footer={
                    step === 2 ? (
                        <div className="pb-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="btn btn-outline"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateTag}
                                disabled={!identifier.trim() || submitting}
                                className="btn btn-primary"
                            >
                                {submitting ? "Creating..." : "Create Tag"}
                            </button>
                        </div>
                    ) : undefined
                }
            >
                {step === 1 ? (
                    <div className="space-y-2 pb-6">
                        {tagTypes.map(({ value, label, description, icon: Icon }) => {
                            const isSelected = selectedType === value;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => {
                                        setSelectedType(value);
                                        setStep(2);
                                    }}
                                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${isSelected
                                        ? "border-primary bg-accent"
                                        : "border-border hover:bg-accent"
                                        }`}
                                >
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                        <Icon size={18} strokeWidth={1.75} />
                                    </span>
                                    <span className="flex-1">
                                        <span className="block text-sm font-medium text-foreground">
                                            {label}
                                        </span>
                                        <span className="block text-xs text-muted">
                                            {description}
                                        </span>
                                    </span>
                                    {isSelected && (
                                        <Check size={16} className="shrink-0 text-primary" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label
                            htmlFor="tag-identifier"
                            className="block text-sm font-medium text-foreground"
                        >
                            Tag identifier
                        </label>
                        <input
                            id="tag-identifier"
                            type="text"
                            autoFocus
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="e.g. My Honda Activa"
                            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <p className="text-xs text-muted">
                            This is just for you — it won't be shown to anyone who scans the tag.
                        </p>
                    </div>
                )}
            </Modal>
        </section>
    );
}