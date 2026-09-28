"use client";

import List from "@/app/components/shared/List";
import { RectangularSkelton } from "@/app/components/shared/skelton";
import { APIENDPOINT } from "@/config/Backend";
import { useApiCall } from "@/hooks/useApiCall";
import { TagType } from "@/types/tag_types";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function Activations() {
    const [tags, setTags] = useState<TagType[]>([]);
    const [loading, setLoading] = useState(true);
    const { makeApiCall } = useApiCall();

    useEffect(() => {
        const fetchInactiveTags = async () => {
            setLoading(true);
            try {
                const res = await makeApiCall(
                    "GET",
                    APIENDPOINT.GetAllTags + "?mode=false"
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

        fetchInactiveTags();
    }, []);

    return (
        <section className="p-4">
            <div className="flex items-center gap-1">
                <ArrowLeft size={18} />
                <h3 className="text-base font-semibold">Activations</h3>
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
                            status="expired"
                            page="activation"
                            code={tag.tag_token}
                            tagId={tag.id}
                        />
                    ))
                ) : (
                    <div className="flex h-[70dvh] flex-col items-center justify-center gap-4 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
                            <RefreshCw size={18} className="text-muted" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-medium">Nothing to activate</p>
                            <p className="max-w-64 text-sm text-muted">
                                All your tags are currently active. Expired tags needing
                                renewal will show up here.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}