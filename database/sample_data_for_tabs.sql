-- Sample data for Academic Registrar Dashboard Tabs
-- This script adds comprehensive sample data for course_units, programs, exams, graduation, and records

-- Insert additional course units for different colleges (using INSERT IGNORE to avoid duplicates)
INSERT IGNORE INTO `course_units` (`code`, `name`, `description`, `credits`, `semester`, `year`, `instructor_id`, `department`, `college_id`, `schedule`, `room`, `max_students`) VALUES
-- Computing Course Units (using unique codes)
('CS105', 'Database Management Systems', 'Advanced database design and implementation', 4, 1, 2, 1, 'Computer Science', 1, 'MWF 10:00-11:00', 'Lab 102', 45),
('CS106', 'Web Development', 'Modern web application development', 3, 2, 2, 1, 'Computer Science', 1, 'TTh 9:00-11:00', 'Lab 103', 40),
('CS305', 'Software Architecture', 'Large-scale software system design', 3, 1, 3, 1, 'Computer Science', 1, 'MWF 2:00-3:00', 'Room 301', 35),
('IT201', 'Network Security', 'Computer network security principles', 3, 1, 2, 1, 'Information Technology', 1, 'TTh 1:00-2:30', 'Lab 201', 30),
('IT301', 'Cloud Computing', 'Cloud infrastructure and services', 4, 2, 3, 1, 'Information Technology', 1, 'MW 3:00-5:00', 'Lab 301', 25),
('SE201', 'DevOps Practices', 'Continuous integration and deployment', 3, 2, 2, 1, 'Software Engineering', 1, 'TTh 11:00-12:30', 'Room 201', 40),
-- Business Course Units (using unique codes)
('BUS102', 'Business Communication', 'Professional communication in business', 3, 1, 1, 1, 'Business Administration', 2, 'MWF 9:00-10:00', 'Room 401', 50),
('BUS202', 'Marketing Fundamentals', 'Introduction to marketing principles', 3, 2, 2, 1, 'Business Administration', 2, 'TTh 10:00-11:30', 'Room 402', 45),
('BUS302', 'International Business', 'Global business operations', 4, 1, 3, 1, 'Business Administration', 2, 'MW 1:00-3:00', 'Room 403', 35),
('ACC102', 'Management Accounting', 'Accounting for management decisions', 4, 1, 1, 1, 'Accounting', 2, 'MWF 11:00-12:00', 'Room 501', 40),
('ACC202', 'Tax Accounting', 'Taxation principles and practices', 3, 2, 2, 1, 'Accounting', 2, 'TTh 2:00-3:30', 'Room 502', 35),
('ACC302', 'Financial Analysis', 'Financial statement analysis', 4, 1, 3, 1, 'Accounting', 2, 'MW 9:00-11:00', 'Room 503', 30),

-- Engineering Course Units (using unique codes for college_id 3)
('ENG102', 'Linear Algebra', 'Mathematical foundations for engineering applications', 4, 1, 1, 1, 'Engineering Mathematics', 3, 'MWF 8:00-9:00', 'Room 601', 50),
('ENG202', 'Fluid Mechanics', 'Properties and behavior of fluids', 3, 2, 2, 1, 'Mechanical Engineering', 3, 'TTh 9:00-10:30', 'Room 602', 40),
('ENG302', 'Digital Systems', 'Digital circuit design and analysis', 4, 1, 3, 1, 'Electrical Engineering', 3, 'MW 10:00-12:00', 'Lab 601', 30),

-- Health Sciences Course Units (using unique codes for college_id 4)
('MED102', 'Medical Terminology', 'Medical language and terminology', 4, 1, 1, 1, 'Medicine', 4, 'MWF 1:00-2:00', 'Lab 701', 35),
('MED202', 'Pathophysiology', 'Disease processes and mechanisms', 4, 2, 2, 1, 'Medicine', 4, 'TTh 11:00-1:00', 'Lab 702', 30),
('NUR102', 'Clinical Skills', 'Hands-on nursing procedures', 3, 1, 1, 1, 'Nursing', 4, 'MWF 3:00-4:00', 'Room 703', 40);

-- Insert additional programs
INSERT INTO `programs` (`name`, `code`, `college_id`, `department_id`, `duration`, `credits_required`, `degree_type`, `description`, `requirements`, `location`, `application_deadline`, `status`) VALUES
-- Computing Programs
('Bachelor of Information Technology', 'BIT', 1, 2, 4, 120, 'Bachelor', 'Comprehensive IT program covering networks, systems, and security', 'High school diploma, Mathematics proficiency', 'On Campus', '2025-09-30', 'active'),
('Master of Computer Science', 'MCS', 1, 1, 2, 60, 'Master', 'Advanced computer science with research focus', 'Bachelor in CS or related field, 3.0 GPA minimum', 'On Campus', '2025-08-15', 'active'),
('Certificate in Web Development', 'CWD', 1, 1, 1, 30, 'Certificate', 'Short-term web development certification', 'Basic computer literacy', 'Online', '2025-12-31', 'active'),

-- Business Programs
('Master of Business Administration', 'MBA', 2, 4, 2, 60, 'Master', 'Advanced business administration with leadership focus', 'Bachelor degree, 2 years work experience', 'On Campus', '2025-07-30', 'active'),
('Certificate in Accounting', 'CA', 2, 5, 1, 30, 'Certificate', 'Basic accounting certification', 'High school diploma', 'Online', '2025-11-30', 'active'),
('Diploma in Business Management', 'DBM', 2, 4, 2, 60, 'Diploma', 'Practical business management skills', 'High school diploma', 'On Campus', '2025-10-15', 'active'),

-- Engineering Programs
('Bachelor of Mechanical Engineering', 'BME', 3, NULL, 4, 140, 'Bachelor', 'Mechanical engineering with focus on design and manufacturing', 'High school diploma, Strong mathematics and physics', 'On Campus', '2025-08-31', 'active'),
('Master of Civil Engineering', 'MCE', 3, NULL, 2, 60, 'Master', 'Advanced civil engineering with research component', 'Bachelor in engineering, 3.0 GPA', 'On Campus', '2025-07-15', 'active'),

-- Health Sciences Programs
('Bachelor of Nursing', 'BN', 4, NULL, 4, 130, 'Bachelor', 'Comprehensive nursing education with clinical practice', 'High school diploma, Biology and Chemistry background', 'On Campus', '2025-08-15', 'active'),
('Master of Public Health', 'MPH', 4, NULL, 2, 60, 'Master', 'Public health policy and management', 'Bachelor degree in health-related field', 'On Campus', '2025-07-30', 'active');

-- Insert additional exam schedules
INSERT INTO `exam_schedules` (`course_unit_code`, `course_unit_title`, `program_id`, `college_id`, `date`, `time`, `venue`, `duration`, `invigilator`, `exam_type`, `status`) VALUES
-- Computing Exams
('CS102', 'Object-Oriented Programming', 1, 1, '2025-09-20', '14:00:00', 'Lab 102', '3', 'Dr. Alice Johnson', 'final', 'scheduled'),
('CS103', 'Database Systems', 1, 1, '2025-09-22', '09:00:00', 'Lab 103', '3', 'Prof. Bob Wilson', 'final', 'scheduled'),
('IT201', 'Network Administration', 5, 1, '2025-09-25', '11:00:00', 'Lab 201', '2.5', 'Dr. Carol Davis', 'midterm', 'scheduled'),
('SE201', 'Agile Development', 2, 1, '2025-09-27', '14:00:00', 'Room 201', '2', 'Prof. David Lee', 'final', 'scheduled'),

-- Business Exams
('BUS101', 'Introduction to Business', 3, 2, '2025-09-18', '10:00:00', 'Room 401', '2', 'Dr. Emma Brown', 'midterm', 'scheduled'),
('ACC101', 'Financial Accounting', 9, 2, '2025-09-21', '09:00:00', 'Room 501', '3', 'Prof. Frank Miller', 'final', 'scheduled'),
('BUS301', 'Strategic Management', 8, 2, '2025-09-24', '14:00:00', 'Room 403', '3', 'Dr. Grace Taylor', 'final', 'scheduled'),

-- Engineering Exams
('ENG101', 'Engineering Mathematics', 10, 3, '2025-09-19', '08:00:00', 'Room 601', '3', 'Prof. Henry Clark', 'final', 'scheduled'),
('ENG201', 'Thermodynamics', 10, 3, '2025-09-23', '10:00:00', 'Room 602', '2.5', 'Dr. Ivy Anderson', 'midterm', 'scheduled'),

-- Health Sciences Exams
('MED101', 'Human Anatomy', 12, 4, '2025-09-26', '09:00:00', 'Lab 701', '4', 'Dr. Jack Williams', 'final', 'scheduled'),
('NUR101', 'Nursing Fundamentals', 12, 4, '2025-09-28', '13:00:00', 'Room 703', '2', 'Prof. Kate Johnson', 'practical', 'scheduled');

-- Insert graduation candidates
INSERT INTO `graduation_candidates` (`student_id`, `name`, `program`, `college_id`, `cgpa`, `credits_completed`, `status`, `graduation_date`) VALUES
-- Computing Students
('CS2021001', 'John Smith', 'Bachelor of Computer Science', 1, 3.75, 120, 'eligible', '2025-12-15'),
('CS2021002', 'Sarah Johnson', 'Bachelor of Computer Science', 1, 3.45, 118, 'pending', '2025-12-15'),
('IT2021001', 'Michael Brown', 'Bachelor of Information Technology', 1, 3.60, 120, 'eligible', '2025-12-15'),
('SE2020001', 'Emily Davis', 'Master of Software Engineering', 1, 3.80, 60, 'approved', '2025-11-30'),

-- Business Students
('BUS2021001', 'David Wilson', 'Bachelor of Business Administration', 2, 3.25, 120, 'eligible', '2025-12-15'),
('BUS2021002', 'Lisa Anderson', 'Bachelor of Business Administration', 2, 3.55, 115, 'pending', '2025-12-15'),
('ACC2021001', 'James Taylor', 'Certificate in Accounting', 2, 3.40, 30, 'eligible', '2025-11-30'),
('MBA2023001', 'Jennifer Clark', 'Master of Business Administration', 2, 3.70, 58, 'pending', '2025-12-15'),

-- Engineering Students
('ENG2021001', 'Robert Miller', 'Bachelor of Mechanical Engineering', 3, 3.50, 140, 'eligible', '2025-12-15'),
('ENG2021002', 'Amanda White', 'Bachelor of Mechanical Engineering', 3, 3.35, 135, 'pending', '2025-12-15'),

-- Health Sciences Students
('MED2021001', 'Christopher Lee', 'Bachelor of Nursing', 4, 3.65, 130, 'eligible', '2025-12-15'),
('NUR2021001', 'Michelle Garcia', 'Bachelor of Nursing', 4, 3.45, 125, 'pending', '2025-12-15');

-- Insert graduation requests
INSERT INTO `graduation_requests` (`student_id`, `program_id`, `college_id`, `expected_graduation_date`, `cgpa`, `credits_completed`, `status`, `notes`) VALUES
(1, 1, 1, '2025-12-15', 3.75, 120, 'approved', 'All requirements met'),
(2, 1, 1, '2025-12-15', 3.45, 118, 'pending', 'Awaiting final course completion'),
(3, 5, 1, '2025-12-15', 3.60, 120, 'approved', 'Excellent academic performance'),
(4, 3, 2, '2025-12-15', 3.25, 120, 'pending', 'Under review by academic committee'),
(5, 10, 3, '2025-12-15', 3.50, 140, 'approved', 'Engineering requirements satisfied'),
(6, 12, 4, '2025-12-15', 3.65, 130, 'pending', 'Clinical hours verification needed');

-- Insert additional student results for different colleges
INSERT INTO `student_results` (`student_id`, `college_id`, `academic_year`, `semester`, `course_code`, `course_title`, `coursework_marks`, `exam_marks`, `final_marks`, `grade`, `grade_points`, `credit_units`) VALUES
-- Computing Results
(2, 1, '2024/2025', 'SEMESTER I', 'CS101', 'Introduction to Programming', 28, 65, 93, 'A', 4.00, 3),
(2, 1, '2024/2025', 'SEMESTER I', 'CS102', 'Object-Oriented Programming', 25, 58, 83, 'A-', 3.70, 3),
(2, 1, '2024/2025', 'SEMESTER I', 'MATH101', 'Calculus I', 22, 55, 77, 'A-', 3.70, 4),
(2, 1, '2024/2025', 'SEMESTER II', 'CS103', 'Database Systems', 30, 62, 92, 'A', 4.00, 4),
(2, 1, '2024/2025', 'SEMESTER II', 'CS201', 'Data Structures', 26, 59, 85, 'A-', 3.70, 3),

(3, 1, '2024/2025', 'SEMESTER I', 'IT201', 'Network Administration', 24, 52, 76, 'A-', 3.70, 3),
(3, 1, '2024/2025', 'SEMESTER I', 'CS101', 'Introduction to Programming', 27, 48, 75, 'A-', 3.70, 3),
(3, 1, '2024/2025', 'SEMESTER II', 'IT301', 'Cybersecurity Fundamentals', 29, 63, 92, 'A', 4.00, 4),

-- Engineering Results
(4, 3, '2024/2025', 'SEMESTER I', 'ENG101', 'Engineering Mathematics', 25, 55, 80, 'A-', 3.70, 4),
(4, 3, '2024/2025', 'SEMESTER I', 'ENG201', 'Thermodynamics', 22, 50, 72, 'B+', 3.30, 3),
(4, 3, '2024/2025', 'SEMESTER II', 'ENG301', 'Control Systems', 28, 58, 86, 'A-', 3.70, 4),

-- Health Sciences Results
(5, 4, '2024/2025', 'SEMESTER I', 'MED101', 'Human Anatomy', 26, 60, 86, 'A-', 3.70, 4),
(5, 4, '2024/2025', 'SEMESTER I', 'NUR101', 'Nursing Fundamentals', 29, 65, 94, 'A', 4.00, 3),
(5, 4, '2024/2025', 'SEMESTER II', 'MED201', 'Physiology', 27, 58, 85, 'A-', 3.70, 4);

-- Update existing data with college_ids
UPDATE `course_units` SET `college_id` = 1 WHERE `code` IN ('CS101', 'CS201', 'MATH101', 'EE101') AND `college_id` IS NULL;
UPDATE `exam_schedules` SET `college_id` = 1 WHERE `course_unit_code` IN ('CS101', 'CS103', 'MATH101') AND `college_id` IS NULL;
UPDATE `student_results` SET `college_id` = 2 WHERE `student_id` = 1 AND `college_id` IS NULL; -- Business student

-- Create some announcements/records data
CREATE TABLE IF NOT EXISTS `academic_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `college_id` int NULL,
  `record_type` enum('transcript','certificate','letter','verification') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `issue_date` date NOT NULL,
  `valid_until` date NULL,
  `status` enum('active','expired','revoked') DEFAULT 'active',
  `issued_by` varchar(255) DEFAULT 'Academic Registry',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_academic_records_student` (`student_id`),
  KEY `idx_academic_records_college` (`college_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `academic_records` (`student_id`, `college_id`, `record_type`, `title`, `description`, `issue_date`, `valid_until`, `status`, `issued_by`) VALUES
(1, 2, 'transcript', 'Official Transcript - Semester I & II 2024/2025', 'Complete academic transcript for Business Administration student', '2025-08-01', NULL, 'active', 'Academic Registry - College of Business'),
(2, 1, 'certificate', 'Dean\'s List Certificate', 'Recognition for academic excellence in Computing', '2025-07-15', '2026-07-15', 'active', 'Dean - College of Computing'),
(3, 1, 'verification', 'Enrollment Verification', 'Verification of current enrollment status', '2025-08-05', '2025-12-31', 'active', 'Academic Registry - College of Computing'),
(4, 3, 'transcript', 'Mid-Program Transcript', 'Academic records for Engineering student', '2025-07-30', NULL, 'active', 'Academic Registry - College of Engineering'),
(5, 4, 'letter', 'Academic Standing Letter', 'Letter confirming good academic standing', '2025-08-03', '2026-08-03', 'active', 'Academic Registry - College of Health Sciences');

-- Insert sample departments data
INSERT IGNORE INTO `departments` (`name`, `code`, `college_id`, `description`, `status`, `created_at`) VALUES
-- Computing Departments
('Computer Science', 'CS', 1, 'Computer Science and Programming', 'active', '2025-01-15 09:00:00'),
('Information Technology', 'IT', 1, 'Information Technology and Systems', 'active', '2025-01-15 09:00:00'),
('Software Engineering', 'SE', 1, 'Software Development and Engineering', 'active', '2025-01-15 09:00:00'),

-- Business Departments
('Business Administration', 'BUS', 2, 'Business Management and Administration', 'active', '2025-01-15 09:00:00'),
('Accounting', 'ACC', 2, 'Accounting and Financial Management', 'active', '2025-01-15 09:00:00'),

-- Engineering Departments
('Mechanical Engineering', 'MECH', 3, 'Mechanical Design and Manufacturing', 'active', '2025-01-15 09:00:00'),
('Civil Engineering', 'CIVIL', 3, 'Civil Infrastructure and Construction', 'active', '2025-01-15 09:00:00'),

-- Health Sciences Departments
('Medicine', 'MED', 4, 'Medical Studies and Healthcare', 'active', '2025-01-15 09:00:00'),
('Nursing', 'NUR', 4, 'Nursing and Patient Care', 'active', '2025-01-15 09:00:00');
