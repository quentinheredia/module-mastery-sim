-- Create exam questions table (static, seeded)
CREATE TABLE public.exam_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL DEFAULT 'net4007',
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  question_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create answer versions table (community submissions)
CREATE TABLE public.answer_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.exam_questions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes tracking table (one vote per session per answer)
CREATE TABLE public.answer_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  answer_id UUID NOT NULL REFERENCES public.answer_versions(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(answer_id, session_id)
);

-- Enable RLS
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_votes ENABLE ROW LEVEL SECURITY;

-- Public read access for questions
CREATE POLICY "Anyone can view exam questions"
ON public.exam_questions FOR SELECT
USING (true);

-- Public read access for answer versions
CREATE POLICY "Anyone can view answer versions"
ON public.answer_versions FOR SELECT
USING (true);

-- Public insert for answer versions (community can add)
CREATE POLICY "Anyone can add answer versions"
ON public.answer_versions FOR INSERT
WITH CHECK (true);

-- Public update for upvotes on answer versions
CREATE POLICY "Anyone can update answer versions"
ON public.answer_versions FOR UPDATE
USING (true);

-- Public read/insert for votes
CREATE POLICY "Anyone can view votes"
ON public.answer_votes FOR SELECT
USING (true);

CREATE POLICY "Anyone can add votes"
ON public.answer_votes FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_answer_versions_question ON public.answer_versions(question_id);
CREATE INDEX idx_answer_versions_upvotes ON public.answer_versions(upvotes DESC);
CREATE INDEX idx_answer_votes_answer ON public.answer_votes(answer_id);
CREATE INDEX idx_answer_votes_session ON public.answer_votes(session_id);

-- Enable realtime for answer_versions
ALTER PUBLICATION supabase_realtime ADD TABLE public.answer_versions;