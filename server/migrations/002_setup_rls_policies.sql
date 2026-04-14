-- Setup Row Level Security policies for development
-- This allows all operations for now - in production you'd want more restrictive policies

-- Disable RLS temporarily for development
ALTER TABLE schemas DISABLE ROW LEVEL SECURITY;
ALTER TABLE tables DISABLE ROW LEVEL SECURITY;
ALTER TABLE insights DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE upload_history DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS enabled, uncomment these policies:
-- CREATE POLICY "Allow all operations on schemas" ON schemas FOR ALL USING (true);
-- CREATE POLICY "Allow all operations on tables" ON tables FOR ALL USING (true);
-- CREATE POLICY "Allow all operations on insights" ON insights FOR ALL USING (true);
-- CREATE POLICY "Allow all operations on chat_history" ON chat_history FOR ALL USING (true);
-- CREATE POLICY "Allow all operations on upload_history" ON upload_history FOR ALL USING (true);
