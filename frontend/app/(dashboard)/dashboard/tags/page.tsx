"use client"

import List from "@/app/components/shared/List";
import { ArrowLeft } from "lucide-react";


export default function Tags() {
    return (
        <section className="p-4">

            <div className="flex gap-1 items-center">
                <ArrowLeft size={18} />
                <h3>Tags</h3>
            </div>
            <div className="pt-4 space-y-4">
                <List
                    name="Welcome Offer"
                    description="10% off for new members"
                    status="active"
                    code="WELCOME10"
                    onCopy={(code) => navigator.clipboard.writeText(code)}
                    onShare={(code) => navigator.share?.({ text: code })}
                />
                <List
                    name="Welcome Offer"
                    description="10% off for new members"
                    status="active"
                    code="WELCOME10"
                    onCopy={(code) => navigator.clipboard.writeText(code)}
                    onShare={(code) => navigator.share?.({ text: code })}
                />
            </div>
        </section>
    )
}