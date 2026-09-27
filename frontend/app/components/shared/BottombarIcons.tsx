import { TabIconType } from "@/types/CommonTypes";
import Link from "next/link";

export default function BottomBarIcons({ icon, title, redirect, active }: TabIconType) {
    const Icon = icon;

    return (
        <Link
            href={redirect}
            className="flex flex-col items-center justify-center space-y-1"
        >
            <Icon
                size={24}
                className={active ? "text-primary" : "text-muted"}
            />

            <span
                className={`text-xs ${active
                    ? "text-primary font-medium"
                    : "text-muted"
                    }`}
            >
                {title}
            </span>
        </Link>
    );
}