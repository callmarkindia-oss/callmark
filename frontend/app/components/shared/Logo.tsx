import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="inline-block">
            <Image
                src="/logo.png"
                alt="CallMark"
                width={140}
                height={40}
                priority
                className="h-8 w-auto sm:h-9"
            />
        </Link>
    );
}