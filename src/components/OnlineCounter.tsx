import { Users } from "lucide-react";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";

export const OnlineCounter = () => {
  const onlineCount = useOnlineUsers();

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm">
      <div className="relative flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <div className="absolute h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
      </div>
      <Users className="h-4 w-4 text-emerald-500" />
      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
        {onlineCount} online
      </span>
    </div>
  );
};
