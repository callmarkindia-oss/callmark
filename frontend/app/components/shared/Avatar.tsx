import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { RoundSkelton } from "./skelton";


export default function Avatar() {

  const { user, loading } = useAuth();

  return (
    loading ? (
      <RoundSkelton customStyle="w-12 h-12" />
    ) : (
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
          src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${user?.fname}`}
          alt="avatar"
          height={48}
          width={48}
          className="object-cover"
        />
      </div>
    )
  );
}