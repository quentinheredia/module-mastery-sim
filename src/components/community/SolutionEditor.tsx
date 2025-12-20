import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSessionId } from '@/hooks/useSessionId';
import { AnswerVersion } from '@/types/net4007';

interface SolutionEditorProps {
  questionId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingSolution?: AnswerVersion; // For edit mode
}

const MIN_LENGTH = 50;

export const SolutionEditor: React.FC<SolutionEditorProps> = ({
  questionId,
  isOpen,
  onClose,
  onSuccess,
  existingSolution,
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const sessionId = useSessionId();
  const isEditMode = !!existingSolution;

  // Pre-fill content when editing
  useEffect(() => {
    if (existingSolution) {
      setContent(existingSolution.content);
    } else {
      setContent('');
    }
  }, [existingSolution, isOpen]);

  // Track submissions per session to prevent spam (only for new submissions)
  const submissionKey = `solution_submitted_${questionId}`;
  const hasSubmittedThisSession = sessionStorage.getItem(submissionKey) === 'true';

  const handleSubmit = async () => {
    if (content.length < MIN_LENGTH) {
      toast({
        title: 'Solution too short',
        description: `Please provide at least ${MIN_LENGTH} characters.`,
        variant: 'destructive',
      });
      return;
    }

    if (!isEditMode && hasSubmittedThisSession) {
      toast({
        title: 'Already submitted',
        description: 'You have already submitted a solution for this question in this session.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        // Update existing solution
        const { error } = await supabase
          .from('answer_versions')
          .update({ content: content.trim() })
          .eq('id', existingSolution.id);

        if (error) throw error;
        toast({ title: 'Solution updated!', description: 'Your changes have been saved.' });
      } else {
        // Insert new solution
        const { error } = await supabase.from('answer_versions').insert({
          question_id: questionId,
          content: content.trim(),
          upvotes: 0,
        });

        if (error) throw error;
        sessionStorage.setItem(submissionKey, 'true');
        toast({ title: 'Solution added!', description: 'Your solution has been submitted.' });
      }

      setContent('');
      onSuccess();
      onClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'submit'} solution. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isEditMode) {
      setContent('');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Solution' : 'Add Your Solution'}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Supports Markdown and LaTeX math notation:</p>
            <ul className="list-disc pl-5 text-xs space-y-1">
              <li>Inline math: <code className="bg-muted px-1 rounded">{'$E = mc^2$'}</code></li>
              <li>Block math: <code className="bg-muted px-1 rounded">{'$$\\int_0^\\infty e^{-x} dx$$'}</code></li>
              <li>Bold: <code className="bg-muted px-1 rounded">{'**text**'}</code></li>
              <li>Lists: <code className="bg-muted px-1 rounded">{'- item'}</code> or <code className="bg-muted px-1 rounded">{'1. item'}</code></li>
              <li>Tables: <code className="bg-muted px-1 rounded">{'| Col1 | Col2 |'}</code> with <code className="bg-muted px-1 rounded">{'|---|---|'}</code> separator</li>
            </ul>
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your solution here... Include your reasoning, formulas, and step-by-step explanations."
            className="min-h-[300px] resize-none font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            {content.length} / {MIN_LENGTH} minimum characters
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting} className="border-border text-foreground hover:bg-muted">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || content.length < MIN_LENGTH}
            className="bg-course-rose hover:bg-course-rose/90 text-white"
          >
            {isSubmitting ? (isEditMode ? 'Saving...' : 'Submitting...') : (isEditMode ? 'Save Changes' : 'Submit Solution')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
