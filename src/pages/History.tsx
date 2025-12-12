import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuiz } from "@/contexts/QuizContext";
import { useCourse } from "@/contexts/CourseContext";
import { courseColorClasses } from "@/components/layout/CourseSelector";
import { Header } from "@/components/layout/Header";
import { CourseColor } from "@/types/quiz";
import { Home, Calendar, Clock, Target, FileQuestion, Trophy, TrendingDown } from "lucide-react";

const History = () => {
  const navigate = useNavigate();
  const { getAttemptHistory } = useQuiz();
  const { activeCourse, courses } = useCourse();
  const attempts = getAttemptHistory(activeCourse?.id);
  const courseColors = activeCourse ? courseColorClasses[activeCourse.color as CourseColor] : courseColorClasses.blue;

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, label: "Excellent", icon: Trophy };
    if (score >= 70) return { variant: "secondary" as const, label: "Pass", icon: Target };
    if (score >= 60) return { variant: "secondary" as const, label: "Fair", icon: Target };
    return { variant: "destructive" as const, label: "Needs Work", icon: TrendingDown };
  };

  const getCourseColors = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? courseColorClasses[course.color as CourseColor] : courseColorClasses.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header title="Attempt History" subtitle={activeCourse?.name}>
        <Button variant="outline" size="sm" onClick={() => navigate("/")} className="rounded-xl">
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </Header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {attempts.length === 0 ? (
            <Card variant="glass" className="p-12 text-center animate-fade-up">
              <div className={`h-16 w-16 rounded-2xl ${courseColors.bg} border ${courseColors.border} flex items-center justify-center mx-auto mb-4`}>
                <FileQuestion className={`h-8 w-8 ${courseColors.text}`} />
              </div>
              <p className="text-lg font-semibold font-display mb-2">No Exam Attempts Yet</p>
              <p className="text-muted-foreground mb-6">
                Take an exam to see your results here
              </p>
              <Button 
                onClick={() => navigate("/exam")}
                className={`${courseColors.dot} text-white border-transparent hover:opacity-90`}
              >
                Start Your First Exam
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Stats Summary */}
              <Card variant="glass" className="p-6 animate-fade-up">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className={`text-3xl font-bold font-display ${courseColors.text}`}>{attempts.length}</p>
                    <p className="text-sm text-muted-foreground">Total Attempts</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold font-display text-success">
                      {Math.round(attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold font-display text-primary">
                      {Math.max(...attempts.map(a => a.score)).toFixed(0)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Best Score</p>
                  </div>
                </div>
              </Card>

              {/* Attempt Cards */}
              {[...attempts].reverse().map((attempt, index) => {
                const badge = getScoreBadge(attempt.score);
                const BadgeIcon = badge.icon;
                const attemptCourseColors = getCourseColors(attempt.courseId);
                const attemptCourse = courses.find(c => c.id === attempt.courseId);
                
                return (
                  <Card 
                    key={attempt.id} 
                    variant="elevated" 
                    className={`p-6 transition-all duration-300 animate-fade-up cursor-pointer ${attemptCourseColors.hover}`}
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <div className={`h-10 w-10 rounded-xl ${attemptCourseColors.bg} border ${attemptCourseColors.border} flex items-center justify-center`}>
                            <BadgeIcon className={`h-5 w-5 ${badge.variant === 'destructive' ? 'text-destructive' : attemptCourseColors.text}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold font-display ${attemptCourseColors.text}`}>
                                {attemptCourse?.name || attempt.courseId}
                              </span>
                              <Badge variant={badge.variant} className="text-xs">
                                {badge.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground capitalize">{attempt.mode} Mode</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Date</p>
                              <p className="font-medium text-sm">
                                {new Date(attempt.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className={`flex items-center gap-3 p-3 rounded-lg ${attemptCourseColors.bg} border ${attemptCourseColors.border}`}>
                            <Target className={`h-4 w-4 ${attemptCourseColors.text}`} />
                            <div>
                              <p className="text-xs text-muted-foreground">Score</p>
                              <p className={`font-bold text-lg font-display ${attemptCourseColors.text}`}>
                                {attempt.score.toFixed(1)}%
                              </p>
                            </div>
                          </div>

                          {attempt.timeSpent && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Time</p>
                                <p className="font-medium text-sm">
                                  {Math.floor(attempt.timeSpent / 60)}:{String(attempt.timeSpent % 60).padStart(2, "0")}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-4">
                          <p className="text-xs text-muted-foreground mb-2">Module Performance</p>
                          <div className="flex flex-wrap gap-2">
                            {attempt.moduleBreakdown.map((module, idx) => {
                              const moduleScore = module.percentage;
                              const scoreColor = moduleScore >= 80 ? 'text-success' : moduleScore >= 60 ? 'text-warning' : 'text-destructive';
                              return (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {module.module.split(" - ")[0]}: <span className={`font-semibold ${scoreColor}`}>{module.percentage.toFixed(0)}%</span>
                                </Badge>
                              );
                            })}
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
