import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuiz } from "@/contexts/QuizContext";
import { useCourse } from "@/contexts/CourseContext";
import { ArrowLeft, Calendar, Clock, Target } from "lucide-react";

const History = () => {
  const navigate = useNavigate();
  const { getAttemptHistory } = useQuiz();
  const { activeCourse } = useCourse();
  const attempts = getAttemptHistory(activeCourse?.id);

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, label: "Excellent" };
    if (score >= 70) return { variant: "secondary" as const, label: "Pass" };
    if (score >= 60) return { variant: "secondary" as const, label: "Fair" };
    return { variant: "destructive" as const, label: "Needs Improvement" };
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold">Attempt History - {activeCourse?.name}</h1>
          <p className="text-sm text-muted-foreground">Review your past exam attempts</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {attempts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-lg mb-4 text-muted-foreground">No exam attempts yet for {activeCourse?.name}</p>
              <p className="text-sm text-muted-foreground mb-6">
                Take an exam to see your results here
              </p>
              <Button onClick={() => navigate("/exam")}>
                Start Your First Exam
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {[...attempts].reverse().map((attempt) => {
                const badge = getScoreBadge(attempt.score);
                return (
                  <Card key={attempt.id} className="p-6 hover:border-primary transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                          <Badge variant="outline" className="capitalize">
                            {attempt.mode} Mode
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">Date</p>
                              <p className="font-medium">
                                {new Date(attempt.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">Score</p>
                              <p className="font-medium text-lg">
                                {attempt.score.toFixed(1)}%
                              </p>
                            </div>
                          </div>

                          {attempt.timeSpent && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-muted-foreground">Time</p>
                                <p className="font-medium">
                                  {Math.floor(attempt.timeSpent / 60)}:
                                  {String(attempt.timeSpent % 60).padStart(2, "0")}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground mb-2">Module Performance:</p>
                          <div className="flex flex-wrap gap-2">
                            {attempt.moduleBreakdown.map((module, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {module.module.split(" - ")[0]}: {module.percentage.toFixed(0)}%
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default History;
