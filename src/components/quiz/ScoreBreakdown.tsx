import { useEffect, useState } from "react";
import { ModulePerformance } from "@/types/quiz";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Trophy, Target, TrendingUp, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";

interface ScoreBreakdownProps {
  moduleBreakdown: ModulePerformance[];
  overallScore: number;
  totalQuestions: number;
}

export const ScoreBreakdown = ({ moduleBreakdown, overallScore, totalQuestions }: ScoreBreakdownProps) => {
  const [animatedProgress, setAnimatedProgress] = useState<number[]>([]);
  const correctCount = Math.round((overallScore / 100) * totalQuestions);

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  const getPerformanceBg = (percentage: number) => {
    if (percentage >= 80) return "bg-success/10 border-success/20";
    if (percentage >= 60) return "bg-warning/10 border-warning/20";
    return "bg-destructive/10 border-destructive/20";
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 80) return { label: "Excellent", icon: Trophy, variant: "default" as const };
    if (percentage >= 60) return { label: "Good", icon: Target, variant: "secondary" as const };
    return { label: "Review", icon: AlertCircle, variant: "destructive" as const };
  };

  const getGradeLabel = (score: number) => {
    if (score >= 90) return { grade: "A", message: "Outstanding Performance!" };
    if (score >= 80) return { grade: "B", message: "Great Job!" };
    if (score >= 70) return { grade: "C", message: "Good Effort!" };
    if (score >= 60) return { grade: "D", message: "Keep Practicing!" };
    return { grade: "F", message: "More Study Needed" };
  };

  const gradeInfo = getGradeLabel(overallScore);

  // Animate module progress bars
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(moduleBreakdown.map(m => m.percentage));
    }, 300);
    return () => clearTimeout(timer);
  }, [moduleBreakdown]);

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card variant="glass" className="p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Circular Progress */}
          <div className="flex-shrink-0">
            <CircularProgress 
              value={overallScore} 
              size={160} 
              strokeWidth={12}
              label="Score"
            />
          </div>

          {/* Score Details */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <Badge 
                  variant="outline" 
                  className={`text-lg px-4 py-1 font-bold ${getPerformanceColor(overallScore)} border-current`}
                >
                  Grade: {gradeInfo.grade}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold font-display">{gradeInfo.message}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto md:mx-0">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-success/10 border border-success/20">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div>
                  <p className="text-2xl font-bold text-success">{correctCount}</p>
                  <p className="text-xs text-muted-foreground">Correct</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-destructive">{totalQuestions - correctCount}</p>
                  <p className="text-xs text-muted-foreground">Incorrect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Module Performance */}
      <Card variant="elevated" className="p-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-display">Performance by Module</h3>
            <p className="text-sm text-muted-foreground">Detailed breakdown of your results</p>
          </div>
        </div>

        <div className="space-y-4">
          {moduleBreakdown.map((module, idx) => {
            const badge = getPerformanceBadge(module.percentage);
            const BadgeIcon = badge.icon;
            
            return (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border transition-all duration-300 animate-fade-up ${getPerformanceBg(module.percentage)}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{module.module}</p>
                    <p className="text-sm text-muted-foreground">
                      {module.correct} / {module.total} questions correct
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={badge.variant} className="text-xs flex items-center gap-1">
                      <BadgeIcon className="h-3 w-3" />
                      {badge.label}
                    </Badge>
                    <span className={`text-xl font-bold font-display ${getPerformanceColor(module.percentage)}`}>
                      {module.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <Progress 
                  value={animatedProgress[idx] || 0} 
                  className="h-2"
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recommendations */}
      <Card variant="glass" className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h4 className="font-semibold font-display">Study Recommendations</h4>
            <p className="text-sm text-muted-foreground">Focus areas for improvement</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {moduleBreakdown
            .filter(m => m.percentage < 70)
            .map((module, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20"
              >
                <AlertCircle className="h-4 w-4 text-warning flex-shrink-0" />
                <span className="text-sm">
                  Review <span className="font-medium">{module.module}</span>
                  <span className="text-muted-foreground"> — {module.percentage.toFixed(0)}% score</span>
                </span>
              </div>
            ))}
          {moduleBreakdown.every(m => m.percentage >= 70) && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
              <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
              <span className="text-sm">Great job! Keep practicing to maintain your knowledge.</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
