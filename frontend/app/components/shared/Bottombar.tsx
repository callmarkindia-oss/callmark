import Avatar from "./Avatar";

export default function BottomBar({ children }: { children: React.ReactNode }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            <div
                className="
                    mx-auto max-w-md
                    bg-surface/80
                    backdrop-blur-lg
                    border-t border-border
                    shadow-lg
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