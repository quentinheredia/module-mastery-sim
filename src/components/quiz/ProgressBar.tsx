import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface ProgressBarProps {
  current: number;
  total: number;
  answered: number;
}

export const ProgressBar = ({ current, total, answered }: ProgressBarProps) => {
  const progress = ((current + 1) / total) * 100;
  const answeredProgress = (answered / total) * 100;

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">
            Question {current + 1} of {total}
          </span>
          <span className="text-muted-foreground">
            {answered} answered
          </span>
        </div>
        <div className="relative">
          <Progress value={progress} className="h-2" />
          <Progress 
            value={answeredProgress} 
            className="h-2 absolute top-0 left-0 opacity-50" 
          />
        </div>
      </div>
    </Card>
  );
};
