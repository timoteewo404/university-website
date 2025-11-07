ALTER TABLE courses
ADD COLUMN application_deadline DATE NULL;

-- Optionally update existing courses with application deadlines
-- UPDATE courses SET application_deadline = '2024-04-30' WHERE id = 1;
