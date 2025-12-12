import { useState, useEffect } from "react";
import { Question, MatchingPairs, UserAnswer } from "@/types/quiz";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
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
    // Shuffle options once on mount
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

  const pairKeys = Object.keys(pairs).sort();

  return (
    <Card className="p-6 border-2">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="outline" className="text-sm">
                Question {questionNumber}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {question.points} {question.points === 1 ? "point" : "points"}
              </Badge>
              <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20">
                Matching
              </Badge>
            </div>
            <p className="text-base font-medium leading-relaxed whitespace-pre-wrap mb-6">
              {question.question}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {pairKeys.map((pairKey) => {
            const pairDescription = pairs[pairKey];
            const selectedOption = matchingAnswers[pairKey];
            const usedOptions = getUsedOptions();
            
            return (
              <div
                key={pairKey}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${
                  showFeedback
                    ? isCorrectPair(pairKey)
                      ? "border-success bg-success/5"
                      : selectedOption
                      ? "border-destructive bg-destructive/5"
                      : "border-border"
                    : selectedOption
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                {/* Left side - Label */}
                <div className="flex items-center gap-3 min-w-[200px]">
                  <Badge variant="outline" className="h-8 w-8 flex items-center justify-center font-bold">
                    {pairKey}
                  </Badge>
                  <span className="text-sm font-medium">{pairDescription}</span>
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                {/* Right side - Dropdown */}
                <div className="flex-1 min-w-[250px]">
                  <Select
                    value={selectedOption || ""}
                    onValueChange={(value) => handleMatch(pairKey, value)}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select matching option..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__clear__">
                        <span className="text-muted-foreground">Clear selection</span>
                      </SelectItem>
                      {shuffledOptions.map((option, idx) => {
                        const isUsedElsewhere = usedOptions.includes(option) && matchingAnswers[pairKey] !== option;
                        return (
                          <SelectItem 
                            key={idx} 
                            value={option}
                            disabled={isUsedElsewhere}
                            className={isUsedElsewhere ? "opacity-50" : ""}
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
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  )
                )}
              </div>
            );
          })}
        </div>

        {showFeedback && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              userAnswer?.isCorrect
                ? "bg-success/10 border border-success"
                : "bg-destructive/10 border border-destructive"
            }`}
          >
            <p className="font-semibold mb-2">
              {userAnswer?.isCorrect ? "✓ Correct!" : "✗ Incorrect"}
            </p>
            <div className="text-sm space-y-1">
              <span className="font-medium">Correct matches:</span>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {pairKeys.map((key) => (
                  <li key={key}>
                    <span className="font-medium">{key}. {pairs[key]}</span>
                    {" → "}
                    <span>{correctAnswers[key]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
