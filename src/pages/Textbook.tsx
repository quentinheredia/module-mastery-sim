import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";

import { Math } from "@/components/math/Math";
import {
  NET4001_TEXTBOOK_CHAPTERS,
  type TextbookQuestion,
} from "@/assets/data/net4001/textbookQuestions";

const Textbook = () => {
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>(
    {}
  );

  const toggleSolution = (id: string) => {
    setOpenSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalQuestions = useMemo(
    () =>
      NET4001_TEXTBOOK_CHAPTERS.reduce(
        (acc, ch) => acc + ch.questions.length,
        0
      ),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header
        title="Textbook Questions"
        subtitle={`Recommended practice problems (Ch. 6–8) • ${totalQuestions} questions`}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="mb-2">
            <Button variant="ghost" asChild className="gap-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Chapters collapse by default */}
          <Accordion type="multiple" className="w-full">
            {NET4001_TEXTBOOK_CHAPTERS.map((ch) => (
              <AccordionItem key={ch.id} value={`chapter-${ch.id}`}>
                <Card className="p-0 overflow-hidden">
                  <AccordionTrigger className="px-4 py-4 text-left hover:no-underline">
                    <div className="flex items-start justify-between gap-3 w-full">
                      <div>
                        <h2 className="text-lg font-semibold">{ch.title}</h2>
                        {ch.subtitle ? (
                          <p className="text-sm text-muted-foreground mt-1">
                            {ch.subtitle}
                          </p>
                        ) : null}
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {ch.questions.length} question
                        {ch.questions.length === 1 ? "" : "s"}
                      </Badge>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pb-4">
                    {/* Questions collapse by default */}
                    <Accordion type="multiple" className="w-full">
                      {ch.questions.map((q) => (
                        <AccordionItem key={q.id} value={`q-${q.id}`}>
                          <AccordionTrigger className="text-left">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">
                                  #{q.exercise} — {q.title}
                                </span>
                                {q.tags.slice(0, 3).map((t) => (
                                  <Badge key={t} variant="outline">
                                    {t}
                                  </Badge>
                                ))}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {q.sourceNote}
                              </div>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent>
                            <QuestionBlock
                              q={q}
                              solutionOpen={!!openSolutions[q.id]}
                              onToggleSolution={() => toggleSolution(q.id)}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
    </div>
  );
};

function QuestionBlock({
  q,
  solutionOpen,
  onToggleSolution,
}: {
  q: TextbookQuestion;
  solutionOpen: boolean;
  onToggleSolution: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-background/60 p-3">
        <div className="text-xs text-muted-foreground mb-2">Question</div>
        <p className="text-sm whitespace-pre-wrap">{q.prompt}</p>

        {q.latex ? (
          <div className="mt-3 rounded-md border p-3">
            <div className="text-xs text-muted-foreground mb-2">Math</div>
            <Math latex={q.latex} block />
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {q.tags.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={onToggleSolution}>
          {solutionOpen ? "Hide solution" : "Show solution"}
        </Button>
      </div>

      {solutionOpen ? (
        <div className="rounded-lg border p-3">
          <div className="text-xs text-muted-foreground mb-2">Solution</div>
          {q.solution ? (
            <p className="text-sm whitespace-pre-wrap">{q.solution}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No solution added yet (placeholder). We can add them later and
              keep the same UI.
            </p>
          )}
        </div>
      ) : null}

      <Separator />
    </div>
  );
}

export default Textbook;
