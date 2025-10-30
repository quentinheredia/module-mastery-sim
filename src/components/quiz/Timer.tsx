import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TimerProps {
  timeRemaining: number;
}

export const Timer = ({ timeRemaining }: TimerProps) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timeRemaining < 300; // Less than 5 minutes

  return (
    <Card className={`p-4 ${isLowTime ? "border-destructive bg-destructive/5" : ""}`}>
      <div className="flex items-center gap-3">
        <Clock className={`h-5 w-5 ${isLowTime ? "text-destructive" : "text-primary"}`} />
        <div>
          <p className="text-sm text-muted-foreground">Time Remaining</p>
          <p className={`text-2xl font-bold tabular-nums ${isLowTime ? "text-destructive" : "text-foreground"}`}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </p>
        </div>
      </div>
    </Card>
  );
};
