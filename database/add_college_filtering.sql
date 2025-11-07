-- Add college_id columns to tables that need them for college-based filtering
-- This script ensures all academic data can be filtered by college

-- Note: course_units table already has college_id column

-- Add college_id to exam_schedules table if it doesn't exist
ALTER TABLE `exam_schedules` 
ADD COLUMN `college_id` int NULL;

-- Add index for exam_schedules college filtering
ALTER TABLE `exam_schedules` 
ADD INDEX `idx_exam_schedules_college` (`college_id`);

-- Add college_id to graduation_candidates table if it doesn't exist
ALTER TABLE `graduation_candidates` 
ADD COLUMN `college_id` int NULL;

-- Add index for graduation_candidates college filtering
ALTER TABLE `graduation_candidates` 
ADD INDEX `idx_graduation_candidates_college` (`college_id`);

-- Add college_id to graduation_requests table if it doesn't exist
ALTER TABLE `graduation_requests` 
ADD COLUMN `college_id` int NULL;

-- Add index for graduation_requests college filtering
ALTER TABLE `graduation_requests` 
ADD INDEX `idx_graduation_requests_college` (`college_id`);

-- Add college_id to student_results table if it doesn't exist
ALTER TABLE `student_results` 
ADD COLUMN `college_id` int NULL;

-- Add index for student_results college filtering
ALTER TABLE `student_results` 
ADD INDEX `idx_student_results_college` (`college_id`);

-- Update course_units table with college_id based on programs (if needed)
-- Note: course_units may already have college_id populated

-- Update exam_schedules with college_id based on programs
UPDATE `exam_schedules` es 
LEFT JOIN `programs` p ON es.`program_id` = p.`id` 
SET es.`college_id` = p.`college_id` 
WHERE es.`college_id` IS NULL AND p.`college_id` IS NOT NULL;

-- Update graduation_candidates with college_id based on student programs
UPDATE `graduation_candidates` gc 
LEFT JOIN `students` s ON gc.`student_id` = s.`student_id` 
LEFT JOIN `programs` p ON s.`program_id` = p.`id` 
SET gc.`college_id` = p.`college_id` 
WHERE gc.`college_id` IS NULL AND p.`college_id` IS NOT NULL;

-- Update graduation_requests with college_id based on programs
UPDATE `graduation_requests` gr 
LEFT JOIN `programs` p ON gr.`program_id` = p.`id` 
SET gr.`college_id` = p.`college_id` 
WHERE gr.`college_id` IS NULL AND p.`college_id` IS NOT NULL;

-- Update student_results with college_id based on student programs
UPDATE `student_results` sr 
LEFT JOIN `students` s ON sr.`student_id` = s.`id` 
LEFT JOIN `programs` p ON s.`program_id` = p.`id` 
SET sr.`college_id` = p.`college_id` 
WHERE sr.`college_id` IS NULL AND p.`college_id` IS NOT NULL;
