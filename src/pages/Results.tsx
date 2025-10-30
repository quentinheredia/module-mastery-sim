import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreBreakdown } from "@/components/quiz/ScoreBreakdown";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { useQuiz } from "@/contexts/QuizContext";
import { Home, RotateCcw, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Results = () => {
  const navigate = useNavigate();
  const { currentAttempt, resetQuiz } = useQuiz();

  if (!currentAttempt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg mb-4">No exam results to display</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Exam Results</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/history")}>
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
              <Button variant="outline" onClick={handleHome}>
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <ScoreBreakdown
            moduleBreakdown={currentAttempt.moduleBreakdown}
            overallScore={currentAttempt.score}
            totalQuestions={currentAttempt.totalQuestions}
          />

          <Card className="p-6">
            <div className="flex gap-3 flex-wrap">
              <Button size="lg" onClick={handleNewExam}>
                <RotateCcw className="mr-2 h-5 w-5" />
                Take Another Exam
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/practice")}>
                Practice Mode
              </Button>
            </div>
          </Card>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="review">Review Answers</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Exam Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(currentAttempt.date).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time Spent</p>
                    <p className="font-medium">
                      {currentAttempt.timeSpent ? 
                        `${Math.floor(currentAttempt.timeSpent / 60)}:${String(currentAttempt.timeSpent % 60).padStart(2, '0')}` 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Questions</p>
                    <p className="font-medium">{currentAttempt.totalQuestions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Correct</p>
                    <p className="font-medium">
                      {Math.round((currentAttempt.score / 100) * currentAttempt.totalQuestions)}
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
