import { ModulePerformance } from "@/types/quiz";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ScoreBreakdownProps {
  moduleBreakdown: ModulePerformance[];
  overallScore: number;
  totalQuestions: number;
}

export const ScoreBreakdown = ({ moduleBreakdown, overallScore, totalQuestions }: ScoreBreakdownProps) => {
  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 80) return { label: "Excellent", variant: "default" as const };
    if (percentage >= 60) return { label: "Good", variant: "secondary" as const };
    return { label: "Needs Review", variant: "destructive" as const };
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-2 border-primary">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
          <p className="text-5xl font-bold text-primary mb-2">
            {overallScore.toFixed(1)}%
          </p>
          <p className="text-muted-foreground">
            {Math.round((overallScore / 100) * totalQuestions)} out of {totalQuestions} correct
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance by Module</h3>
        <div className="space-y-4">
          {moduleBreakdown.map((module, idx) => {
            const badge = getPerformanceBadge(module.percentage);
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{module.module}</p>
                    <p className="text-xs text-muted-foreground">
                      {module.correct} / {module.total} correct
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={badge.variant} className="text-xs">
                      {badge.label}
                    </Badge>
                    <span className={`text-lg font-bold ${getPerformanceColor(module.percentage)}`}>
                      {module.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <Progress value={module.percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 bg-muted">
        <h4 className="font-semibold mb-2">Recommendations</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {moduleBreakdown
            .filter(m => m.percentage < 70)
            .map((module, idx) => (
              <li key={idx}>
                • Review {module.module} - Score: {module.percentage.toFixed(0)}%
              </li>
            ))}
          {moduleBreakdown.every(m => m.percentage >= 70) && (
            <li>• Great job! Keep practicing to maintain your knowledge.</li>
          )}
        </ul>
      </Card>
    </div>
  );
};
