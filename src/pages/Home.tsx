import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Timer, History, Sparkles, Zap, CheckCircle2 } from "lucide-react";
import { loadQuestions } from "@/utils/questionLoader";
import { useCourse } from "@/contexts/CourseContext";
import { Header } from "@/components/layout/Header";
import { courseColorClasses } from "@/components/layout/CourseSelector";
import { CourseColor } from "@/types/quiz";

const Home = () => {
  const navigate = useNavigate();
  const { activeCourse } = useCourse();
  
  const totalQuestions = activeCourse ? loadQuestions(activeCourse.id).length : 0;
  const examQuestionCount = Math.min(40, totalQuestions);
  const courseColors = activeCourse ? courseColorClasses[activeCourse.color as CourseColor] : courseColorClasses.blue;

  if (!activeCourse) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-soft">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header 
        title={`${activeCourse.name} Practice Exam`}
        subtitle={activeCourse.description}
      />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-up">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${courseColors.bg} ${courseColors.text} text-sm font-medium mb-6 border ${courseColors.border}`}>
              <div className={`h-2 w-2 rounded-full ${courseColors.dot}`} />
              <span>{totalQuestions} questions across {activeCourse.modules.length} modules</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Welcome to Your{" "}
              <span className="text-gradient-primary">Exam Prep</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your study mode below to master the material
            </p>
          </div>

          {/* Mode Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Practice Mode Card */}
            <Card
              variant="interactive"
              glow="primary"
              className="p-8 group relative overflow-hidden border-primary/10 animate-fade-up"
              style={{ animationDelay: "100ms" }}
              onClick={() => navigate("/practice")}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-elevation-md group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold font-display">Practice Mode</h3>
                <p className="text-muted-foreground">
                  Study at your own pace with immediate feedback. Filter by
                  module and review correct answers instantly.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 w-full">
                  {["Immediate feedback", "Filter by module", "No time limit", "Navigate freely"].map((item) => (
                    <li key={item} className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="w-full mt-4 bg-gradient-primary hover:opacity-90 transition-opacity shadow-elevation-sm group-hover:shadow-glow-primary">
                  Start Practice
                </Button>
              </div>
            </Card>

            {/* Exam Mode Card */}
            <Card
              variant="interactive"
              glow="accent"
              className="p-8 group relative overflow-hidden border-accent/10 animate-fade-up"
              style={{ animationDelay: "200ms" }}
              onClick={() => navigate("/exam")}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-elevation-md group-hover:scale-110 transition-transform duration-300">
                  <Timer className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold font-display">Exam Mode</h3>
                <p className="text-muted-foreground">
                  Simulate the real exam experience with {examQuestionCount} random questions and
                  a 30-minute time limit.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 w-full">
                  {[`${examQuestionCount} random questions`, "30-minute timer", "Performance analytics", "Module breakdown"].map((item) => (
                    <li key={item} className="flex items-center justify-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="w-full mt-4 bg-gradient-accent hover:opacity-90 transition-opacity shadow-elevation-sm group-hover:shadow-glow-accent">
                  Start Exam
                </Button>
              </div>
            </Card>
          </div>

          {/* History Card */}
          <Card 
            variant="glass" 
            className="p-6 animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <Button
              variant="outline"
              className="w-full justify-start group"
              size="lg"
              onClick={() => navigate("/history")}
            >
              <History className="mr-2 h-5 w-5 group-hover:rotate-[-20deg] transition-transform" />
              View Attempt History
            </Button>
          </Card>

          {/* Footer info */}
          <div className="mt-12 text-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "400ms" }}>
            <p className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-primary/50" />
              All questions include single choice, multiple choice, and matching types
            </p>
            <p className="mt-2">
              Switch courses using the dropdown in the header
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
