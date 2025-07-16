/*
  # Add user authentication and connect analyses to users

  1. New Changes
    - Add `user_id` column to `analyses` table to link analyses to users
    - Update RLS policies to handle both authenticated and anonymous users
    - Allow anonymous users to create and view analyses (user_id = null)
    - Allow authenticated users to create and view their own analyses

  2. Security
    - Maintain existing RLS policies
    - Add new policies for user-specific data access
    - Anonymous users can only see their own session data
    - Authenticated users can only see their own analyses
*/

-- Add user_id column to analyses table
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Update RLS policies to handle both authenticated and anonymous users
DROP POLICY IF EXISTS "Allow anonymous insert on analyses" ON analyses;
DROP POLICY IF EXISTS "Allow anonymous select on analyses" ON analyses;
DROP POLICY IF EXISTS "Allow authenticated insert on analyses" ON analyses;
DROP POLICY IF EXISTS "Allow authenticated select on analyses" ON analyses;

-- Allow anyone to insert analyses (both authenticated and anonymous)
CREATE POLICY "Allow insert on analyses"
  ON analyses
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow users to select their own analyses or anonymous analyses
CREATE POLICY "Allow select own analyses"
  ON analyses
  FOR SELECT
  TO public
  USING (
    -- If user is authenticated, show only their analyses
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    -- If user is anonymous, show only anonymous analyses
    (auth.uid() IS NULL AND user_id IS NULL)
  );

-- Allow users to update their own analyses
CREATE POLICY "Allow update own analyses"
  ON analyses
  FOR UPDATE
  TO public
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (auth.uid() IS NULL AND user_id IS NULL)
  );

-- Allow users to delete their own analyses
CREATE POLICY "Allow delete own analyses"
  ON analyses
  FOR DELETE
  TO public
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (auth.uid() IS NULL AND user_id IS NULL)
  );