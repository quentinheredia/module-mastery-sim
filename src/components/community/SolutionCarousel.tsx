import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { AnswerVersion } from '@/types/net4007';
import { SolutionView } from './SolutionView';
import { SolutionControls } from './SolutionControls';
import { SolutionEditor } from './SolutionEditor';

interface SolutionCarouselProps {
  questionId: string;
  solutions: AnswerVersion[];
  onRefresh: () => void;
}

export const SolutionCarousel: React.FC<SolutionCarouselProps> = ({
  questionId,
  solutions,
  onRefresh,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<AnswerVersion | undefined>(undefined);

  // Adjust index if current solution is deleted
  useEffect(() => {
    if (currentIndex >= solutions.length && solutions.length > 0) {
      setCurrentIndex(solutions.length - 1);
    }
  }, [solutions.length, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : solutions.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < solutions.length - 1 ? prev + 1 : 0));
  };

  const handleAddSolution = () => {
    setEditingSolution(undefined);
    setEditorOpen(true);
  };

  const handleEditSolution = () => {
    setEditingSolution(solutions[currentIndex]);
    setEditorOpen(true);
  };

  const handleDeleteSolution = () => {
    // Refresh will happen via realtime, but we adjust index proactively
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    onRefresh();
  };

  const handleEditorClose = () => {
    setEditorOpen(false);
    setEditingSolution(undefined);
  };

  if (solutions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 px-4 bg-muted/30 rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground mb-4">
            No solutions yet. Be the first to add one!
          </p>
          <Button
            onClick={handleAddSolution}
            className="bg-course-rose hover:bg-course-rose/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Solution
          </Button>
        </div>
        <SolutionEditor
          questionId={questionId}
          isOpen={editorOpen}
          onClose={handleEditorClose}
          onSuccess={onRefresh}
          existingSolution={editingSolution}
        />
      </div>
    );
  }

  const currentSolution = solutions[currentIndex];

  return (
    <div className="space-y-4">
      {/* Navigation header */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Solution {currentIndex + 1} of {solutions.length}
        </span>
        {solutions.length > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="h-8 w-8 border-border text-foreground hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="h-8 w-8 border-border text-foreground hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Solution content with transition */}
      <div className="min-h-[200px] transition-opacity duration-200">
        <SolutionView solution={currentSolution} />
      </div>

      {/* Controls */}
      <SolutionControls
        solution={currentSolution}
        onAddSolution={handleAddSolution}
        onEditSolution={handleEditSolution}
        onDeleteSolution={handleDeleteSolution}
        onVoteSuccess={onRefresh}
      />

      <SolutionEditor
        questionId={questionId}
        isOpen={editorOpen}
        onClose={handleEditorClose}
        onSuccess={onRefresh}
        existingSolution={editingSolution}
      />
    </div>
  );
};
