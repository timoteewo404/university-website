-- Fix missing columns in database tables
-- This script adds missing columns that are required for the college registrar system

-- Add college_id to students table if it doesn't exist
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS college_id INT DEFAULT NULL AFTER program,
ADD INDEX IF NOT EXISTS idx_students_college_id (college_id);

-- Add created_at to students table if it doesn't exist
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER graduation_status;

-- Add missing columns to announcements table if they don't exist
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS created_by INT DEFAULT NULL AFTER status,
ADD COLUMN IF NOT EXISTS priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal' AFTER target_audience,
ADD INDEX IF NOT EXISTS idx_announcements_created_by (created_by);

-- Update students college_id based on their program (temporary mapping)
UPDATE students 
SET college_id = CASE 
    WHEN program IN ('CS', 'IT', 'SE', 'BSC-CS') THEN 3  -- College of Engineering
    WHEN program IN ('BBA', 'MBA', 'ECON') THEN 1        -- College of Business
    WHEN program IN ('ENG', 'LIT', 'HIST') THEN 2        -- College of Arts
    ELSE 4  -- College of Science (default)
END
WHERE college_id IS NULL;

-- Insert sample student data with proper college assignments if none exists
INSERT INTO students (user_id, student_id, program, college_id, year, semester, gpa, cgpa, credits_completed, graduation_status) 
SELECT * FROM (
    SELECT 1 as user_id, 'ENG2024001' as student_id, 'CS' as program, 3 as college_id, '2nd Year' as year, '1' as semester, 3.75 as gpa, 3.50 as cgpa, 60 as credits_completed, 'active' as graduation_status
    UNION ALL
    SELECT 2, 'ENG2024002', 'IT', 3, '3rd Year', '1', 3.25, 3.40, 90, 'active'
    UNION ALL  
    SELECT 3, 'BUS2024001', 'BBA', 1, '1st Year', '2', 3.80, 3.80, 30, 'active'
    UNION ALL
    SELECT 4, 'ART2024001', 'ENG', 2, '4th Year', '1', 3.90, 3.85, 120, 'pending_graduation'
) AS new_students
WHERE NOT EXISTS (
    SELECT 1 FROM students WHERE student_id = new_students.student_id
);

-- Verify the changes
SELECT 'Students table structure:' as info;
DESCRIBE students;

SELECT 'Announcements table structure:' as info;
DESCRIBE announcements;

SELECT 'Sample students with college assignments:' as info;
SELECT student_id, program, college_id, year, graduation_status FROM students LIMIT 5;
