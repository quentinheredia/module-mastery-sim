-- Add DELETE policy for answer_versions to allow solution deletion
CREATE POLICY "Anyone can delete answer versions"
ON public.answer_versions FOR DELETE
TO public
USING (true);