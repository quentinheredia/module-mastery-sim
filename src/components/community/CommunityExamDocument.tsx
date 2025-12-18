import React from "react";
import { useExamQuestions } from "@/hooks/useExamQuestions";
import { CommunityQuestionCard } from "./QuestionCard";
import { Skeleton } from "@/components/ui/skeleton";

export const CommunityExamDocument: React.FC = () => {
  const { questions, answers, loading, error, refetchAnswers } =
    useExamQuestions("net4007");

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
        <p className="text-destructive">
          Error loading exam questions: {error}
        </p>
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

  const GROUP_LABELS: Record<number, string> = {
    1: "Question 1: VoIP Encoding Selection + Encapsulation Overhead + Concurrency Capacity Assessment (Comprehensive Calculation + Engineering Explanation)",

    2: "Question 2: Predictive Coding/ADPCM Concept + Quantization Error Assessment + Low Bitrate Speech Mechanism (Derivation + Discussion)",

    3: "Question 3: DiffServ QoS Design: Classification/Labeling, PHB, Queue Scheduling (Network Solution Question)",

    4: "Question 4: MPEG and Image: (A) Image Representation and Basic Storage Calculations (Calculation process must be shown)",
    5: 'Question 4: MPEG and Image: (B) Image Compression Format Selection (Photos vs. Graphics: Provide "Selection + Quantization Result + Reasons")',
    6: 'Question 4: MPEG and Image: (C) Audio Compression: Explain your bitrate selection using "perceptual coding" (mechanism + structure)',
    7: 'Question 4: MPEG and Image: (D) Fingerprint Archive: Select "Differential/Transform/Wavelet" and provide a progressive transmission scheme.',
  };

  const grouped = questions.reduce<Record<number, typeof questions>>(
    (acc, q) => {
      const group =
        q.question_order < 700
          ? Math.floor(q.question_order / 100) // 100→1, 200→2, 300→3
          : 7; // 400–700 all belong to Question 4

      if (!acc[group]) acc[group] = [];
      acc[group].push(q);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-14">
      {Object.entries(grouped)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([groupNumber, groupQuestions]) => (
          <div key={groupNumber} className="space-y-6">
            {/* Group Header */}
            <div className="pb-2 border-b border-border/60">
              <h3 className="text-2xl font-bold text-foreground">
                {GROUP_LABELS[Number(groupNumber)] ?? `Question ${groupNumber}`}
              </h3>
            </div>

            {/* Subsections */}
            {groupQuestions
              .sort((a, b) => a.question_order - b.question_order)
              .map((question) => (
                <CommunityQuestionCard
                  key={question.id}
                  question={question}
                  solutions={answers[question.id] || []}
                  onRefresh={refetchAnswers}
                />
              ))}
          </div>
        ))}
    </div>
  );
};
