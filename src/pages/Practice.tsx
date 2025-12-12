import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { ArrowLeft, ArrowRight, Home, RotateCcw } from "lucide-react";
import { getAvailableModules, loadQuestions, shuffleArray, checkAnswer } from "@/utils/questionLoader";
import { Question, UserAnswer, MatchingPairs } from "@/types/quiz";
import { useCourse } from "@/contexts/CourseContext";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold">Practice Mode - {activeCourse.name}</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Select Study Module</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Module</label>
                  <Select value={selectedModule} onValueChange={setSelectedModule}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      {modules.slice(1).map((module) => (
                        <SelectItem key={module} value={module}>
                          {module}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button size="lg" className="w-full" onClick={handleStart}>
                  Start Practice Session
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg mb-4">No questions available for this module</p>
          <Button onClick={handleReset}>Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Practice Mode - {activeCourse.name}</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
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

          <div className="flex flex-wrap gap-3 justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-3">
              {!showFeedback && (userAnswers[currentIndex]?.selectedAnswers.length > 0 || 
                (userAnswers[currentIndex]?.matchingAnswers && Object.keys(userAnswers[currentIndex].matchingAnswers!).length > 0)) && (
                <Button onClick={handleShowAnswer} variant="secondary">
                  Show Answer
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Use keyboard: ← Previous | → Next
          </div>
        </div>
      </main>
    </div>
  );
};

export default Practice;
