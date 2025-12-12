import { useState, useEffect } from "react";
import { Question, MatchingPairs, UserAnswer } from "@/types/quiz";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, ArrowRight, Link2 } from "lucide-react";
import { shuffleArray } from "@/utils/questionLoader";

interface MatchingQuestionProps {
  question: Question;
  questionNumber: number;
  userAnswer?: UserAnswer;
  onMatchingChange: (matchingAnswers: MatchingPairs) => void;
  showFeedback?: boolean;
  disabled?: boolean;
}

export const MatchingQuestion = ({
  question,
  questionNumber,
  userAnswer,
  onMatchingChange,
  showFeedback = false,
  disabled = false,
}: MatchingQuestionProps) => {
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const matchingAnswers = userAnswer?.matchingAnswers || {};
  const pairs = question.pairs || {};
  const correctAnswers = question.correct_answers as MatchingPairs;

  useEffect(() => {
    setShuffledOptions(shuffleArray([...question.options]));
  }, [question.options]);

  const handleMatch = (pairKey: string, option: string) => {
    if (disabled) return;
    
    const newMatching = { ...matchingAnswers };
    if (option === "__clear__") {
      delete newMatching[pairKey];
    } else {
      newMatching[pairKey] = option;
    }
    onMatchingChange(newMatching);
  };

  const isCorrectPair = (pairKey: string) => {
    return matchingAnswers[pairKey] === correctAnswers[pairKey];
  };

  const getUsedOptions = () => {
    return Object.values(matchingAnswers);
  };

  const getPairState = (pairKey: string) => {
    const selectedOption = matchingAnswers[pairKey];
    if (showFeedback) {
      if (isCorrectPair(pairKey)) return "correct";
      if (selectedOption) return "incorrect";
      return "neutral";
    }
    if (selectedOption) return "selected";
    return "default";
  };

  const pairStyles = {
    default: "border-border bg-card hover:border-primary/30",
    selected: "border-primary bg-primary/5 shadow-sm",
    correct: "border-success bg-success/10",
    incorrect: "border-destructive bg-destructive/10",
    neutral: "border-border bg-card",
  };

  const pairKeys = Object.keys(pairs).sort();

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
            className="text-xs flex items-center gap-1.5 bg-accent/10 text-accent border-accent/30"
          >
            <Link2 className="h-3 w-3" />
            Matching
          </Badge>
        </div>
      </div>

      {/* Question content */}
      <div className="p-6 space-y-6">
        <p className="text-base font-medium leading-relaxed whitespace-pre-wrap">
          {question.question}
        </p>

        {/* Matching pairs */}
        <div className="space-y-3">
          {pairKeys.map((pairKey, idx) => {
            const pairDescription = pairs[pairKey];
            const selectedOption = matchingAnswers[pairKey];
            const usedOptions = getUsedOptions();
            const state = getPairState(pairKey);
            
            return (
              <div
                key={pairKey}
                className={`
                  flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl border-2 
                  transition-all duration-200 ease-out
                  ${pairStyles[state]}
                `}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Left side - Label */}
                <div className="flex items-center gap-3 sm:min-w-[200px]">
                  <Badge 
                    variant="outline" 
                    className="h-8 w-8 flex items-center justify-center font-bold bg-background border-primary/30 text-primary"
                  >
                    {pairKey}
                  </Badge>
                  <span className="text-sm font-medium">{pairDescription}</span>
                </div>

                <ArrowRight className="hidden sm:block h-4 w-4 text-muted-foreground flex-shrink-0" />

                {/* Right side - Dropdown */}
                <div className="flex-1 sm:min-w-[250px]">
                  <Select
                    value={selectedOption || ""}
                    onValueChange={(value) => handleMatch(pairKey, value)}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-full rounded-lg border-border/50 bg-background/50 backdrop-blur-sm">
                      <SelectValue placeholder="Select matching option..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border bg-popover shadow-elevation-lg">
                      <SelectItem value="__clear__" className="rounded-lg">
                        <span className="text-muted-foreground italic">Clear selection</span>
                      </SelectItem>
                      {shuffledOptions.map((option, optIdx) => {
                        const isUsedElsewhere = usedOptions.includes(option) && matchingAnswers[pairKey] !== option;
                        return (
                          <SelectItem 
                            key={optIdx} 
                            value={option}
                            disabled={isUsedElsewhere}
                            className={`rounded-lg ${isUsedElsewhere ? "opacity-50" : ""}`}
                          >
                            {option}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Feedback icons */}
                {showFeedback && selectedOption && (
                  isCorrectPair(pairKey) ? (
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 animate-scale-in" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 animate-scale-in" />
                  )
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback panel */}
        {showFeedback && (
          <div
            className={`
              p-4 rounded-xl border-2 animate-fade-up
              ${userAnswer?.isCorrect 
                ? "bg-success/10 border-success/30" 
                : "bg-destructive/10 border-destructive/30"
              }
            `}
          >
            <div className="flex items-center gap-2 mb-3">
              {userAnswer?.isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <p className="font-semibold font-display">
                {userAnswer?.isCorrect ? "Correct!" : "Incorrect"}
              </p>
            </div>
            <div className="text-sm space-y-2">
              <span className="font-medium text-foreground">Correct matches:</span>
              <div className="grid gap-2 mt-2">
                {pairKeys.map((key) => (
                  <div 
                    key={key} 
                    className="flex items-center gap-2 text-muted-foreground bg-background/50 rounded-lg px-3 py-2"
                  >
                    <Badge variant="outline" className="h-6 w-6 flex items-center justify-center text-xs">
                      {key}
                    </Badge>
                    <span className="font-medium text-foreground">{pairs[key]}</span>
                    <ArrowRight className="h-3 w-3 mx-1" />
                    <span>{correctAnswers[key]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
