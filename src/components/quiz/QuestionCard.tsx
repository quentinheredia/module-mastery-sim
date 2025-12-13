import { Question, UserAnswer, MatchingPairs } from "@/types/quiz";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, CircleDot, SquareCheck } from "lucide-react";
import { MatchingQuestion } from "./MatchingQuestion";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  userAnswer?: UserAnswer;
  onAnswerChange: (selectedAnswers: string[], matchingAnswers?: MatchingPairs) => void;
  showFeedback?: boolean;
  disabled?: boolean;
}

export const QuestionCard = ({
  question,
  questionNumber,
  userAnswer,
  onAnswerChange,
  showFeedback = false,
  disabled = false,
}: QuestionCardProps) => {
  // Handle matching questions with dedicated component
  if (question.question_type === "matching") {
    return (
      <MatchingQuestion
        question={question}
        questionNumber={questionNumber}
        userAnswer={userAnswer}
        onMatchingChange={(matchingAnswers) => onAnswerChange([], matchingAnswers)}
        showFeedback={showFeedback}
        disabled={disabled}
      />
    );
  }

  const isSingleChoice = question.question_type === "single_choice" || question.question_type === "true_false" || question.question_type === "multiple_choice";
  const selectedAnswers = userAnswer?.selectedAnswers || [];
  const correctAnswers = question.correct_answers as string[];

  const resolveImageSrc = (imagePath: string) => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    if (imagePath.startsWith(import.meta.env.BASE_URL)) {
      return imagePath;
    }
    const cleanPath = imagePath.replace(/^\//, '');
    return import.meta.env.BASE_URL + cleanPath;
  };

  const handleSingleChoiceChange = (value: string) => {
    if (!disabled) {
      onAnswerChange([value]);
    }
  };

  const handleMultipleChoiceChange = (option: string, checked: boolean) => {
    if (!disabled) {
      if (checked) {
        onAnswerChange([...selectedAnswers, option]);
      } else {
        onAnswerChange(selectedAnswers.filter(a => a !== option));
      }
    }
  };

  const isCorrectOption = (option: string) => {
    return correctAnswers.includes(option);
  };

  const isSelectedOption = (option: string) => {
    return selectedAnswers.includes(option);
  };

  const getOptionState = (option: string) => {
    if (showFeedback) {
      if (isCorrectOption(option)) return "correct";
      if (isSelectedOption(option) && !isCorrectOption(option)) return "incorrect";
      return "neutral";
    }
    if (isSelectedOption(option)) return "selected";
    return "default";
  };

  const optionStyles = {
    default: "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
    selected: "border-primary bg-primary/5 shadow-sm",
    correct: "border-success bg-success/10",
    incorrect: "border-destructive bg-destructive/10",
    neutral: "border-border bg-card",
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
            className="text-xs flex items-center gap-1.5 bg-background"
          >
            {isSingleChoice ? (
              <>
                <CircleDot className="h-3 w-3" />
                Single Choice
              </>
            ) : (
              <>
                <SquareCheck className="h-3 w-3" />
                Multiple Choice
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Question content */}
      <div className="p-6 space-y-6">
        {/* Images if present */}
        {(question.image || question.image2) && (
          <div className="space-y-4">
            {question.image && (
              <div className="rounded-xl overflow-hidden border border-border/50 shadow-elevation-sm">
                <img 
                  src={resolveImageSrc(question.image)} 
                  alt="Question diagram" 
                  className="w-full h-auto"
                  onError={(e) => {
                    console.error('Failed to load image:', e.currentTarget.src);
                  }}
                />
              </div>
            )}
            {question.image2 && (
              <div className="rounded-xl overflow-hidden border border-border/50 shadow-elevation-sm">
                <img 
                  src={resolveImageSrc(question.image2)} 
                  alt="Question diagram 2" 
                  className="w-full h-auto"
                  onError={(e) => {
                    console.error('Failed to load image2:', e.currentTarget.src);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Question text */}
        <p className="text-base font-medium leading-relaxed whitespace-pre-wrap">
          {question.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {isSingleChoice ? (
            <RadioGroup
              value={selectedAnswers[0] || ""}
              onValueChange={handleSingleChoiceChange}
              disabled={disabled}
              className="space-y-3"
            >
              {question.options.map((option, idx) => {
                const state = getOptionState(option);
                return (
                  <div
                    key={idx}
                    className={`
                      flex items-center space-x-4 p-4 rounded-xl border-2 
                      transition-all duration-200 ease-out
                      ${optionStyles[state]}
                      ${!disabled && !showFeedback ? "cursor-pointer" : ""}
                    `}
                    onClick={() => !disabled && !showFeedback && handleSingleChoiceChange(option)}
                  >
                    <RadioGroupItem 
                      value={option} 
                      id={`q${questionNumber}-opt${idx}`}
                      className="border-2"
                    />
                    <Label
                      htmlFor={`q${questionNumber}-opt${idx}`}
                      className="flex-1 cursor-pointer font-normal leading-relaxed"
                    >
                      {option}
                    </Label>
                    {showFeedback && isCorrectOption(option) && (
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 animate-scale-in" />
                    )}
                    {showFeedback && isSelectedOption(option) && !isCorrectOption(option) && (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0 animate-scale-in" />
                    )}
                  </div>
                );
              })}
            </RadioGroup>
          ) : (
            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const state = getOptionState(option);
                return (
                  <div
                    key={idx}
                    className={`
                      flex items-center space-x-4 p-4 rounded-xl border-2 
                      transition-all duration-200 ease-out
                      ${optionStyles[state]}
                      ${!disabled && !showFeedback ? "cursor-pointer" : ""}
                    `}
                    onClick={() => !disabled && !showFeedback && handleMultipleChoiceChange(option, !isSelectedOption(option))}
                  >
                    <Checkbox
                      id={`q${questionNumber}-opt${idx}`}
                      checked={isSelectedOption(option)}
                      onCheckedChange={(checked) =>
                        handleMultipleChoiceChange(option, checked as boolean)
                      }
                      disabled={disabled}
                      className="border-2"
                    />
                    <Label
                      htmlFor={`q${questionNumber}-opt${idx}`}
                      className="flex-1 cursor-pointer font-normal leading-relaxed"
                    >
                      {option}
                    </Label>
                    {showFeedback && isCorrectOption(option) && (
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 animate-scale-in" />
                    )}
                    {showFeedback && isSelectedOption(option) && !isCorrectOption(option) && (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0 animate-scale-in" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
            <div className="flex items-center gap-2 mb-2">
              {userAnswer?.isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <p className="font-semibold font-display">
                {userAnswer?.isCorrect ? "Correct!" : "Incorrect"}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                Correct answer{correctAnswers.length > 1 ? "s" : ""}:
              </span>{" "}
              {correctAnswers.join(", ")}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
