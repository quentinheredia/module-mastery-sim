import { useState, useEffect } from "react";
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
import { Slider } from "@/components/ui/slider";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Timer } from "@/components/quiz/Timer";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { Header } from "@/components/layout/Header";
import { courseColorClasses } from "@/components/layout/CourseSelector";
import { useQuiz } from "@/contexts/QuizContext";
import { useCourse } from "@/contexts/CourseContext";
import {
  AlertCircle, 
  Home, 
  Timer as TimerIcon, 
  FileQuestion, 
  Target,
  ChevronLeft,
  ChevronRight,
  Send,
  Settings2,
  Zap,
  Clock
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MatchingPairs, CourseColor } from "@/types/quiz";
import { Badge } from "@/components/ui/badge";
import { loadQuestions } from "@/utils/questionLoader";

const Exam = () => {
  const navigate = useNavigate();
  const {
    quizState,
    startQuiz,
    answerQuestion,
    submitQuiz,
    resetQuiz,
    goToQuestion,
    examDuration,
  } = useQuiz();
  const { activeCourse } = useCourse();
  const [questionsPerPage, setQuestionsPerPage] = useState<1 | 5 | 10>(1);
  const [customQuestionCount, setCustomQuestionCount] = useState<number>(10);
  const [customDuration, setCustomDuration] = useState<number>(30);

  const courseId = activeCourse?.id || "net4009";
  const totalQuestions = activeCourse ? loadQuestions(activeCourse.id).length : 0;
  const isNet4005 = courseId === "net4005";
  // Default question counts
  const defaultQuestionCount = isNet4005 ? 10 : Math.min(40, totalQuestions);
  const maxQuestions = Math.min(totalQuestions, 50);
  const courseColors = activeCourse ? courseColorClasses[activeCourse.color as CourseColor] : courseColorClasses.blue;

  // Set defaults on course change
  useEffect(() => {
    setCustomQuestionCount(defaultQuestionCount);
    setCustomDuration(30);
  }, [courseId, defaultQuestionCount]);

  const handleStart = () => {
    const currentCourseId = activeCourse?.id || "net4009";
    startQuiz("exam", currentCourseId, undefined, {
      questionCount: customQuestionCount,
      duration: customDuration,
    });
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
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="animate-pulse-soft">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!quizState.isStarted) {
    return (
      <div className="min-h-screen bg-gradient-surface">
        <Header title="Exam Mode" subtitle={activeCourse.name}>
          <Button variant="outline" size="sm" onClick={() => navigate("/")} className="rounded-xl">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Info Alert */}
            <Alert className={`border ${courseColors.border} ${courseColors.bg} animate-fade-up`}>
              <Zap className={`h-4 w-4 ${courseColors.text}`} />
              <AlertDescription className="text-foreground">
                Customize your exam settings below. Default: <span className="font-semibold">{defaultQuestionCount} questions</span> in{" "}
                <span className="font-semibold">30 minutes</span>.
              </AlertDescription>
            </Alert>

            {/* Settings Card */}
            <Card variant="elevated" className="p-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`h-12 w-12 rounded-xl ${courseColors.bg} border ${courseColors.border} flex items-center justify-center shadow-elevation-sm`}>
                  <Settings2 className={`h-6 w-6 ${courseColors.text}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-display">Exam Settings</h2>
                  <p className="text-muted-foreground">Configure your exam experience</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Number of Questions */}
                <div>
                  <label className="text-sm font-medium mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileQuestion className="h-4 w-4" />
                      Number of Questions
                    </span>
                    <span className={`font-bold ${courseColors.text}`}>{customQuestionCount}</span>
                  </label>
                  <Slider
                    value={[customQuestionCount]}
                    onValueChange={(value) => setCustomQuestionCount(value[0])}
                    min={5}
                    max={maxQuestions}
                    step={5}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>5</span>
                    <span>{maxQuestions}</span>
                  </div>
                </div>

                {/* Exam Duration */}
                <div>
                  <label className="text-sm font-medium mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time Limit
                    </span>
                    <span className={`font-bold ${courseColors.text}`}>{customDuration} min</span>
                  </label>
                  <Slider
                    value={[customDuration]}
                    onValueChange={(value) => setCustomDuration(value[0])}
                    min={5}
                    max={120}
                    step={5}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>5 min</span>
                    <span>120 min</span>
                  </div>
                </div>

                {/* Questions per Page */}
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
                    <SelectTrigger className="h-12 rounded-xl border-border/50 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border bg-popover shadow-elevation-lg">
                      <SelectItem value="1" className="rounded-lg">1 question at a time</SelectItem>
                      <SelectItem value="5" className="rounded-lg">5 questions at a time</SelectItem>
                      <SelectItem value="10" className="rounded-lg">10 questions at a time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className={`p-4 rounded-xl ${courseColors.bg} border ${courseColors.border} text-center`}>
                    <FileQuestion className={`h-5 w-5 ${courseColors.text} mx-auto mb-2`} />
                    <p className={`text-2xl font-bold font-display ${courseColors.text}`}>{customQuestionCount}</p>
                    <p className="text-xs text-muted-foreground">Questions</p>
                  </div>
                  <div className={`p-4 rounded-xl ${courseColors.bg} border ${courseColors.border} text-center`}>
                    <TimerIcon className={`h-5 w-5 ${courseColors.text} mx-auto mb-2`} />
                    <p className={`text-2xl font-bold font-display ${courseColors.text}`}>{customDuration}</p>
                    <p className="text-xs text-muted-foreground">Minutes</p>
                  </div>
                  <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center">
                    <Target className="h-5 w-5 text-success mx-auto mb-2" />
                    <p className="text-2xl font-bold font-display text-success">70%</p>
                    <p className="text-xs text-muted-foreground">Passing</p>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className={`w-full ${courseColors.dot} text-white border-transparent hover:opacity-90 shadow-elevation-sm transition-all duration-300`}
                  onClick={handleStart}
                >
                  <Zap className="mr-2 h-5 w-5" />
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
    <div className="min-h-screen bg-gradient-surface">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className={`h-1 w-full ${courseColors.dot}`} />
        <div className="container mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className={`text-xl font-bold font-display ${courseColors.text}`}>Exam in Progress</h1>
              <p className="text-sm text-muted-foreground">{activeCourse.name}</p>
            </div>
            <div className="flex gap-3 items-center flex-wrap">
              <Timer timeRemaining={quizState.timeRemaining} />
              <Button variant="outline" size="sm" onClick={handleExit} className="rounded-xl">
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
          {unansweredCount > 0 && unansweredCount < quizState.questions.length && (
            <Alert variant="destructive" className="animate-fade-up border-warning/30 bg-warning/5 text-foreground">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription>
                You have <span className="font-semibold">{unansweredCount} unanswered question{unansweredCount > 1 ? "s" : ""}</span>
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

          <Card variant="elevated" className="p-4">
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-3">
                {startIdx > 0 && (
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => {
                      const newIdx = Math.max(0, startIdx - questionsPerPage);
                      goToQuestion(newIdx);
                    }}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous Page
                  </Button>
                )}
              </div>

              <div className="flex gap-3 items-center">
                <Badge variant="outline" className={`text-sm px-3 py-1 border ${courseColors.border} ${courseColors.text}`}>
                  {answeredCount} / {quizState.questions.length} answered
                </Badge>
                
                {endIdx < quizState.questions.length && (
                  <Button
                    className={`rounded-xl ${courseColors.dot} text-white border-transparent hover:opacity-90`}
                    onClick={() => {
                      goToQuestion(endIdx);
                    }}
                  >
                    Next Page
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                <Button 
                  onClick={handleSubmit} 
                  size="lg" 
                  className="rounded-xl bg-success hover:bg-success/90 text-white shadow-elevation-sm"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Submit Exam
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Exam;
