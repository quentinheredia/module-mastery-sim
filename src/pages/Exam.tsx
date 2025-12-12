import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Timer } from "@/components/quiz/Timer";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { useQuiz } from "@/contexts/QuizContext";
import { useCourse } from "@/contexts/CourseContext";
import { AlertCircle, Home } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MatchingPairs } from "@/types/quiz";

const Exam = () => {
  const navigate = useNavigate();
  const {
    quizState,
    startQuiz,
    answerQuestion,
    submitQuiz,
    resetQuiz,
    goToQuestion,
  } = useQuiz();
  const { activeCourse } = useCourse();
  const [questionsPerPage, setQuestionsPerPage] = useState<1 | 5 | 10>(1);

  const courseId = activeCourse?.id || "net4009";

  const handleStart = () => {
    startQuiz("exam", courseId);
  };

  const handleAnswerChange = (
    questionIndex: number,
    selectedAnswers: string[],
    matchingAnswers?: MatchingPairs
  ) => {
    answerQuestion(questionIndex, selectedAnswers, matchingAnswers);
  };

  const handleSubmit = () => {
    if (
      window.confirm(
        "Are you sure you want to submit your exam? You cannot change answers after submission."
      )
    ) {
      submitQuiz(courseId);
      navigate("/results");
    }
  };

  const handleExit = () => {
    if (
      window.confirm(
        "Are you sure you want to exit? Your progress will be lost."
      )
    ) {
      resetQuiz();
      navigate("/");
    }
  };

  const answeredCount = quizState.userAnswers.filter(
    (a) => a.selectedAnswers.length > 0 || (a.matchingAnswers && Object.keys(a.matchingAnswers).length > 0)
  ).length;
  const unansweredCount = quizState.questions.length - answeredCount;

  if (!activeCourse) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!quizState.isStarted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-2"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold">Exam Mode - {activeCourse.name}</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This exam will consist of 40 randomly selected questions from{" "}
                {activeCourse.name}. You will have 30 minutes to complete it. Questions
                include single choice, multiple choice, and matching types.
              </AlertDescription>
            </Alert>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Exam Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Questions per Page
                  </label>
                  <Select
                    value={String(questionsPerPage)}
                    onValueChange={(value) =>
                      setQuestionsPerPage(Number(value) as 1 | 5 | 10)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 question at a time</SelectItem>
                      <SelectItem value="5">5 questions at a time</SelectItem>
                      <SelectItem value="10">10 questions at a time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Questions:
                    </span>
                    <span className="font-semibold">40</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Limit:</span>
                    <span className="font-semibold">30 minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Passing Score:
                    </span>
                    <span className="font-semibold">70%</span>
                  </div>
                </div>

                <Button size="lg" className="w-full mt-6" onClick={handleStart}>
                  Start Exam
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const startIdx =
    Math.floor(quizState.currentQuestionIndex / questionsPerPage) *
    questionsPerPage;
  const endIdx = Math.min(
    startIdx + questionsPerPage,
    quizState.questions.length
  );
  const currentPageQuestions = quizState.questions.slice(startIdx, endIdx);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <h1 className="text-xl font-bold">Exam in Progress - {activeCourse.name}</h1>
            <div className="flex gap-3 flex-wrap">
              <Timer timeRemaining={quizState.timeRemaining} />
              <Button variant="outline" size="sm" onClick={handleExit}>
                <Home className="mr-2 h-4 w-4" />
                Exit
              </Button>
            </div>
          </div>
          <ProgressBar
            current={quizState.currentQuestionIndex}
            total={quizState.questions.length}
            answered={answeredCount}
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {unansweredCount > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have {unansweredCount} unanswered question
                {unansweredCount > 1 ? "s" : ""}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {currentPageQuestions.map((question, idx) => {
              const questionIndex = startIdx + idx;
              return (
                <QuestionCard
                  key={questionIndex}
                  question={question}
                  questionNumber={questionIndex + 1}
                  userAnswer={quizState.userAnswers[questionIndex]}
                  onAnswerChange={(answers, matching) =>
                    handleAnswerChange(questionIndex, answers, matching)
                  }
                  showFeedback={false}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex gap-3">
              {startIdx > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const newIdx = Math.max(0, startIdx - questionsPerPage);
                    goToQuestion(newIdx);
                  }}
                >
                  Previous Page
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              {endIdx < quizState.questions.length && (
                <Button
                  onClick={() => {
                    goToQuestion(endIdx);
                  }}
                >
                  Next Page
                </Button>
              )}
              <Button onClick={handleSubmit} size="lg" variant="default">
                Submit Exam
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Exam;
