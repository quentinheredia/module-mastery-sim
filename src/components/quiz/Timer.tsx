import { Clock, AlertTriangle } from "lucide-react";

interface TimerProps {
  timeRemaining: number;
}

export const Timer = ({ timeRemaining }: TimerProps) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timeRemaining < 300; // Less than 5 minutes
  const isCritical = timeRemaining < 60; // Less than 1 minute

  return (
    <div 
      className={`
        flex items-center gap-3 px-4 py-2 rounded-xl border backdrop-blur-sm transition-all duration-300
        ${isCritical 
          ? "bg-destructive/10 border-destructive/50 animate-pulse-soft" 
          : isLowTime 
            ? "bg-warning/10 border-warning/50" 
            : "bg-muted/50 border-border/50"
        }
      `}
    >
      {isCritical ? (
        <AlertTriangle className="h-5 w-5 text-destructive animate-bounce-soft" />
      ) : (
        <Clock className={`h-5 w-5 ${isLowTime ? "text-warning" : "text-primary"}`} />
      )}
      <div className="flex flex-col">
        <p className="text-xs text-muted-foreground leading-none mb-1">Time Left</p>
        <p 
          className={`
            text-xl font-bold font-display tabular-nums leading-none
            ${isCritical ? "text-destructive" : isLowTime ? "text-warning" : "text-foreground"}
          `}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
};
