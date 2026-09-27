

export const RoundSkelton = ({ customStyle }: { customStyle?: string }) => {
    return (
        <div
            className={`
                rounded-full
                bg-accent
                animate-pulse
                ${customStyle}`}
        />
    )
}

export const RectangularSkelton = ({ customStyle }: { customStyle: string }) => {
    return (
        <div
            className={`
                rounded-md
                bg-accent
                animate-pulse
                ${customStyle}
            `}
        />
    )
}