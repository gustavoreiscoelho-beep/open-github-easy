CREATE TABLE IF NOT EXISTS public.user_app_state (
  user_id uuid PRIMARY KEY,
  state jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_app_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own app state"
ON public.user_app_state
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own app state"
ON public.user_app_state
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own app state"
ON public.user_app_state
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own app state"
ON public.user_app_state
FOR DELETE
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_user_app_state_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_user_app_state_updated_at ON public.user_app_state;
CREATE TRIGGER update_user_app_state_updated_at
BEFORE UPDATE ON public.user_app_state
FOR EACH ROW
EXECUTE FUNCTION public.update_user_app_state_updated_at();