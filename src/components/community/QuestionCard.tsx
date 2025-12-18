import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ExamQuestion, AnswerVersion } from '@/types/net4007';
import { SolutionCarousel } from './SolutionCarousel';

interface QuestionCardProps {
  question: ExamQuestion;
  solutions: AnswerVersion[];
  onRefresh: () => void;
}

export const CommunityQuestionCard: React.FC<QuestionCardProps> = ({
  question,
  solutions,
  onRefresh,
}) => {
  return (
    <Card variant="glass" className="overflow-hidden animate-fade-up">
      {/* Question header with accent bar */}
      <div className="h-1 bg-course-rose" />
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-course-rose">
          {question.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question prompt - read only */}
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {question.prompt}
          </ReactMarkdown>
        </div>

        <Separator />

        {/* Solutions section */}
        <div>
          <h4 className="text-sm font-semibold mb-4 text-foreground">
            Community Solutions
          </h4>
          <SolutionCarousel
            questionId={question.id}
            solutions={solutions}
            onRefresh={onRefresh}
          />
        </div>
      </CardContent>
    </Card>
  );
};
