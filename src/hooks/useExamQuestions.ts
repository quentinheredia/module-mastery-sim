import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExamQuestion, AnswerVersion } from '@/types/net4007';

export const useExamQuestions = (courseId: string = 'net4007') => {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerVersion[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_questions')
        .select('*')
        .eq('course_id', courseId)
        .order('question_order', { ascending: true });

      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    }
  };

  const fetchAnswers = async () => {
    try {
      const { data, error } = await supabase
        .from('answer_versions')
        .select('*')
        .order('upvotes', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group answers by question_id
      const grouped: Record<string, AnswerVersion[]> = {};
      (data || []).forEach((answer) => {
        if (!grouped[answer.question_id]) {
          grouped[answer.question_id] = [];
        }
        // Limit to 4 solutions per question
        if (grouped[answer.question_id].length < 4) {
          grouped[answer.question_id].push(answer);
        }
      });
      setAnswers(grouped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch answers');
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchQuestions(), fetchAnswers()]);
      setLoading(false);
    };
    load();

    // Subscribe to realtime updates for answers
    const channel = supabase
      .channel('answer_versions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'answer_versions' },
        () => {
          fetchAnswers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [courseId]);

  return { questions, answers, loading, error, refetchAnswers: fetchAnswers };
};
