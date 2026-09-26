export type CodeStatus = "active" | "expired" | "used";

export type ListProps = {
    name: string;
    description: string;
    status: CodeStatus;
    code: string;
    onCopy?: (code: string) => void;
    onShare?: (code: string) => void;
};
