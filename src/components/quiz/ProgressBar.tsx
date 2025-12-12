import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";

interface ProgressBarProps {
  current: number;
  total: number;
  answered: number;
}

export const ProgressBar = ({ current, total, answered }: ProgressBarProps) => {
  const progress = ((current + 1) / total) * 100;
  const answeredProgress = (answered / total) * 100;

  return (
    <div className="p-4 rounded-xl bg-muted/30 border border-border/50 backdrop-blur-sm">
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              Question {current + 1}
            </span>
            <span className="text-muted-foreground">of {total}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>{answered} answered</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Circle className="h-4 w-4" />
              <span>{total - answered} remaining</span>
            </div>
          </div>
        </div>
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-primary/30 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${answeredProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
