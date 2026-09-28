import Avatar from "./Avatar";

export default function BottomBar({ children }: { children: React.ReactNode }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            <div
                className="
                    mx-auto max-w-md
                    bg-surface/90
                    backdrop-blur-lg
                    border-t border-border
                    shadow-[0_-4px_20px_rgba(11,18,32,0.08)]
                    rounded-tr-3xl
                    rounded-tl-3xl
                    px-6 py-3
                "
            >
                <div className="flex items-center justify-between">
                    {children}
                    <Avatar />
                </div>
            </div>
        </div>
    );
}