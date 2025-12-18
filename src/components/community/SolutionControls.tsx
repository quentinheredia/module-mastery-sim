import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSessionId } from '@/hooks/useSessionId';
import { AnswerVersion } from '@/types/net4007';
import { useToast } from '@/hooks/use-toast';

interface SolutionControlsProps {
  solution: AnswerVersion;
  onAddSolution: () => void;
  onVoteSuccess: () => void;
}

export const SolutionControls: React.FC<SolutionControlsProps> = ({
  solution,
  onAddSolution,
  onVoteSuccess,
}) => {
  const sessionId = useSessionId();
  const { toast } = useToast();
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const checkVote = async () => {
      if (!sessionId) return;
      const { data } = await supabase
        .from('answer_votes')
        .select('id')
        .eq('answer_id', solution.id)
        .eq('session_id', sessionId)
        .maybeSingle();
      setHasVoted(!!data);
    };
    checkVote();
  }, [solution.id, sessionId]);

  const handleUpvote = async () => {
    if (hasVoted || isVoting || !sessionId) return;

    setIsVoting(true);
    try {
      // Record the vote
      const { error: voteError } = await supabase
        .from('answer_votes')
        .insert({ answer_id: solution.id, session_id: sessionId });

      if (voteError) {
        if (voteError.code === '23505') {
          toast({ title: 'Already voted', description: 'You have already upvoted this solution.' });
          setHasVoted(true);
          return;
        }
        throw voteError;
      }

      // Increment the upvote count
      const { error: updateError } = await supabase
        .from('answer_versions')
        .update({ upvotes: solution.upvotes + 1 })
        .eq('id', solution.id);

      if (updateError) throw updateError;

      setHasVoted(true);
      onVoteSuccess();
      toast({ title: 'Upvoted!', description: 'Thanks for verifying this solution.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to upvote. Please try again.', variant: 'destructive' });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
      <Button
        variant={hasVoted ? 'default' : 'outline'}
        size="sm"
        onClick={handleUpvote}
        disabled={hasVoted || isVoting}
        className={hasVoted ? 'bg-course-rose text-white' : ''}
      >
        <ThumbsUp className="h-4 w-4 mr-1.5" />
        <span>{solution.upvotes}</span>
        {hasVoted && <span className="ml-1 text-xs">(voted)</span>}
      </Button>
      <Button variant="outline" size="sm" onClick={onAddSolution}>
        <Plus className="h-4 w-4 mr-1.5" />
        Add Solution
      </Button>
    </div>
  );
};
