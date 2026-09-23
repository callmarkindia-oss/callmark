"use client";

import { usePathname } from "next/navigation";
import { Home, Tags, Zap } from "lucide-react";

import BottomBar from "@/app/components/shared/Bottombar";
import BottomBarIcons from "@/app/components/shared/BottombarIcons";

const TabBarItems = [
    {
        title: "Home",
        redirect: "/dashboard/home",
        icon: Home,
    },
    {
        title: "Tags",
        redirect: "/dashboard/tags",
        icon: Tags,
    },
    {
        title: "Activations",
        redirect: "/dashboard/activation",
        icon: Zap,
    },
];

export default function ExploreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const path = usePathname();

    return (
        <main>
            {children}

            <BottomBar>
                {TabBarItems.map((item, idx) => (
                    <BottomBarIcons
                        key={idx}
                        icon={item.icon}
                        title={item.title}
                        redirect={item.redirect}
                        active={
                            path === item.redirect ||
                            path.startsWith(`${item.redirect}/`)
                        }
                    />
                ))}
            </BottomBar>
        </main>
    );
}