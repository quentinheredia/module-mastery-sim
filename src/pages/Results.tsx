import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreBreakdown } from "@/components/quiz/ScoreBreakdown";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { useQuiz } from "@/contexts/QuizContext";
import { useCourse } from "@/contexts/CourseContext";
import { courseColorClasses } from "@/components/layout/CourseSelector";
import { Home, RotateCcw, History, Clock, Calendar, FileQuestion, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { CourseColor } from "@/types/quiz";

const Results = () => {
  const navigate = useNavigate();
  const { currentAttempt, resetQuiz } = useQuiz();
  const { courses } = useCourse();
  
  const attemptCourse = currentAttempt?.courseId 
    ? courses.find(c => c.id === currentAttempt.courseId)
    : null;
  const courseName = attemptCourse?.name || currentAttempt?.courseId?.toUpperCase() || "Unknown";
  const courseColors = attemptCourse 
    ? courseColorClasses[attemptCourse.color as CourseColor] 
    : courseColorClasses.blue;

  if (!currentAttempt) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
        <Card variant="glass" className="p-8 text-center max-w-md animate-fade-up">
          <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium mb-2">No Results Available</p>
          <p className="text-muted-foreground mb-6">Complete an exam to see your results here.</p>
          <Button onClick={() => navigate("/")} className="bg-primary text-white hover:bg-primary/90">
            Go Home
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Card>
      </div>
    );
  }

  const handleNewExam = () => {
    resetQuiz();
    navigate("/exam");
  };

  const handleHome = () => {
    resetQuiz();
    navigate("/");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header title="Exam Results" subtitle={courseName}>
        <Button variant="outline" size="sm" onClick={() => navigate("/history")} className="hidden sm:flex rounded-xl">
          <History className="mr-2 h-4 w-4" />
          History
        </Button>
      </Header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Score Breakdown */}
          <div className="animate-fade-up">
            <ScoreBreakdown
              moduleBreakdown={currentAttempt.moduleBreakdown}
              overallScore={currentAttempt.score}
              totalQuestions={currentAttempt.totalQuestions}
            />
          </div>

          {/* Action Buttons */}
          <Card variant="elevated" className="p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                onClick={handleNewExam}
                className={`flex-1 ${courseColors.dot} text-white border-transparent hover:opacity-90 shadow-elevation-sm`}
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Take Another Exam
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/practice")}
                className={`flex-1 rounded-xl ${courseColors.hover} transition-colors`}
              >
                Practice Mode
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleHome}
                className={`flex-1 rounded-xl ${courseColors.hover} transition-colors`}
              >
                <Home className="mr-2 h-5 w-5" />
                Home
              </Button>
            </div>
          </Card>

          {/* Tabs for Details */}
          <Tabs defaultValue="overview" className="w-full animate-fade-up" style={{ animationDelay: "300ms" }}>
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl">
              <TabsTrigger 
                value="overview" 
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="review"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Review Answers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card variant="elevated" className="p-6">
                <h3 className="text-lg font-semibold font-display mb-6">Exam Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium">Date</span>
                    </div>
                    <p className="font-semibold">
                      {new Date(currentAttempt.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(currentAttempt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-medium">Duration</span>
                    </div>
                    <p className="font-semibold">
                      {currentAttempt.timeSpent ? formatTime(currentAttempt.timeSpent) : 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">Time spent</p>
                  </div>

                  <div className={`p-4 rounded-xl ${courseColors.bg} border ${courseColors.border}`}>
                    <div className={`flex items-center gap-2 ${courseColors.text} mb-2`}>
                      <FileQuestion className="h-4 w-4" />
                      <span className="text-xs font-medium">Questions</span>
                    </div>
                    <p className={`font-semibold ${courseColors.text}`}>{currentAttempt.totalQuestions}</p>
                    <p className="text-xs text-muted-foreground">Total questions</p>
                  </div>

                  <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                    <div className="flex items-center gap-2 text-success mb-2">
                      <span className="text-xs font-medium">Correct</span>
                    </div>
                    <p className="font-semibold text-success">
                      {Math.round((currentAttempt.score / 100) * currentAttempt.totalQuestions)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      of {currentAttempt.totalQuestions}
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="review" className="space-y-6 mt-6">
              {currentAttempt.questions.map((question, idx) => (
                <QuestionCard
                  key={idx}
                  question={question}
                  questionNumber={idx + 1}
                  userAnswer={currentAttempt.answers[idx]}
                  onAnswerChange={() => {}}
                  showFeedback={true}
                  disabled={true}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Results;
