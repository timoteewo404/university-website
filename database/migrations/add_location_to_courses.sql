ALTER TABLE courses
ADD COLUMN location ENUM('On Campus', 'Online') NOT NULL DEFAULT 'On Campus';

-- Optionally update existing courses with correct location values if known
-- UPDATE courses SET location = 'Online' WHERE id IN (...);
