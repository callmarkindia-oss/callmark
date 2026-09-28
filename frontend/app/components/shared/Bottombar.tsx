import Avatar from "./Avatar";

export default function BottomBar({ children }: { children: React.ReactNode }) {
    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 md:bottom-4 md:px-4">
            <div
                className="
                pointer-events-auto mx-auto w-full max-w-md
                rounded-t-3xl border-t border-border
                bg-surface/90 backdrop-blur-lg
                px-6 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)]
                shadow-[0_-4px_20px_rgba(11,18,32,0.08)]
                md:max-w-xl md:rounded-full md:border md:px-8 md:py-3
                md:shadow-[0_8px_30px_rgba(11,18,32,0.18)]
                lg:max-w-2xl
                "
            >
                <div className="flex items-center justify-between gap-4">
                    {children}
                    <Avatar />
                </div>
            </div>
        </div>
    );
}