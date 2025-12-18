import React from 'react';
import { useExamQuestions } from '@/hooks/useExamQuestions';
import { CommunityQuestionCard } from './QuestionCard';
import { Skeleton } from '@/components/ui/skeleton';

export const CommunityExamDocument: React.FC = () => {
  const { questions, answers, loading, error, refetchAnswers } = useExamQuestions('net4007');

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading exam questions: {error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No exam questions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {questions.map((question, index) => (
        <div
          key={question.id}
          className="animate-fade-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CommunityQuestionCard
            question={question}
            solutions={answers[question.id] || []}
            onRefresh={refetchAnswers}
          />
        </div>
      ))}
    </div>
  );
};
