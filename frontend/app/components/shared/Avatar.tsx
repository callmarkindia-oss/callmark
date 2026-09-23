import Image from "next/image";

export default function Avatar() {
  return (
    <div
      className="
            bg-accent
            border border-border
            w-12 h-12
            flex items-center justify-center
            rounded-full
            overflow-hidden
          "
    >
      <Image
        src={`https://api.dicebear.com/9.x/lorelei/svg?seed=aromal`}
        alt="avatar"
        height={48}
        width={48}
        className="object-cover"
      />
    </div>
  );
}