import { useState, useEffect } from "react";
import { Question, UserAnswer, MultiStepSubpart } from "@/types/quiz";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ListOrdered, Calculator } from "lucide-react";

interface MultiStepQuestionProps {
  question: Question;
  questionNumber: number;
  userAnswer?: UserAnswer;
  onAnswerChange: (multiStepAnswers: { [subpartId: string]: string }) => void;
  showFeedback?: boolean;
  disabled?: boolean;
}

export const MultiStepQuestion = ({
  question,
  questionNumber,
  userAnswer,
  onAnswerChange,
  showFeedback = false,
  disabled = false,
}: MultiStepQuestionProps) => {
  const subparts = question.subparts || [];
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  // Initialize answers from userAnswer if available
  useEffect(() => {
    if (userAnswer?.multiStepAnswers) {
      setAnswers(userAnswer.multiStepAnswers);
    }
  }, [userAnswer?.multiStepAnswers]);

  const handleInputChange = (subpartId: string, value: string) => {
    const newAnswers = { ...answers, [subpartId]: value };
    setAnswers(newAnswers);
    onAnswerChange(newAnswers);
  };

  const checkSubpartAnswer = (subpart: MultiStepSubpart, userValue: string): boolean => {
    if (!userValue) return false;
    const normalizedUser = userValue.trim().toLowerCase();
    const normalizedCorrect = subpart.answer.trim().toLowerCase();
    
    // Exact match
    if (normalizedUser === normalizedCorrect) return true;
    
    // Try numeric comparison for numbers
    const userNum = parseFloat(normalizedUser);
    const correctNum = parseFloat(normalizedCorrect);
    if (!isNaN(userNum) && !isNaN(correctNum)) {
      // Allow for small floating point differences (within 1%)
      const tolerance = Math.abs(correctNum) * 0.01 || 0.01;
      return Math.abs(userNum - correctNum) <= tolerance;
    }
    
    return false;
  };

  const getCorrectCount = (): number => {
    return subparts.filter(sp => checkSubpartAnswer(sp, answers[sp.id] || "")).length;
  };

  return (
    <Card variant="elevated" className="overflow-hidden animate-fade-up">
      {/* Question header */}
      <div className="p-6 pb-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge 
            variant="outline" 
            className="text-sm font-semibold bg-background border-primary/30 text-primary"
          >
            Question {questionNumber}
          </Badge>
          <Badge 
            variant="secondary" 
            className="text-xs font-medium"
          >
            {question.points} {question.points === 1 ? "pt" : "pts"}
          </Badge>
          <Badge 
            variant="outline" 
            className="text-xs flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
          >
            <Calculator className="h-3 w-3" />
            Multi-Step ({subparts.length} parts)
          </Badge>
        </div>
      </div>

      {/* Question content */}
      <div className="p-6 space-y-6">
        {/* Question text */}
        <p className="text-base font-medium leading-relaxed whitespace-pre-wrap">
          {question.question}
        </p>

        {/* Subparts */}
        <div className="space-y-4">
          {subparts.map((subpart, idx) => {
            const userValue = answers[subpart.id] || "";
            const isCorrect = showFeedback ? checkSubpartAnswer(subpart, userValue) : null;
            
            return (
              <div 
                key={subpart.id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  showFeedback
                    ? isCorrect
                      ? "border-success bg-success/5"
                      : userValue
                        ? "border-destructive bg-destructive/5"
                        : "border-muted bg-muted/30"
                    : userValue
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-card"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-semibold text-sm">
                    {subpart.id})
                  </div>
                  <div className="flex-1 space-y-3">
                    <Label className="text-sm font-medium leading-relaxed block">
                      {subpart.text}
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="text"
                        value={userValue}
                        onChange={(e) => handleInputChange(subpart.id, e.target.value)}
                        disabled={disabled}
                        placeholder="Enter your answer..."
                        className={`max-w-xs font-mono ${
                          showFeedback
                            ? isCorrect
                              ? "border-success focus:border-success"
                              : userValue
                                ? "border-destructive focus:border-destructive"
                                : ""
                            : ""
                        }`}
                      />
                      {showFeedback && (
                        <>
                          {isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 animate-scale-in" />
                          ) : userValue ? (
                            <XCircle className="h-5 w-5 text-destructive flex-shrink-0 animate-scale-in" />
                          ) : null}
                        </>
                      )}
                    </div>
                    
                    {/* Show explanation when feedback is enabled */}
                    {showFeedback && (
                      <div className={`text-sm p-3 rounded-lg ${
                        isCorrect 
                          ? "bg-success/10 text-success-foreground" 
                          : "bg-muted"
                      }`}>
                        <p>
                          <span className="font-semibold">Correct Answer: </span>
                          <span className="font-mono">{subpart.answer}</span>
                        </p>
                        {subpart.explanation && (
                          <p className="mt-1 text-muted-foreground text-xs">
                            {subpart.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall feedback */}
        {showFeedback && (
          <div
            className={`
              p-4 rounded-xl border-2 animate-fade-up
              ${getCorrectCount() === subparts.length
                ? "bg-success/10 border-success/30" 
                : getCorrectCount() > 0
                  ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                  : "bg-destructive/10 border-destructive/30"
              }
            `}
          >
            <div className="flex items-center gap-2 mb-2">
              {getCorrectCount() === subparts.length ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <ListOrdered className="h-5 w-5 text-muted-foreground" />
              )}
              <p className="font-semibold font-display">
                {getCorrectCount()} of {subparts.length} correct
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Score: {Math.round((getCorrectCount() / subparts.length) * question.points)} / {question.points} points
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};