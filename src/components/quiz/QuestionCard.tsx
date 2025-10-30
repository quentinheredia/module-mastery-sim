import { Question, UserAnswer } from "@/types/quiz";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  userAnswer?: UserAnswer;
  onAnswerChange: (selectedAnswers: string[]) => void;
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
  const isSingleChoice = question.question_type === "single_choice" || question.question_type === "true_false";
  const selectedAnswers = userAnswer?.selectedAnswers || [];

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
    return question.correct_answers.includes(option);
  };

  const isSelectedOption = (option: string) => {
    return selectedAnswers.includes(option);
  };

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
              <Badge variant="secondary" className="text-xs">
                {isSingleChoice ? "Single Choice" : "Multiple Choice"}
              </Badge>
            </div>
            <p className="text-base font-medium leading-relaxed whitespace-pre-wrap">
              {question.question}
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          {isSingleChoice ? (
            <RadioGroup
              value={selectedAnswers[0] || ""}
              onValueChange={handleSingleChoiceChange}
              disabled={disabled}
            >
              {question.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                    showFeedback
                      ? isCorrectOption(option)
                        ? "border-success bg-success/5"
                        : isSelectedOption(option) && !isCorrectOption(option)
                        ? "border-destructive bg-destructive/5"
                        : "border-border"
                      : isSelectedOption(option)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={option} id={`q${questionNumber}-opt${idx}`} />
                  <Label
                    htmlFor={`q${questionNumber}-opt${idx}`}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    {option}
                  </Label>
                  {showFeedback && isCorrectOption(option) && (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  )}
                  {showFeedback && isSelectedOption(option) && !isCorrectOption(option) && (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                    showFeedback
                      ? isCorrectOption(option)
                        ? "border-success bg-success/5"
                        : isSelectedOption(option) && !isCorrectOption(option)
                        ? "border-destructive bg-destructive/5"
                        : "border-border"
                      : isSelectedOption(option)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Checkbox
                    id={`q${questionNumber}-opt${idx}`}
                    checked={isSelectedOption(option)}
                    onCheckedChange={(checked) =>
                      handleMultipleChoiceChange(option, checked as boolean)
                    }
                    disabled={disabled}
                  />
                  <Label
                    htmlFor={`q${questionNumber}-opt${idx}`}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    {option}
                  </Label>
                  {showFeedback && isCorrectOption(option) && (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  )}
                  {showFeedback && isSelectedOption(option) && !isCorrectOption(option) && (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {showFeedback && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              userAnswer?.isCorrect ? "bg-success/10 border border-success" : "bg-destructive/10 border border-destructive"
            }`}
          >
            <p className="font-semibold mb-2">
              {userAnswer?.isCorrect ? "✓ Correct!" : "✗ Incorrect"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Correct answer{question.correct_answers.length > 1 ? "s" : ""}:</span>{" "}
              {question.correct_answers.join(", ")}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
