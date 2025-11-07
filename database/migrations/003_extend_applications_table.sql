-- Migration to extend applications table with additional fields for detailed application form data

ALTER TABLE applications
ADD COLUMN gender ENUM('Male', 'Female', 'Other') DEFAULT NULL,
ADD COLUMN nationality VARCHAR(100) DEFAULT NULL,
ADD COLUMN national_id VARCHAR(100) DEFAULT NULL,
ADD COLUMN o_level_school_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN o_level_year_completed VARCHAR(10) DEFAULT NULL,
ADD COLUMN o_level_subjects_grades TEXT DEFAULT NULL,
ADD COLUMN a_level_school_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN a_level_year_completed VARCHAR(10) DEFAULT NULL,
ADD COLUMN a_level_subjects_grades TEXT DEFAULT NULL;
