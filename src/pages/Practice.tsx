import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { Header } from "@/components/layout/Header";
import { courseColorClasses } from "@/components/layout/CourseSelector";
import { ArrowLeft, ArrowRight, Home, RotateCcw, BookOpen, Layers, Eye, Keyboard } from "lucide-react";
import { getAvailableModules, loadQuestions, shuffleArray, checkAnswer } from "@/utils/questionLoader";
import { Question, UserAnswer, MatchingPairs, CourseColor } from "@/types/quiz";
import { useCourse } from "@/contexts/CourseContext";
import { Badge } from "@/components/ui/badge";

const Practice = () => {
  const navigate = useNavigate();
  const { activeCourse } = useCourse();
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const courseId = activeCourse?.id || "net4009";
  const modules = ["all", ...getAvailableModules(courseId)];
  const courseColors = activeCourse ? courseColorClasses[activeCourse.color as CourseColor] : courseColorClasses.blue;

  useEffect(() => {
    if (isStarted && activeCourse) {
      loadQuestionsForModule(selectedModule);
    }
  }, [selectedModule, isStarted, activeCourse]);

  const loadQuestionsForModule = (module: string) => {
    const allQuestions = loadQuestions(courseId);
    const filtered = module === "all" 
      ? allQuestions 
      : allQuestions.filter(q => q.module === module);
    
    const shuffled = shuffleArray(filtered);
    setQuestions(shuffled);
    setUserAnswers(new Array(shuffled.length).fill(null).map((_, idx) => ({
      questionId: idx,
      selectedAnswers: [],
      isCorrect: false,
    })));
    setCurrentIndex(0);
    setShowFeedback(false);
  };

  const handleStart = () => {
    setIsStarted(true);
    loadQuestionsForModule(selectedModule);
  };

  const handleAnswerChange = (selectedAnswers: string[], matchingAnswers?: MatchingPairs) => {
    const newAnswers = [...userAnswers];
    const isCorrect = checkAnswer(questions[currentIndex], selectedAnswers, matchingAnswers);
    newAnswers[currentIndex] = {
      questionId: currentIndex,
      selectedAnswers,
      matchingAnswers,
      isCorrect,
    };
    setUserAnswers(newAnswers);
    setShowFeedback(false);
  };

  const handleShowAnswer = () => {
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFeedback(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowFeedback(false);
    }
  };

  const handleReset = () => {
    setIsStarted(false);
    setCurrentIndex(0);
    setShowFeedback(false);
  };

  const answeredCount = userAnswers.filter(a => 
    a.selectedAnswers.length > 0 || (a.matchingAnswers && Object.keys(a.matchingAnswers).length > 0)
  ).length;

  // Keyboard navigation
  useEffect(() => {
    if (!isStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStarted, currentIndex, questions.length]);

  if (!activeCourse) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="animate-pulse-soft">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-surface">
        <Header title={`Practice Mode`} subtitle={activeCourse.name}>
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Module Selection Card */}
            <Card variant="elevated" className="p-8 animate-fade-up">
              <div className="flex items-center gap-3 mb-6">
                <div className={`h-12 w-12 rounded-xl ${courseColors.bg} ${courseColors.border} border flex items-center justify-center shadow-elevation-sm`}>
                  <Layers className={`h-6 w-6 ${courseColors.text}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-display">Select Module</h2>
                  <p className="text-muted-foreground">Choose a module to practice</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Module</label>
                  <Select value={selectedModule} onValueChange={setSelectedModule}>
                    <SelectTrigger className="h-12 rounded-xl border-border/50 bg-background/50">
                      <SelectValue placeholder="Select a module" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border bg-popover shadow-elevation-lg">
                      <SelectItem value="all" className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <BookOpen className={`h-4 w-4 ${courseColors.text}`} />
                          <span className="font-medium">All Modules</span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {loadQuestions(courseId).length} questions
                          </Badge>
                        </div>
                      </SelectItem>
                      {modules.slice(1).map((module) => {
                        const count = loadQuestions(courseId).filter(q => q.module === module).length;
                        return (
                          <SelectItem key={module} value={module} className="rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{module}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {count} questions
                              </Badge>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  size="lg" 
                  className={`w-full ${courseColors.bg} ${courseColors.text} border ${courseColors.border} hover:opacity-90 shadow-elevation-sm transition-all duration-300`}
                  onClick={handleStart}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Practice Session
                </Button>
              </div>
            </Card>

            {/* Info Card */}
            <Card variant="glass" className="p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-xl ${courseColors.bg} ${courseColors.border} border flex items-center justify-center flex-shrink-0`}>
                  <Keyboard className={`h-5 w-5 ${courseColors.text}`} />
                </div>
                <div>
                  <h4 className="font-semibold font-display mb-1">Practice Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use ← → arrow keys to navigate questions</li>
                    <li>• Check answers instantly with Show Answer</li>
                    <li>• No time limit - learn at your own pace</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center p-4">
        <Card variant="glass" className="p-8 text-center max-w-md animate-fade-up">
          <p className="text-lg mb-4">No questions available for this module</p>
          <Button onClick={handleReset} className={`${courseColors.bg} ${courseColors.text}`}>Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className={`h-1 w-full ${courseColors.dot}`} />
        <div className="container mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-xl font-bold font-display ${courseColors.text}`}>Practice Mode</h1>
              <p className="text-sm text-muted-foreground">{activeCourse.name}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset} className="rounded-xl">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/")} className="rounded-xl">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>
          </div>
          <ProgressBar
            current={currentIndex}
            total={questions.length}
            answered={answeredCount}
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <QuestionCard
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            userAnswer={userAnswers[currentIndex]}
            onAnswerChange={handleAnswerChange}
            showFeedback={showFeedback}
          />

          <Card variant="elevated" className="p-4">
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="rounded-xl"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-3">
                {!showFeedback && (userAnswers[currentIndex]?.selectedAnswers.length > 0 || 
                  (userAnswers[currentIndex]?.matchingAnswers && Object.keys(userAnswers[currentIndex].matchingAnswers!).length > 0)) && (
                  <Button onClick={handleShowAnswer} variant="secondary" className="rounded-xl">
                    <Eye className="mr-2 h-4 w-4" />
                    Show Answer
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                  className={`rounded-xl ${courseColors.bg} ${courseColors.text} border ${courseColors.border} hover:opacity-90`}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Keyboard className="h-4 w-4" />
            <span>Use arrow keys to navigate</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Practice;
