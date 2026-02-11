import React, { useState } from "react";
import { Scenario } from "@/assets/data/net4011/scenarios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { BookOpen, HelpCircle, Lightbulb, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

interface ScenarioCardProps {
  scenario: Scenario;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <Card variant="glass" className="overflow-hidden animate-fade-up">
      <Accordion type="single" collapsible>
        <AccordionItem value={scenario.id} className="border-b-0">
          <AccordionTrigger className="px-6 py-5 hover:no-underline">
            <div className="flex flex-col items-start text-left gap-1">
              <h3 className="text-lg font-bold font-display">
                {scenario.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {scenario.subtitle}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-6">
              {/* Case Description */}
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">The Case</h4>
                  <p className="text-muted-foreground">
                    {scenario.caseDescription}
                  </p>
                </div>
              </div>

              {/* Questions */}
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold mb-2">The Questions</h4>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    {scenario.questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Key Concepts */}
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold mb-2">
                    Key Textbook Concepts to Include in Your Answer
                  </h4>
                  <div className="space-y-3">
                    {scenario.keyConcepts.map((concept, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-muted/50 border border-border/50 p-3"
                      >
                        <p className="font-medium text-sm mb-1">
                          {concept.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {concept.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Answer Section */}
              {scenario.answer && (
                <div className="pt-2 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="mb-3 gap-2"
                  >
                    {showAnswer ? (
                      <>
                        <EyeOff className="h-4 w-4" /> Hide Answer
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" /> Show Answer
                      </>
                    )}
                  </Button>
                  {showAnswer && (
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 animate-fade-up prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{scenario.answer}</ReactMarkdown>
                    </div>
                  )}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
