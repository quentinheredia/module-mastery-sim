import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Timer, History, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { loadQuestions } from "@/utils/questionLoader";

const Home = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const totalQuestions = loadQuestions().length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              NET4009 Practice Exam
            </h1>
            <p className="text-sm text-muted-foreground">Modules 1-5</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Welcome to Your Exam Prep
            </h2>
            <p className="text-xl text-muted-foreground mb-2">
              {totalQuestions} questions covering Modules 1 through 5
            </p>
            <p className="text-muted-foreground">
              Choose your study mode below to get started
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card
              className="p-8 hover:border-primary transition-all cursor-pointer group"
              onClick={() => navigate("/practice")}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Practice Mode</h3>
                <p className="text-muted-foreground">
                  Study at your own pace with immediate feedback. Filter by
                  module and review correct answers instantly.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Immediate feedback</li>
                  <li>✓ Filter by module</li>
                  <li>✓ No time limit</li>
                  <li>✓ Navigate freely</li>
                </ul>
                <Button size="lg" className="w-full">
                  Start Practice
                </Button>
              </div>
            </Card>

            <Card
              className="p-8 hover:border-primary transition-all cursor-pointer group"
              onClick={() => navigate("/exam")}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Timer className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">Exam Mode</h3>
                <p className="text-muted-foreground">
                  Simulate the real exam experience with 40 random questions and
                  a 30-minute time limit.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ 40 random questions</li>
                  <li>✓ 30-minute timer</li>
                  <li>✓ Performance analytics</li>
                  <li>✓ Module breakdown</li>
                </ul>
                <Button size="lg" className="w-full" variant="default">
                  Start Exam
                </Button>
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-muted/50">
            <Button
              variant="outline"
              className="w-full justify-start"
              size="lg"
              onClick={() => navigate("/history")}
            >
              <History className="mr-2 h-5 w-5" />
              View Attempt History
            </Button>
          </Card>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>All questions are multiple choice with all-or-nothing grading</p>
            <p className="mt-1">
              Module 6 questions are excluded from this simulator
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
