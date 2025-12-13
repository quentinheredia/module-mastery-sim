import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bug, CheckCircle2, Calendar } from "lucide-react";
import { Header } from "@/components/layout/Header";

interface BugFix {
  date: string;
  title: string;
  description: string;
  status: "fixed" | "known";
}

const bugFixes: BugFix[] = [
  {
    date: "2024-12-13",
    title: "Fixed matching question correct answers display",
    description: "Fixed an issue where some matching questions showed pair descriptions as correct answers instead of the actual options.",
    status: "fixed",
  },
  {
    date: "2024-12-12",
    title: "Matching questions now allow option reuse",
    description: "Fixed an issue where matching questions with more pairs than options couldn't be completed because options couldn't be selected more than once.",
    status: "fixed",
  },
  {
    date: "2024-12-12",
    title: "Removed duplicate questions from NET4005",
    description: "Removed 11 duplicate or very similar questions across Cloud, SDN, and Crypto modules.",
    status: "fixed",
  },
];

const BugFixes = () => {
  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header title="Bug Fixes & Updates" subtitle="Track recent changes and fixes" />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild className="gap-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {bugFixes.length === 0 ? (
              <Card variant="glass" className="p-8 text-center">
                <Bug className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No bug fixes recorded yet.</p>
              </Card>
            ) : (
              bugFixes.map((fix, index) => (
                <Card
                  key={index}
                  variant="elevated"
                  className="p-6 animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      fix.status === "fixed" 
                        ? "bg-success/10 text-success" 
                        : "bg-warning/10 text-warning"
                    }`}>
                      {fix.status === "fixed" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Bug className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold font-display">{fix.title}</h3>
                        <Badge 
                          variant={fix.status === "fixed" ? "default" : "secondary"}
                          className={fix.status === "fixed" ? "bg-success text-success-foreground" : ""}
                        >
                          {fix.status === "fixed" ? "Fixed" : "Known Issue"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        {fix.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{fix.date}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BugFixes;
