-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 07, 2025 at 09:43 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `university_portal`
--

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `AnalyzeTablePerformance`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `AnalyzeTablePerformance` ()   BEGIN
    ANALYZE TABLE students, courses, enrollments, assignments, assignment_submissions, 
                 notifications, payments, student_finances, course_materials, video_lectures;
END$$

DROP PROCEDURE IF EXISTS `BackupStudentData`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `BackupStudentData` (IN `p_student_id` INT)   BEGIN
    DECLARE backup_table_name VARCHAR(100);
    SET backup_table_name = CONCAT('student_backup_', p_student_id, '_', DATE_FORMAT(NOW(), '%Y%m%d'));
    
    SET @sql = CONCAT('CREATE TABLE IF NOT EXISTS ', backup_table_name, ' AS 
                      SELECT * FROM students WHERE id = ', p_student_id);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DROP PROCEDURE IF EXISTS `CalculateStudentGPA`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CalculateStudentGPA` (IN `p_student_id` INT)   BEGIN
    DECLARE total_points DECIMAL(10,2) DEFAULT 0;
    DECLARE total_credits INT DEFAULT 0;
    DECLARE calculated_gpa DECIMAL(3,2) DEFAULT 0;
    
    -- Check if student_results table exists
    IF EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'student_results'
    ) THEN
        
        SELECT 
            COALESCE(SUM(sr.grade_points * sr.credit_units), 0),
            COALESCE(SUM(sr.credit_units), 0)
        INTO total_points, total_credits
        FROM student_results sr
        WHERE sr.student_id = p_student_id 
        AND sr.grade_points IS NOT NULL;
        
        IF total_credits > 0 THEN
            SET calculated_gpa = total_points / total_credits;
            
            UPDATE students 
            SET cgpa = calculated_gpa 
            WHERE id = p_student_id;
        END IF;
        
    END IF;
END$$

DROP PROCEDURE IF EXISTS `CheckSystemHealth`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckSystemHealth` ()   BEGIN
    -- Check for high number of failed login attempts in last hour
    INSERT INTO system_alerts (alert_type, severity, message, details)
    SELECT 
        'security',
        'high',
        'High number of failed login attempts detected',
        JSON_OBJECT('count', COUNT(*), 'timeframe', '1 hour')
    FROM login_attempts 
    WHERE success = 0 
    AND created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
    HAVING COUNT(*) > 100;
    
    -- You can add more checks here...
END$$

DROP PROCEDURE IF EXISTS `CreateIndexSafely`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateIndexSafely` (IN `p_table_name` VARCHAR(64), IN `p_index_name` VARCHAR(64), IN `p_columns` VARCHAR(255))   BEGIN
    DECLARE index_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO index_exists
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = p_table_name
    AND INDEX_NAME = p_index_name;
    
    IF index_exists = 0 THEN
        SET @sql = CONCAT('CREATE INDEX ', p_index_name, ' ON ', p_table_name, '(', p_columns, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$

DROP PROCEDURE IF EXISTS `DropCheckConstraintIfExists`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `DropCheckConstraintIfExists` (IN `tbl_name` VARCHAR(64), IN `constraint_name` VARCHAR(64))   BEGIN
    DECLARE drop_stmt VARCHAR(255);
    DECLARE constraint_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO constraint_count
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = tbl_name
      AND CONSTRAINT_NAME = constraint_name
      AND CONSTRAINT_TYPE = 'CHECK';
    
    IF constraint_count > 0 THEN
        SET @drop_stmt = CONCAT('ALTER TABLE `', tbl_name, '` DROP CHECK `', constraint_name, '`;');
        PREPARE stmt FROM @drop_stmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$

DROP PROCEDURE IF EXISTS `GenerateStudentDashboard`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GenerateStudentDashboard` (IN `p_student_id` VARCHAR(50))   BEGIN
    DECLARE v_internal_id INT DEFAULT NULL;
    
    SELECT id INTO v_internal_id 
    FROM students 
    WHERE student_id = p_student_id;
    
    IF v_internal_id IS NOT NULL THEN
        -- Update dashboard cache
        INSERT INTO dashboard_cache (student_id, data)
        SELECT 
            v_internal_id,
            JSON_OBJECT(
                'student_info', JSON_OBJECT(
                    'id', s.id,
                    'student_id', s.student_id,
                    'name', u.name,
                    'email', u.email,
                    'program', s.program,
                    'year', s.year,
                    'semester', s.semester,
                    'gpa', COALESCE(s.gpa, 0),
                    'cgpa', COALESCE(s.cgpa, 0),
                    'credits_completed', COALESCE(s.credits_completed, 0)
                ),
                'course_count', (
                    SELECT COUNT(*) 
                    FROM enrollments e 
                    WHERE e.student_id = v_internal_id AND e.status = 'active'
                ),
                'pending_assignments', (
                    SELECT COUNT(*) 
                    FROM assignments a
                    JOIN courses c ON a.course_id = c.id
                    JOIN enrollments e ON c.id = e.course_id
                    LEFT JOIN assignment_submissions sub ON a.id = sub.assignment_id AND sub.student_id = v_internal_id
                    WHERE e.student_id = v_internal_id 
                    AND e.status = 'active'
                    AND sub.id IS NULL
                    AND a.due_date >= CURDATE()
                ),
                'fee_balance', COALESCE((
                    SELECT sf.balance 
                    FROM student_finances sf 
                    WHERE sf.student_id = v_internal_id 
                    ORDER BY sf.created_at DESC 
                    LIMIT 1
                ), 0)
            )
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = v_internal_id
        ON DUPLICATE KEY UPDATE 
            data = VALUES(data),
            last_updated = CURRENT_TIMESTAMP;
    END IF;
END$$

DROP PROCEDURE IF EXISTS `UpdateCourseProgress`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateCourseProgress` (IN `p_student_id` INT, IN `p_course_id` INT)   BEGIN
    DECLARE total_assignments INT DEFAULT 0;
    DECLARE completed_assignments INT DEFAULT 0;
    DECLARE progress_percentage INT DEFAULT 0;
    
    SELECT COUNT(*) INTO total_assignments
    FROM assignments a
    WHERE a.course_id = p_course_id;
    
    SELECT COUNT(*) INTO completed_assignments
    FROM assignments a
    JOIN assignment_submissions sub ON a.id = sub.assignment_id
    WHERE a.course_id = p_course_id 
    AND sub.student_id = p_student_id;
    
    IF total_assignments > 0 THEN
        SET progress_percentage = (completed_assignments * 100) DIV total_assignments;
        
        UPDATE enrollments 
        SET progress = progress_percentage 
        WHERE student_id = p_student_id AND course_id = p_course_id;
    END IF;
END$$

--
-- Functions
--
DROP FUNCTION IF EXISTS `IsClassToday`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `IsClassToday` (`course_schedule` VARCHAR(255)) RETURNS TINYINT(1) DETERMINISTIC READS SQL DATA BEGIN
    DECLARE day_name VARCHAR(10);
    DECLARE is_today BOOLEAN DEFAULT FALSE;
    
    SET day_name = DAYNAME(CURDATE());
    
    CASE day_name
        WHEN 'Monday' THEN 
            IF course_schedule LIKE '%M%' AND course_schedule NOT LIKE '%Mo%' THEN 
                SET is_today = TRUE; 
            END IF;
        WHEN 'Tuesday' THEN 
            IF course_schedule LIKE '%T%' AND course_schedule NOT LIKE '%Th%' THEN 
                SET is_today = TRUE; 
            END IF;
        WHEN 'Wednesday' THEN 
            IF course_schedule LIKE '%W%' THEN 
                SET is_today = TRUE; 
            END IF;
        WHEN 'Thursday' THEN 
            IF course_schedule LIKE '%Th%' THEN 
                SET is_today = TRUE; 
            END IF;
        WHEN 'Friday' THEN 
            IF course_schedule LIKE '%F%' THEN 
                SET is_today = TRUE; 
            END IF;
    END CASE;
    
    RETURN is_today;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `table_name` varchar(100) NOT NULL,
  `record_id` int DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activity_logs_user_date` (`user_id`,`created_at`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text,
  `type` enum('general','urgent','deadline','exam') DEFAULT 'general',
  `target_audience` enum('students','staff','all') DEFAULT 'students',
  `status` enum('active','draft') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
CREATE TABLE IF NOT EXISTS `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `applicant_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `program_id` int NOT NULL,
  `application_type` enum('admission','transfer','readmission') DEFAULT 'admission',
  `status` enum('pending','approved','rejected','waitlisted') DEFAULT 'pending',
  `documents` json DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `reviewed_by` int DEFAULT NULL,
  `notes` text,
  `nationality` varchar(100) DEFAULT NULL,
  `national_id` varchar(100) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` text,
  `o_level_school` varchar(255) DEFAULT NULL,
  `o_level_year` varchar(4) DEFAULT NULL,
  `o_level_grades` json DEFAULT NULL,
  `a_level_school` varchar(255) DEFAULT NULL,
  `a_level_year` varchar(4) DEFAULT NULL,
  `a_level_grades` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `program_id` (`program_id`),
  KEY `reviewed_by` (`reviewed_by`),
  KEY `idx_applications_status` (`status`),
  KEY `user_id` (`user_id`),
  KEY `idx_applications_user_status` (`user_id`,`status`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `user_id`, `applicant_name`, `email`, `phone`, `program_id`, `application_type`, `status`, `documents`, `submitted_at`, `reviewed_at`, `reviewed_by`, `notes`, `nationality`, `national_id`, `gender`, `date_of_birth`, `address`, `o_level_school`, `o_level_year`, `o_level_grades`, `a_level_school`, `a_level_year`, `a_level_grades`) VALUES
(1, 0, 'john deo', 'test@example.com', '0475272626', 1, 'admission', 'pending', NULL, '2025-08-04 16:11:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 1, 'chedikol timothy', 'cheotimo66@gmail.com', '0475272626', 3, 'admission', 'pending', NULL, '2025-08-04 16:53:36', NULL, NULL, NULL, 'ugandan', 'cm12453647584764', 'Male', '2006-12-12', 'sdasdasd', '', '', '\"\"', '', '', '\"\"'),
(4, 1, 'chedikol timothy', 'cheotimo66@gmail.com', '0475272626', 3, 'admission', 'pending', NULL, '2025-08-04 16:53:36', NULL, NULL, NULL, 'ugandan', 'cm12453647584764', 'Male', '2006-12-12', 'sdasdasd', '', '', '\"\"', '', '', '\"\"');

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
CREATE TABLE IF NOT EXISTS `assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `max_points` int NOT NULL,
  `due_date` datetime NOT NULL,
  `submission_type` enum('file','text','both') DEFAULT 'file',
  `allowed_formats` varchar(255) DEFAULT NULL,
  `instructions` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_assignments_course` (`course_id`),
  KEY `idx_assignments_due_date` (`due_date`),
  KEY `idx_assignments_course_due_date` (`course_id`,`due_date`),
  KEY `idx_assignments_due_status` (`due_date`,`course_id`),
  KEY `idx_assignments_course_due` (`course_id`,`due_date`)
) ;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `course_id`, `title`, `description`, `max_points`, `due_date`, `submission_type`, `allowed_formats`, `instructions`, `created_at`) VALUES
(1, 1, 'Binary Trees Implementation', 'Implement a binary search tree with insertion, deletion, and traversal methods', 100, '2024-03-20 23:59:59', 'file', '.java,.cpp,.py', NULL, '2025-07-27 13:53:41'),
(2, 2, 'SQL Query Optimization', 'Optimize the given SQL queries and provide performance analysis', 80, '2024-03-25 23:59:59', 'file', '.sql,.pdf', NULL, '2025-07-27 13:53:41'),
(3, 3, 'Project Documentation', 'Complete documentation for your software engineering project', 50, '2024-03-18 23:59:59', 'text', NULL, NULL, '2025-07-27 13:53:41'),
(4, 1, 'Python Basics Assignment', 'Complete exercises 1-10', 100, '2025-08-12 03:44:39', 'file', NULL, NULL, '2025-08-05 10:44:39'),
(5, 2, 'Linked List Implementation', 'Implement a linked list', 200, '2025-08-15 03:44:39', 'file', NULL, NULL, '2025-08-05 10:44:39'),
(6, 3, 'Calculus Problem Set', 'Solve problems 1-20', 100, '2025-08-10 03:44:39', 'file', NULL, NULL, '2025-08-05 10:44:39'),
(7, 1, 'Programming Assignment 1: Variables and Data Types', 'Create a program that demonstrates the use of different data types and variables in programming.', 100, '2025-08-08 14:24:02', 'file', 'py,java,cpp,c', 'Submit your code files with proper documentation and comments.', '2025-08-05 14:24:02'),
(8, 1, 'Programming Assignment 2: Control Structures', 'Implement control structures including loops, conditionals, and functions.', 150, '2025-08-12 14:24:02', 'file', 'py,java,cpp,c', 'Include test cases and documentation for your implementation.', '2025-08-05 14:24:02'),
(9, 2, 'Operating Systems Essay: Process Management', 'Write a detailed essay on process management in modern operating systems.', 80, '2025-08-10 14:24:02', 'file', 'pdf,doc,docx', 'Minimum 2000 words with proper citations and references.', '2025-08-05 14:24:02'),
(10, 2, 'OS Lab Report: Memory Allocation', 'Complete the memory allocation simulation and submit a detailed lab report.', 120, '2025-08-15 14:24:02', 'both', 'pdf,doc,docx,zip', 'Include source code, screenshots, and analysis of results.', '2025-08-05 14:24:02'),
(11, 3, 'Discrete Math Problem Set 1', 'Solve the assigned problems from chapters 1-3 covering sets, logic, and proofs.', 75, '2025-08-09 14:24:02', 'file', 'pdf,doc,docx', 'Show all work and provide step-by-step solutions.', '2025-08-05 14:24:02'),
(12, 3, 'Graph Theory Assignment', 'Analyze the given graph structures and solve the related problems.', 90, '2025-08-13 14:24:02', 'file', 'pdf,doc,docx', 'Include diagrams and mathematical proofs where required.', '2025-08-05 14:24:02');

-- --------------------------------------------------------

--
-- Table structure for table `assignment_submissions`
--

DROP TABLE IF EXISTS `assignment_submissions`;
CREATE TABLE IF NOT EXISTS `assignment_submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assignment_id` int NOT NULL,
  `student_id` int NOT NULL,
  `submission_text` text,
  `file_path` varchar(500) DEFAULT NULL,
  `grade` int DEFAULT NULL,
  `feedback` text,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `graded_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_submission` (`assignment_id`,`student_id`),
  KEY `idx_assignment_submissions_student_assignment` (`student_id`,`assignment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers `assignment_submissions`
--
DROP TRIGGER IF EXISTS `after_assignment_graded`;
DELIMITER $$
CREATE TRIGGER `after_assignment_graded` AFTER UPDATE ON `assignment_submissions` FOR EACH ROW BEGIN
    IF NEW.grade IS NOT NULL AND (OLD.grade IS NULL OR OLD.grade != NEW.grade) THEN
        INSERT INTO notifications (user_id, title, message, type)
        SELECT 
            s.user_id,
            'Assignment Graded',
            CONCAT('Your assignment "', a.title, '" has been graded. Score: ', NEW.grade, '/', a.max_points),
            'info'
        FROM students s
        JOIN assignments a ON a.id = NEW.assignment_id
        WHERE s.id = NEW.student_id;
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `after_assignment_submission`;
DELIMITER $$
CREATE TRIGGER `after_assignment_submission` AFTER INSERT ON `assignment_submissions` FOR EACH ROW BEGIN
    DECLARE v_course_id INT DEFAULT NULL;
    
    SELECT course_id INTO v_course_id
    FROM assignments
    WHERE id = NEW.assignment_id;
    
    IF v_course_id IS NOT NULL THEN
        CALL UpdateCourseProgress(NEW.student_id, v_course_id);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `bio_data`
--

DROP TABLE IF EXISTS `bio_data`;
CREATE TABLE IF NOT EXISTS `bio_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(20) DEFAULT NULL,
  `surname` varchar(100) DEFAULT NULL,
  `other_names` varchar(200) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `sex` enum('MALE','FEMALE') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `religion` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `nationality` varchar(100) DEFAULT 'UGANDAN',
  `national_id` varchar(50) DEFAULT NULL,
  `passport_number` varchar(50) DEFAULT NULL,
  `marital_status` enum('SINGLE','MARRIED','DIVORCED','WIDOWED') DEFAULT 'SINGLE',
  `address` text,
  `guardian_full_name` varchar(255) DEFAULT NULL,
  `guardian_relationship` varchar(100) DEFAULT NULL,
  `guardian_email` varchar(255) DEFAULT NULL,
  `guardian_phone` varchar(20) DEFAULT NULL,
  `guardian_address` text,
  `guardian_occupation` varchar(100) DEFAULT NULL,
  `next_of_kin_name` varchar(255) DEFAULT NULL,
  `next_of_kin_relationship` varchar(100) DEFAULT NULL,
  `next_of_kin_phone` varchar(20) DEFAULT NULL,
  `next_of_kin_email` varchar(255) DEFAULT NULL,
  `next_of_kin_address` text,
  `next_of_kin_occupation` varchar(100) DEFAULT NULL,
  `registration_number` varchar(50) DEFAULT NULL,
  `academic_status` varchar(100) DEFAULT 'NORMAL PROGRESS',
  `billing_category` varchar(100) DEFAULT 'UGANDAN',
  `campus` varchar(100) DEFAULT 'MAIN CAMPUS',
  `programme_version` varchar(20) DEFAULT NULL,
  `residence_status` enum('RESIDENT','NON-RESIDENT') DEFAULT 'RESIDENT',
  `intake` varchar(50) DEFAULT NULL,
  `hall_of_attachment` varchar(100) DEFAULT NULL,
  `entry_academic_year` varchar(20) DEFAULT NULL,
  `hall_of_residence` varchar(100) DEFAULT NULL,
  `entry_study_year` varchar(20) DEFAULT NULL,
  `fees_waiver` varchar(100) DEFAULT NULL,
  `current_study_year` varchar(20) DEFAULT NULL,
  `has_completed` enum('YES','NO') DEFAULT 'NO',
  `study_type` enum('DAY','EVENING','WEEKEND') DEFAULT 'DAY',
  `on_loan_scheme` enum('YES','NO') DEFAULT 'NO',
  `sponsorship` varchar(100) DEFAULT 'GOVERNMENT',
  `affiliated` enum('YES','NO') DEFAULT 'NO',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_bio_data` (`student_id`),
  KEY `idx_bio_data_student` (`student_id`),
  KEY `idx_bio_data_national_id` (`national_id`),
  KEY `idx_bio_data_passport` (`passport_number`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bio_data`
--

INSERT INTO `bio_data` (`id`, `student_id`, `surname`, `other_names`, `email`, `phone`, `sex`, `date_of_birth`, `religion`, `district`, `nationality`, `national_id`, `passport_number`, `marital_status`, `address`, `guardian_full_name`, `guardian_relationship`, `guardian_email`, `guardian_phone`, `guardian_address`, `guardian_occupation`, `next_of_kin_name`, `next_of_kin_relationship`, `next_of_kin_phone`, `next_of_kin_email`, `next_of_kin_address`, `next_of_kin_occupation`, `registration_number`, `academic_status`, `billing_category`, `campus`, `programme_version`, `residence_status`, `intake`, `hall_of_attachment`, `entry_academic_year`, `hall_of_residence`, `entry_study_year`, `fees_waiver`, `current_study_year`, `has_completed`, `study_type`, `on_loan_scheme`, `sponsorship`, `affiliated`, `created_at`, `updated_at`) VALUES
(1, 'STD2024002', 'Doe', 'John', 'john.doe@student.eyecab.edu', '+256701234567', 'MALE', '2003-03-18', 'CHRISTIAN', 'KAMPALA', 'UGANDAN', 'CM12345678901234', NULL, 'SINGLE', 'Plot 123, Kampala Road, Kampala, Uganda', 'APIO SARAH', 'sister', 'apio.sarah@gmail.com', '0773076597', 'Plot 456, Jinja Road, Kampala, Uganda', 'TEACHER', NULL, NULL, NULL, NULL, NULL, NULL, '24/U/2185', 'NORMAL PROGRESS', 'UGANDAN', 'MAIN CAMPUS', 'V2022', 'RESIDENT', 'AUGUST', 'MITCHELL', '2024/2025', 'MITCHELL', 'YEAR 1', 'GOVT', 'YEAR 3', 'NO', 'DAY', 'NO', 'GOVERNMENT', 'NO', '2025-07-31 19:49:55', '2025-08-05 12:07:11');

-- --------------------------------------------------------

--
-- Table structure for table `blog`
--

DROP TABLE IF EXISTS `blog`;
CREATE TABLE IF NOT EXISTS `blog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(1000) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `descrip` varchar(10000) DEFAULT NULL,
  `img` varchar(100) DEFAULT NULL,
  `img2` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `bible` varchar(1000) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `verse` varchar(255) NOT NULL,
  `conclusion` varchar(10000) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `date` varchar(100) NOT NULL,
  `tags` varchar(1000) DEFAULT NULL,
  `student_name` varchar(255) DEFAULT NULL,
  `student_level` varchar(100) DEFAULT NULL,
  `content` text,
  `thumb` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `blog`
--

INSERT INTO `blog` (`id`, `title`, `category`, `descrip`, `img`, `img2`, `bible`, `verse`, `conclusion`, `date`, `tags`, `student_name`, `student_level`, `content`, `thumb`) VALUES
(14, 'Outreach programs', 'Donations', '<p><span style=\"font-family: din-next-w01-light, din-next-w02-light, din-next-w10-light, sans-serif; white-space: pre-wrap;\">Fasting can point the way to a greater compassion and help us against the fight hunger all over the world. It’s only through Ramdan and Lent when we give up our favourite luxury snacks or totally go without food that we get to experience what normal life is like for some in most third world countries. It’s not an easy feat trying to rid the world of hunger, in Uganda alone at least 10.9 million Ugandans are facing acute food insecurity and thankfully the fight to help communities nationwide is being taken on by organisations like The Hunger Project.   </span></p><p><span style=\"font-weight: 700; color: rgb(95, 94, 94); font-family: Poppins; font-size: 17.7952px; white-space: pre-wrap;\">Your gift  helps support therapeutic staff + purchase the following:</span></p><h5 style=\"margin: 1rem 0px 0px; padding: 0px; border: none; outline: none; position: relative; font-family: Poppins; color: rgb(95, 94, 94); transition: all 500ms ease 0s; overflow-wrap: break-word; font-size: 17.7952px; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\"><ul style=\"margin-right: 0px; margin-bottom: 0px; margin-left: 0px; padding: 0px; border: none; outline: none; list-style: none; color: rgb(95, 94, 94); font-family: \"Nunito Sans\", sans-serif; font-size: 18px;\"><li style=\"margin: 1rem 0px 0px; padding: 0px; border: none; outline: none; list-style: none; text-align: left; overflow-wrap: break-word; font-family: Poppins; font-size: 17.7952px; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\">Plush + Sports Toys </li></ul><ul style=\"margin-right: 0px; margin-bottom: 0px; margin-left: 0px; padding: 0px; border: none; outline: none; list-style: none; color: rgb(95, 94, 94); font-family: \"Nunito Sans\", sans-serif; font-size: 18px;\"><li style=\"margin: 1rem 0px 0px; padding: 0px; border: none; outline: none; list-style: none; text-align: left; overflow-wrap: break-word; font-family: Poppins; font-size: 17.7952px; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\">Sign-language Materials</li></ul><ul style=\"margin-right: 0px; margin-bottom: 0px; margin-left: 0px; padding: 0px; border: none; outline: none; list-style: none; color: rgb(95, 94, 94); font-family: \"Nunito Sans\", sans-serif; font-size: 18px;\"><li style=\"margin: 1rem 0px 0px; padding: 0px; border: none; outline: none; list-style: none; text-align: left; overflow-wrap: break-word; font-family: Poppins; font-size: 17.7952px; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\"> Fuel for Transportation </li></ul><ul style=\"margin-right: 0px; margin-bottom: 0px; margin-left: 0px; padding: 0px; border: none; outline: none; list-style: none; color: rgb(95, 94, 94); font-family: \"Nunito Sans\", sans-serif; font-size: 18px;\"><li style=\"margin: 1rem 0px 0px; padding: 0px; border: none; outline: none; list-style: none; text-align: left; overflow-wrap: break-word; font-family: Poppins; font-size: 17.7952px; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\">Uniform + School Shoes </li></ul><ul style=\"margin-right: 0px; margin-bottom: 0px; margin-left: 0px; padding: 0px; border: none; outline: none; list-style: none; color: rgb(95, 94, 94); font-family: \"Nunito Sans\", sans-serif; font-size: 18px;\"><li style=\"margin: 1rem 0px 0px; padding: 0px; border: none; outline: none; list-style: none; text-align: left; overflow-wrap: break-word; font-family: Poppins; font-size: 17.7952px; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\"> School Supplies </li></ul><ul style=\"margin-right: 0px; margin-bottom: 0px; margin-left: 0px; padding: 0px; border: none; outline: none; list-style: none; color: rgb(95, 94, 94); font-family: \"Nunito Sans\", sans-serif; font-size: 18px;\"><li style=\"margin: 1rem 0px 0px; padding: 0px; border: none; outline: none; list-style: none; text-align: left; overflow-wrap: break-word; font-family: Poppins; font-size: 17.7952px; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\">Sensory Toys </li></ul><ul style=\"margin-right: 0px; margin-bottom: 0px; margin-left: 0px; padding: 0px; border: none; outline: none; list-style: none; color: rgb(95, 94, 94); font-family: \"Nunito Sans\", sans-serif; font-size: 18px;\"><li style=\"margin: 1rem 0px 0px; padding: 0px; border: none; outline: none; list-style: none; text-align: left; overflow-wrap: break-word; font-family: Poppins; font-size: 17.7952px; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\">Plates + Utensils </li></ul><ul style=\"margin-right: 0px; margin-bottom: 0px; margin-left: 0px; padding: 0px; border: none; outline: none; list-style: none; color: rgb(95, 94, 94); font-family: \"Nunito Sans\", sans-serif; font-size: 18px;\"><li style=\"margin: 1rem 0px 0px; padding: 0px; border: none; outline: none; list-style: none; text-align: left; overflow-wrap: break-word; font-family: Poppins; font-size: 17.7952px; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\">Small Weighted Blankets</li></ul></h5>', '1341457598bht.png', '1229056271bn.png', '  The measure of life is not its duration, but its donation and it is easy to talk of fasting when the stomach is full.', 'Kyobe Reagan, Founder', '<p id=\"viewer-851is\" class=\"mm8Nw _1j-51 roLFQS _1FoOD _3M0Fe Z63qyL roLFQS public-DraftStyleDefault-block-depth0 fixed-tab-size public-DraftStyleDefault-text-ltr\" style=\"background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; border: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-stretch: inherit; line-height: 1.5; font-family: din-next-w01-light, din-next-w02-light, din-next-w10-light, sans-serif; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); box-sizing: inherit; direction: ltr; min-height: var(--ricos-custom-p-min-height,unset); white-space: pre-wrap;\"><span class=\"_2PHJq public-DraftStyleDefault-ltr\" style=\"background: transparent; border: 0px; margin: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font: inherit; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); box-sizing: inherit; direction: ltr; display: block;\"><span style=\"background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: var(--ricos-custom-p-background-color,unset); border: 0px; margin: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font: inherit; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); box-sizing: inherit;\">On a local level where we operate, we teamed up with our friends in USA to raise funds which went towards a good meal for a number of families in jinja communities.</span></span><span class=\"_2PHJq public-DraftStyleDefault-ltr\" style=\"background: transparent; border: 0px; margin: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font: inherit; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); box-sizing: inherit; direction: ltr; display: block;\"><br></span></p><p id=\"viewer-851is\" class=\"mm8Nw _1j-51 roLFQS _1FoOD _3M0Fe Z63qyL roLFQS public-DraftStyleDefault-block-depth0 fixed-tab-size public-DraftStyleDefault-text-ltr\" style=\"background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; border: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-stretch: inherit; line-height: 1.5; font-family: din-next-w01-light, din-next-w02-light, din-next-w10-light, sans-serif; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); box-sizing: inherit; direction: ltr; min-height: var(--ricos-custom-p-min-height,unset); white-space: pre-wrap;\"></p><h3><span class=\"_2PHJq public-DraftStyleDefault-ltr\" style=\"background: transparent; border: 0px; margin: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font: inherit; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); box-sizing: inherit; direction: ltr; display: block;\"><span style=\"background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: var(--ricos-custom-p-background-color,unset); border: 0px; margin: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font: inherit; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); box-sizing: inherit;\"><span style=\"font-family: Poppins; font-size: 23.1808px; text-align: center; white-space: normal;\">We rely on people like you to support the work that we do – and we couldn’t do it without you! When you give donation, your support empowers communities to receive lasting change!</span></span></span></h3><p id=\"viewer-851is\" class=\"mm8Nw _1j-51 roLFQS _1FoOD _3M0Fe Z63qyL roLFQS public-DraftStyleDefault-block-depth0 fixed-tab-size public-DraftStyleDefault-text-ltr\" style=\"background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; border: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-stretch: inherit; line-height: 1.5; font-family: din-next-w01-light, din-next-w02-light, din-next-w10-light, sans-serif; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); box-sizing: inherit; direction: ltr; min-height: var(--ricos-custom-p-min-height,unset); white-space: pre-wrap;\"></p><blockquote class=\"blockquote\"><p><span style=\"color: rgb(72, 150, 81); font-family: adorn-roman; font-size: 28px; letter-spacing: 0.18px; text-align: center; background-color: rgb(245, 245, 245);\">Can a mother forget the baby at her breast and have no compassion on the child she has borne? Though she may forget, I will not forget you! See, I have engraved you on the palms of my hands</span><span style=\"font-size: 16px;\">&nbsp;-</span><span style=\"background-color: rgb(245, 245, 245); color: rgb(72, 150, 81); font-family: sofia-pro; letter-spacing: 0.18px; text-align: center; font-size: 1rem;\">&nbsp;</span><span style=\"background-color: rgb(245, 245, 245); color: rgb(72, 150, 81); font-family: sofia-pro; letter-spacing: 0.18px; text-align: center; font-size: 1rem;\">Isaiah 49:15</span></p></blockquote><p></p><h3 style=\"font-family: \"Source Sans Pro\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"; color: rgb(0, 0, 0);\"><span class=\"_2PHJq public-DraftStyleDefault-ltr\" style=\"box-sizing: inherit; background: transparent; border: 0px; margin: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font: inherit; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); direction: ltr; display: block;\"><span style=\"box-sizing: inherit; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: var(--ricos-custom-p-background-color,unset); border: 0px; margin: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font: inherit; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><span style=\"font-family: Poppins; font-size: 17.7952px;\">You can help our cause by donating using the button below;</span></span></span></h3><p></p><p id=\"viewer-851is\" class=\"mm8Nw _1j-51 roLFQS _1FoOD _3M0Fe Z63qyL roLFQS public-DraftStyleDefault-block-depth0 fixed-tab-size public-DraftStyleDefault-text-ltr\" style=\"background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; border: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-stretch: inherit; line-height: 1.5; font-family: din-next-w01-light, din-next-w02-light, din-next-w10-light, sans-serif; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); box-sizing: inherit; direction: ltr; min-height: var(--ricos-custom-p-min-height,unset); white-space: pre-wrap;\"><span class=\"_2PHJq public-DraftStyleDefault-ltr\" style=\"background: transparent; border: 0px; margin: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font: inherit; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); box-sizing: inherit; direction: ltr; display: block;\"></span></p><p id=\"viewer-851is\" class=\"mm8Nw _1j-51 roLFQS _1FoOD _3M0Fe Z63qyL roLFQS public-DraftStyleDefault-block-depth0 fixed-tab-size public-DraftStyleDefault-text-ltr\" style=\"box-sizing: inherit; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; border: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-stretch: inherit; line-height: 1.5; font-family: din-next-w01-light, din-next-w02-light, din-next-w10-light, sans-serif; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); direction: ltr; min-height: var(--ricos-custom-p-min-height,unset); white-space: pre-wrap;\"><span class=\"_2PHJq public-DraftStyleDefault-ltr\" style=\"box-sizing: inherit; background: transparent; border: 0px; margin: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font: inherit; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); direction: ltr; display: block;\"><span style=\"box-sizing: inherit; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: var(--ricos-custom-p-background-color,unset); border: 0px; margin: 0px; outline: 0px; padding: 0px; vertical-align: baseline; font: inherit; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><a href=\"http://donate.php/\" target=\"_blank\">DONATE</a></span></span></p>', 'Wed 11 Jan 2023', 'campus,career,learning-business', NULL, NULL, NULL, NULL),
(15, 'FOSTER LOVE AND CARE', 'Orphans', '<h3 style=\"font-family: Poppins; line-height: calc(1.056); font-size: calc(1.2vw + 1rem); margin-right: 0px; margin-bottom: 2rem; margin-left: 0px; text-align: center; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\"><span style=\"font-weight: 700; overflow-wrap: break-word;\">BUILDING A COMMUNITY TO FOSTER LOVE</span></h3><p class=\"\" style=\"margin-top: 1rem; margin-right: 0px; margin-left: 0px; overflow-wrap: break-word; font-family: Poppins; font-size: 17.7952px; text-align: center; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\">Every child deserves a family! At Homeless Hope Uganda, we believe that children of all ages do best in a family setting versus an institutionalized orphanage. Our organization is currently pioneering a new way of care for the orphaned in jinja, uganda. How? By raising a network of Ugandan foster mothers who are committed to supporting the orphaned or abused children — by raising them as their own!  </p><p class=\"\" style=\"margin: 1rem 0px 0px; overflow-wrap: break-word; font-family: Poppins; font-size: 17.7952px; text-align: center; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\">When a child is brought to our organization, we work to get him or her placed into a loving home as quickly as possible.  </p>', '38164297622.png', '776159239baby.png', 'Every kid is one caring adult away from being a success story. ', ' – Josh Shipp                                                                                                                                                                ', '<h4>Homeless Hope Uganda<span style=\"color: black; font-family: Poppins; font-size: 18.2048px; white-space: pre-wrap; \"> is breaking ground on a community that will provide a “forever home” to the orphaned, abused, and abandoned child. we serve&nbsp;faithfully serving the fatherless!</span></h4><h4><p class=\"\" style=\"text-align: left; margin-top: 1rem; margin-right: 0px; margin-left: 0px; overflow-wrap: break-word; font-family: Poppins; font-size: 17.7952px; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\">we see your sponsorship and donation as a gift of love, and has to changed our children’s lives in so many ways! <span style=\"font-weight: 700; overflow-wrap: break-word;\">We believe that it is their responsibility to pass that same love to not only their family, friends, or those they care about – but to everyone who needs genuine love.&nbsp;</span></p><p class=\"\" style=\"text-align: left; margin-top: 1rem; margin-right: 0px; margin-left: 0px; overflow-wrap: break-word; font-family: Poppins; font-size: 17.7952px; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\"><span style=\"color: inherit; font-weight: 700; overflow-wrap: break-word;\"> </span><span style=\"color: inherit;\">This is so important because our kids will grow to become great men and women, which Uganda needs, and will make a difference in our nation.  </span></p><p class=\"\" style=\"text-align: left; margin-top: 1rem; margin-right: 0px; margin-left: 0px; overflow-wrap: break-word; font-family: Poppins; font-size: 17.7952px; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\">we always want to see a strong bond of love among our kids and  sometimes we organize a room, put chairs around a table, and we all just listen to one another. We talk about what we love, make funny jokes, take photos together, and ask everyone to share about their week.</p><blockquote style=\"text-align: left; margin-top: 1rem; margin-right: 0px; margin-left: 0px; overflow-wrap: break-word; font-family: Poppins; font-size: 17.7952px; white-space: pre-wrap; -webkit-font-smoothing: antialiased !important;\" class=\"blockquote\"><span style=\"color: inherit; font-size: calc(0.6vw + 1rem);\">I’ve seen a bond among our children, and it is a deep love for one another. It is one reason why I love my job so much!</span></blockquote></h4>', 'Wed 11 Jan 2023', 'campus,career,learning-business', NULL, NULL, NULL, NULL),
(25, 'Sample Blog Post 1', 'General', '<p>This is the description for sample blog post 1.</p>', '', '', '', 'John 3:16', 'This is the conclusion for sample blog post 1.', 'Thu 17 Jul 2025', 'sample,blog', NULL, NULL, NULL, NULL),
(26, 'Sample Blog Post 2', 'General', '<p>This is the description for sample blog post 2.</p>', '', '', '', 'John 3:16', 'This is the conclusion for sample blog post 2.', 'Thu 17 Jul 2025', 'sample,blog', NULL, NULL, NULL, NULL),
(27, 'Sample Blog Post 3', 'General', '<p>This is the description for sample blog post 3.</p>', '', '', '', 'John 3:16', 'This is the conclusion for sample blog post 3.', 'Thu 17 Jul 2025', 'sample,blog', NULL, NULL, NULL, NULL),
(28, 'Sample Blog Post 4', 'General', '<p>This is the description for sample blog post 4.</p>', '', '', '', 'John 3:16', 'This is the conclusion for sample blog post 4.', 'Thu 17 Jul 2025', 'sample,blog', NULL, NULL, NULL, NULL),
(29, 'Sample Blog Post 5', 'General', '<p>This is the description for sample blog post 5.</p>', '', '', '', 'John 3:16', 'This is the conclusion for sample blog post 5.', 'Thu 17 Jul 2025', 'sample,blog', NULL, NULL, NULL, NULL),
(30, 'Sample Blog Post 6', 'General', '<p>This is the description for sample blog post 6.</p>', '', '', '', 'John 3:16', 'This is the conclusion for sample blog post 6.', 'Thu 17 Jul 2025', 'sample,blog', NULL, NULL, NULL, NULL),
(31, 'Sample Blog Post 7', 'General', '<p>This is the description for sample blog post 7.</p>', '', '', '', 'John 3:16', 'This is the conclusion for sample blog post 7.', 'Thu 17 Jul 2025', 'sample,blog', NULL, NULL, NULL, NULL),
(32, 'Sample Blog Post 8', 'General', '<p>This is the description for sample blog post 8.</p>', '', '', '', 'John 3:16', 'This is the conclusion for sample blog post 8.', 'Thu 17 Jul 2025', 'sample,blog', NULL, NULL, NULL, NULL),
(33, 'Sample Blog Post 9', 'General', '<p>This is the description for sample blog post 9.</p>', '', '', '', 'John 3:16', 'This is the conclusion for sample blog post 9.', 'Thu 17 Jul 2025', 'sample,blog', NULL, NULL, NULL, NULL),
(34, 'Sample Blog Post 10', 'General', '<p>This is the description for sample blog post 10.</p>', '', '', '', 'John 3:16', 'This is the conclusion for sample blog post 10.', 'Thu 17 Jul 2025', 'sample,blog', NULL, NULL, NULL, NULL),
(35, 'My Experience with General Education', 'student-stories', NULL, NULL, NULL, NULL, '', NULL, '', NULL, 'Morgan McLaughlin', 'Graduate Student', 'This story outlines my journey navigating the general education curriculum and how it shaped my academic path.', 'student-story-01-640x640.jpg'),
(36, 'My Top 5 Eyecab Moments', 'student-stories', NULL, NULL, NULL, NULL, '', NULL, '', NULL, 'Denise Henderson', 'Undergraduate Student', 'Here are the unforgettable experiences I had while being part of the Eyecab community!', 'student-story-02-640x640.jpg'),
(37, 'Should You Consider Taking a Gap Year?', 'student-stories', NULL, NULL, NULL, NULL, '', NULL, '', NULL, 'Charlie Doyle', 'Graduate Student', 'In this post, I discuss the pros and cons of taking a gap year and how it helped me find clarity.', 'student-story-03-640x640.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cat_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `cat_name`) VALUES
(5, 'Child-sponsorship'),
(6, 'HealthAndEducation'),
(10, 'Donations'),
(11, 'Orphans'),
(12, 'student-stories');

-- --------------------------------------------------------

--
-- Table structure for table `clearance_steps`
--

DROP TABLE IF EXISTS `clearance_steps`;
CREATE TABLE IF NOT EXISTS `clearance_steps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `department` varchar(255) DEFAULT NULL,
  `required_for_graduation` tinyint(1) DEFAULT '1',
  `order_sequence` int NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `clearance_steps`
--

INSERT INTO `clearance_steps` (`id`, `name`, `description`, `department`, `required_for_graduation`, `order_sequence`, `status`, `created_at`) VALUES
(1, 'Library Clearance', 'Return all borrowed books and pay outstanding fines', 'Library', 1, 1, 'active', '2025-07-27 13:56:07'),
(2, 'Finance Clearance', 'Clear all outstanding fees and financial obligations', 'Finance', 1, 2, 'active', '2025-07-27 13:56:07'),
(3, 'Hostel Clearance', 'Return hostel keys and clear accommodation fees', 'Student Affairs', 1, 3, 'active', '2025-07-27 13:56:07'),
(4, 'Department Clearance', 'Complete all academic requirements', 'Academic Department', 1, 4, 'active', '2025-07-27 13:56:07'),
(5, 'Registry Clearance', 'Final verification of academic records', 'Registry', 1, 5, 'active', '2025-07-27 13:56:07');

-- --------------------------------------------------------

--
-- Table structure for table `colleges`
--

DROP TABLE IF EXISTS `colleges`;
CREATE TABLE IF NOT EXISTS `colleges` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `dean_id` int DEFAULT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `dean_id` (`dean_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `colleges`
--

INSERT INTO `colleges` (`id`, `name`, `description`, `dean_id`, `logo`, `status`, `created_at`, `updated_at`) VALUES
(1, 'College of Computing and Information Sciences', 'Leading college in technology and computer sciences', 2, NULL, 'active', '2025-07-27 13:54:06', '2025-07-27 13:54:06'),
(2, 'College of Business and Management', 'Excellence in business education and management studies', NULL, NULL, 'active', '2025-07-27 13:54:06', '2025-07-27 13:54:06'),
(3, 'College of Engineering', 'Engineering programs and technical education', NULL, NULL, 'active', '2025-07-27 13:54:06', '2025-07-27 13:54:06'),
(4, 'College of Health Sciences', 'Medical and health-related programs', NULL, NULL, 'active', '2025-07-27 13:54:06', '2025-07-27 13:54:06'),
(5, 'College of Computing and Information Sciences', 'Leading college in technology and computer sciences', 2, NULL, 'active', '2025-07-27 13:56:07', '2025-07-27 13:56:07'),
(6, 'College of Business and Management', 'Excellence in business education and management studies', NULL, NULL, 'active', '2025-07-27 13:56:07', '2025-07-27 13:56:07'),
(7, 'College of Engineering', 'Engineering programs and technical education', NULL, NULL, 'active', '2025-07-27 13:56:07', '2025-07-27 13:56:07'),
(8, 'College of Health Sciences', 'Medical and health-related programs', NULL, NULL, 'active', '2025-07-27 13:56:07', '2025-07-27 13:56:07');

-- --------------------------------------------------------

--
-- Table structure for table `college_admins`
--

DROP TABLE IF EXISTS `college_admins`;
CREATE TABLE IF NOT EXISTS `college_admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `college_id` int NOT NULL,
  `permissions` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_college_admin` (`user_id`,`college_id`),
  KEY `college_id` (`college_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `blog_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `blog_id` (`blog_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `blog_id`, `name`, `email`, `comment`, `date`) VALUES
(1, 14, 'John Doe', 'johndoe@example.com', 'This is a great article!', '2023-01-12 00:44:00'),
(2, 14, 'Jane Smith', 'janesmith@example.com', 'I really enjoyed reading this. Thanks for sharing!', '2023-01-12 00:45:00'),
(3, 15, 'Peter Jones', 'peterjones@example.com', 'Interesting perspective. I have a few thoughts on this as well.', '2023-01-12 00:46:00'),
(4, 34, 'Alice', 'user1@example.com', 'This is a sample comment 1 for blog 34.', '2025-07-17 21:19:20'),
(5, 33, 'Bob', 'user2@example.com', 'This is a sample comment 2 for blog 33.', '2025-07-17 21:19:20'),
(6, 32, 'Charlie', 'user3@example.com', 'This is a sample comment 3 for blog 32.', '2025-07-17 21:19:20'),
(7, 31, 'Diana', 'user4@example.com', 'This is a sample comment 4 for blog 31.', '2025-07-17 21:19:20'),
(8, 30, 'Eve', 'user5@example.com', 'This is a sample comment 5 for blog 30.', '2025-07-17 21:19:20'),
(9, 29, 'Frank', 'user6@example.com', 'This is a sample comment 6 for blog 29.', '2025-07-17 21:19:20'),
(10, 28, 'Grace', 'user7@example.com', 'This is a sample comment 7 for blog 28.', '2025-07-17 21:19:20'),
(11, 27, 'Heidi', 'user8@example.com', 'This is a sample comment 8 for blog 27.', '2025-07-17 21:19:20'),
(12, 26, 'Ivan', 'user9@example.com', 'This is a sample comment 9 for blog 26.', '2025-07-17 21:19:20'),
(13, 25, 'Judy', 'user10@example.com', 'This is a sample comment 10 for blog 25.', '2025-07-17 21:19:20');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
CREATE TABLE IF NOT EXISTS `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `credits` int DEFAULT '3',
  `semester` int DEFAULT NULL,
  `year` int DEFAULT NULL,
  `instructor_id` int DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `schedule` varchar(100) DEFAULT NULL,
  `room` varchar(50) DEFAULT NULL,
  `max_students` int DEFAULT '50',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_courses_code` (`code`),
  KEY `idx_courses_instructor` (`instructor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `code`, `name`, `description`, `credits`, `semester`, `year`, `instructor_id`, `department_id`, `schedule`, `room`, `max_students`, `created_at`, `updated_at`) VALUES
(1, 'CS101', 'Introduction to Programming', 'Basic programming concepts', 3, NULL, NULL, 1, NULL, 'MWF 9:00-10:00', 'Lab 101', 50, '2025-08-05 10:44:38', '2025-08-05 10:44:38'),
(2, 'CS201', 'Data Structures', 'Advanced data structures', 3, NULL, NULL, 1, NULL, 'TTh 11:00-12:30', 'Room 205', 50, '2025-08-05 10:44:38', '2025-08-05 10:44:38'),
(3, 'MATH101', 'Calculus I', 'Differential calculus', 4, NULL, NULL, 1, NULL, 'MWF 8:00-9:00', 'Room 301', 50, '2025-08-05 10:44:38', '2025-08-05 10:44:38'),
(4, 'EE101', 'Circuit Analysis', 'Basic electrical circuits', 3, NULL, NULL, 1, NULL, 'TTh 2:00-3:30', 'Lab 201', 50, '2025-08-05 10:44:38', '2025-08-05 10:44:38');

-- --------------------------------------------------------

--
-- Table structure for table `course_assignments`
--

DROP TABLE IF EXISTS `course_assignments`;
CREATE TABLE IF NOT EXISTS `course_assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `lecturer_id` int NOT NULL,
  `college_id` int NOT NULL,
  `semester` varchar(50) NOT NULL,
  `year` varchar(10) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `assigned_by` int DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  KEY `lecturer_id` (`lecturer_id`),
  KEY `college_id` (`college_id`),
  KEY `assigned_by` (`assigned_by`),
  KEY `approved_by` (`approved_by`),
  KEY `idx_course_assignments_status` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_materials`
--

DROP TABLE IF EXISTS `course_materials`;
CREATE TABLE IF NOT EXISTS `course_materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `file_path` varchar(500) DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `type` enum('document','video','audio','image','other') DEFAULT 'document',
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_course_materials_course_type` (`course_id`,`type`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `course_materials`
--

INSERT INTO `course_materials` (`id`, `course_id`, `title`, `description`, `file_path`, `file_size`, `type`, `uploaded_at`) VALUES
(1, 1, 'Introduction to Binary Trees', 'Comprehensive guide to binary tree data structures', 'materials/cs301/binary_trees.pdf', 2560000, 'document', '2025-07-27 13:53:42'),
(2, 2, 'Database Normalization Lecture', 'Video lecture on database normalization techniques', 'materials/cs302/normalization.mp4', 45000000, 'video', '2025-07-27 13:53:42'),
(3, 3, 'Software Requirements Analysis', 'Guide to analyzing software requirements', 'materials/cs303/requirements.pdf', 1800000, 'document', '2025-07-27 13:53:42'),
(4, 4, 'Programming Fundamentals - Lecture Notes', NULL, '/materials/cs101/lecture_notes.pdf', 2634200, 'document', '2025-08-05 14:17:02'),
(5, 4, 'Introduction to Variables and Data Types', NULL, '/materials/cs101/variables_video.mp4', 3972344, 'video', '2025-08-05 14:17:03'),
(6, 4, 'Assignment 1 - Basic Programming', NULL, '/materials/cs101/assignment1.pdf', 5376763, 'document', '2025-08-05 14:17:03'),
(7, 6, 'Operating Systems Overview', NULL, '/materials/cs202/os_overview.pdf', 13479452, 'document', '2025-08-05 14:17:03'),
(8, 6, 'Process Management Lecture', NULL, '/materials/cs202/processes.mp4', 7625769, 'video', '2025-08-05 14:17:03'),
(9, 6, 'Memory Management Guide', NULL, '/materials/cs202/memory_guide.pdf', 11610704, 'document', '2025-08-05 14:17:03'),
(10, 8, 'Mathematical Logic Foundations', NULL, '/materials/math201/logic.pdf', 8074507, 'document', '2025-08-05 14:17:03'),
(11, 8, 'Graph Theory Concepts', NULL, '/materials/math201/graphs.pdf', 1349480, 'document', '2025-08-05 14:17:03'),
(12, 8, 'Set Theory Tutorial', NULL, '/materials/math201/sets_tutorial.mp4', 11330440, 'video', '2025-08-05 14:17:03');

-- --------------------------------------------------------

--
-- Table structure for table `course_registrations`
--

DROP TABLE IF EXISTS `course_registrations`;
CREATE TABLE IF NOT EXISTS `course_registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `registration_id` int NOT NULL,
  `course_code` varchar(20) NOT NULL,
  `course_title` varchar(255) NOT NULL,
  `category` enum('CORE','ELECTIVE','GENERAL') DEFAULT 'CORE',
  `credit_units` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_course_registrations_reg` (`registration_id`)
) ENGINE=MyISAM AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `course_registrations`
--

INSERT INTO `course_registrations` (`id`, `registration_id`, `course_code`, `course_title`, `category`, `credit_units`) VALUES
(1, 1, 'COA1101', 'FUNDAMENTAL ACCOUNTING PRINCIPLES', 'CORE', 5),
(2, 1, 'COA1102', 'QUANTITATIVE METHODS', 'CORE', 4),
(3, 1, 'COA1103', 'ENTREPRENEURSHIP PRINCIPLES', 'CORE', 3),
(4, 1, 'COB1101', 'INTRODUCTION TO BUSINESS ADMINISTRATION', 'CORE', 3),
(5, 1, 'COB1103', 'BUSINESS COMMUNICATION SKILLS', 'CORE', 3),
(6, 1, 'COB1105', 'FUNDAMENTALS OF PROCUREMENT AND LOGISTICS MANAGEMENT', 'CORE', 3),
(7, 2, 'COB1204', 'PRINCIPLES OF MARKETING', 'CORE', 3),
(8, 2, 'COA1205', 'BUSINESS STATISTICS', 'CORE', 4),
(9, 2, 'COA1202', 'ECONOMIC THEORY', 'CORE', 3),
(10, 2, 'COA1201', 'BUSINESS COMPUTING TECHNIQUES', 'CORE', 4),
(11, 2, 'COA1204', 'ORGANIZATIONAL THEORY AND MANAGEMENT', 'CORE', 3),
(12, 3, 'CS301', 'Data Structures & Algorithms', 'CORE', 3),
(13, 3, 'CS302', 'Database Management Systems', 'CORE', 4),
(14, 3, 'CS303', 'Software Engineering', 'CORE', 3),
(15, 4, 'CS301', 'Data Structures & Algorithms', 'CORE', 3),
(16, 4, 'CS302', 'Database Management Systems', 'CORE', 4),
(17, 4, 'CS303', 'Software Engineering', 'CORE', 3),
(18, 5, 'CS301', 'Data Structures & Algorithms', 'CORE', 3),
(19, 5, 'CS302', 'Database Management Systems', 'CORE', 4),
(20, 5, 'CS303', 'Software Engineering', 'CORE', 3),
(21, 6, 'CS301', 'Data Structures & Algorithms', 'CORE', 3),
(22, 6, 'CS302', 'Database Management Systems', 'CORE', 4),
(23, 6, 'CS303', 'Software Engineering', 'CORE', 3),
(24, 6, 'CS101', 'Programming Fundamentals', 'CORE', 3),
(25, 6, 'CS102', 'Object Oriented Programming', 'CORE', 4),
(26, 6, 'MATH201', 'Discrete Mathematics', 'CORE', 3);

-- --------------------------------------------------------

--
-- Stand-in structure for view `course_summary`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `course_summary`;
CREATE TABLE IF NOT EXISTS `course_summary` (
);

-- --------------------------------------------------------

--
-- Table structure for table `course_units`
--

DROP TABLE IF EXISTS `course_units`;
CREATE TABLE IF NOT EXISTS `course_units` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `code` varchar(20) NOT NULL,
  `description` text,
  `prerequisites` text,
  `credits` int NOT NULL,
  `instructor_id` int DEFAULT NULL,
  `instructor` varchar(255) DEFAULT NULL,
  `program_id` int DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `semester` int DEFAULT '1',
  `year` int DEFAULT '2025',
  `schedule` varchar(255) DEFAULT NULL,
  `room` varchar(100) DEFAULT NULL,
  `max_students` int DEFAULT '30',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `location` enum('On Campus','Online') NOT NULL DEFAULT 'On Campus',
  `application_deadline` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_courses_status_semester` (`status`,`semester`),
  KEY `idx_courses_instructor` (`instructor_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `course_units`
--

INSERT INTO `course_units` (`id`, `name`, `title`, `code`, `description`, `prerequisites`, `credits`, `instructor_id`, `instructor`, `program_id`, `department`, `semester`, `year`, `schedule`, `room`, `max_students`, `status`, `created_at`, `location`, `application_deadline`) VALUES
(1, 'Data Structures & Algorithms', 'Data Structures & Algorithms', 'CS301', 'Comprehensive course covering data structures and algorithms', NULL, 3, 1, 'TBA', 1, 'General', 1, 1, 'MWF 9:00-10:00 AM', 'CS-201', 45, 'active', '2025-07-27 20:53:41', 'On Campus', NULL),
(2, 'Database Management Systems', 'Database Management Systems', 'CS302', 'Introduction to database design and management', NULL, 4, 1, 'TBA', 1, 'General', 1, 1, 'TTh 2:00-3:30 PM', 'CS-305', 32, 'active', '2025-07-27 20:53:41', 'On Campus', NULL),
(3, 'Software Engineering', 'Software Engineering', 'CS303', 'Software development methodologies and practices', NULL, 3, 1, 'TBA', 1, 'General', 1, 1, 'MW 3:00-4:30 PM', 'CS-401', 28, 'active', '2025-07-27 20:53:41', 'On Campus', NULL),
(4, 'Programming Fundamentals', 'Programming Fundamentals', 'CS101', 'Introduction to programming concepts and logic', NULL, 3, 1, 'TBA', 1, 'General', 0, 2024, 'MWF 10:00-11:00 AM', 'CS-101', 50, 'active', '2025-08-05 13:51:41', 'On Campus', NULL),
(5, 'Object Oriented Programming', 'Object Oriented Programming', 'CS102', 'Advanced programming with object-oriented concepts', NULL, 4, 1, 'TBA', 1, 'General', 0, 2024, 'TTh 2:00-3:30 PM', 'CS-102', 50, 'active', '2025-08-05 13:51:41', 'On Campus', NULL),
(6, 'Discrete Mathematics', 'Discrete Mathematics', 'MATH201', 'Mathematical foundations for computer science', NULL, 3, 1, 'TBA', 1, 'General', 0, 2024, 'MWF 9:00-10:00 AM', 'MATH-201', 50, 'active', '2025-08-05 13:51:41', 'On Campus', NULL),
(7, 'Computer Networks', 'Computer Networks', 'CS201', 'Introduction to computer networking concepts', NULL, 3, 1, 'TBA', 1, 'General', 0, 2024, 'MW 1:00-2:30 PM', 'CS-201', 50, 'active', '2025-08-05 13:51:41', 'On Campus', NULL),
(8, 'Operating Systems', 'Operating Systems', 'CS202', 'Study of operating system principles and implementation', NULL, 4, 1, 'TBA', 1, 'General', 0, 2024, 'TTh 3:00-4:30 PM', 'CS-202', 50, 'active', '2025-08-05 13:51:41', 'On Campus', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `dashboard_cache`
--

DROP TABLE IF EXISTS `dashboard_cache`;
CREATE TABLE IF NOT EXISTS `dashboard_cache` (
  `student_id` int NOT NULL,
  `data` json NOT NULL,
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`),
  KEY `idx_dashboard_cache_updated` (`last_updated`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dashboard_cache`
--

INSERT INTO `dashboard_cache` (`student_id`, `data`, `last_updated`) VALUES
(1, '{\"fee_balance\": 6700.00, \"course_count\": 6, \"student_info\": {\"id\": 1, \"gpa\": 3.75, \"cgpa\": 2.56, \"name\": \"Chedikol Timothy\", \"year\": \"3rd Year\", \"email\": \"cheotim66@gmail.com\", \"program\": \"BSC-CS\", \"semester\": \"1\", \"student_id\": \"STD2024001\", \"credits_completed\": 89}, \"pending_assignments\": 9}', '2025-08-07 09:26:37');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(20) NOT NULL,
  `college_id` int NOT NULL,
  `head_id` int DEFAULT NULL,
  `description` text,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `college_id` (`college_id`),
  KEY `head_id` (`head_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `code`, `college_id`, `head_id`, `description`, `status`, `created_at`) VALUES
(1, 'Computer Science', 'CS', 1, 2, NULL, 'active', '2025-07-27 13:56:07'),
(2, 'Information Technology', 'IT', 1, NULL, NULL, 'active', '2025-07-27 13:56:07'),
(3, 'Software Engineering', 'SE', 1, NULL, NULL, 'active', '2025-07-27 13:56:07'),
(4, 'Business Administration', 'BA', 2, NULL, NULL, 'active', '2025-07-27 13:56:07'),
(5, 'Accounting', 'ACC', 2, NULL, NULL, 'active', '2025-07-27 13:56:07');

-- --------------------------------------------------------

--
-- Table structure for table `emails`
--

DROP TABLE IF EXISTS `emails`;
CREATE TABLE IF NOT EXISTS `emails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email_address` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'default',
  `phone` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `subject` varchar(100) NOT NULL,
  `message` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `program_id` int DEFAULT NULL,
  `grade` varchar(5) DEFAULT NULL,
  `progress` int DEFAULT '0',
  `status` enum('active','completed','dropped','withdrawn') DEFAULT 'active',
  `enrolled_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_enrollment` (`student_id`,`course_id`),
  KEY `idx_enrollments_student_course` (`student_id`,`course_id`),
  KEY `idx_enrollments_student_status` (`student_id`,`status`),
  KEY `idx_enrollments_course_status` (`course_id`,`status`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `student_id`, `course_id`, `program_id`, `grade`, `progress`, `status`, `enrolled_at`, `completed_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, 'A-', 85, 'active', '2025-07-27 13:53:41', NULL, '2025-08-07 08:58:39', '2025-08-07 08:58:40'),
(2, 1, 2, NULL, 'B+', 78, 'active', '2025-07-27 13:53:41', NULL, '2025-08-07 08:58:39', '2025-08-07 08:58:40'),
(3, 1, 3, NULL, 'A', 92, 'active', '2025-07-27 13:53:41', NULL, '2025-08-07 08:58:39', '2025-08-07 08:58:40'),
(4, 2, 1, NULL, NULL, 85, 'active', '2025-08-05 10:57:37', NULL, '2025-08-07 08:58:39', '2025-08-07 08:58:40'),
(5, 2, 2, NULL, NULL, 71, 'active', '2025-08-05 10:57:37', NULL, '2025-08-07 08:58:39', '2025-08-07 08:58:40'),
(6, 2, 4, NULL, NULL, 90, 'active', '2025-08-05 10:57:37', NULL, '2025-08-07 08:58:39', '2025-08-07 08:58:40'),
(7, 1, 4, NULL, 'A', 43, 'active', '2025-08-05 14:17:01', NULL, '2025-08-07 08:58:39', '2025-08-07 08:58:40'),
(8, 1, 6, NULL, 'B', 95, 'active', '2025-08-05 14:17:02', NULL, '2025-08-07 08:58:39', '2025-08-07 08:58:40'),
(9, 1, 8, NULL, 'A-', 26, 'active', '2025-08-05 14:17:02', NULL, '2025-08-07 08:58:39', '2025-08-07 08:58:40'),
(10, 2, 5, NULL, NULL, 0, 'active', '2025-08-05 16:47:01', NULL, '2025-08-07 08:58:39', '2025-08-07 08:58:40'),
(11, 2, 3, NULL, NULL, 0, 'active', '2025-08-05 16:47:48', NULL, '2025-08-07 08:58:39', '2025-08-07 08:58:40'),
(12, 2, 6, NULL, NULL, 0, 'active', '2025-08-05 16:49:48', NULL, '2025-08-07 08:58:39', '2025-08-07 08:58:40');

-- --------------------------------------------------------

--
-- Table structure for table `enrollment_history`
--

DROP TABLE IF EXISTS `enrollment_history`;
CREATE TABLE IF NOT EXISTS `enrollment_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `academic_year` varchar(20) NOT NULL,
  `semester` varchar(50) NOT NULL,
  `study_year` varchar(20) NOT NULL,
  `enrolled_as` enum('FRESHER','CONTINUING','TRANSFER') NOT NULL,
  `enrolled_by` varchar(100) DEFAULT 'STAFF',
  `enrollment_token` varchar(50) DEFAULT NULL,
  `enrolled_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','completed','cancelled') DEFAULT 'active',
  PRIMARY KEY (`id`),
  KEY `idx_enrollment_history_student` (`student_id`),
  KEY `idx_enrollment_history_year_sem` (`academic_year`,`semester`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `enrollment_history`
--

INSERT INTO `enrollment_history` (`id`, `student_id`, `academic_year`, `semester`, `study_year`, `enrolled_as`, `enrolled_by`, `enrollment_token`, `enrolled_at`, `status`) VALUES
(1, 1, '2024/2025', 'SEMESTER I', 'YEAR 1', 'FRESHER', 'STAFF', 'ENR241173637', '2024-09-04 16:07:41', 'active'),
(2, 1, '2024/2025', 'SEMESTER II', 'YEAR 1', 'CONTINUING', 'STAFF', 'ENR241173638', '2024-01-15 16:00:00', 'active'),
(3, 2, '2023', '1', '1', 'FRESHER', 'System Admin', 'ENR2023001', '2025-08-05 11:51:31', 'active'),
(4, 2, '2023', '2', '1', 'CONTINUING', 'System Admin', 'ENR2023002', '2025-08-05 11:51:31', 'active'),
(5, 2, '2024', '1', '2', 'CONTINUING', 'System Admin', 'ENR2024001', '2025-08-05 11:51:31', 'active'),
(6, 2, '2024/2025', 'SEMESTER I', '', 'FRESHER', 'system', NULL, '2025-08-01 17:00:00', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE IF NOT EXISTS `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time_from` time NOT NULL,
  `time_to` time NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `organiser` varchar(255) DEFAULT NULL,
  `slots` int DEFAULT NULL,
  `event_categories` varchar(255) DEFAULT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `map` varchar(255) DEFAULT NULL,
  `speaker_name` varchar(255) DEFAULT NULL,
  `speaker_img` varchar(255) DEFAULT NULL,
  `speaker_job` varchar(255) DEFAULT NULL,
  `speaker_description` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `date`, `time_from`, `time_to`, `img`, `location`, `organiser`, `slots`, `event_categories`, `description`, `price`, `email`, `phone`, `map`, `speaker_name`, `speaker_img`, `speaker_job`, `speaker_description`) VALUES
(1, 'AI & Future Careers Seminar', '2025-08-10', '14:00:00', '16:00:00', 'ai-seminar.jpg', 'Main Auditorium', 'Dr. Jane Smith', 100, 'Lecture, Career', 'This is a sample event description.', 49.99, 'admin@eyecab.com', '123 0039 68886', 'https://www.google.com/maps/search/?api=1&query=Senate+House,+London', 'Dr. Jane Smith', 'jane-smith.jpg', 'Professor of Education', 'Dr. Jane Smith is a leading expert in distance learning and educational technology.'),
(2, 'Digital Marketing Bootcamp', '2025-08-15', '10:00:00', '13:00:00', 'marketing.jpg', 'Room 201', 'Prof. Mark Lee', 50, 'Workshop, Marketing', 'This is a sample event description.', 49.99, 'admin@eyecab.com', '123 0039 68886', 'https://www.google.com/maps/search/?api=1&query=Senate+House,+London', 'Mr. John Doe', 'john-doe.jpg', 'Senior Developer', 'John Doe specializes in web development and online learning platforms.'),
(3, 'Health & Wellness Expo', '2025-08-20', '09:00:00', '12:00:00', 'wellness.jpg', 'Sports Complex', 'Dr. Amy Wong', 200, 'Expo, Health', 'This is a sample event description.', 49.99, 'admin@eyecab.com', '123 0039 68886', 'https://www.google.com/maps/search/?api=1&query=Senate+House,+London', 'Ms. Emily Carter', 'emily-carter.jpg', 'Instructional Designer', 'Emily Carter designs engaging online courses for universities worldwide.'),
(4, 'Startup Pitch Night', '2025-08-25', '18:00:00', '21:00:00', 'startup.jpg', 'Innovation Hub', 'Mr. Tom Green', 80, 'Networking, Business', 'This is a sample event description.', 49.99, 'admin@eyecab.com', '123 0039 68886', 'https://www.google.com/maps/search/?api=1&query=Senate+House,+London', 'Prof. Michael Lee', 'michael-lee.jpg', 'Researcher', 'Michael Lee researches the impact of technology on student outcomes.'),
(5, 'Art & Design Symposium', '2025-08-30', '11:00:00', '15:00:00', 'art-design.jpg', 'Gallery Hall', 'Ms. Rita Blue', 60, 'Symposium, Art', 'This is a sample event description.', 49.99, 'admin@eyecab.com', '123 0039 68886', 'https://www.google.com/maps/search/?api=1&query=Senate+House,+London', 'Dr. Sarah Kim', 'sarah-kim.jpg', 'Education Consultant', 'Sarah Kim consults for schools on best practices in remote teaching.');

-- --------------------------------------------------------

--
-- Table structure for table `exam_schedules`
--

DROP TABLE IF EXISTS `exam_schedules`;
CREATE TABLE IF NOT EXISTS `exam_schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_unit_code` varchar(20) NOT NULL,
  `course_unit_title` varchar(255) DEFAULT NULL,
  `program_id` int DEFAULT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `venue` varchar(255) NOT NULL,
  `duration` varchar(10) DEFAULT '2',
  `invigilator` varchar(255) DEFAULT 'TBA',
  `exam_type` enum('midterm','final','quiz','practical') DEFAULT 'final',
  `instructions` text,
  `status` enum('scheduled','completed','cancelled','postponed') DEFAULT 'scheduled',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_course_date` (`course_unit_code`,`date`),
  KEY `idx_exam_schedules_course` (`course_unit_code`),
  KEY `idx_exam_schedules_program` (`program_id`),
  KEY `idx_exam_schedules_date` (`date`),
  KEY `idx_exam_schedules_status` (`status`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `exam_schedules`
--

INSERT INTO `exam_schedules` (`id`, `course_unit_code`, `course_unit_title`, `program_id`, `date`, `time`, `venue`, `duration`, `invigilator`, `exam_type`, `instructions`, `status`, `created_at`, `updated_at`) VALUES
(1, 'CS101', 'Introduction to Computer Science', 1, '2025-09-15', '09:00:00', 'Room 101', '2', 'Dr. John Smith', 'midterm', NULL, 'scheduled', '2025-08-07 08:48:45', '2025-08-07 08:48:45'),
(2, 'CS102', 'Data Structures and Algorithms', 1, '2025-09-16', '14:00:00', 'Room 102', '3', 'Dr. John Smith', 'midterm', NULL, 'scheduled', '2025-08-07 08:48:45', '2025-08-07 08:48:45'),
(3, 'MATH101', 'Calculus I', 2, '2025-09-17', '10:00:00', 'Room 201', '3', 'Prof. Jane Doe', 'midterm', NULL, 'scheduled', '2025-08-07 08:48:45', '2025-08-07 08:48:45');

-- --------------------------------------------------------

--
-- Table structure for table `fees_structure`
--

DROP TABLE IF EXISTS `fees_structure`;
CREATE TABLE IF NOT EXISTS `fees_structure` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_code` varchar(20) NOT NULL,
  `year_level` int NOT NULL,
  `semester` int NOT NULL,
  `fee_category` varchar(100) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'UGX',
  `description` text,
  `is_mandatory` tinyint(1) DEFAULT '1',
  `effective_from` date DEFAULT NULL,
  `effective_to` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_program_year_sem` (`program_code`,`year_level`,`semester`)
) ENGINE=MyISAM AUTO_INCREMENT=1865 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fees_structure`
--

INSERT INTO `fees_structure` (`id`, `program_code`, `year_level`, `semester`, `fee_category`, `amount`, `currency`, `description`, `is_mandatory`, `effective_from`, `effective_to`, `created_at`) VALUES
(940, 'CS', 1, 1, 'Tuition Fees', 2500000.00, 'UGX', 'Tuition Fees for Bachelor of Science in Computer Science - Year 1 Semester 1 (ACADEMIC)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(941, 'CS', 1, 1, 'Registration Fees', 150000.00, 'UGX', 'Registration Fees for Bachelor of Science in Computer Science - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(942, 'CS', 1, 1, 'Library Fees', 100000.00, 'UGX', 'Library Fees for Bachelor of Science in Computer Science - Year 1 Semester 1 (FACILITY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(943, 'CS', 1, 1, 'Internet & WiFi Fees', 100000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Science in Computer Science - Year 1 Semester 1 (TECHNOLOGY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(944, 'CS', 1, 1, 'Student ID Card', 25000.00, 'UGX', 'Student ID Card for Bachelor of Science in Computer Science - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(945, 'CS', 1, 1, 'Medical Services Fee', 80000.00, 'UGX', 'Medical Services Fee for Bachelor of Science in Computer Science - Year 1 Semester 1 (SERVICES)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(946, 'CS', 1, 1, 'Sports & Recreation Fee', 75000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Science in Computer Science - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(947, 'CS', 1, 1, 'Student Activities Fee', 150000.00, 'UGX', 'Student Activities Fee for Bachelor of Science in Computer Science - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(948, 'CS', 1, 1, 'Late Registration Fee', 100000.00, 'UGX', 'Late Registration Fee for Bachelor of Science in Computer Science - Year 1 Semester 1 (PENALTY)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(949, 'CS', 1, 1, 'Transcript Fee', 50000.00, 'UGX', 'Transcript Fee for Bachelor of Science in Computer Science - Year 1 Semester 1 (ADMINISTRATIVE)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(950, 'CS', 1, 2, 'Tuition Fees', 2550000.00, 'UGX', 'Tuition Fees for Bachelor of Science in Computer Science - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(951, 'CS', 1, 2, 'Registration Fees', 150000.00, 'UGX', 'Registration Fees for Bachelor of Science in Computer Science - Year 1 Semester 2 (ADMINISTRATIVE)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(952, 'CS', 1, 2, 'Examination Fees', 200000.00, 'UGX', 'Examination Fees for Bachelor of Science in Computer Science - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(953, 'CS', 1, 2, 'Library Fees', 100000.00, 'UGX', 'Library Fees for Bachelor of Science in Computer Science - Year 1 Semester 2 (FACILITY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(954, 'CS', 1, 2, 'Internet & WiFi Fees', 100000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Science in Computer Science - Year 1 Semester 2 (TECHNOLOGY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(955, 'CS', 1, 2, 'Medical Services Fee', 80000.00, 'UGX', 'Medical Services Fee for Bachelor of Science in Computer Science - Year 1 Semester 2 (SERVICES)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(956, 'CS', 1, 2, 'Sports & Recreation Fee', 75000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Science in Computer Science - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(957, 'CS', 1, 2, 'Student Activities Fee', 150000.00, 'UGX', 'Student Activities Fee for Bachelor of Science in Computer Science - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(958, 'CS', 1, 2, 'Late Registration Fee', 100000.00, 'UGX', 'Late Registration Fee for Bachelor of Science in Computer Science - Year 1 Semester 2 (PENALTY)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(959, 'CS', 1, 2, 'Transcript Fee', 50000.00, 'UGX', 'Transcript Fee for Bachelor of Science in Computer Science - Year 1 Semester 2 (ADMINISTRATIVE)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(960, 'CS', 2, 1, 'Tuition Fees', 2625000.00, 'UGX', 'Tuition Fees for Bachelor of Science in Computer Science - Year 2 Semester 1 (ACADEMIC)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(961, 'CS', 2, 1, 'Library Fees', 105000.00, 'UGX', 'Library Fees for Bachelor of Science in Computer Science - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(962, 'CS', 2, 1, 'Computer Lab Fees', 315000.00, 'UGX', 'Computer Lab Fees for Bachelor of Science in Computer Science - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(963, 'CS', 2, 1, 'Software Licensing Fees', 263000.00, 'UGX', 'Software Licensing Fees for Bachelor of Science in Computer Science - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(964, 'CS', 2, 1, 'Internet & WiFi Fees', 105000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Science in Computer Science - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(965, 'CS', 2, 1, 'Medical Services Fee', 84000.00, 'UGX', 'Medical Services Fee for Bachelor of Science in Computer Science - Year 2 Semester 1 (SERVICES)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(966, 'CS', 2, 1, 'Sports & Recreation Fee', 79000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Science in Computer Science - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(967, 'CS', 2, 1, 'Student Activities Fee', 158000.00, 'UGX', 'Student Activities Fee for Bachelor of Science in Computer Science - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(968, 'CS', 2, 1, 'Industry Workshop Access', 158000.00, 'UGX', 'Industry Workshop Access for Bachelor of Science in Computer Science - Year 2 Semester 1 (ENHANCEMENT)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(969, 'CS', 2, 1, 'Late Registration Fee', 105000.00, 'UGX', 'Late Registration Fee for Bachelor of Science in Computer Science - Year 2 Semester 1 (PENALTY)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(970, 'CS', 2, 1, 'Transcript Fee', 53000.00, 'UGX', 'Transcript Fee for Bachelor of Science in Computer Science - Year 2 Semester 1 (ADMINISTRATIVE)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(971, 'CS', 2, 2, 'Tuition Fees', 2678000.00, 'UGX', 'Tuition Fees for Bachelor of Science in Computer Science - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(972, 'CS', 2, 2, 'Examination Fees', 210000.00, 'UGX', 'Examination Fees for Bachelor of Science in Computer Science - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(973, 'CS', 2, 2, 'Library Fees', 105000.00, 'UGX', 'Library Fees for Bachelor of Science in Computer Science - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(974, 'CS', 2, 2, 'Computer Lab Fees', 315000.00, 'UGX', 'Computer Lab Fees for Bachelor of Science in Computer Science - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(975, 'CS', 2, 2, 'Software Licensing Fees', 263000.00, 'UGX', 'Software Licensing Fees for Bachelor of Science in Computer Science - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(976, 'CS', 2, 2, 'Internet & WiFi Fees', 105000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Science in Computer Science - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(977, 'CS', 2, 2, 'Medical Services Fee', 84000.00, 'UGX', 'Medical Services Fee for Bachelor of Science in Computer Science - Year 2 Semester 2 (SERVICES)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(978, 'CS', 2, 2, 'Sports & Recreation Fee', 79000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Science in Computer Science - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(979, 'CS', 2, 2, 'Student Activities Fee', 158000.00, 'UGX', 'Student Activities Fee for Bachelor of Science in Computer Science - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(980, 'CS', 2, 2, 'Industry Workshop Access', 158000.00, 'UGX', 'Industry Workshop Access for Bachelor of Science in Computer Science - Year 2 Semester 2 (ENHANCEMENT)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(981, 'CS', 2, 2, 'Late Registration Fee', 105000.00, 'UGX', 'Late Registration Fee for Bachelor of Science in Computer Science - Year 2 Semester 2 (PENALTY)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(982, 'CS', 2, 2, 'Transcript Fee', 53000.00, 'UGX', 'Transcript Fee for Bachelor of Science in Computer Science - Year 2 Semester 2 (ADMINISTRATIVE)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(983, 'CS', 3, 1, 'Tuition Fees', 2756000.00, 'UGX', 'Tuition Fees for Bachelor of Science in Computer Science - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(984, 'CS', 3, 1, 'Library Fees', 110000.00, 'UGX', 'Library Fees for Bachelor of Science in Computer Science - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(985, 'CS', 3, 1, 'Computer Lab Fees', 331000.00, 'UGX', 'Computer Lab Fees for Bachelor of Science in Computer Science - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(986, 'CS', 3, 1, 'Software Licensing Fees', 276000.00, 'UGX', 'Software Licensing Fees for Bachelor of Science in Computer Science - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(987, 'CS', 3, 1, 'Internet & WiFi Fees', 110000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Science in Computer Science - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(988, 'CS', 3, 1, 'Equipment Usage Fees', 221000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Science in Computer Science - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(989, 'CS', 3, 1, 'Project Development Fees', 441000.00, 'UGX', 'Project Development Fees for Bachelor of Science in Computer Science - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(990, 'CS', 3, 1, 'Research Methodology Fees', 165000.00, 'UGX', 'Research Methodology Fees for Bachelor of Science in Computer Science - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(991, 'CS', 3, 1, 'Medical Services Fee', 88000.00, 'UGX', 'Medical Services Fee for Bachelor of Science in Computer Science - Year 3 Semester 1 (SERVICES)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(992, 'CS', 3, 1, 'Sports & Recreation Fee', 83000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Science in Computer Science - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(993, 'CS', 3, 1, 'Student Activities Fee', 165000.00, 'UGX', 'Student Activities Fee for Bachelor of Science in Computer Science - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(994, 'CS', 3, 1, 'Career Services Fee', 110000.00, 'UGX', 'Career Services Fee for Bachelor of Science in Computer Science - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(995, 'CS', 3, 1, 'Professional Certification Prep', 221000.00, 'UGX', 'Professional Certification Prep for Bachelor of Science in Computer Science - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(996, 'CS', 3, 1, 'Industry Workshop Access', 165000.00, 'UGX', 'Industry Workshop Access for Bachelor of Science in Computer Science - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(997, 'CS', 3, 1, 'Late Registration Fee', 110000.00, 'UGX', 'Late Registration Fee for Bachelor of Science in Computer Science - Year 3 Semester 1 (PENALTY)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(998, 'CS', 3, 1, 'Transcript Fee', 55000.00, 'UGX', 'Transcript Fee for Bachelor of Science in Computer Science - Year 3 Semester 1 (ADMINISTRATIVE)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(999, 'CS', 3, 2, 'Tuition Fees', 2811000.00, 'UGX', 'Tuition Fees for Bachelor of Science in Computer Science - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1000, 'CS', 3, 2, 'Examination Fees', 221000.00, 'UGX', 'Examination Fees for Bachelor of Science in Computer Science - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1001, 'CS', 3, 2, 'Library Fees', 110000.00, 'UGX', 'Library Fees for Bachelor of Science in Computer Science - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1002, 'CS', 3, 2, 'Computer Lab Fees', 331000.00, 'UGX', 'Computer Lab Fees for Bachelor of Science in Computer Science - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1003, 'CS', 3, 2, 'Software Licensing Fees', 276000.00, 'UGX', 'Software Licensing Fees for Bachelor of Science in Computer Science - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1004, 'CS', 3, 2, 'Internet & WiFi Fees', 110000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Science in Computer Science - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1005, 'CS', 3, 2, 'Equipment Usage Fees', 221000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Science in Computer Science - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1006, 'CS', 3, 2, 'Project Development Fees', 441000.00, 'UGX', 'Project Development Fees for Bachelor of Science in Computer Science - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1007, 'CS', 3, 2, 'Research Methodology Fees', 165000.00, 'UGX', 'Research Methodology Fees for Bachelor of Science in Computer Science - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1008, 'CS', 3, 2, 'Industry Attachment Fees', 331000.00, 'UGX', 'Industry Attachment Fees for Bachelor of Science in Computer Science - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1009, 'CS', 3, 2, 'Medical Services Fee', 88000.00, 'UGX', 'Medical Services Fee for Bachelor of Science in Computer Science - Year 3 Semester 2 (SERVICES)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1010, 'CS', 3, 2, 'Sports & Recreation Fee', 83000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Science in Computer Science - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1011, 'CS', 3, 2, 'Student Activities Fee', 165000.00, 'UGX', 'Student Activities Fee for Bachelor of Science in Computer Science - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1012, 'CS', 3, 2, 'Career Services Fee', 110000.00, 'UGX', 'Career Services Fee for Bachelor of Science in Computer Science - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1013, 'CS', 3, 2, 'Professional Certification Prep', 221000.00, 'UGX', 'Professional Certification Prep for Bachelor of Science in Computer Science - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1014, 'CS', 3, 2, 'Industry Workshop Access', 165000.00, 'UGX', 'Industry Workshop Access for Bachelor of Science in Computer Science - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1015, 'CS', 3, 2, 'Late Registration Fee', 110000.00, 'UGX', 'Late Registration Fee for Bachelor of Science in Computer Science - Year 3 Semester 2 (PENALTY)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1016, 'CS', 3, 2, 'Transcript Fee', 55000.00, 'UGX', 'Transcript Fee for Bachelor of Science in Computer Science - Year 3 Semester 2 (ADMINISTRATIVE)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1017, 'CS', 4, 1, 'Tuition Fees', 2894000.00, 'UGX', 'Tuition Fees for Bachelor of Science in Computer Science - Year 4 Semester 1 (ACADEMIC)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1018, 'CS', 4, 1, 'Library Fees', 116000.00, 'UGX', 'Library Fees for Bachelor of Science in Computer Science - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1019, 'CS', 4, 1, 'Computer Lab Fees', 347000.00, 'UGX', 'Computer Lab Fees for Bachelor of Science in Computer Science - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1020, 'CS', 4, 1, 'Software Licensing Fees', 289000.00, 'UGX', 'Software Licensing Fees for Bachelor of Science in Computer Science - Year 4 Semester 1 (TECHNOLOGY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1021, 'CS', 4, 1, 'Internet & WiFi Fees', 116000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Science in Computer Science - Year 4 Semester 1 (TECHNOLOGY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1022, 'CS', 4, 1, 'Equipment Usage Fees', 232000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Science in Computer Science - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1023, 'CS', 4, 1, 'Project Development Fees', 463000.00, 'UGX', 'Project Development Fees for Bachelor of Science in Computer Science - Year 4 Semester 1 (ACADEMIC)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1024, 'CS', 4, 1, 'Medical Services Fee', 93000.00, 'UGX', 'Medical Services Fee for Bachelor of Science in Computer Science - Year 4 Semester 1 (SERVICES)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1025, 'CS', 4, 1, 'Sports & Recreation Fee', 87000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Science in Computer Science - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1026, 'CS', 4, 1, 'Student Activities Fee', 174000.00, 'UGX', 'Student Activities Fee for Bachelor of Science in Computer Science - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1027, 'CS', 4, 1, 'Career Services Fee', 116000.00, 'UGX', 'Career Services Fee for Bachelor of Science in Computer Science - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1028, 'CS', 4, 1, 'Professional Certification Prep', 232000.00, 'UGX', 'Professional Certification Prep for Bachelor of Science in Computer Science - Year 4 Semester 1 (ENHANCEMENT)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1029, 'CS', 4, 1, 'Industry Workshop Access', 174000.00, 'UGX', 'Industry Workshop Access for Bachelor of Science in Computer Science - Year 4 Semester 1 (ENHANCEMENT)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1030, 'CS', 4, 1, 'Alumni Network Access', 58000.00, 'UGX', 'Alumni Network Access for Bachelor of Science in Computer Science - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1031, 'CS', 4, 1, 'Job Placement Assistance', 116000.00, 'UGX', 'Job Placement Assistance for Bachelor of Science in Computer Science - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1032, 'CS', 4, 1, 'Late Registration Fee', 116000.00, 'UGX', 'Late Registration Fee for Bachelor of Science in Computer Science - Year 4 Semester 1 (PENALTY)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1033, 'CS', 4, 1, 'Transcript Fee', 58000.00, 'UGX', 'Transcript Fee for Bachelor of Science in Computer Science - Year 4 Semester 1 (ADMINISTRATIVE)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1034, 'CS', 4, 1, 'Certificate Fee', 174000.00, 'UGX', 'Certificate Fee for Bachelor of Science in Computer Science - Year 4 Semester 1 (ADMINISTRATIVE)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1035, 'CS', 4, 2, 'Tuition Fees', 2952000.00, 'UGX', 'Tuition Fees for Bachelor of Science in Computer Science - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1036, 'CS', 4, 2, 'Examination Fees', 232000.00, 'UGX', 'Examination Fees for Bachelor of Science in Computer Science - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1037, 'CS', 4, 2, 'Library Fees', 116000.00, 'UGX', 'Library Fees for Bachelor of Science in Computer Science - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1038, 'CS', 4, 2, 'Computer Lab Fees', 347000.00, 'UGX', 'Computer Lab Fees for Bachelor of Science in Computer Science - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1039, 'CS', 4, 2, 'Software Licensing Fees', 289000.00, 'UGX', 'Software Licensing Fees for Bachelor of Science in Computer Science - Year 4 Semester 2 (TECHNOLOGY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1040, 'CS', 4, 2, 'Internet & WiFi Fees', 116000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Science in Computer Science - Year 4 Semester 2 (TECHNOLOGY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1041, 'CS', 4, 2, 'Equipment Usage Fees', 232000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Science in Computer Science - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1042, 'CS', 4, 2, 'Project Development Fees', 463000.00, 'UGX', 'Project Development Fees for Bachelor of Science in Computer Science - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1043, 'CS', 4, 2, 'Thesis/Final Project Fee', 579000.00, 'UGX', 'Thesis/Final Project Fee for Bachelor of Science in Computer Science - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1044, 'CS', 4, 2, 'Medical Services Fee', 93000.00, 'UGX', 'Medical Services Fee for Bachelor of Science in Computer Science - Year 4 Semester 2 (SERVICES)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1045, 'CS', 4, 2, 'Sports & Recreation Fee', 87000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Science in Computer Science - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1046, 'CS', 4, 2, 'Student Activities Fee', 174000.00, 'UGX', 'Student Activities Fee for Bachelor of Science in Computer Science - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1047, 'CS', 4, 2, 'Career Services Fee', 116000.00, 'UGX', 'Career Services Fee for Bachelor of Science in Computer Science - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1048, 'CS', 4, 2, 'Professional Certification Prep', 232000.00, 'UGX', 'Professional Certification Prep for Bachelor of Science in Computer Science - Year 4 Semester 2 (ENHANCEMENT)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1049, 'CS', 4, 2, 'Industry Workshop Access', 174000.00, 'UGX', 'Industry Workshop Access for Bachelor of Science in Computer Science - Year 4 Semester 2 (ENHANCEMENT)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1050, 'CS', 4, 2, 'Alumni Network Access', 58000.00, 'UGX', 'Alumni Network Access for Bachelor of Science in Computer Science - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1051, 'CS', 4, 2, 'Job Placement Assistance', 116000.00, 'UGX', 'Job Placement Assistance for Bachelor of Science in Computer Science - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1052, 'CS', 4, 2, 'Late Registration Fee', 116000.00, 'UGX', 'Late Registration Fee for Bachelor of Science in Computer Science - Year 4 Semester 2 (PENALTY)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1053, 'CS', 4, 2, 'Transcript Fee', 58000.00, 'UGX', 'Transcript Fee for Bachelor of Science in Computer Science - Year 4 Semester 2 (ADMINISTRATIVE)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1054, 'CS', 4, 2, 'Certificate Fee', 174000.00, 'UGX', 'Certificate Fee for Bachelor of Science in Computer Science - Year 4 Semester 2 (ADMINISTRATIVE)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1055, 'CS', 4, 2, 'Graduation Fee', 347000.00, 'UGX', 'Graduation Fee for Bachelor of Science in Computer Science - Year 4 Semester 2 (ADMINISTRATIVE)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1056, 'IT', 1, 1, 'Tuition Fees', 2375000.00, 'UGX', 'Tuition Fees for Bachelor of Information Technology - Year 1 Semester 1 (ACADEMIC)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1057, 'IT', 1, 1, 'Registration Fees', 143000.00, 'UGX', 'Registration Fees for Bachelor of Information Technology - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1058, 'IT', 1, 1, 'Library Fees', 95000.00, 'UGX', 'Library Fees for Bachelor of Information Technology - Year 1 Semester 1 (FACILITY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1059, 'IT', 1, 1, 'Internet & WiFi Fees', 95000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Technology - Year 1 Semester 1 (TECHNOLOGY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1060, 'IT', 1, 1, 'Student ID Card', 24000.00, 'UGX', 'Student ID Card for Bachelor of Information Technology - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1061, 'IT', 1, 1, 'Medical Services Fee', 76000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Technology - Year 1 Semester 1 (SERVICES)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1062, 'IT', 1, 1, 'Sports & Recreation Fee', 71000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Technology - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1063, 'IT', 1, 1, 'Student Activities Fee', 143000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Technology - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1064, 'IT', 1, 1, 'Late Registration Fee', 95000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Technology - Year 1 Semester 1 (PENALTY)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1065, 'IT', 1, 1, 'Transcript Fee', 48000.00, 'UGX', 'Transcript Fee for Bachelor of Information Technology - Year 1 Semester 1 (ADMINISTRATIVE)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1066, 'IT', 1, 2, 'Tuition Fees', 2423000.00, 'UGX', 'Tuition Fees for Bachelor of Information Technology - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1067, 'IT', 1, 2, 'Registration Fees', 143000.00, 'UGX', 'Registration Fees for Bachelor of Information Technology - Year 1 Semester 2 (ADMINISTRATIVE)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1068, 'IT', 1, 2, 'Examination Fees', 190000.00, 'UGX', 'Examination Fees for Bachelor of Information Technology - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1069, 'IT', 1, 2, 'Library Fees', 95000.00, 'UGX', 'Library Fees for Bachelor of Information Technology - Year 1 Semester 2 (FACILITY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1070, 'IT', 1, 2, 'Internet & WiFi Fees', 95000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Technology - Year 1 Semester 2 (TECHNOLOGY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1071, 'IT', 1, 2, 'Medical Services Fee', 76000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Technology - Year 1 Semester 2 (SERVICES)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1072, 'IT', 1, 2, 'Sports & Recreation Fee', 71000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Technology - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1073, 'IT', 1, 2, 'Student Activities Fee', 143000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Technology - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1074, 'IT', 1, 2, 'Late Registration Fee', 95000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Technology - Year 1 Semester 2 (PENALTY)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1075, 'IT', 1, 2, 'Transcript Fee', 48000.00, 'UGX', 'Transcript Fee for Bachelor of Information Technology - Year 1 Semester 2 (ADMINISTRATIVE)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1076, 'IT', 2, 1, 'Tuition Fees', 2494000.00, 'UGX', 'Tuition Fees for Bachelor of Information Technology - Year 2 Semester 1 (ACADEMIC)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1077, 'IT', 2, 1, 'Library Fees', 100000.00, 'UGX', 'Library Fees for Bachelor of Information Technology - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1078, 'IT', 2, 1, 'Computer Lab Fees', 299000.00, 'UGX', 'Computer Lab Fees for Bachelor of Information Technology - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1079, 'IT', 2, 1, 'Software Licensing Fees', 249000.00, 'UGX', 'Software Licensing Fees for Bachelor of Information Technology - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1080, 'IT', 2, 1, 'Internet & WiFi Fees', 100000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Technology - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1081, 'IT', 2, 1, 'Medical Services Fee', 80000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Technology - Year 2 Semester 1 (SERVICES)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1082, 'IT', 2, 1, 'Sports & Recreation Fee', 75000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Technology - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1083, 'IT', 2, 1, 'Student Activities Fee', 150000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Technology - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1084, 'IT', 2, 1, 'Industry Workshop Access', 150000.00, 'UGX', 'Industry Workshop Access for Bachelor of Information Technology - Year 2 Semester 1 (ENHANCEMENT)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1085, 'IT', 2, 1, 'Late Registration Fee', 100000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Technology - Year 2 Semester 1 (PENALTY)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1086, 'IT', 2, 1, 'Transcript Fee', 50000.00, 'UGX', 'Transcript Fee for Bachelor of Information Technology - Year 2 Semester 1 (ADMINISTRATIVE)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1087, 'IT', 2, 2, 'Tuition Fees', 2544000.00, 'UGX', 'Tuition Fees for Bachelor of Information Technology - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1088, 'IT', 2, 2, 'Examination Fees', 200000.00, 'UGX', 'Examination Fees for Bachelor of Information Technology - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1089, 'IT', 2, 2, 'Library Fees', 100000.00, 'UGX', 'Library Fees for Bachelor of Information Technology - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1090, 'IT', 2, 2, 'Computer Lab Fees', 299000.00, 'UGX', 'Computer Lab Fees for Bachelor of Information Technology - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1091, 'IT', 2, 2, 'Software Licensing Fees', 249000.00, 'UGX', 'Software Licensing Fees for Bachelor of Information Technology - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1092, 'IT', 2, 2, 'Internet & WiFi Fees', 100000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Technology - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1093, 'IT', 2, 2, 'Medical Services Fee', 80000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Technology - Year 2 Semester 2 (SERVICES)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1094, 'IT', 2, 2, 'Sports & Recreation Fee', 75000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Technology - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1095, 'IT', 2, 2, 'Student Activities Fee', 150000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Technology - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1096, 'IT', 2, 2, 'Industry Workshop Access', 150000.00, 'UGX', 'Industry Workshop Access for Bachelor of Information Technology - Year 2 Semester 2 (ENHANCEMENT)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1097, 'IT', 2, 2, 'Late Registration Fee', 100000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Technology - Year 2 Semester 2 (PENALTY)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1098, 'IT', 2, 2, 'Transcript Fee', 50000.00, 'UGX', 'Transcript Fee for Bachelor of Information Technology - Year 2 Semester 2 (ADMINISTRATIVE)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1099, 'IT', 3, 1, 'Tuition Fees', 2618000.00, 'UGX', 'Tuition Fees for Bachelor of Information Technology - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1100, 'IT', 3, 1, 'Library Fees', 105000.00, 'UGX', 'Library Fees for Bachelor of Information Technology - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1101, 'IT', 3, 1, 'Computer Lab Fees', 314000.00, 'UGX', 'Computer Lab Fees for Bachelor of Information Technology - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1102, 'IT', 3, 1, 'Software Licensing Fees', 262000.00, 'UGX', 'Software Licensing Fees for Bachelor of Information Technology - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1103, 'IT', 3, 1, 'Internet & WiFi Fees', 105000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Technology - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1104, 'IT', 3, 1, 'Equipment Usage Fees', 209000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Information Technology - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1105, 'IT', 3, 1, 'Project Development Fees', 419000.00, 'UGX', 'Project Development Fees for Bachelor of Information Technology - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1106, 'IT', 3, 1, 'Research Methodology Fees', 157000.00, 'UGX', 'Research Methodology Fees for Bachelor of Information Technology - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1107, 'IT', 3, 1, 'Medical Services Fee', 84000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Technology - Year 3 Semester 1 (SERVICES)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1108, 'IT', 3, 1, 'Sports & Recreation Fee', 79000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Technology - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1109, 'IT', 3, 1, 'Student Activities Fee', 157000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Technology - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1110, 'IT', 3, 1, 'Career Services Fee', 105000.00, 'UGX', 'Career Services Fee for Bachelor of Information Technology - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1111, 'IT', 3, 1, 'Professional Certification Prep', 209000.00, 'UGX', 'Professional Certification Prep for Bachelor of Information Technology - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1112, 'IT', 3, 1, 'Industry Workshop Access', 157000.00, 'UGX', 'Industry Workshop Access for Bachelor of Information Technology - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1113, 'IT', 3, 1, 'Late Registration Fee', 105000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Technology - Year 3 Semester 1 (PENALTY)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1114, 'IT', 3, 1, 'Transcript Fee', 52000.00, 'UGX', 'Transcript Fee for Bachelor of Information Technology - Year 3 Semester 1 (ADMINISTRATIVE)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1115, 'IT', 3, 2, 'Tuition Fees', 2671000.00, 'UGX', 'Tuition Fees for Bachelor of Information Technology - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1116, 'IT', 3, 2, 'Examination Fees', 209000.00, 'UGX', 'Examination Fees for Bachelor of Information Technology - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1117, 'IT', 3, 2, 'Library Fees', 105000.00, 'UGX', 'Library Fees for Bachelor of Information Technology - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1118, 'IT', 3, 2, 'Computer Lab Fees', 314000.00, 'UGX', 'Computer Lab Fees for Bachelor of Information Technology - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1119, 'IT', 3, 2, 'Software Licensing Fees', 262000.00, 'UGX', 'Software Licensing Fees for Bachelor of Information Technology - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1120, 'IT', 3, 2, 'Internet & WiFi Fees', 105000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Technology - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1121, 'IT', 3, 2, 'Equipment Usage Fees', 209000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Information Technology - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1122, 'IT', 3, 2, 'Project Development Fees', 419000.00, 'UGX', 'Project Development Fees for Bachelor of Information Technology - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1123, 'IT', 3, 2, 'Research Methodology Fees', 157000.00, 'UGX', 'Research Methodology Fees for Bachelor of Information Technology - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1124, 'IT', 3, 2, 'Industry Attachment Fees', 314000.00, 'UGX', 'Industry Attachment Fees for Bachelor of Information Technology - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1125, 'IT', 3, 2, 'Medical Services Fee', 84000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Technology - Year 3 Semester 2 (SERVICES)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1126, 'IT', 3, 2, 'Sports & Recreation Fee', 79000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Technology - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1127, 'IT', 3, 2, 'Student Activities Fee', 157000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Technology - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1128, 'IT', 3, 2, 'Career Services Fee', 105000.00, 'UGX', 'Career Services Fee for Bachelor of Information Technology - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1129, 'IT', 3, 2, 'Professional Certification Prep', 209000.00, 'UGX', 'Professional Certification Prep for Bachelor of Information Technology - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1130, 'IT', 3, 2, 'Industry Workshop Access', 157000.00, 'UGX', 'Industry Workshop Access for Bachelor of Information Technology - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1131, 'IT', 3, 2, 'Late Registration Fee', 105000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Technology - Year 3 Semester 2 (PENALTY)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1132, 'IT', 3, 2, 'Transcript Fee', 52000.00, 'UGX', 'Transcript Fee for Bachelor of Information Technology - Year 3 Semester 2 (ADMINISTRATIVE)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1133, 'IT', 4, 1, 'Tuition Fees', 2749000.00, 'UGX', 'Tuition Fees for Bachelor of Information Technology - Year 4 Semester 1 (ACADEMIC)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1134, 'IT', 4, 1, 'Library Fees', 110000.00, 'UGX', 'Library Fees for Bachelor of Information Technology - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1135, 'IT', 4, 1, 'Computer Lab Fees', 330000.00, 'UGX', 'Computer Lab Fees for Bachelor of Information Technology - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1136, 'IT', 4, 1, 'Software Licensing Fees', 275000.00, 'UGX', 'Software Licensing Fees for Bachelor of Information Technology - Year 4 Semester 1 (TECHNOLOGY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1137, 'IT', 4, 1, 'Internet & WiFi Fees', 110000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Technology - Year 4 Semester 1 (TECHNOLOGY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1138, 'IT', 4, 1, 'Equipment Usage Fees', 220000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Information Technology - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1139, 'IT', 4, 1, 'Project Development Fees', 440000.00, 'UGX', 'Project Development Fees for Bachelor of Information Technology - Year 4 Semester 1 (ACADEMIC)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1140, 'IT', 4, 1, 'Medical Services Fee', 88000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Technology - Year 4 Semester 1 (SERVICES)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1141, 'IT', 4, 1, 'Sports & Recreation Fee', 82000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Technology - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1142, 'IT', 4, 1, 'Student Activities Fee', 165000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Technology - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1143, 'IT', 4, 1, 'Career Services Fee', 110000.00, 'UGX', 'Career Services Fee for Bachelor of Information Technology - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1144, 'IT', 4, 1, 'Professional Certification Prep', 220000.00, 'UGX', 'Professional Certification Prep for Bachelor of Information Technology - Year 4 Semester 1 (ENHANCEMENT)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1145, 'IT', 4, 1, 'Industry Workshop Access', 165000.00, 'UGX', 'Industry Workshop Access for Bachelor of Information Technology - Year 4 Semester 1 (ENHANCEMENT)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1146, 'IT', 4, 1, 'Alumni Network Access', 55000.00, 'UGX', 'Alumni Network Access for Bachelor of Information Technology - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1147, 'IT', 4, 1, 'Job Placement Assistance', 110000.00, 'UGX', 'Job Placement Assistance for Bachelor of Information Technology - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1148, 'IT', 4, 1, 'Late Registration Fee', 110000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Technology - Year 4 Semester 1 (PENALTY)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1149, 'IT', 4, 1, 'Transcript Fee', 55000.00, 'UGX', 'Transcript Fee for Bachelor of Information Technology - Year 4 Semester 1 (ADMINISTRATIVE)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1150, 'IT', 4, 1, 'Certificate Fee', 165000.00, 'UGX', 'Certificate Fee for Bachelor of Information Technology - Year 4 Semester 1 (ADMINISTRATIVE)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1151, 'IT', 4, 2, 'Tuition Fees', 2804000.00, 'UGX', 'Tuition Fees for Bachelor of Information Technology - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1152, 'IT', 4, 2, 'Examination Fees', 220000.00, 'UGX', 'Examination Fees for Bachelor of Information Technology - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1153, 'IT', 4, 2, 'Library Fees', 110000.00, 'UGX', 'Library Fees for Bachelor of Information Technology - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1154, 'IT', 4, 2, 'Computer Lab Fees', 330000.00, 'UGX', 'Computer Lab Fees for Bachelor of Information Technology - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1155, 'IT', 4, 2, 'Software Licensing Fees', 275000.00, 'UGX', 'Software Licensing Fees for Bachelor of Information Technology - Year 4 Semester 2 (TECHNOLOGY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1156, 'IT', 4, 2, 'Internet & WiFi Fees', 110000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Technology - Year 4 Semester 2 (TECHNOLOGY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1157, 'IT', 4, 2, 'Equipment Usage Fees', 220000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Information Technology - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1158, 'IT', 4, 2, 'Project Development Fees', 440000.00, 'UGX', 'Project Development Fees for Bachelor of Information Technology - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1159, 'IT', 4, 2, 'Thesis/Final Project Fee', 550000.00, 'UGX', 'Thesis/Final Project Fee for Bachelor of Information Technology - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1160, 'IT', 4, 2, 'Medical Services Fee', 88000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Technology - Year 4 Semester 2 (SERVICES)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1161, 'IT', 4, 2, 'Sports & Recreation Fee', 82000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Technology - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1162, 'IT', 4, 2, 'Student Activities Fee', 165000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Technology - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1163, 'IT', 4, 2, 'Career Services Fee', 110000.00, 'UGX', 'Career Services Fee for Bachelor of Information Technology - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1164, 'IT', 4, 2, 'Professional Certification Prep', 220000.00, 'UGX', 'Professional Certification Prep for Bachelor of Information Technology - Year 4 Semester 2 (ENHANCEMENT)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1165, 'IT', 4, 2, 'Industry Workshop Access', 165000.00, 'UGX', 'Industry Workshop Access for Bachelor of Information Technology - Year 4 Semester 2 (ENHANCEMENT)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1166, 'IT', 4, 2, 'Alumni Network Access', 55000.00, 'UGX', 'Alumni Network Access for Bachelor of Information Technology - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1167, 'IT', 4, 2, 'Job Placement Assistance', 110000.00, 'UGX', 'Job Placement Assistance for Bachelor of Information Technology - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1168, 'IT', 4, 2, 'Late Registration Fee', 110000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Technology - Year 4 Semester 2 (PENALTY)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1169, 'IT', 4, 2, 'Transcript Fee', 55000.00, 'UGX', 'Transcript Fee for Bachelor of Information Technology - Year 4 Semester 2 (ADMINISTRATIVE)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1170, 'IT', 4, 2, 'Certificate Fee', 165000.00, 'UGX', 'Certificate Fee for Bachelor of Information Technology - Year 4 Semester 2 (ADMINISTRATIVE)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1171, 'IT', 4, 2, 'Graduation Fee', 330000.00, 'UGX', 'Graduation Fee for Bachelor of Information Technology - Year 4 Semester 2 (ADMINISTRATIVE)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1172, 'SE', 1, 1, 'Tuition Fees', 2750000.00, 'UGX', 'Tuition Fees for Bachelor of Software Engineering - Year 1 Semester 1 (ACADEMIC)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1173, 'SE', 1, 1, 'Registration Fees', 165000.00, 'UGX', 'Registration Fees for Bachelor of Software Engineering - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1174, 'SE', 1, 1, 'Library Fees', 110000.00, 'UGX', 'Library Fees for Bachelor of Software Engineering - Year 1 Semester 1 (FACILITY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1175, 'SE', 1, 1, 'Internet & WiFi Fees', 110000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Software Engineering - Year 1 Semester 1 (TECHNOLOGY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1176, 'SE', 1, 1, 'Student ID Card', 28000.00, 'UGX', 'Student ID Card for Bachelor of Software Engineering - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17');
INSERT INTO `fees_structure` (`id`, `program_code`, `year_level`, `semester`, `fee_category`, `amount`, `currency`, `description`, `is_mandatory`, `effective_from`, `effective_to`, `created_at`) VALUES
(1177, 'SE', 1, 1, 'Medical Services Fee', 88000.00, 'UGX', 'Medical Services Fee for Bachelor of Software Engineering - Year 1 Semester 1 (SERVICES)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1178, 'SE', 1, 1, 'Sports & Recreation Fee', 83000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Software Engineering - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1179, 'SE', 1, 1, 'Student Activities Fee', 165000.00, 'UGX', 'Student Activities Fee for Bachelor of Software Engineering - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1180, 'SE', 1, 1, 'Late Registration Fee', 110000.00, 'UGX', 'Late Registration Fee for Bachelor of Software Engineering - Year 1 Semester 1 (PENALTY)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1181, 'SE', 1, 1, 'Transcript Fee', 55000.00, 'UGX', 'Transcript Fee for Bachelor of Software Engineering - Year 1 Semester 1 (ADMINISTRATIVE)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1182, 'SE', 1, 2, 'Tuition Fees', 2805000.00, 'UGX', 'Tuition Fees for Bachelor of Software Engineering - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1183, 'SE', 1, 2, 'Registration Fees', 165000.00, 'UGX', 'Registration Fees for Bachelor of Software Engineering - Year 1 Semester 2 (ADMINISTRATIVE)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1184, 'SE', 1, 2, 'Examination Fees', 220000.00, 'UGX', 'Examination Fees for Bachelor of Software Engineering - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1185, 'SE', 1, 2, 'Library Fees', 110000.00, 'UGX', 'Library Fees for Bachelor of Software Engineering - Year 1 Semester 2 (FACILITY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1186, 'SE', 1, 2, 'Internet & WiFi Fees', 110000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Software Engineering - Year 1 Semester 2 (TECHNOLOGY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1187, 'SE', 1, 2, 'Medical Services Fee', 88000.00, 'UGX', 'Medical Services Fee for Bachelor of Software Engineering - Year 1 Semester 2 (SERVICES)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1188, 'SE', 1, 2, 'Sports & Recreation Fee', 83000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Software Engineering - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1189, 'SE', 1, 2, 'Student Activities Fee', 165000.00, 'UGX', 'Student Activities Fee for Bachelor of Software Engineering - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1190, 'SE', 1, 2, 'Late Registration Fee', 110000.00, 'UGX', 'Late Registration Fee for Bachelor of Software Engineering - Year 1 Semester 2 (PENALTY)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1191, 'SE', 1, 2, 'Transcript Fee', 55000.00, 'UGX', 'Transcript Fee for Bachelor of Software Engineering - Year 1 Semester 2 (ADMINISTRATIVE)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1192, 'SE', 2, 1, 'Tuition Fees', 2888000.00, 'UGX', 'Tuition Fees for Bachelor of Software Engineering - Year 2 Semester 1 (ACADEMIC)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1193, 'SE', 2, 1, 'Library Fees', 116000.00, 'UGX', 'Library Fees for Bachelor of Software Engineering - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1194, 'SE', 2, 1, 'Computer Lab Fees', 347000.00, 'UGX', 'Computer Lab Fees for Bachelor of Software Engineering - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1195, 'SE', 2, 1, 'Software Licensing Fees', 289000.00, 'UGX', 'Software Licensing Fees for Bachelor of Software Engineering - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1196, 'SE', 2, 1, 'Internet & WiFi Fees', 116000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Software Engineering - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1197, 'SE', 2, 1, 'Medical Services Fee', 92000.00, 'UGX', 'Medical Services Fee for Bachelor of Software Engineering - Year 2 Semester 1 (SERVICES)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1198, 'SE', 2, 1, 'Sports & Recreation Fee', 87000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Software Engineering - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1199, 'SE', 2, 1, 'Student Activities Fee', 173000.00, 'UGX', 'Student Activities Fee for Bachelor of Software Engineering - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1200, 'SE', 2, 1, 'Industry Workshop Access', 173000.00, 'UGX', 'Industry Workshop Access for Bachelor of Software Engineering - Year 2 Semester 1 (ENHANCEMENT)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1201, 'SE', 2, 1, 'Late Registration Fee', 116000.00, 'UGX', 'Late Registration Fee for Bachelor of Software Engineering - Year 2 Semester 1 (PENALTY)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1202, 'SE', 2, 1, 'Transcript Fee', 58000.00, 'UGX', 'Transcript Fee for Bachelor of Software Engineering - Year 2 Semester 1 (ADMINISTRATIVE)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1203, 'SE', 2, 2, 'Tuition Fees', 2945000.00, 'UGX', 'Tuition Fees for Bachelor of Software Engineering - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1204, 'SE', 2, 2, 'Examination Fees', 231000.00, 'UGX', 'Examination Fees for Bachelor of Software Engineering - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1205, 'SE', 2, 2, 'Library Fees', 116000.00, 'UGX', 'Library Fees for Bachelor of Software Engineering - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1206, 'SE', 2, 2, 'Computer Lab Fees', 347000.00, 'UGX', 'Computer Lab Fees for Bachelor of Software Engineering - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1207, 'SE', 2, 2, 'Software Licensing Fees', 289000.00, 'UGX', 'Software Licensing Fees for Bachelor of Software Engineering - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1208, 'SE', 2, 2, 'Internet & WiFi Fees', 116000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Software Engineering - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1209, 'SE', 2, 2, 'Medical Services Fee', 92000.00, 'UGX', 'Medical Services Fee for Bachelor of Software Engineering - Year 2 Semester 2 (SERVICES)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1210, 'SE', 2, 2, 'Sports & Recreation Fee', 87000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Software Engineering - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1211, 'SE', 2, 2, 'Student Activities Fee', 173000.00, 'UGX', 'Student Activities Fee for Bachelor of Software Engineering - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1212, 'SE', 2, 2, 'Industry Workshop Access', 173000.00, 'UGX', 'Industry Workshop Access for Bachelor of Software Engineering - Year 2 Semester 2 (ENHANCEMENT)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1213, 'SE', 2, 2, 'Late Registration Fee', 116000.00, 'UGX', 'Late Registration Fee for Bachelor of Software Engineering - Year 2 Semester 2 (PENALTY)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1214, 'SE', 2, 2, 'Transcript Fee', 58000.00, 'UGX', 'Transcript Fee for Bachelor of Software Engineering - Year 2 Semester 2 (ADMINISTRATIVE)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1215, 'SE', 3, 1, 'Tuition Fees', 3032000.00, 'UGX', 'Tuition Fees for Bachelor of Software Engineering - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1216, 'SE', 3, 1, 'Library Fees', 121000.00, 'UGX', 'Library Fees for Bachelor of Software Engineering - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1217, 'SE', 3, 1, 'Computer Lab Fees', 364000.00, 'UGX', 'Computer Lab Fees for Bachelor of Software Engineering - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1218, 'SE', 3, 1, 'Software Licensing Fees', 303000.00, 'UGX', 'Software Licensing Fees for Bachelor of Software Engineering - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1219, 'SE', 3, 1, 'Internet & WiFi Fees', 121000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Software Engineering - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1220, 'SE', 3, 1, 'Equipment Usage Fees', 243000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Software Engineering - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1221, 'SE', 3, 1, 'Project Development Fees', 485000.00, 'UGX', 'Project Development Fees for Bachelor of Software Engineering - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1222, 'SE', 3, 1, 'Research Methodology Fees', 182000.00, 'UGX', 'Research Methodology Fees for Bachelor of Software Engineering - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1223, 'SE', 3, 1, 'Medical Services Fee', 97000.00, 'UGX', 'Medical Services Fee for Bachelor of Software Engineering - Year 3 Semester 1 (SERVICES)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1224, 'SE', 3, 1, 'Sports & Recreation Fee', 91000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Software Engineering - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1225, 'SE', 3, 1, 'Student Activities Fee', 182000.00, 'UGX', 'Student Activities Fee for Bachelor of Software Engineering - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1226, 'SE', 3, 1, 'Career Services Fee', 121000.00, 'UGX', 'Career Services Fee for Bachelor of Software Engineering - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1227, 'SE', 3, 1, 'Enterprise Software Fee', 606000.00, 'UGX', 'Enterprise Software Fee for Bachelor of Software Engineering - Year 3 Semester 1 (SPECIALIZED)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1228, 'SE', 3, 1, 'Professional Certification Prep', 243000.00, 'UGX', 'Professional Certification Prep for Bachelor of Software Engineering - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1229, 'SE', 3, 1, 'Industry Workshop Access', 182000.00, 'UGX', 'Industry Workshop Access for Bachelor of Software Engineering - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1230, 'SE', 3, 1, 'Late Registration Fee', 121000.00, 'UGX', 'Late Registration Fee for Bachelor of Software Engineering - Year 3 Semester 1 (PENALTY)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1231, 'SE', 3, 1, 'Transcript Fee', 61000.00, 'UGX', 'Transcript Fee for Bachelor of Software Engineering - Year 3 Semester 1 (ADMINISTRATIVE)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1232, 'SE', 3, 2, 'Tuition Fees', 3093000.00, 'UGX', 'Tuition Fees for Bachelor of Software Engineering - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1233, 'SE', 3, 2, 'Examination Fees', 243000.00, 'UGX', 'Examination Fees for Bachelor of Software Engineering - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1234, 'SE', 3, 2, 'Library Fees', 121000.00, 'UGX', 'Library Fees for Bachelor of Software Engineering - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1235, 'SE', 3, 2, 'Computer Lab Fees', 364000.00, 'UGX', 'Computer Lab Fees for Bachelor of Software Engineering - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1236, 'SE', 3, 2, 'Software Licensing Fees', 303000.00, 'UGX', 'Software Licensing Fees for Bachelor of Software Engineering - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1237, 'SE', 3, 2, 'Internet & WiFi Fees', 121000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Software Engineering - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1238, 'SE', 3, 2, 'Equipment Usage Fees', 243000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Software Engineering - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1239, 'SE', 3, 2, 'Project Development Fees', 485000.00, 'UGX', 'Project Development Fees for Bachelor of Software Engineering - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1240, 'SE', 3, 2, 'Research Methodology Fees', 182000.00, 'UGX', 'Research Methodology Fees for Bachelor of Software Engineering - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1241, 'SE', 3, 2, 'Industry Attachment Fees', 364000.00, 'UGX', 'Industry Attachment Fees for Bachelor of Software Engineering - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1242, 'SE', 3, 2, 'Medical Services Fee', 97000.00, 'UGX', 'Medical Services Fee for Bachelor of Software Engineering - Year 3 Semester 2 (SERVICES)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1243, 'SE', 3, 2, 'Sports & Recreation Fee', 91000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Software Engineering - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1244, 'SE', 3, 2, 'Student Activities Fee', 182000.00, 'UGX', 'Student Activities Fee for Bachelor of Software Engineering - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1245, 'SE', 3, 2, 'Career Services Fee', 121000.00, 'UGX', 'Career Services Fee for Bachelor of Software Engineering - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1246, 'SE', 3, 2, 'Enterprise Software Fee', 606000.00, 'UGX', 'Enterprise Software Fee for Bachelor of Software Engineering - Year 3 Semester 2 (SPECIALIZED)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1247, 'SE', 3, 2, 'Professional Certification Prep', 243000.00, 'UGX', 'Professional Certification Prep for Bachelor of Software Engineering - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1248, 'SE', 3, 2, 'Industry Workshop Access', 182000.00, 'UGX', 'Industry Workshop Access for Bachelor of Software Engineering - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1249, 'SE', 3, 2, 'Late Registration Fee', 121000.00, 'UGX', 'Late Registration Fee for Bachelor of Software Engineering - Year 3 Semester 2 (PENALTY)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1250, 'SE', 3, 2, 'Transcript Fee', 61000.00, 'UGX', 'Transcript Fee for Bachelor of Software Engineering - Year 3 Semester 2 (ADMINISTRATIVE)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1251, 'SE', 4, 1, 'Tuition Fees', 3183000.00, 'UGX', 'Tuition Fees for Bachelor of Software Engineering - Year 4 Semester 1 (ACADEMIC)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1252, 'SE', 4, 1, 'Library Fees', 127000.00, 'UGX', 'Library Fees for Bachelor of Software Engineering - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1253, 'SE', 4, 1, 'Computer Lab Fees', 382000.00, 'UGX', 'Computer Lab Fees for Bachelor of Software Engineering - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1254, 'SE', 4, 1, 'Software Licensing Fees', 318000.00, 'UGX', 'Software Licensing Fees for Bachelor of Software Engineering - Year 4 Semester 1 (TECHNOLOGY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1255, 'SE', 4, 1, 'Internet & WiFi Fees', 127000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Software Engineering - Year 4 Semester 1 (TECHNOLOGY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1256, 'SE', 4, 1, 'Equipment Usage Fees', 255000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Software Engineering - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1257, 'SE', 4, 1, 'Project Development Fees', 509000.00, 'UGX', 'Project Development Fees for Bachelor of Software Engineering - Year 4 Semester 1 (ACADEMIC)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1258, 'SE', 4, 1, 'Medical Services Fee', 102000.00, 'UGX', 'Medical Services Fee for Bachelor of Software Engineering - Year 4 Semester 1 (SERVICES)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1259, 'SE', 4, 1, 'Sports & Recreation Fee', 96000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Software Engineering - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1260, 'SE', 4, 1, 'Student Activities Fee', 191000.00, 'UGX', 'Student Activities Fee for Bachelor of Software Engineering - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1261, 'SE', 4, 1, 'Career Services Fee', 127000.00, 'UGX', 'Career Services Fee for Bachelor of Software Engineering - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1262, 'SE', 4, 1, 'Enterprise Software Fee', 637000.00, 'UGX', 'Enterprise Software Fee for Bachelor of Software Engineering - Year 4 Semester 1 (SPECIALIZED)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1263, 'SE', 4, 1, 'Professional Certification Prep', 255000.00, 'UGX', 'Professional Certification Prep for Bachelor of Software Engineering - Year 4 Semester 1 (ENHANCEMENT)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1264, 'SE', 4, 1, 'Industry Workshop Access', 191000.00, 'UGX', 'Industry Workshop Access for Bachelor of Software Engineering - Year 4 Semester 1 (ENHANCEMENT)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1265, 'SE', 4, 1, 'Alumni Network Access', 64000.00, 'UGX', 'Alumni Network Access for Bachelor of Software Engineering - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1266, 'SE', 4, 1, 'Job Placement Assistance', 127000.00, 'UGX', 'Job Placement Assistance for Bachelor of Software Engineering - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1267, 'SE', 4, 1, 'Late Registration Fee', 127000.00, 'UGX', 'Late Registration Fee for Bachelor of Software Engineering - Year 4 Semester 1 (PENALTY)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1268, 'SE', 4, 1, 'Transcript Fee', 64000.00, 'UGX', 'Transcript Fee for Bachelor of Software Engineering - Year 4 Semester 1 (ADMINISTRATIVE)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1269, 'SE', 4, 1, 'Certificate Fee', 191000.00, 'UGX', 'Certificate Fee for Bachelor of Software Engineering - Year 4 Semester 1 (ADMINISTRATIVE)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1270, 'SE', 4, 2, 'Tuition Fees', 3247000.00, 'UGX', 'Tuition Fees for Bachelor of Software Engineering - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1271, 'SE', 4, 2, 'Examination Fees', 255000.00, 'UGX', 'Examination Fees for Bachelor of Software Engineering - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1272, 'SE', 4, 2, 'Library Fees', 127000.00, 'UGX', 'Library Fees for Bachelor of Software Engineering - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1273, 'SE', 4, 2, 'Computer Lab Fees', 382000.00, 'UGX', 'Computer Lab Fees for Bachelor of Software Engineering - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1274, 'SE', 4, 2, 'Software Licensing Fees', 318000.00, 'UGX', 'Software Licensing Fees for Bachelor of Software Engineering - Year 4 Semester 2 (TECHNOLOGY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1275, 'SE', 4, 2, 'Internet & WiFi Fees', 127000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Software Engineering - Year 4 Semester 2 (TECHNOLOGY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1276, 'SE', 4, 2, 'Equipment Usage Fees', 255000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Software Engineering - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1277, 'SE', 4, 2, 'Project Development Fees', 509000.00, 'UGX', 'Project Development Fees for Bachelor of Software Engineering - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1278, 'SE', 4, 2, 'Thesis/Final Project Fee', 637000.00, 'UGX', 'Thesis/Final Project Fee for Bachelor of Software Engineering - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1279, 'SE', 4, 2, 'Medical Services Fee', 102000.00, 'UGX', 'Medical Services Fee for Bachelor of Software Engineering - Year 4 Semester 2 (SERVICES)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1280, 'SE', 4, 2, 'Sports & Recreation Fee', 96000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Software Engineering - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1281, 'SE', 4, 2, 'Student Activities Fee', 191000.00, 'UGX', 'Student Activities Fee for Bachelor of Software Engineering - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1282, 'SE', 4, 2, 'Career Services Fee', 127000.00, 'UGX', 'Career Services Fee for Bachelor of Software Engineering - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1283, 'SE', 4, 2, 'Enterprise Software Fee', 637000.00, 'UGX', 'Enterprise Software Fee for Bachelor of Software Engineering - Year 4 Semester 2 (SPECIALIZED)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1284, 'SE', 4, 2, 'Professional Certification Prep', 255000.00, 'UGX', 'Professional Certification Prep for Bachelor of Software Engineering - Year 4 Semester 2 (ENHANCEMENT)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1285, 'SE', 4, 2, 'Industry Workshop Access', 191000.00, 'UGX', 'Industry Workshop Access for Bachelor of Software Engineering - Year 4 Semester 2 (ENHANCEMENT)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1286, 'SE', 4, 2, 'Alumni Network Access', 64000.00, 'UGX', 'Alumni Network Access for Bachelor of Software Engineering - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1287, 'SE', 4, 2, 'Job Placement Assistance', 127000.00, 'UGX', 'Job Placement Assistance for Bachelor of Software Engineering - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1288, 'SE', 4, 2, 'Late Registration Fee', 127000.00, 'UGX', 'Late Registration Fee for Bachelor of Software Engineering - Year 4 Semester 2 (PENALTY)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1289, 'SE', 4, 2, 'Transcript Fee', 64000.00, 'UGX', 'Transcript Fee for Bachelor of Software Engineering - Year 4 Semester 2 (ADMINISTRATIVE)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1290, 'SE', 4, 2, 'Certificate Fee', 191000.00, 'UGX', 'Certificate Fee for Bachelor of Software Engineering - Year 4 Semester 2 (ADMINISTRATIVE)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1291, 'SE', 4, 2, 'Graduation Fee', 382000.00, 'UGX', 'Graduation Fee for Bachelor of Software Engineering - Year 4 Semester 2 (ADMINISTRATIVE)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1292, 'IS', 1, 1, 'Tuition Fees', 2250000.00, 'UGX', 'Tuition Fees for Bachelor of Information Systems - Year 1 Semester 1 (ACADEMIC)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1293, 'IS', 1, 1, 'Registration Fees', 135000.00, 'UGX', 'Registration Fees for Bachelor of Information Systems - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1294, 'IS', 1, 1, 'Library Fees', 90000.00, 'UGX', 'Library Fees for Bachelor of Information Systems - Year 1 Semester 1 (FACILITY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1295, 'IS', 1, 1, 'Internet & WiFi Fees', 90000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Systems - Year 1 Semester 1 (TECHNOLOGY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1296, 'IS', 1, 1, 'Student ID Card', 23000.00, 'UGX', 'Student ID Card for Bachelor of Information Systems - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1297, 'IS', 1, 1, 'Medical Services Fee', 72000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Systems - Year 1 Semester 1 (SERVICES)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1298, 'IS', 1, 1, 'Sports & Recreation Fee', 68000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Systems - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1299, 'IS', 1, 1, 'Student Activities Fee', 135000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Systems - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1300, 'IS', 1, 1, 'Late Registration Fee', 90000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Systems - Year 1 Semester 1 (PENALTY)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1301, 'IS', 1, 1, 'Transcript Fee', 45000.00, 'UGX', 'Transcript Fee for Bachelor of Information Systems - Year 1 Semester 1 (ADMINISTRATIVE)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1302, 'IS', 1, 2, 'Tuition Fees', 2295000.00, 'UGX', 'Tuition Fees for Bachelor of Information Systems - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1303, 'IS', 1, 2, 'Registration Fees', 135000.00, 'UGX', 'Registration Fees for Bachelor of Information Systems - Year 1 Semester 2 (ADMINISTRATIVE)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1304, 'IS', 1, 2, 'Examination Fees', 180000.00, 'UGX', 'Examination Fees for Bachelor of Information Systems - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1305, 'IS', 1, 2, 'Library Fees', 90000.00, 'UGX', 'Library Fees for Bachelor of Information Systems - Year 1 Semester 2 (FACILITY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1306, 'IS', 1, 2, 'Internet & WiFi Fees', 90000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Systems - Year 1 Semester 2 (TECHNOLOGY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1307, 'IS', 1, 2, 'Medical Services Fee', 72000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Systems - Year 1 Semester 2 (SERVICES)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1308, 'IS', 1, 2, 'Sports & Recreation Fee', 68000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Systems - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1309, 'IS', 1, 2, 'Student Activities Fee', 135000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Systems - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1310, 'IS', 1, 2, 'Late Registration Fee', 90000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Systems - Year 1 Semester 2 (PENALTY)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1311, 'IS', 1, 2, 'Transcript Fee', 45000.00, 'UGX', 'Transcript Fee for Bachelor of Information Systems - Year 1 Semester 2 (ADMINISTRATIVE)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1312, 'IS', 2, 1, 'Tuition Fees', 2363000.00, 'UGX', 'Tuition Fees for Bachelor of Information Systems - Year 2 Semester 1 (ACADEMIC)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1313, 'IS', 2, 1, 'Library Fees', 95000.00, 'UGX', 'Library Fees for Bachelor of Information Systems - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1314, 'IS', 2, 1, 'Computer Lab Fees', 284000.00, 'UGX', 'Computer Lab Fees for Bachelor of Information Systems - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1315, 'IS', 2, 1, 'Software Licensing Fees', 236000.00, 'UGX', 'Software Licensing Fees for Bachelor of Information Systems - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1316, 'IS', 2, 1, 'Internet & WiFi Fees', 95000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Systems - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1317, 'IS', 2, 1, 'Medical Services Fee', 76000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Systems - Year 2 Semester 1 (SERVICES)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1318, 'IS', 2, 1, 'Sports & Recreation Fee', 71000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Systems - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1319, 'IS', 2, 1, 'Student Activities Fee', 142000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Systems - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1320, 'IS', 2, 1, 'Industry Workshop Access', 142000.00, 'UGX', 'Industry Workshop Access for Bachelor of Information Systems - Year 2 Semester 1 (ENHANCEMENT)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1321, 'IS', 2, 1, 'Late Registration Fee', 95000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Systems - Year 2 Semester 1 (PENALTY)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1322, 'IS', 2, 1, 'Transcript Fee', 47000.00, 'UGX', 'Transcript Fee for Bachelor of Information Systems - Year 2 Semester 1 (ADMINISTRATIVE)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1323, 'IS', 2, 2, 'Tuition Fees', 2410000.00, 'UGX', 'Tuition Fees for Bachelor of Information Systems - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1324, 'IS', 2, 2, 'Examination Fees', 189000.00, 'UGX', 'Examination Fees for Bachelor of Information Systems - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1325, 'IS', 2, 2, 'Library Fees', 95000.00, 'UGX', 'Library Fees for Bachelor of Information Systems - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1326, 'IS', 2, 2, 'Computer Lab Fees', 284000.00, 'UGX', 'Computer Lab Fees for Bachelor of Information Systems - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1327, 'IS', 2, 2, 'Software Licensing Fees', 236000.00, 'UGX', 'Software Licensing Fees for Bachelor of Information Systems - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1328, 'IS', 2, 2, 'Internet & WiFi Fees', 95000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Systems - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1329, 'IS', 2, 2, 'Medical Services Fee', 76000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Systems - Year 2 Semester 2 (SERVICES)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1330, 'IS', 2, 2, 'Sports & Recreation Fee', 71000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Systems - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1331, 'IS', 2, 2, 'Student Activities Fee', 142000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Systems - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1332, 'IS', 2, 2, 'Industry Workshop Access', 142000.00, 'UGX', 'Industry Workshop Access for Bachelor of Information Systems - Year 2 Semester 2 (ENHANCEMENT)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1333, 'IS', 2, 2, 'Late Registration Fee', 95000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Systems - Year 2 Semester 2 (PENALTY)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1334, 'IS', 2, 2, 'Transcript Fee', 47000.00, 'UGX', 'Transcript Fee for Bachelor of Information Systems - Year 2 Semester 2 (ADMINISTRATIVE)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1335, 'IS', 3, 1, 'Tuition Fees', 2481000.00, 'UGX', 'Tuition Fees for Bachelor of Information Systems - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1336, 'IS', 3, 1, 'Library Fees', 99000.00, 'UGX', 'Library Fees for Bachelor of Information Systems - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1337, 'IS', 3, 1, 'Computer Lab Fees', 298000.00, 'UGX', 'Computer Lab Fees for Bachelor of Information Systems - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1338, 'IS', 3, 1, 'Software Licensing Fees', 248000.00, 'UGX', 'Software Licensing Fees for Bachelor of Information Systems - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1339, 'IS', 3, 1, 'Internet & WiFi Fees', 99000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Systems - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1340, 'IS', 3, 1, 'Equipment Usage Fees', 198000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Information Systems - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1341, 'IS', 3, 1, 'Project Development Fees', 397000.00, 'UGX', 'Project Development Fees for Bachelor of Information Systems - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1342, 'IS', 3, 1, 'Research Methodology Fees', 149000.00, 'UGX', 'Research Methodology Fees for Bachelor of Information Systems - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1343, 'IS', 3, 1, 'Medical Services Fee', 79000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Systems - Year 3 Semester 1 (SERVICES)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1344, 'IS', 3, 1, 'Sports & Recreation Fee', 74000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Systems - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1345, 'IS', 3, 1, 'Student Activities Fee', 149000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Systems - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1346, 'IS', 3, 1, 'Career Services Fee', 99000.00, 'UGX', 'Career Services Fee for Bachelor of Information Systems - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1347, 'IS', 3, 1, 'Enterprise Software Fee', 496000.00, 'UGX', 'Enterprise Software Fee for Bachelor of Information Systems - Year 3 Semester 1 (SPECIALIZED)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1348, 'IS', 3, 1, 'Professional Certification Prep', 198000.00, 'UGX', 'Professional Certification Prep for Bachelor of Information Systems - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1349, 'IS', 3, 1, 'Industry Workshop Access', 149000.00, 'UGX', 'Industry Workshop Access for Bachelor of Information Systems - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1350, 'IS', 3, 1, 'Late Registration Fee', 99000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Systems - Year 3 Semester 1 (PENALTY)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1351, 'IS', 3, 1, 'Transcript Fee', 50000.00, 'UGX', 'Transcript Fee for Bachelor of Information Systems - Year 3 Semester 1 (ADMINISTRATIVE)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1352, 'IS', 3, 2, 'Tuition Fees', 2530000.00, 'UGX', 'Tuition Fees for Bachelor of Information Systems - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1353, 'IS', 3, 2, 'Examination Fees', 198000.00, 'UGX', 'Examination Fees for Bachelor of Information Systems - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1354, 'IS', 3, 2, 'Library Fees', 99000.00, 'UGX', 'Library Fees for Bachelor of Information Systems - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1355, 'IS', 3, 2, 'Computer Lab Fees', 298000.00, 'UGX', 'Computer Lab Fees for Bachelor of Information Systems - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1356, 'IS', 3, 2, 'Software Licensing Fees', 248000.00, 'UGX', 'Software Licensing Fees for Bachelor of Information Systems - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1357, 'IS', 3, 2, 'Internet & WiFi Fees', 99000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Systems - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1358, 'IS', 3, 2, 'Equipment Usage Fees', 198000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Information Systems - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1359, 'IS', 3, 2, 'Project Development Fees', 397000.00, 'UGX', 'Project Development Fees for Bachelor of Information Systems - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1360, 'IS', 3, 2, 'Research Methodology Fees', 149000.00, 'UGX', 'Research Methodology Fees for Bachelor of Information Systems - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1361, 'IS', 3, 2, 'Industry Attachment Fees', 298000.00, 'UGX', 'Industry Attachment Fees for Bachelor of Information Systems - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1362, 'IS', 3, 2, 'Medical Services Fee', 79000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Systems - Year 3 Semester 2 (SERVICES)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1363, 'IS', 3, 2, 'Sports & Recreation Fee', 74000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Systems - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1364, 'IS', 3, 2, 'Student Activities Fee', 149000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Systems - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1365, 'IS', 3, 2, 'Career Services Fee', 99000.00, 'UGX', 'Career Services Fee for Bachelor of Information Systems - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1366, 'IS', 3, 2, 'Enterprise Software Fee', 496000.00, 'UGX', 'Enterprise Software Fee for Bachelor of Information Systems - Year 3 Semester 2 (SPECIALIZED)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1367, 'IS', 3, 2, 'Professional Certification Prep', 198000.00, 'UGX', 'Professional Certification Prep for Bachelor of Information Systems - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1368, 'IS', 3, 2, 'Industry Workshop Access', 149000.00, 'UGX', 'Industry Workshop Access for Bachelor of Information Systems - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1369, 'IS', 3, 2, 'Late Registration Fee', 99000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Systems - Year 3 Semester 2 (PENALTY)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1370, 'IS', 3, 2, 'Transcript Fee', 50000.00, 'UGX', 'Transcript Fee for Bachelor of Information Systems - Year 3 Semester 2 (ADMINISTRATIVE)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1371, 'IS', 4, 1, 'Tuition Fees', 2605000.00, 'UGX', 'Tuition Fees for Bachelor of Information Systems - Year 4 Semester 1 (ACADEMIC)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1372, 'IS', 4, 1, 'Library Fees', 104000.00, 'UGX', 'Library Fees for Bachelor of Information Systems - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1373, 'IS', 4, 1, 'Computer Lab Fees', 313000.00, 'UGX', 'Computer Lab Fees for Bachelor of Information Systems - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1374, 'IS', 4, 1, 'Software Licensing Fees', 260000.00, 'UGX', 'Software Licensing Fees for Bachelor of Information Systems - Year 4 Semester 1 (TECHNOLOGY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1375, 'IS', 4, 1, 'Internet & WiFi Fees', 104000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Systems - Year 4 Semester 1 (TECHNOLOGY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1376, 'IS', 4, 1, 'Equipment Usage Fees', 208000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Information Systems - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1377, 'IS', 4, 1, 'Project Development Fees', 417000.00, 'UGX', 'Project Development Fees for Bachelor of Information Systems - Year 4 Semester 1 (ACADEMIC)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1378, 'IS', 4, 1, 'Medical Services Fee', 83000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Systems - Year 4 Semester 1 (SERVICES)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1379, 'IS', 4, 1, 'Sports & Recreation Fee', 78000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Systems - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1380, 'IS', 4, 1, 'Student Activities Fee', 156000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Systems - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1381, 'IS', 4, 1, 'Career Services Fee', 104000.00, 'UGX', 'Career Services Fee for Bachelor of Information Systems - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1382, 'IS', 4, 1, 'Enterprise Software Fee', 521000.00, 'UGX', 'Enterprise Software Fee for Bachelor of Information Systems - Year 4 Semester 1 (SPECIALIZED)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1383, 'IS', 4, 1, 'Professional Certification Prep', 208000.00, 'UGX', 'Professional Certification Prep for Bachelor of Information Systems - Year 4 Semester 1 (ENHANCEMENT)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1384, 'IS', 4, 1, 'Industry Workshop Access', 156000.00, 'UGX', 'Industry Workshop Access for Bachelor of Information Systems - Year 4 Semester 1 (ENHANCEMENT)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1385, 'IS', 4, 1, 'Alumni Network Access', 52000.00, 'UGX', 'Alumni Network Access for Bachelor of Information Systems - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1386, 'IS', 4, 1, 'Job Placement Assistance', 104000.00, 'UGX', 'Job Placement Assistance for Bachelor of Information Systems - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1387, 'IS', 4, 1, 'Late Registration Fee', 104000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Systems - Year 4 Semester 1 (PENALTY)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1388, 'IS', 4, 1, 'Transcript Fee', 52000.00, 'UGX', 'Transcript Fee for Bachelor of Information Systems - Year 4 Semester 1 (ADMINISTRATIVE)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1389, 'IS', 4, 1, 'Certificate Fee', 156000.00, 'UGX', 'Certificate Fee for Bachelor of Information Systems - Year 4 Semester 1 (ADMINISTRATIVE)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:17'),
(1390, 'IS', 4, 2, 'Tuition Fees', 2657000.00, 'UGX', 'Tuition Fees for Bachelor of Information Systems - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1391, 'IS', 4, 2, 'Examination Fees', 208000.00, 'UGX', 'Examination Fees for Bachelor of Information Systems - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1392, 'IS', 4, 2, 'Library Fees', 104000.00, 'UGX', 'Library Fees for Bachelor of Information Systems - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1393, 'IS', 4, 2, 'Computer Lab Fees', 313000.00, 'UGX', 'Computer Lab Fees for Bachelor of Information Systems - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1394, 'IS', 4, 2, 'Software Licensing Fees', 260000.00, 'UGX', 'Software Licensing Fees for Bachelor of Information Systems - Year 4 Semester 2 (TECHNOLOGY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1395, 'IS', 4, 2, 'Internet & WiFi Fees', 104000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Information Systems - Year 4 Semester 2 (TECHNOLOGY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1396, 'IS', 4, 2, 'Equipment Usage Fees', 208000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Information Systems - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1397, 'IS', 4, 2, 'Project Development Fees', 417000.00, 'UGX', 'Project Development Fees for Bachelor of Information Systems - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1398, 'IS', 4, 2, 'Thesis/Final Project Fee', 521000.00, 'UGX', 'Thesis/Final Project Fee for Bachelor of Information Systems - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1399, 'IS', 4, 2, 'Medical Services Fee', 83000.00, 'UGX', 'Medical Services Fee for Bachelor of Information Systems - Year 4 Semester 2 (SERVICES)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1400, 'IS', 4, 2, 'Sports & Recreation Fee', 78000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Information Systems - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1401, 'IS', 4, 2, 'Student Activities Fee', 156000.00, 'UGX', 'Student Activities Fee for Bachelor of Information Systems - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1402, 'IS', 4, 2, 'Career Services Fee', 104000.00, 'UGX', 'Career Services Fee for Bachelor of Information Systems - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1403, 'IS', 4, 2, 'Enterprise Software Fee', 521000.00, 'UGX', 'Enterprise Software Fee for Bachelor of Information Systems - Year 4 Semester 2 (SPECIALIZED)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1404, 'IS', 4, 2, 'Professional Certification Prep', 208000.00, 'UGX', 'Professional Certification Prep for Bachelor of Information Systems - Year 4 Semester 2 (ENHANCEMENT)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1405, 'IS', 4, 2, 'Industry Workshop Access', 156000.00, 'UGX', 'Industry Workshop Access for Bachelor of Information Systems - Year 4 Semester 2 (ENHANCEMENT)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1406, 'IS', 4, 2, 'Alumni Network Access', 52000.00, 'UGX', 'Alumni Network Access for Bachelor of Information Systems - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1407, 'IS', 4, 2, 'Job Placement Assistance', 104000.00, 'UGX', 'Job Placement Assistance for Bachelor of Information Systems - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1408, 'IS', 4, 2, 'Late Registration Fee', 104000.00, 'UGX', 'Late Registration Fee for Bachelor of Information Systems - Year 4 Semester 2 (PENALTY)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1409, 'IS', 4, 2, 'Transcript Fee', 52000.00, 'UGX', 'Transcript Fee for Bachelor of Information Systems - Year 4 Semester 2 (ADMINISTRATIVE)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1410, 'IS', 4, 2, 'Certificate Fee', 156000.00, 'UGX', 'Certificate Fee for Bachelor of Information Systems - Year 4 Semester 2 (ADMINISTRATIVE)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1411, 'IS', 4, 2, 'Graduation Fee', 313000.00, 'UGX', 'Graduation Fee for Bachelor of Information Systems - Year 4 Semester 2 (ADMINISTRATIVE)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:17'),
(1412, 'CE', 1, 1, 'Tuition Fees', 2875000.00, 'UGX', 'Tuition Fees for Bachelor of Computer Engineering - Year 1 Semester 1 (ACADEMIC)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1413, 'CE', 1, 1, 'Registration Fees', 173000.00, 'UGX', 'Registration Fees for Bachelor of Computer Engineering - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1414, 'CE', 1, 1, 'Library Fees', 115000.00, 'UGX', 'Library Fees for Bachelor of Computer Engineering - Year 1 Semester 1 (FACILITY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1415, 'CE', 1, 1, 'Internet & WiFi Fees', 115000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Computer Engineering - Year 1 Semester 1 (TECHNOLOGY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1416, 'CE', 1, 1, 'Student ID Card', 29000.00, 'UGX', 'Student ID Card for Bachelor of Computer Engineering - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1417, 'CE', 1, 1, 'Medical Services Fee', 92000.00, 'UGX', 'Medical Services Fee for Bachelor of Computer Engineering - Year 1 Semester 1 (SERVICES)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1418, 'CE', 1, 1, 'Sports & Recreation Fee', 86000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Computer Engineering - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17');
INSERT INTO `fees_structure` (`id`, `program_code`, `year_level`, `semester`, `fee_category`, `amount`, `currency`, `description`, `is_mandatory`, `effective_from`, `effective_to`, `created_at`) VALUES
(1419, 'CE', 1, 1, 'Student Activities Fee', 173000.00, 'UGX', 'Student Activities Fee for Bachelor of Computer Engineering - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1420, 'CE', 1, 1, 'Late Registration Fee', 115000.00, 'UGX', 'Late Registration Fee for Bachelor of Computer Engineering - Year 1 Semester 1 (PENALTY)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1421, 'CE', 1, 1, 'Transcript Fee', 57000.00, 'UGX', 'Transcript Fee for Bachelor of Computer Engineering - Year 1 Semester 1 (ADMINISTRATIVE)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:17'),
(1422, 'CE', 1, 2, 'Tuition Fees', 2933000.00, 'UGX', 'Tuition Fees for Bachelor of Computer Engineering - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1423, 'CE', 1, 2, 'Registration Fees', 173000.00, 'UGX', 'Registration Fees for Bachelor of Computer Engineering - Year 1 Semester 2 (ADMINISTRATIVE)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1424, 'CE', 1, 2, 'Examination Fees', 230000.00, 'UGX', 'Examination Fees for Bachelor of Computer Engineering - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1425, 'CE', 1, 2, 'Library Fees', 115000.00, 'UGX', 'Library Fees for Bachelor of Computer Engineering - Year 1 Semester 2 (FACILITY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1426, 'CE', 1, 2, 'Internet & WiFi Fees', 115000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Computer Engineering - Year 1 Semester 2 (TECHNOLOGY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1427, 'CE', 1, 2, 'Medical Services Fee', 92000.00, 'UGX', 'Medical Services Fee for Bachelor of Computer Engineering - Year 1 Semester 2 (SERVICES)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1428, 'CE', 1, 2, 'Sports & Recreation Fee', 86000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Computer Engineering - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1429, 'CE', 1, 2, 'Student Activities Fee', 173000.00, 'UGX', 'Student Activities Fee for Bachelor of Computer Engineering - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1430, 'CE', 1, 2, 'Late Registration Fee', 115000.00, 'UGX', 'Late Registration Fee for Bachelor of Computer Engineering - Year 1 Semester 2 (PENALTY)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1431, 'CE', 1, 2, 'Transcript Fee', 57000.00, 'UGX', 'Transcript Fee for Bachelor of Computer Engineering - Year 1 Semester 2 (ADMINISTRATIVE)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:17'),
(1432, 'CE', 2, 1, 'Tuition Fees', 3019000.00, 'UGX', 'Tuition Fees for Bachelor of Computer Engineering - Year 2 Semester 1 (ACADEMIC)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1433, 'CE', 2, 1, 'Library Fees', 121000.00, 'UGX', 'Library Fees for Bachelor of Computer Engineering - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1434, 'CE', 2, 1, 'Computer Lab Fees', 362000.00, 'UGX', 'Computer Lab Fees for Bachelor of Computer Engineering - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1435, 'CE', 2, 1, 'Software Licensing Fees', 302000.00, 'UGX', 'Software Licensing Fees for Bachelor of Computer Engineering - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1436, 'CE', 2, 1, 'Internet & WiFi Fees', 121000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Computer Engineering - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1437, 'CE', 2, 1, 'Medical Services Fee', 97000.00, 'UGX', 'Medical Services Fee for Bachelor of Computer Engineering - Year 2 Semester 1 (SERVICES)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1438, 'CE', 2, 1, 'Sports & Recreation Fee', 91000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Computer Engineering - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1439, 'CE', 2, 1, 'Student Activities Fee', 181000.00, 'UGX', 'Student Activities Fee for Bachelor of Computer Engineering - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1440, 'CE', 2, 1, 'Hardware Lab Fee', 362000.00, 'UGX', 'Hardware Lab Fee for Bachelor of Computer Engineering - Year 2 Semester 1 (SPECIALIZED)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1441, 'CE', 2, 1, 'Industry Workshop Access', 181000.00, 'UGX', 'Industry Workshop Access for Bachelor of Computer Engineering - Year 2 Semester 1 (ENHANCEMENT)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1442, 'CE', 2, 1, 'Late Registration Fee', 121000.00, 'UGX', 'Late Registration Fee for Bachelor of Computer Engineering - Year 2 Semester 1 (PENALTY)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1443, 'CE', 2, 1, 'Transcript Fee', 60000.00, 'UGX', 'Transcript Fee for Bachelor of Computer Engineering - Year 2 Semester 1 (ADMINISTRATIVE)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:17'),
(1444, 'CE', 2, 2, 'Tuition Fees', 3079000.00, 'UGX', 'Tuition Fees for Bachelor of Computer Engineering - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1445, 'CE', 2, 2, 'Examination Fees', 241000.00, 'UGX', 'Examination Fees for Bachelor of Computer Engineering - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1446, 'CE', 2, 2, 'Library Fees', 121000.00, 'UGX', 'Library Fees for Bachelor of Computer Engineering - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1447, 'CE', 2, 2, 'Computer Lab Fees', 362000.00, 'UGX', 'Computer Lab Fees for Bachelor of Computer Engineering - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1448, 'CE', 2, 2, 'Software Licensing Fees', 302000.00, 'UGX', 'Software Licensing Fees for Bachelor of Computer Engineering - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1449, 'CE', 2, 2, 'Internet & WiFi Fees', 121000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Computer Engineering - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1450, 'CE', 2, 2, 'Medical Services Fee', 97000.00, 'UGX', 'Medical Services Fee for Bachelor of Computer Engineering - Year 2 Semester 2 (SERVICES)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1451, 'CE', 2, 2, 'Sports & Recreation Fee', 91000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Computer Engineering - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1452, 'CE', 2, 2, 'Student Activities Fee', 181000.00, 'UGX', 'Student Activities Fee for Bachelor of Computer Engineering - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1453, 'CE', 2, 2, 'Hardware Lab Fee', 362000.00, 'UGX', 'Hardware Lab Fee for Bachelor of Computer Engineering - Year 2 Semester 2 (SPECIALIZED)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1454, 'CE', 2, 2, 'Industry Workshop Access', 181000.00, 'UGX', 'Industry Workshop Access for Bachelor of Computer Engineering - Year 2 Semester 2 (ENHANCEMENT)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1455, 'CE', 2, 2, 'Late Registration Fee', 121000.00, 'UGX', 'Late Registration Fee for Bachelor of Computer Engineering - Year 2 Semester 2 (PENALTY)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1456, 'CE', 2, 2, 'Transcript Fee', 60000.00, 'UGX', 'Transcript Fee for Bachelor of Computer Engineering - Year 2 Semester 2 (ADMINISTRATIVE)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:17'),
(1457, 'CE', 3, 1, 'Tuition Fees', 3170000.00, 'UGX', 'Tuition Fees for Bachelor of Computer Engineering - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1458, 'CE', 3, 1, 'Library Fees', 127000.00, 'UGX', 'Library Fees for Bachelor of Computer Engineering - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1459, 'CE', 3, 1, 'Computer Lab Fees', 380000.00, 'UGX', 'Computer Lab Fees for Bachelor of Computer Engineering - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1460, 'CE', 3, 1, 'Software Licensing Fees', 317000.00, 'UGX', 'Software Licensing Fees for Bachelor of Computer Engineering - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1461, 'CE', 3, 1, 'Internet & WiFi Fees', 127000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Computer Engineering - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1462, 'CE', 3, 1, 'Equipment Usage Fees', 254000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Computer Engineering - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1463, 'CE', 3, 1, 'Project Development Fees', 507000.00, 'UGX', 'Project Development Fees for Bachelor of Computer Engineering - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1464, 'CE', 3, 1, 'Research Methodology Fees', 190000.00, 'UGX', 'Research Methodology Fees for Bachelor of Computer Engineering - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1465, 'CE', 3, 1, 'Medical Services Fee', 101000.00, 'UGX', 'Medical Services Fee for Bachelor of Computer Engineering - Year 3 Semester 1 (SERVICES)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1466, 'CE', 3, 1, 'Sports & Recreation Fee', 95000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Computer Engineering - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1467, 'CE', 3, 1, 'Student Activities Fee', 190000.00, 'UGX', 'Student Activities Fee for Bachelor of Computer Engineering - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1468, 'CE', 3, 1, 'Career Services Fee', 127000.00, 'UGX', 'Career Services Fee for Bachelor of Computer Engineering - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1469, 'CE', 3, 1, 'Hardware Lab Fee', 380000.00, 'UGX', 'Hardware Lab Fee for Bachelor of Computer Engineering - Year 3 Semester 1 (SPECIALIZED)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1470, 'CE', 3, 1, 'Professional Certification Prep', 254000.00, 'UGX', 'Professional Certification Prep for Bachelor of Computer Engineering - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1471, 'CE', 3, 1, 'Industry Workshop Access', 190000.00, 'UGX', 'Industry Workshop Access for Bachelor of Computer Engineering - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1472, 'CE', 3, 1, 'Late Registration Fee', 127000.00, 'UGX', 'Late Registration Fee for Bachelor of Computer Engineering - Year 3 Semester 1 (PENALTY)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1473, 'CE', 3, 1, 'Transcript Fee', 63000.00, 'UGX', 'Transcript Fee for Bachelor of Computer Engineering - Year 3 Semester 1 (ADMINISTRATIVE)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:17'),
(1474, 'CE', 3, 2, 'Tuition Fees', 3233000.00, 'UGX', 'Tuition Fees for Bachelor of Computer Engineering - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1475, 'CE', 3, 2, 'Examination Fees', 254000.00, 'UGX', 'Examination Fees for Bachelor of Computer Engineering - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1476, 'CE', 3, 2, 'Library Fees', 127000.00, 'UGX', 'Library Fees for Bachelor of Computer Engineering - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1477, 'CE', 3, 2, 'Computer Lab Fees', 380000.00, 'UGX', 'Computer Lab Fees for Bachelor of Computer Engineering - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1478, 'CE', 3, 2, 'Software Licensing Fees', 317000.00, 'UGX', 'Software Licensing Fees for Bachelor of Computer Engineering - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1479, 'CE', 3, 2, 'Internet & WiFi Fees', 127000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Computer Engineering - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:17'),
(1480, 'CE', 3, 2, 'Equipment Usage Fees', 254000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Computer Engineering - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1481, 'CE', 3, 2, 'Project Development Fees', 507000.00, 'UGX', 'Project Development Fees for Bachelor of Computer Engineering - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1482, 'CE', 3, 2, 'Research Methodology Fees', 190000.00, 'UGX', 'Research Methodology Fees for Bachelor of Computer Engineering - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1483, 'CE', 3, 2, 'Industry Attachment Fees', 380000.00, 'UGX', 'Industry Attachment Fees for Bachelor of Computer Engineering - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1484, 'CE', 3, 2, 'Medical Services Fee', 101000.00, 'UGX', 'Medical Services Fee for Bachelor of Computer Engineering - Year 3 Semester 2 (SERVICES)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1485, 'CE', 3, 2, 'Sports & Recreation Fee', 95000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Computer Engineering - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1486, 'CE', 3, 2, 'Student Activities Fee', 190000.00, 'UGX', 'Student Activities Fee for Bachelor of Computer Engineering - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1487, 'CE', 3, 2, 'Career Services Fee', 127000.00, 'UGX', 'Career Services Fee for Bachelor of Computer Engineering - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1488, 'CE', 3, 2, 'Hardware Lab Fee', 380000.00, 'UGX', 'Hardware Lab Fee for Bachelor of Computer Engineering - Year 3 Semester 2 (SPECIALIZED)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1489, 'CE', 3, 2, 'Professional Certification Prep', 254000.00, 'UGX', 'Professional Certification Prep for Bachelor of Computer Engineering - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1490, 'CE', 3, 2, 'Industry Workshop Access', 190000.00, 'UGX', 'Industry Workshop Access for Bachelor of Computer Engineering - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1491, 'CE', 3, 2, 'Late Registration Fee', 127000.00, 'UGX', 'Late Registration Fee for Bachelor of Computer Engineering - Year 3 Semester 2 (PENALTY)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1492, 'CE', 3, 2, 'Transcript Fee', 63000.00, 'UGX', 'Transcript Fee for Bachelor of Computer Engineering - Year 3 Semester 2 (ADMINISTRATIVE)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1493, 'CE', 4, 1, 'Tuition Fees', 3328000.00, 'UGX', 'Tuition Fees for Bachelor of Computer Engineering - Year 4 Semester 1 (ACADEMIC)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1494, 'CE', 4, 1, 'Library Fees', 133000.00, 'UGX', 'Library Fees for Bachelor of Computer Engineering - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1495, 'CE', 4, 1, 'Computer Lab Fees', 399000.00, 'UGX', 'Computer Lab Fees for Bachelor of Computer Engineering - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1496, 'CE', 4, 1, 'Software Licensing Fees', 333000.00, 'UGX', 'Software Licensing Fees for Bachelor of Computer Engineering - Year 4 Semester 1 (TECHNOLOGY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1497, 'CE', 4, 1, 'Internet & WiFi Fees', 133000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Computer Engineering - Year 4 Semester 1 (TECHNOLOGY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1498, 'CE', 4, 1, 'Equipment Usage Fees', 266000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Computer Engineering - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1499, 'CE', 4, 1, 'Project Development Fees', 533000.00, 'UGX', 'Project Development Fees for Bachelor of Computer Engineering - Year 4 Semester 1 (ACADEMIC)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1500, 'CE', 4, 1, 'Medical Services Fee', 107000.00, 'UGX', 'Medical Services Fee for Bachelor of Computer Engineering - Year 4 Semester 1 (SERVICES)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1501, 'CE', 4, 1, 'Sports & Recreation Fee', 100000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Computer Engineering - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1502, 'CE', 4, 1, 'Student Activities Fee', 200000.00, 'UGX', 'Student Activities Fee for Bachelor of Computer Engineering - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1503, 'CE', 4, 1, 'Career Services Fee', 133000.00, 'UGX', 'Career Services Fee for Bachelor of Computer Engineering - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1504, 'CE', 4, 1, 'Hardware Lab Fee', 399000.00, 'UGX', 'Hardware Lab Fee for Bachelor of Computer Engineering - Year 4 Semester 1 (SPECIALIZED)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1505, 'CE', 4, 1, 'Professional Certification Prep', 266000.00, 'UGX', 'Professional Certification Prep for Bachelor of Computer Engineering - Year 4 Semester 1 (ENHANCEMENT)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1506, 'CE', 4, 1, 'Industry Workshop Access', 200000.00, 'UGX', 'Industry Workshop Access for Bachelor of Computer Engineering - Year 4 Semester 1 (ENHANCEMENT)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1507, 'CE', 4, 1, 'Alumni Network Access', 67000.00, 'UGX', 'Alumni Network Access for Bachelor of Computer Engineering - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1508, 'CE', 4, 1, 'Job Placement Assistance', 133000.00, 'UGX', 'Job Placement Assistance for Bachelor of Computer Engineering - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1509, 'CE', 4, 1, 'Late Registration Fee', 133000.00, 'UGX', 'Late Registration Fee for Bachelor of Computer Engineering - Year 4 Semester 1 (PENALTY)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1510, 'CE', 4, 1, 'Transcript Fee', 67000.00, 'UGX', 'Transcript Fee for Bachelor of Computer Engineering - Year 4 Semester 1 (ADMINISTRATIVE)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1511, 'CE', 4, 1, 'Certificate Fee', 200000.00, 'UGX', 'Certificate Fee for Bachelor of Computer Engineering - Year 4 Semester 1 (ADMINISTRATIVE)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1512, 'CE', 4, 2, 'Tuition Fees', 3395000.00, 'UGX', 'Tuition Fees for Bachelor of Computer Engineering - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1513, 'CE', 4, 2, 'Examination Fees', 266000.00, 'UGX', 'Examination Fees for Bachelor of Computer Engineering - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1514, 'CE', 4, 2, 'Library Fees', 133000.00, 'UGX', 'Library Fees for Bachelor of Computer Engineering - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1515, 'CE', 4, 2, 'Computer Lab Fees', 399000.00, 'UGX', 'Computer Lab Fees for Bachelor of Computer Engineering - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1516, 'CE', 4, 2, 'Software Licensing Fees', 333000.00, 'UGX', 'Software Licensing Fees for Bachelor of Computer Engineering - Year 4 Semester 2 (TECHNOLOGY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1517, 'CE', 4, 2, 'Internet & WiFi Fees', 133000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Computer Engineering - Year 4 Semester 2 (TECHNOLOGY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1518, 'CE', 4, 2, 'Equipment Usage Fees', 266000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Computer Engineering - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1519, 'CE', 4, 2, 'Project Development Fees', 533000.00, 'UGX', 'Project Development Fees for Bachelor of Computer Engineering - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1520, 'CE', 4, 2, 'Thesis/Final Project Fee', 666000.00, 'UGX', 'Thesis/Final Project Fee for Bachelor of Computer Engineering - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1521, 'CE', 4, 2, 'Medical Services Fee', 107000.00, 'UGX', 'Medical Services Fee for Bachelor of Computer Engineering - Year 4 Semester 2 (SERVICES)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1522, 'CE', 4, 2, 'Sports & Recreation Fee', 100000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Computer Engineering - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1523, 'CE', 4, 2, 'Student Activities Fee', 200000.00, 'UGX', 'Student Activities Fee for Bachelor of Computer Engineering - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1524, 'CE', 4, 2, 'Career Services Fee', 133000.00, 'UGX', 'Career Services Fee for Bachelor of Computer Engineering - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1525, 'CE', 4, 2, 'Hardware Lab Fee', 399000.00, 'UGX', 'Hardware Lab Fee for Bachelor of Computer Engineering - Year 4 Semester 2 (SPECIALIZED)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1526, 'CE', 4, 2, 'Professional Certification Prep', 266000.00, 'UGX', 'Professional Certification Prep for Bachelor of Computer Engineering - Year 4 Semester 2 (ENHANCEMENT)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1527, 'CE', 4, 2, 'Industry Workshop Access', 200000.00, 'UGX', 'Industry Workshop Access for Bachelor of Computer Engineering - Year 4 Semester 2 (ENHANCEMENT)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1528, 'CE', 4, 2, 'Alumni Network Access', 67000.00, 'UGX', 'Alumni Network Access for Bachelor of Computer Engineering - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1529, 'CE', 4, 2, 'Job Placement Assistance', 133000.00, 'UGX', 'Job Placement Assistance for Bachelor of Computer Engineering - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1530, 'CE', 4, 2, 'Late Registration Fee', 133000.00, 'UGX', 'Late Registration Fee for Bachelor of Computer Engineering - Year 4 Semester 2 (PENALTY)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1531, 'CE', 4, 2, 'Transcript Fee', 67000.00, 'UGX', 'Transcript Fee for Bachelor of Computer Engineering - Year 4 Semester 2 (ADMINISTRATIVE)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1532, 'CE', 4, 2, 'Certificate Fee', 200000.00, 'UGX', 'Certificate Fee for Bachelor of Computer Engineering - Year 4 Semester 2 (ADMINISTRATIVE)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1533, 'CE', 4, 2, 'Graduation Fee', 399000.00, 'UGX', 'Graduation Fee for Bachelor of Computer Engineering - Year 4 Semester 2 (ADMINISTRATIVE)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1534, 'DS', 1, 1, 'Tuition Fees', 3000000.00, 'UGX', 'Tuition Fees for Bachelor of Data Science - Year 1 Semester 1 (ACADEMIC)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1535, 'DS', 1, 1, 'Registration Fees', 180000.00, 'UGX', 'Registration Fees for Bachelor of Data Science - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1536, 'DS', 1, 1, 'Library Fees', 120000.00, 'UGX', 'Library Fees for Bachelor of Data Science - Year 1 Semester 1 (FACILITY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1537, 'DS', 1, 1, 'Internet & WiFi Fees', 120000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Data Science - Year 1 Semester 1 (TECHNOLOGY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1538, 'DS', 1, 1, 'Student ID Card', 30000.00, 'UGX', 'Student ID Card for Bachelor of Data Science - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1539, 'DS', 1, 1, 'Medical Services Fee', 96000.00, 'UGX', 'Medical Services Fee for Bachelor of Data Science - Year 1 Semester 1 (SERVICES)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1540, 'DS', 1, 1, 'Sports & Recreation Fee', 90000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Data Science - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1541, 'DS', 1, 1, 'Student Activities Fee', 180000.00, 'UGX', 'Student Activities Fee for Bachelor of Data Science - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1542, 'DS', 1, 1, 'AI/ML Lab Access Fee', 480000.00, 'UGX', 'AI/ML Lab Access Fee for Bachelor of Data Science - Year 1 Semester 1 (SPECIALIZED)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1543, 'DS', 1, 1, 'Late Registration Fee', 120000.00, 'UGX', 'Late Registration Fee for Bachelor of Data Science - Year 1 Semester 1 (PENALTY)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1544, 'DS', 1, 1, 'Transcript Fee', 60000.00, 'UGX', 'Transcript Fee for Bachelor of Data Science - Year 1 Semester 1 (ADMINISTRATIVE)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1545, 'DS', 1, 2, 'Tuition Fees', 3060000.00, 'UGX', 'Tuition Fees for Bachelor of Data Science - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1546, 'DS', 1, 2, 'Registration Fees', 180000.00, 'UGX', 'Registration Fees for Bachelor of Data Science - Year 1 Semester 2 (ADMINISTRATIVE)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1547, 'DS', 1, 2, 'Examination Fees', 240000.00, 'UGX', 'Examination Fees for Bachelor of Data Science - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1548, 'DS', 1, 2, 'Library Fees', 120000.00, 'UGX', 'Library Fees for Bachelor of Data Science - Year 1 Semester 2 (FACILITY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1549, 'DS', 1, 2, 'Internet & WiFi Fees', 120000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Data Science - Year 1 Semester 2 (TECHNOLOGY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1550, 'DS', 1, 2, 'Medical Services Fee', 96000.00, 'UGX', 'Medical Services Fee for Bachelor of Data Science - Year 1 Semester 2 (SERVICES)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1551, 'DS', 1, 2, 'Sports & Recreation Fee', 90000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Data Science - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1552, 'DS', 1, 2, 'Student Activities Fee', 180000.00, 'UGX', 'Student Activities Fee for Bachelor of Data Science - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1553, 'DS', 1, 2, 'AI/ML Lab Access Fee', 480000.00, 'UGX', 'AI/ML Lab Access Fee for Bachelor of Data Science - Year 1 Semester 2 (SPECIALIZED)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1554, 'DS', 1, 2, 'Late Registration Fee', 120000.00, 'UGX', 'Late Registration Fee for Bachelor of Data Science - Year 1 Semester 2 (PENALTY)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1555, 'DS', 1, 2, 'Transcript Fee', 60000.00, 'UGX', 'Transcript Fee for Bachelor of Data Science - Year 1 Semester 2 (ADMINISTRATIVE)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1556, 'DS', 2, 1, 'Tuition Fees', 3150000.00, 'UGX', 'Tuition Fees for Bachelor of Data Science - Year 2 Semester 1 (ACADEMIC)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1557, 'DS', 2, 1, 'Library Fees', 126000.00, 'UGX', 'Library Fees for Bachelor of Data Science - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1558, 'DS', 2, 1, 'Computer Lab Fees', 378000.00, 'UGX', 'Computer Lab Fees for Bachelor of Data Science - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1559, 'DS', 2, 1, 'Software Licensing Fees', 315000.00, 'UGX', 'Software Licensing Fees for Bachelor of Data Science - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1560, 'DS', 2, 1, 'Internet & WiFi Fees', 126000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Data Science - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1561, 'DS', 2, 1, 'Medical Services Fee', 101000.00, 'UGX', 'Medical Services Fee for Bachelor of Data Science - Year 2 Semester 1 (SERVICES)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1562, 'DS', 2, 1, 'Sports & Recreation Fee', 95000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Data Science - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1563, 'DS', 2, 1, 'Student Activities Fee', 189000.00, 'UGX', 'Student Activities Fee for Bachelor of Data Science - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1564, 'DS', 2, 1, 'AI/ML Lab Access Fee', 504000.00, 'UGX', 'AI/ML Lab Access Fee for Bachelor of Data Science - Year 2 Semester 1 (SPECIALIZED)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1565, 'DS', 2, 1, 'Industry Workshop Access', 189000.00, 'UGX', 'Industry Workshop Access for Bachelor of Data Science - Year 2 Semester 1 (ENHANCEMENT)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1566, 'DS', 2, 1, 'Late Registration Fee', 126000.00, 'UGX', 'Late Registration Fee for Bachelor of Data Science - Year 2 Semester 1 (PENALTY)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1567, 'DS', 2, 1, 'Transcript Fee', 63000.00, 'UGX', 'Transcript Fee for Bachelor of Data Science - Year 2 Semester 1 (ADMINISTRATIVE)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1568, 'DS', 2, 2, 'Tuition Fees', 3213000.00, 'UGX', 'Tuition Fees for Bachelor of Data Science - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1569, 'DS', 2, 2, 'Examination Fees', 252000.00, 'UGX', 'Examination Fees for Bachelor of Data Science - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1570, 'DS', 2, 2, 'Library Fees', 126000.00, 'UGX', 'Library Fees for Bachelor of Data Science - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1571, 'DS', 2, 2, 'Computer Lab Fees', 378000.00, 'UGX', 'Computer Lab Fees for Bachelor of Data Science - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1572, 'DS', 2, 2, 'Software Licensing Fees', 315000.00, 'UGX', 'Software Licensing Fees for Bachelor of Data Science - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1573, 'DS', 2, 2, 'Internet & WiFi Fees', 126000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Data Science - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1574, 'DS', 2, 2, 'Medical Services Fee', 101000.00, 'UGX', 'Medical Services Fee for Bachelor of Data Science - Year 2 Semester 2 (SERVICES)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1575, 'DS', 2, 2, 'Sports & Recreation Fee', 95000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Data Science - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1576, 'DS', 2, 2, 'Student Activities Fee', 189000.00, 'UGX', 'Student Activities Fee for Bachelor of Data Science - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1577, 'DS', 2, 2, 'AI/ML Lab Access Fee', 504000.00, 'UGX', 'AI/ML Lab Access Fee for Bachelor of Data Science - Year 2 Semester 2 (SPECIALIZED)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1578, 'DS', 2, 2, 'Industry Workshop Access', 189000.00, 'UGX', 'Industry Workshop Access for Bachelor of Data Science - Year 2 Semester 2 (ENHANCEMENT)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1579, 'DS', 2, 2, 'Late Registration Fee', 126000.00, 'UGX', 'Late Registration Fee for Bachelor of Data Science - Year 2 Semester 2 (PENALTY)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1580, 'DS', 2, 2, 'Transcript Fee', 63000.00, 'UGX', 'Transcript Fee for Bachelor of Data Science - Year 2 Semester 2 (ADMINISTRATIVE)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1581, 'DS', 3, 1, 'Tuition Fees', 3308000.00, 'UGX', 'Tuition Fees for Bachelor of Data Science - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1582, 'DS', 3, 1, 'Library Fees', 132000.00, 'UGX', 'Library Fees for Bachelor of Data Science - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1583, 'DS', 3, 1, 'Computer Lab Fees', 397000.00, 'UGX', 'Computer Lab Fees for Bachelor of Data Science - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1584, 'DS', 3, 1, 'Software Licensing Fees', 331000.00, 'UGX', 'Software Licensing Fees for Bachelor of Data Science - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1585, 'DS', 3, 1, 'Internet & WiFi Fees', 132000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Data Science - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1586, 'DS', 3, 1, 'Equipment Usage Fees', 265000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Data Science - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1587, 'DS', 3, 1, 'Project Development Fees', 529000.00, 'UGX', 'Project Development Fees for Bachelor of Data Science - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1588, 'DS', 3, 1, 'Research Methodology Fees', 198000.00, 'UGX', 'Research Methodology Fees for Bachelor of Data Science - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1589, 'DS', 3, 1, 'Medical Services Fee', 106000.00, 'UGX', 'Medical Services Fee for Bachelor of Data Science - Year 3 Semester 1 (SERVICES)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1590, 'DS', 3, 1, 'Sports & Recreation Fee', 99000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Data Science - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1591, 'DS', 3, 1, 'Student Activities Fee', 198000.00, 'UGX', 'Student Activities Fee for Bachelor of Data Science - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1592, 'DS', 3, 1, 'Career Services Fee', 132000.00, 'UGX', 'Career Services Fee for Bachelor of Data Science - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1593, 'DS', 3, 1, 'AI/ML Lab Access Fee', 529000.00, 'UGX', 'AI/ML Lab Access Fee for Bachelor of Data Science - Year 3 Semester 1 (SPECIALIZED)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1594, 'DS', 3, 1, 'Professional Certification Prep', 265000.00, 'UGX', 'Professional Certification Prep for Bachelor of Data Science - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1595, 'DS', 3, 1, 'Industry Workshop Access', 198000.00, 'UGX', 'Industry Workshop Access for Bachelor of Data Science - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1596, 'DS', 3, 1, 'Late Registration Fee', 132000.00, 'UGX', 'Late Registration Fee for Bachelor of Data Science - Year 3 Semester 1 (PENALTY)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1597, 'DS', 3, 1, 'Transcript Fee', 66000.00, 'UGX', 'Transcript Fee for Bachelor of Data Science - Year 3 Semester 1 (ADMINISTRATIVE)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1598, 'DS', 3, 2, 'Tuition Fees', 3374000.00, 'UGX', 'Tuition Fees for Bachelor of Data Science - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1599, 'DS', 3, 2, 'Examination Fees', 265000.00, 'UGX', 'Examination Fees for Bachelor of Data Science - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1600, 'DS', 3, 2, 'Library Fees', 132000.00, 'UGX', 'Library Fees for Bachelor of Data Science - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1601, 'DS', 3, 2, 'Computer Lab Fees', 397000.00, 'UGX', 'Computer Lab Fees for Bachelor of Data Science - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1602, 'DS', 3, 2, 'Software Licensing Fees', 331000.00, 'UGX', 'Software Licensing Fees for Bachelor of Data Science - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1603, 'DS', 3, 2, 'Internet & WiFi Fees', 132000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Data Science - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1604, 'DS', 3, 2, 'Equipment Usage Fees', 265000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Data Science - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1605, 'DS', 3, 2, 'Project Development Fees', 529000.00, 'UGX', 'Project Development Fees for Bachelor of Data Science - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1606, 'DS', 3, 2, 'Research Methodology Fees', 198000.00, 'UGX', 'Research Methodology Fees for Bachelor of Data Science - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1607, 'DS', 3, 2, 'Industry Attachment Fees', 397000.00, 'UGX', 'Industry Attachment Fees for Bachelor of Data Science - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1608, 'DS', 3, 2, 'Medical Services Fee', 106000.00, 'UGX', 'Medical Services Fee for Bachelor of Data Science - Year 3 Semester 2 (SERVICES)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1609, 'DS', 3, 2, 'Sports & Recreation Fee', 99000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Data Science - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1610, 'DS', 3, 2, 'Student Activities Fee', 198000.00, 'UGX', 'Student Activities Fee for Bachelor of Data Science - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1611, 'DS', 3, 2, 'Career Services Fee', 132000.00, 'UGX', 'Career Services Fee for Bachelor of Data Science - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1612, 'DS', 3, 2, 'AI/ML Lab Access Fee', 529000.00, 'UGX', 'AI/ML Lab Access Fee for Bachelor of Data Science - Year 3 Semester 2 (SPECIALIZED)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1613, 'DS', 3, 2, 'Professional Certification Prep', 265000.00, 'UGX', 'Professional Certification Prep for Bachelor of Data Science - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1614, 'DS', 3, 2, 'Industry Workshop Access', 198000.00, 'UGX', 'Industry Workshop Access for Bachelor of Data Science - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1615, 'DS', 3, 2, 'Late Registration Fee', 132000.00, 'UGX', 'Late Registration Fee for Bachelor of Data Science - Year 3 Semester 2 (PENALTY)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1616, 'DS', 3, 2, 'Transcript Fee', 66000.00, 'UGX', 'Transcript Fee for Bachelor of Data Science - Year 3 Semester 2 (ADMINISTRATIVE)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1617, 'CY', 1, 1, 'Tuition Fees', 3125000.00, 'UGX', 'Tuition Fees for Bachelor of Cybersecurity - Year 1 Semester 1 (ACADEMIC)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1618, 'CY', 1, 1, 'Registration Fees', 188000.00, 'UGX', 'Registration Fees for Bachelor of Cybersecurity - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1619, 'CY', 1, 1, 'Library Fees', 125000.00, 'UGX', 'Library Fees for Bachelor of Cybersecurity - Year 1 Semester 1 (FACILITY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1620, 'CY', 1, 1, 'Internet & WiFi Fees', 125000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Cybersecurity - Year 1 Semester 1 (TECHNOLOGY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1621, 'CY', 1, 1, 'Student ID Card', 31000.00, 'UGX', 'Student ID Card for Bachelor of Cybersecurity - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1622, 'CY', 1, 1, 'Medical Services Fee', 100000.00, 'UGX', 'Medical Services Fee for Bachelor of Cybersecurity - Year 1 Semester 1 (SERVICES)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1623, 'CY', 1, 1, 'Sports & Recreation Fee', 94000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Cybersecurity - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1624, 'CY', 1, 1, 'Student Activities Fee', 188000.00, 'UGX', 'Student Activities Fee for Bachelor of Cybersecurity - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1625, 'CY', 1, 1, 'Cybersecurity Lab Fee', 438000.00, 'UGX', 'Cybersecurity Lab Fee for Bachelor of Cybersecurity - Year 1 Semester 1 (SPECIALIZED)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1626, 'CY', 1, 1, 'Late Registration Fee', 125000.00, 'UGX', 'Late Registration Fee for Bachelor of Cybersecurity - Year 1 Semester 1 (PENALTY)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1627, 'CY', 1, 1, 'Transcript Fee', 63000.00, 'UGX', 'Transcript Fee for Bachelor of Cybersecurity - Year 1 Semester 1 (ADMINISTRATIVE)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1628, 'CY', 1, 2, 'Tuition Fees', 3188000.00, 'UGX', 'Tuition Fees for Bachelor of Cybersecurity - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1629, 'CY', 1, 2, 'Registration Fees', 188000.00, 'UGX', 'Registration Fees for Bachelor of Cybersecurity - Year 1 Semester 2 (ADMINISTRATIVE)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1630, 'CY', 1, 2, 'Examination Fees', 250000.00, 'UGX', 'Examination Fees for Bachelor of Cybersecurity - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1631, 'CY', 1, 2, 'Library Fees', 125000.00, 'UGX', 'Library Fees for Bachelor of Cybersecurity - Year 1 Semester 2 (FACILITY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1632, 'CY', 1, 2, 'Internet & WiFi Fees', 125000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Cybersecurity - Year 1 Semester 2 (TECHNOLOGY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1633, 'CY', 1, 2, 'Medical Services Fee', 100000.00, 'UGX', 'Medical Services Fee for Bachelor of Cybersecurity - Year 1 Semester 2 (SERVICES)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1634, 'CY', 1, 2, 'Sports & Recreation Fee', 94000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Cybersecurity - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1635, 'CY', 1, 2, 'Student Activities Fee', 188000.00, 'UGX', 'Student Activities Fee for Bachelor of Cybersecurity - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1636, 'CY', 1, 2, 'Cybersecurity Lab Fee', 438000.00, 'UGX', 'Cybersecurity Lab Fee for Bachelor of Cybersecurity - Year 1 Semester 2 (SPECIALIZED)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1637, 'CY', 1, 2, 'Late Registration Fee', 125000.00, 'UGX', 'Late Registration Fee for Bachelor of Cybersecurity - Year 1 Semester 2 (PENALTY)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1638, 'CY', 1, 2, 'Transcript Fee', 63000.00, 'UGX', 'Transcript Fee for Bachelor of Cybersecurity - Year 1 Semester 2 (ADMINISTRATIVE)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1639, 'CY', 2, 1, 'Tuition Fees', 3281000.00, 'UGX', 'Tuition Fees for Bachelor of Cybersecurity - Year 2 Semester 1 (ACADEMIC)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1640, 'CY', 2, 1, 'Library Fees', 131000.00, 'UGX', 'Library Fees for Bachelor of Cybersecurity - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1641, 'CY', 2, 1, 'Computer Lab Fees', 394000.00, 'UGX', 'Computer Lab Fees for Bachelor of Cybersecurity - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1642, 'CY', 2, 1, 'Software Licensing Fees', 328000.00, 'UGX', 'Software Licensing Fees for Bachelor of Cybersecurity - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1643, 'CY', 2, 1, 'Internet & WiFi Fees', 131000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Cybersecurity - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1644, 'CY', 2, 1, 'Medical Services Fee', 105000.00, 'UGX', 'Medical Services Fee for Bachelor of Cybersecurity - Year 2 Semester 1 (SERVICES)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1645, 'CY', 2, 1, 'Sports & Recreation Fee', 98000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Cybersecurity - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1646, 'CY', 2, 1, 'Student Activities Fee', 197000.00, 'UGX', 'Student Activities Fee for Bachelor of Cybersecurity - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1647, 'CY', 2, 1, 'Cybersecurity Lab Fee', 459000.00, 'UGX', 'Cybersecurity Lab Fee for Bachelor of Cybersecurity - Year 2 Semester 1 (SPECIALIZED)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1648, 'CY', 2, 1, 'Industry Workshop Access', 197000.00, 'UGX', 'Industry Workshop Access for Bachelor of Cybersecurity - Year 2 Semester 1 (ENHANCEMENT)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1649, 'CY', 2, 1, 'Late Registration Fee', 131000.00, 'UGX', 'Late Registration Fee for Bachelor of Cybersecurity - Year 2 Semester 1 (PENALTY)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1650, 'CY', 2, 1, 'Transcript Fee', 66000.00, 'UGX', 'Transcript Fee for Bachelor of Cybersecurity - Year 2 Semester 1 (ADMINISTRATIVE)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1651, 'CY', 2, 2, 'Tuition Fees', 3347000.00, 'UGX', 'Tuition Fees for Bachelor of Cybersecurity - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1652, 'CY', 2, 2, 'Examination Fees', 263000.00, 'UGX', 'Examination Fees for Bachelor of Cybersecurity - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1653, 'CY', 2, 2, 'Library Fees', 131000.00, 'UGX', 'Library Fees for Bachelor of Cybersecurity - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1654, 'CY', 2, 2, 'Computer Lab Fees', 394000.00, 'UGX', 'Computer Lab Fees for Bachelor of Cybersecurity - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1655, 'CY', 2, 2, 'Software Licensing Fees', 328000.00, 'UGX', 'Software Licensing Fees for Bachelor of Cybersecurity - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1656, 'CY', 2, 2, 'Internet & WiFi Fees', 131000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Cybersecurity - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1657, 'CY', 2, 2, 'Medical Services Fee', 105000.00, 'UGX', 'Medical Services Fee for Bachelor of Cybersecurity - Year 2 Semester 2 (SERVICES)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1658, 'CY', 2, 2, 'Sports & Recreation Fee', 98000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Cybersecurity - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1659, 'CY', 2, 2, 'Student Activities Fee', 197000.00, 'UGX', 'Student Activities Fee for Bachelor of Cybersecurity - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1660, 'CY', 2, 2, 'Cybersecurity Lab Fee', 459000.00, 'UGX', 'Cybersecurity Lab Fee for Bachelor of Cybersecurity - Year 2 Semester 2 (SPECIALIZED)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1661, 'CY', 2, 2, 'Industry Workshop Access', 197000.00, 'UGX', 'Industry Workshop Access for Bachelor of Cybersecurity - Year 2 Semester 2 (ENHANCEMENT)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1662, 'CY', 2, 2, 'Late Registration Fee', 131000.00, 'UGX', 'Late Registration Fee for Bachelor of Cybersecurity - Year 2 Semester 2 (PENALTY)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1663, 'CY', 2, 2, 'Transcript Fee', 66000.00, 'UGX', 'Transcript Fee for Bachelor of Cybersecurity - Year 2 Semester 2 (ADMINISTRATIVE)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1664, 'CY', 3, 1, 'Tuition Fees', 3445000.00, 'UGX', 'Tuition Fees for Bachelor of Cybersecurity - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1665, 'CY', 3, 1, 'Library Fees', 138000.00, 'UGX', 'Library Fees for Bachelor of Cybersecurity - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18');
INSERT INTO `fees_structure` (`id`, `program_code`, `year_level`, `semester`, `fee_category`, `amount`, `currency`, `description`, `is_mandatory`, `effective_from`, `effective_to`, `created_at`) VALUES
(1666, 'CY', 3, 1, 'Computer Lab Fees', 413000.00, 'UGX', 'Computer Lab Fees for Bachelor of Cybersecurity - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1667, 'CY', 3, 1, 'Software Licensing Fees', 345000.00, 'UGX', 'Software Licensing Fees for Bachelor of Cybersecurity - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1668, 'CY', 3, 1, 'Internet & WiFi Fees', 138000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Cybersecurity - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1669, 'CY', 3, 1, 'Equipment Usage Fees', 276000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Cybersecurity - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1670, 'CY', 3, 1, 'Project Development Fees', 551000.00, 'UGX', 'Project Development Fees for Bachelor of Cybersecurity - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1671, 'CY', 3, 1, 'Research Methodology Fees', 207000.00, 'UGX', 'Research Methodology Fees for Bachelor of Cybersecurity - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1672, 'CY', 3, 1, 'Medical Services Fee', 110000.00, 'UGX', 'Medical Services Fee for Bachelor of Cybersecurity - Year 3 Semester 1 (SERVICES)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1673, 'CY', 3, 1, 'Sports & Recreation Fee', 103000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Cybersecurity - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1674, 'CY', 3, 1, 'Student Activities Fee', 207000.00, 'UGX', 'Student Activities Fee for Bachelor of Cybersecurity - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1675, 'CY', 3, 1, 'Career Services Fee', 138000.00, 'UGX', 'Career Services Fee for Bachelor of Cybersecurity - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1676, 'CY', 3, 1, 'Cybersecurity Lab Fee', 482000.00, 'UGX', 'Cybersecurity Lab Fee for Bachelor of Cybersecurity - Year 3 Semester 1 (SPECIALIZED)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1677, 'CY', 3, 1, 'Professional Certification Prep', 276000.00, 'UGX', 'Professional Certification Prep for Bachelor of Cybersecurity - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1678, 'CY', 3, 1, 'Industry Workshop Access', 207000.00, 'UGX', 'Industry Workshop Access for Bachelor of Cybersecurity - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1679, 'CY', 3, 1, 'Late Registration Fee', 138000.00, 'UGX', 'Late Registration Fee for Bachelor of Cybersecurity - Year 3 Semester 1 (PENALTY)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1680, 'CY', 3, 1, 'Transcript Fee', 69000.00, 'UGX', 'Transcript Fee for Bachelor of Cybersecurity - Year 3 Semester 1 (ADMINISTRATIVE)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1681, 'CY', 3, 2, 'Tuition Fees', 3514000.00, 'UGX', 'Tuition Fees for Bachelor of Cybersecurity - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1682, 'CY', 3, 2, 'Examination Fees', 276000.00, 'UGX', 'Examination Fees for Bachelor of Cybersecurity - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1683, 'CY', 3, 2, 'Library Fees', 138000.00, 'UGX', 'Library Fees for Bachelor of Cybersecurity - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1684, 'CY', 3, 2, 'Computer Lab Fees', 413000.00, 'UGX', 'Computer Lab Fees for Bachelor of Cybersecurity - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1685, 'CY', 3, 2, 'Software Licensing Fees', 345000.00, 'UGX', 'Software Licensing Fees for Bachelor of Cybersecurity - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1686, 'CY', 3, 2, 'Internet & WiFi Fees', 138000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Cybersecurity - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1687, 'CY', 3, 2, 'Equipment Usage Fees', 276000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Cybersecurity - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1688, 'CY', 3, 2, 'Project Development Fees', 551000.00, 'UGX', 'Project Development Fees for Bachelor of Cybersecurity - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1689, 'CY', 3, 2, 'Research Methodology Fees', 207000.00, 'UGX', 'Research Methodology Fees for Bachelor of Cybersecurity - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1690, 'CY', 3, 2, 'Industry Attachment Fees', 413000.00, 'UGX', 'Industry Attachment Fees for Bachelor of Cybersecurity - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1691, 'CY', 3, 2, 'Medical Services Fee', 110000.00, 'UGX', 'Medical Services Fee for Bachelor of Cybersecurity - Year 3 Semester 2 (SERVICES)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1692, 'CY', 3, 2, 'Sports & Recreation Fee', 103000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Cybersecurity - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1693, 'CY', 3, 2, 'Student Activities Fee', 207000.00, 'UGX', 'Student Activities Fee for Bachelor of Cybersecurity - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1694, 'CY', 3, 2, 'Career Services Fee', 138000.00, 'UGX', 'Career Services Fee for Bachelor of Cybersecurity - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1695, 'CY', 3, 2, 'Cybersecurity Lab Fee', 482000.00, 'UGX', 'Cybersecurity Lab Fee for Bachelor of Cybersecurity - Year 3 Semester 2 (SPECIALIZED)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1696, 'CY', 3, 2, 'Professional Certification Prep', 276000.00, 'UGX', 'Professional Certification Prep for Bachelor of Cybersecurity - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1697, 'CY', 3, 2, 'Industry Workshop Access', 207000.00, 'UGX', 'Industry Workshop Access for Bachelor of Cybersecurity - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1698, 'CY', 3, 2, 'Late Registration Fee', 138000.00, 'UGX', 'Late Registration Fee for Bachelor of Cybersecurity - Year 3 Semester 2 (PENALTY)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1699, 'CY', 3, 2, 'Transcript Fee', 69000.00, 'UGX', 'Transcript Fee for Bachelor of Cybersecurity - Year 3 Semester 2 (ADMINISTRATIVE)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1700, 'CY', 4, 1, 'Tuition Fees', 3618000.00, 'UGX', 'Tuition Fees for Bachelor of Cybersecurity - Year 4 Semester 1 (ACADEMIC)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1701, 'CY', 4, 1, 'Library Fees', 145000.00, 'UGX', 'Library Fees for Bachelor of Cybersecurity - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1702, 'CY', 4, 1, 'Computer Lab Fees', 434000.00, 'UGX', 'Computer Lab Fees for Bachelor of Cybersecurity - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1703, 'CY', 4, 1, 'Software Licensing Fees', 362000.00, 'UGX', 'Software Licensing Fees for Bachelor of Cybersecurity - Year 4 Semester 1 (TECHNOLOGY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1704, 'CY', 4, 1, 'Internet & WiFi Fees', 145000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Cybersecurity - Year 4 Semester 1 (TECHNOLOGY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1705, 'CY', 4, 1, 'Equipment Usage Fees', 289000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Cybersecurity - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1706, 'CY', 4, 1, 'Project Development Fees', 579000.00, 'UGX', 'Project Development Fees for Bachelor of Cybersecurity - Year 4 Semester 1 (ACADEMIC)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1707, 'CY', 4, 1, 'Medical Services Fee', 116000.00, 'UGX', 'Medical Services Fee for Bachelor of Cybersecurity - Year 4 Semester 1 (SERVICES)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1708, 'CY', 4, 1, 'Sports & Recreation Fee', 109000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Cybersecurity - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1709, 'CY', 4, 1, 'Student Activities Fee', 217000.00, 'UGX', 'Student Activities Fee for Bachelor of Cybersecurity - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1710, 'CY', 4, 1, 'Career Services Fee', 145000.00, 'UGX', 'Career Services Fee for Bachelor of Cybersecurity - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1711, 'CY', 4, 1, 'Cybersecurity Lab Fee', 506000.00, 'UGX', 'Cybersecurity Lab Fee for Bachelor of Cybersecurity - Year 4 Semester 1 (SPECIALIZED)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1712, 'CY', 4, 1, 'Professional Certification Prep', 289000.00, 'UGX', 'Professional Certification Prep for Bachelor of Cybersecurity - Year 4 Semester 1 (ENHANCEMENT)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1713, 'CY', 4, 1, 'Industry Workshop Access', 217000.00, 'UGX', 'Industry Workshop Access for Bachelor of Cybersecurity - Year 4 Semester 1 (ENHANCEMENT)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1714, 'CY', 4, 1, 'Alumni Network Access', 72000.00, 'UGX', 'Alumni Network Access for Bachelor of Cybersecurity - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1715, 'CY', 4, 1, 'Job Placement Assistance', 145000.00, 'UGX', 'Job Placement Assistance for Bachelor of Cybersecurity - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1716, 'CY', 4, 1, 'Late Registration Fee', 145000.00, 'UGX', 'Late Registration Fee for Bachelor of Cybersecurity - Year 4 Semester 1 (PENALTY)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1717, 'CY', 4, 1, 'Transcript Fee', 72000.00, 'UGX', 'Transcript Fee for Bachelor of Cybersecurity - Year 4 Semester 1 (ADMINISTRATIVE)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1718, 'CY', 4, 1, 'Certificate Fee', 217000.00, 'UGX', 'Certificate Fee for Bachelor of Cybersecurity - Year 4 Semester 1 (ADMINISTRATIVE)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1719, 'CY', 4, 2, 'Tuition Fees', 3690000.00, 'UGX', 'Tuition Fees for Bachelor of Cybersecurity - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1720, 'CY', 4, 2, 'Examination Fees', 289000.00, 'UGX', 'Examination Fees for Bachelor of Cybersecurity - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1721, 'CY', 4, 2, 'Library Fees', 145000.00, 'UGX', 'Library Fees for Bachelor of Cybersecurity - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1722, 'CY', 4, 2, 'Computer Lab Fees', 434000.00, 'UGX', 'Computer Lab Fees for Bachelor of Cybersecurity - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1723, 'CY', 4, 2, 'Software Licensing Fees', 362000.00, 'UGX', 'Software Licensing Fees for Bachelor of Cybersecurity - Year 4 Semester 2 (TECHNOLOGY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1724, 'CY', 4, 2, 'Internet & WiFi Fees', 145000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Cybersecurity - Year 4 Semester 2 (TECHNOLOGY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1725, 'CY', 4, 2, 'Equipment Usage Fees', 289000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Cybersecurity - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1726, 'CY', 4, 2, 'Project Development Fees', 579000.00, 'UGX', 'Project Development Fees for Bachelor of Cybersecurity - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1727, 'CY', 4, 2, 'Thesis/Final Project Fee', 724000.00, 'UGX', 'Thesis/Final Project Fee for Bachelor of Cybersecurity - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1728, 'CY', 4, 2, 'Medical Services Fee', 116000.00, 'UGX', 'Medical Services Fee for Bachelor of Cybersecurity - Year 4 Semester 2 (SERVICES)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1729, 'CY', 4, 2, 'Sports & Recreation Fee', 109000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Cybersecurity - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1730, 'CY', 4, 2, 'Student Activities Fee', 217000.00, 'UGX', 'Student Activities Fee for Bachelor of Cybersecurity - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1731, 'CY', 4, 2, 'Career Services Fee', 145000.00, 'UGX', 'Career Services Fee for Bachelor of Cybersecurity - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1732, 'CY', 4, 2, 'Cybersecurity Lab Fee', 506000.00, 'UGX', 'Cybersecurity Lab Fee for Bachelor of Cybersecurity - Year 4 Semester 2 (SPECIALIZED)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1733, 'CY', 4, 2, 'Professional Certification Prep', 289000.00, 'UGX', 'Professional Certification Prep for Bachelor of Cybersecurity - Year 4 Semester 2 (ENHANCEMENT)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1734, 'CY', 4, 2, 'Industry Workshop Access', 217000.00, 'UGX', 'Industry Workshop Access for Bachelor of Cybersecurity - Year 4 Semester 2 (ENHANCEMENT)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1735, 'CY', 4, 2, 'Alumni Network Access', 72000.00, 'UGX', 'Alumni Network Access for Bachelor of Cybersecurity - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1736, 'CY', 4, 2, 'Job Placement Assistance', 145000.00, 'UGX', 'Job Placement Assistance for Bachelor of Cybersecurity - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1737, 'CY', 4, 2, 'Late Registration Fee', 145000.00, 'UGX', 'Late Registration Fee for Bachelor of Cybersecurity - Year 4 Semester 2 (PENALTY)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1738, 'CY', 4, 2, 'Transcript Fee', 72000.00, 'UGX', 'Transcript Fee for Bachelor of Cybersecurity - Year 4 Semester 2 (ADMINISTRATIVE)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1739, 'CY', 4, 2, 'Certificate Fee', 217000.00, 'UGX', 'Certificate Fee for Bachelor of Cybersecurity - Year 4 Semester 2 (ADMINISTRATIVE)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1740, 'CY', 4, 2, 'Graduation Fee', 434000.00, 'UGX', 'Graduation Fee for Bachelor of Cybersecurity - Year 4 Semester 2 (ADMINISTRATIVE)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1741, 'AI', 1, 1, 'Tuition Fees', 3250000.00, 'UGX', 'Tuition Fees for Bachelor of Artificial Intelligence - Year 1 Semester 1 (ACADEMIC)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1742, 'AI', 1, 1, 'Registration Fees', 195000.00, 'UGX', 'Registration Fees for Bachelor of Artificial Intelligence - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1743, 'AI', 1, 1, 'Library Fees', 130000.00, 'UGX', 'Library Fees for Bachelor of Artificial Intelligence - Year 1 Semester 1 (FACILITY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1744, 'AI', 1, 1, 'Internet & WiFi Fees', 130000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Artificial Intelligence - Year 1 Semester 1 (TECHNOLOGY)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1745, 'AI', 1, 1, 'Student ID Card', 33000.00, 'UGX', 'Student ID Card for Bachelor of Artificial Intelligence - Year 1 Semester 1 (ADMINISTRATIVE)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1746, 'AI', 1, 1, 'Medical Services Fee', 104000.00, 'UGX', 'Medical Services Fee for Bachelor of Artificial Intelligence - Year 1 Semester 1 (SERVICES)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1747, 'AI', 1, 1, 'Sports & Recreation Fee', 98000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Artificial Intelligence - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1748, 'AI', 1, 1, 'Student Activities Fee', 195000.00, 'UGX', 'Student Activities Fee for Bachelor of Artificial Intelligence - Year 1 Semester 1 (SERVICES)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1749, 'AI', 1, 1, 'AI/ML Lab Access Fee', 520000.00, 'UGX', 'AI/ML Lab Access Fee for Bachelor of Artificial Intelligence - Year 1 Semester 1 (SPECIALIZED)', 1, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1750, 'AI', 1, 1, 'Late Registration Fee', 130000.00, 'UGX', 'Late Registration Fee for Bachelor of Artificial Intelligence - Year 1 Semester 1 (PENALTY)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1751, 'AI', 1, 1, 'Transcript Fee', 65000.00, 'UGX', 'Transcript Fee for Bachelor of Artificial Intelligence - Year 1 Semester 1 (ADMINISTRATIVE)', 0, '2023-01-01', '2026-12-31', '2025-08-06 08:53:18'),
(1752, 'AI', 1, 2, 'Tuition Fees', 3315000.00, 'UGX', 'Tuition Fees for Bachelor of Artificial Intelligence - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1753, 'AI', 1, 2, 'Registration Fees', 195000.00, 'UGX', 'Registration Fees for Bachelor of Artificial Intelligence - Year 1 Semester 2 (ADMINISTRATIVE)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1754, 'AI', 1, 2, 'Examination Fees', 260000.00, 'UGX', 'Examination Fees for Bachelor of Artificial Intelligence - Year 1 Semester 2 (ACADEMIC)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1755, 'AI', 1, 2, 'Library Fees', 130000.00, 'UGX', 'Library Fees for Bachelor of Artificial Intelligence - Year 1 Semester 2 (FACILITY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1756, 'AI', 1, 2, 'Internet & WiFi Fees', 130000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Artificial Intelligence - Year 1 Semester 2 (TECHNOLOGY)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1757, 'AI', 1, 2, 'Medical Services Fee', 104000.00, 'UGX', 'Medical Services Fee for Bachelor of Artificial Intelligence - Year 1 Semester 2 (SERVICES)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1758, 'AI', 1, 2, 'Sports & Recreation Fee', 98000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Artificial Intelligence - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1759, 'AI', 1, 2, 'Student Activities Fee', 195000.00, 'UGX', 'Student Activities Fee for Bachelor of Artificial Intelligence - Year 1 Semester 2 (SERVICES)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1760, 'AI', 1, 2, 'AI/ML Lab Access Fee', 520000.00, 'UGX', 'AI/ML Lab Access Fee for Bachelor of Artificial Intelligence - Year 1 Semester 2 (SPECIALIZED)', 1, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1761, 'AI', 1, 2, 'Late Registration Fee', 130000.00, 'UGX', 'Late Registration Fee for Bachelor of Artificial Intelligence - Year 1 Semester 2 (PENALTY)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1762, 'AI', 1, 2, 'Transcript Fee', 65000.00, 'UGX', 'Transcript Fee for Bachelor of Artificial Intelligence - Year 1 Semester 2 (ADMINISTRATIVE)', 0, '2023-07-01', '2026-12-31', '2025-08-06 08:53:18'),
(1763, 'AI', 2, 1, 'Tuition Fees', 3413000.00, 'UGX', 'Tuition Fees for Bachelor of Artificial Intelligence - Year 2 Semester 1 (ACADEMIC)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1764, 'AI', 2, 1, 'Library Fees', 137000.00, 'UGX', 'Library Fees for Bachelor of Artificial Intelligence - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1765, 'AI', 2, 1, 'Computer Lab Fees', 410000.00, 'UGX', 'Computer Lab Fees for Bachelor of Artificial Intelligence - Year 2 Semester 1 (FACILITY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1766, 'AI', 2, 1, 'Software Licensing Fees', 341000.00, 'UGX', 'Software Licensing Fees for Bachelor of Artificial Intelligence - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1767, 'AI', 2, 1, 'Internet & WiFi Fees', 137000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Artificial Intelligence - Year 2 Semester 1 (TECHNOLOGY)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1768, 'AI', 2, 1, 'Medical Services Fee', 109000.00, 'UGX', 'Medical Services Fee for Bachelor of Artificial Intelligence - Year 2 Semester 1 (SERVICES)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1769, 'AI', 2, 1, 'Sports & Recreation Fee', 102000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Artificial Intelligence - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1770, 'AI', 2, 1, 'Student Activities Fee', 205000.00, 'UGX', 'Student Activities Fee for Bachelor of Artificial Intelligence - Year 2 Semester 1 (SERVICES)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1771, 'AI', 2, 1, 'AI/ML Lab Access Fee', 546000.00, 'UGX', 'AI/ML Lab Access Fee for Bachelor of Artificial Intelligence - Year 2 Semester 1 (SPECIALIZED)', 1, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1772, 'AI', 2, 1, 'Industry Workshop Access', 205000.00, 'UGX', 'Industry Workshop Access for Bachelor of Artificial Intelligence - Year 2 Semester 1 (ENHANCEMENT)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1773, 'AI', 2, 1, 'Late Registration Fee', 137000.00, 'UGX', 'Late Registration Fee for Bachelor of Artificial Intelligence - Year 2 Semester 1 (PENALTY)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1774, 'AI', 2, 1, 'Transcript Fee', 68000.00, 'UGX', 'Transcript Fee for Bachelor of Artificial Intelligence - Year 2 Semester 1 (ADMINISTRATIVE)', 0, '2024-01-01', '2027-12-31', '2025-08-06 08:53:18'),
(1775, 'AI', 2, 2, 'Tuition Fees', 3481000.00, 'UGX', 'Tuition Fees for Bachelor of Artificial Intelligence - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1776, 'AI', 2, 2, 'Examination Fees', 273000.00, 'UGX', 'Examination Fees for Bachelor of Artificial Intelligence - Year 2 Semester 2 (ACADEMIC)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1777, 'AI', 2, 2, 'Library Fees', 137000.00, 'UGX', 'Library Fees for Bachelor of Artificial Intelligence - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1778, 'AI', 2, 2, 'Computer Lab Fees', 410000.00, 'UGX', 'Computer Lab Fees for Bachelor of Artificial Intelligence - Year 2 Semester 2 (FACILITY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1779, 'AI', 2, 2, 'Software Licensing Fees', 341000.00, 'UGX', 'Software Licensing Fees for Bachelor of Artificial Intelligence - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1780, 'AI', 2, 2, 'Internet & WiFi Fees', 137000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Artificial Intelligence - Year 2 Semester 2 (TECHNOLOGY)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1781, 'AI', 2, 2, 'Medical Services Fee', 109000.00, 'UGX', 'Medical Services Fee for Bachelor of Artificial Intelligence - Year 2 Semester 2 (SERVICES)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1782, 'AI', 2, 2, 'Sports & Recreation Fee', 102000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Artificial Intelligence - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1783, 'AI', 2, 2, 'Student Activities Fee', 205000.00, 'UGX', 'Student Activities Fee for Bachelor of Artificial Intelligence - Year 2 Semester 2 (SERVICES)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1784, 'AI', 2, 2, 'AI/ML Lab Access Fee', 546000.00, 'UGX', 'AI/ML Lab Access Fee for Bachelor of Artificial Intelligence - Year 2 Semester 2 (SPECIALIZED)', 1, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1785, 'AI', 2, 2, 'Industry Workshop Access', 205000.00, 'UGX', 'Industry Workshop Access for Bachelor of Artificial Intelligence - Year 2 Semester 2 (ENHANCEMENT)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1786, 'AI', 2, 2, 'Late Registration Fee', 137000.00, 'UGX', 'Late Registration Fee for Bachelor of Artificial Intelligence - Year 2 Semester 2 (PENALTY)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1787, 'AI', 2, 2, 'Transcript Fee', 68000.00, 'UGX', 'Transcript Fee for Bachelor of Artificial Intelligence - Year 2 Semester 2 (ADMINISTRATIVE)', 0, '2024-07-01', '2027-12-31', '2025-08-06 08:53:18'),
(1788, 'AI', 3, 1, 'Tuition Fees', 3583000.00, 'UGX', 'Tuition Fees for Bachelor of Artificial Intelligence - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1789, 'AI', 3, 1, 'Library Fees', 143000.00, 'UGX', 'Library Fees for Bachelor of Artificial Intelligence - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1790, 'AI', 3, 1, 'Computer Lab Fees', 430000.00, 'UGX', 'Computer Lab Fees for Bachelor of Artificial Intelligence - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1791, 'AI', 3, 1, 'Software Licensing Fees', 358000.00, 'UGX', 'Software Licensing Fees for Bachelor of Artificial Intelligence - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1792, 'AI', 3, 1, 'Internet & WiFi Fees', 143000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Artificial Intelligence - Year 3 Semester 1 (TECHNOLOGY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1793, 'AI', 3, 1, 'Equipment Usage Fees', 287000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Artificial Intelligence - Year 3 Semester 1 (FACILITY)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1794, 'AI', 3, 1, 'Project Development Fees', 573000.00, 'UGX', 'Project Development Fees for Bachelor of Artificial Intelligence - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1795, 'AI', 3, 1, 'Research Methodology Fees', 215000.00, 'UGX', 'Research Methodology Fees for Bachelor of Artificial Intelligence - Year 3 Semester 1 (ACADEMIC)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1796, 'AI', 3, 1, 'Medical Services Fee', 115000.00, 'UGX', 'Medical Services Fee for Bachelor of Artificial Intelligence - Year 3 Semester 1 (SERVICES)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1797, 'AI', 3, 1, 'Sports & Recreation Fee', 107000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Artificial Intelligence - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1798, 'AI', 3, 1, 'Student Activities Fee', 215000.00, 'UGX', 'Student Activities Fee for Bachelor of Artificial Intelligence - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1799, 'AI', 3, 1, 'Career Services Fee', 143000.00, 'UGX', 'Career Services Fee for Bachelor of Artificial Intelligence - Year 3 Semester 1 (SERVICES)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1800, 'AI', 3, 1, 'AI/ML Lab Access Fee', 573000.00, 'UGX', 'AI/ML Lab Access Fee for Bachelor of Artificial Intelligence - Year 3 Semester 1 (SPECIALIZED)', 1, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1801, 'AI', 3, 1, 'Professional Certification Prep', 287000.00, 'UGX', 'Professional Certification Prep for Bachelor of Artificial Intelligence - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1802, 'AI', 3, 1, 'Industry Workshop Access', 215000.00, 'UGX', 'Industry Workshop Access for Bachelor of Artificial Intelligence - Year 3 Semester 1 (ENHANCEMENT)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1803, 'AI', 3, 1, 'Late Registration Fee', 143000.00, 'UGX', 'Late Registration Fee for Bachelor of Artificial Intelligence - Year 3 Semester 1 (PENALTY)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1804, 'AI', 3, 1, 'Transcript Fee', 72000.00, 'UGX', 'Transcript Fee for Bachelor of Artificial Intelligence - Year 3 Semester 1 (ADMINISTRATIVE)', 0, '2025-01-01', '2028-12-31', '2025-08-06 08:53:18'),
(1805, 'AI', 3, 2, 'Tuition Fees', 3655000.00, 'UGX', 'Tuition Fees for Bachelor of Artificial Intelligence - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1806, 'AI', 3, 2, 'Examination Fees', 287000.00, 'UGX', 'Examination Fees for Bachelor of Artificial Intelligence - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1807, 'AI', 3, 2, 'Library Fees', 143000.00, 'UGX', 'Library Fees for Bachelor of Artificial Intelligence - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1808, 'AI', 3, 2, 'Computer Lab Fees', 430000.00, 'UGX', 'Computer Lab Fees for Bachelor of Artificial Intelligence - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1809, 'AI', 3, 2, 'Software Licensing Fees', 358000.00, 'UGX', 'Software Licensing Fees for Bachelor of Artificial Intelligence - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1810, 'AI', 3, 2, 'Internet & WiFi Fees', 143000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Artificial Intelligence - Year 3 Semester 2 (TECHNOLOGY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1811, 'AI', 3, 2, 'Equipment Usage Fees', 287000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Artificial Intelligence - Year 3 Semester 2 (FACILITY)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1812, 'AI', 3, 2, 'Project Development Fees', 573000.00, 'UGX', 'Project Development Fees for Bachelor of Artificial Intelligence - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1813, 'AI', 3, 2, 'Research Methodology Fees', 215000.00, 'UGX', 'Research Methodology Fees for Bachelor of Artificial Intelligence - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1814, 'AI', 3, 2, 'Industry Attachment Fees', 430000.00, 'UGX', 'Industry Attachment Fees for Bachelor of Artificial Intelligence - Year 3 Semester 2 (ACADEMIC)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1815, 'AI', 3, 2, 'Medical Services Fee', 115000.00, 'UGX', 'Medical Services Fee for Bachelor of Artificial Intelligence - Year 3 Semester 2 (SERVICES)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1816, 'AI', 3, 2, 'Sports & Recreation Fee', 107000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Artificial Intelligence - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1817, 'AI', 3, 2, 'Student Activities Fee', 215000.00, 'UGX', 'Student Activities Fee for Bachelor of Artificial Intelligence - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1818, 'AI', 3, 2, 'Career Services Fee', 143000.00, 'UGX', 'Career Services Fee for Bachelor of Artificial Intelligence - Year 3 Semester 2 (SERVICES)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1819, 'AI', 3, 2, 'AI/ML Lab Access Fee', 573000.00, 'UGX', 'AI/ML Lab Access Fee for Bachelor of Artificial Intelligence - Year 3 Semester 2 (SPECIALIZED)', 1, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1820, 'AI', 3, 2, 'Professional Certification Prep', 287000.00, 'UGX', 'Professional Certification Prep for Bachelor of Artificial Intelligence - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1821, 'AI', 3, 2, 'Industry Workshop Access', 215000.00, 'UGX', 'Industry Workshop Access for Bachelor of Artificial Intelligence - Year 3 Semester 2 (ENHANCEMENT)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1822, 'AI', 3, 2, 'Late Registration Fee', 143000.00, 'UGX', 'Late Registration Fee for Bachelor of Artificial Intelligence - Year 3 Semester 2 (PENALTY)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1823, 'AI', 3, 2, 'Transcript Fee', 72000.00, 'UGX', 'Transcript Fee for Bachelor of Artificial Intelligence - Year 3 Semester 2 (ADMINISTRATIVE)', 0, '2025-07-01', '2028-12-31', '2025-08-06 08:53:18'),
(1824, 'AI', 4, 1, 'Tuition Fees', 3762000.00, 'UGX', 'Tuition Fees for Bachelor of Artificial Intelligence - Year 4 Semester 1 (ACADEMIC)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1825, 'AI', 4, 1, 'Library Fees', 150000.00, 'UGX', 'Library Fees for Bachelor of Artificial Intelligence - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1826, 'AI', 4, 1, 'Computer Lab Fees', 451000.00, 'UGX', 'Computer Lab Fees for Bachelor of Artificial Intelligence - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1827, 'AI', 4, 1, 'Software Licensing Fees', 376000.00, 'UGX', 'Software Licensing Fees for Bachelor of Artificial Intelligence - Year 4 Semester 1 (TECHNOLOGY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1828, 'AI', 4, 1, 'Internet & WiFi Fees', 150000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Artificial Intelligence - Year 4 Semester 1 (TECHNOLOGY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1829, 'AI', 4, 1, 'Equipment Usage Fees', 301000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Artificial Intelligence - Year 4 Semester 1 (FACILITY)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1830, 'AI', 4, 1, 'Project Development Fees', 602000.00, 'UGX', 'Project Development Fees for Bachelor of Artificial Intelligence - Year 4 Semester 1 (ACADEMIC)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1831, 'AI', 4, 1, 'Medical Services Fee', 120000.00, 'UGX', 'Medical Services Fee for Bachelor of Artificial Intelligence - Year 4 Semester 1 (SERVICES)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1832, 'AI', 4, 1, 'Sports & Recreation Fee', 113000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Artificial Intelligence - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1833, 'AI', 4, 1, 'Student Activities Fee', 226000.00, 'UGX', 'Student Activities Fee for Bachelor of Artificial Intelligence - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1834, 'AI', 4, 1, 'Career Services Fee', 150000.00, 'UGX', 'Career Services Fee for Bachelor of Artificial Intelligence - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1835, 'AI', 4, 1, 'AI/ML Lab Access Fee', 602000.00, 'UGX', 'AI/ML Lab Access Fee for Bachelor of Artificial Intelligence - Year 4 Semester 1 (SPECIALIZED)', 1, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1836, 'AI', 4, 1, 'Professional Certification Prep', 301000.00, 'UGX', 'Professional Certification Prep for Bachelor of Artificial Intelligence - Year 4 Semester 1 (ENHANCEMENT)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1837, 'AI', 4, 1, 'Industry Workshop Access', 226000.00, 'UGX', 'Industry Workshop Access for Bachelor of Artificial Intelligence - Year 4 Semester 1 (ENHANCEMENT)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1838, 'AI', 4, 1, 'Alumni Network Access', 75000.00, 'UGX', 'Alumni Network Access for Bachelor of Artificial Intelligence - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1839, 'AI', 4, 1, 'Job Placement Assistance', 150000.00, 'UGX', 'Job Placement Assistance for Bachelor of Artificial Intelligence - Year 4 Semester 1 (SERVICES)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1840, 'AI', 4, 1, 'Late Registration Fee', 150000.00, 'UGX', 'Late Registration Fee for Bachelor of Artificial Intelligence - Year 4 Semester 1 (PENALTY)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1841, 'AI', 4, 1, 'Transcript Fee', 75000.00, 'UGX', 'Transcript Fee for Bachelor of Artificial Intelligence - Year 4 Semester 1 (ADMINISTRATIVE)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1842, 'AI', 4, 1, 'Certificate Fee', 226000.00, 'UGX', 'Certificate Fee for Bachelor of Artificial Intelligence - Year 4 Semester 1 (ADMINISTRATIVE)', 0, '2026-01-01', '2029-12-31', '2025-08-06 08:53:18'),
(1843, 'AI', 4, 2, 'Tuition Fees', 3838000.00, 'UGX', 'Tuition Fees for Bachelor of Artificial Intelligence - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1844, 'AI', 4, 2, 'Examination Fees', 301000.00, 'UGX', 'Examination Fees for Bachelor of Artificial Intelligence - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1845, 'AI', 4, 2, 'Library Fees', 150000.00, 'UGX', 'Library Fees for Bachelor of Artificial Intelligence - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1846, 'AI', 4, 2, 'Computer Lab Fees', 451000.00, 'UGX', 'Computer Lab Fees for Bachelor of Artificial Intelligence - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1847, 'AI', 4, 2, 'Software Licensing Fees', 376000.00, 'UGX', 'Software Licensing Fees for Bachelor of Artificial Intelligence - Year 4 Semester 2 (TECHNOLOGY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1848, 'AI', 4, 2, 'Internet & WiFi Fees', 150000.00, 'UGX', 'Internet & WiFi Fees for Bachelor of Artificial Intelligence - Year 4 Semester 2 (TECHNOLOGY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1849, 'AI', 4, 2, 'Equipment Usage Fees', 301000.00, 'UGX', 'Equipment Usage Fees for Bachelor of Artificial Intelligence - Year 4 Semester 2 (FACILITY)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1850, 'AI', 4, 2, 'Project Development Fees', 602000.00, 'UGX', 'Project Development Fees for Bachelor of Artificial Intelligence - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1851, 'AI', 4, 2, 'Thesis/Final Project Fee', 752000.00, 'UGX', 'Thesis/Final Project Fee for Bachelor of Artificial Intelligence - Year 4 Semester 2 (ACADEMIC)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1852, 'AI', 4, 2, 'Medical Services Fee', 120000.00, 'UGX', 'Medical Services Fee for Bachelor of Artificial Intelligence - Year 4 Semester 2 (SERVICES)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1853, 'AI', 4, 2, 'Sports & Recreation Fee', 113000.00, 'UGX', 'Sports & Recreation Fee for Bachelor of Artificial Intelligence - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1854, 'AI', 4, 2, 'Student Activities Fee', 226000.00, 'UGX', 'Student Activities Fee for Bachelor of Artificial Intelligence - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1855, 'AI', 4, 2, 'Career Services Fee', 150000.00, 'UGX', 'Career Services Fee for Bachelor of Artificial Intelligence - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1856, 'AI', 4, 2, 'AI/ML Lab Access Fee', 602000.00, 'UGX', 'AI/ML Lab Access Fee for Bachelor of Artificial Intelligence - Year 4 Semester 2 (SPECIALIZED)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1857, 'AI', 4, 2, 'Professional Certification Prep', 301000.00, 'UGX', 'Professional Certification Prep for Bachelor of Artificial Intelligence - Year 4 Semester 2 (ENHANCEMENT)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1858, 'AI', 4, 2, 'Industry Workshop Access', 226000.00, 'UGX', 'Industry Workshop Access for Bachelor of Artificial Intelligence - Year 4 Semester 2 (ENHANCEMENT)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1859, 'AI', 4, 2, 'Alumni Network Access', 75000.00, 'UGX', 'Alumni Network Access for Bachelor of Artificial Intelligence - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1860, 'AI', 4, 2, 'Job Placement Assistance', 150000.00, 'UGX', 'Job Placement Assistance for Bachelor of Artificial Intelligence - Year 4 Semester 2 (SERVICES)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1861, 'AI', 4, 2, 'Late Registration Fee', 150000.00, 'UGX', 'Late Registration Fee for Bachelor of Artificial Intelligence - Year 4 Semester 2 (PENALTY)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1862, 'AI', 4, 2, 'Transcript Fee', 75000.00, 'UGX', 'Transcript Fee for Bachelor of Artificial Intelligence - Year 4 Semester 2 (ADMINISTRATIVE)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1863, 'AI', 4, 2, 'Certificate Fee', 226000.00, 'UGX', 'Certificate Fee for Bachelor of Artificial Intelligence - Year 4 Semester 2 (ADMINISTRATIVE)', 0, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18'),
(1864, 'AI', 4, 2, 'Graduation Fee', 451000.00, 'UGX', 'Graduation Fee for Bachelor of Artificial Intelligence - Year 4 Semester 2 (ADMINISTRATIVE)', 1, '2026-07-01', '2029-12-31', '2025-08-06 08:53:18');

-- --------------------------------------------------------

--
-- Table structure for table `fee_structures`
--

DROP TABLE IF EXISTS `fee_structures`;
CREATE TABLE IF NOT EXISTS `fee_structures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `year_level` int NOT NULL,
  `semester` varchar(50) NOT NULL,
  `tuition_fee` decimal(10,2) NOT NULL,
  `registration_fee` decimal(10,2) DEFAULT '0.00',
  `library_fee` decimal(10,2) DEFAULT '0.00',
  `lab_fee` decimal(10,2) DEFAULT '0.00',
  `hostel_fee` decimal(10,2) DEFAULT '0.00',
  `other_fees` decimal(10,2) DEFAULT '0.00',
  `total_fee` decimal(10,2) GENERATED ALWAYS AS ((((((`tuition_fee` + `registration_fee`) + `library_fee`) + `lab_fee`) + `hostel_fee`) + `other_fees`)) STORED,
  `effective_date` date NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `program_id` (`program_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fee_transactions`
--

DROP TABLE IF EXISTS `fee_transactions`;
CREATE TABLE IF NOT EXISTS `fee_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transaction_id` varchar(50) NOT NULL,
  `student_id` int NOT NULL,
  `invoice_id` int DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `transaction_type` enum('PAYMENT','REFUND','ADJUSTMENT') DEFAULT 'PAYMENT',
  `payment_method` varchar(50) DEFAULT NULL,
  `reference_no` varchar(100) DEFAULT NULL,
  `description` text,
  `transaction_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `idx_student_date` (`student_id`,`transaction_date`),
  KEY `invoice_id` (`invoice_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fee_transactions`
--

INSERT INTO `fee_transactions` (`id`, `transaction_id`, `student_id`, `invoice_id`, `amount`, `transaction_type`, `payment_method`, `reference_no`, `description`, `transaction_date`, `created_at`) VALUES
(1, 'TXN-1754469805506-0', 2, NULL, 2500000.00, 'PAYMENT', 'BANK_TRANSFER', 'PAY-2023-001', 'Tuition payment 2023/1', '2023-02-15 08:00:00', '2025-08-06 08:43:25'),
(2, 'TXN-1754469805507-1', 2, NULL, 250000.00, 'PAYMENT', 'MOBILE_MONEY', 'MM-2023-001', 'Registration and library fees 2023/1', '2023-02-20 08:00:00', '2025-08-06 08:43:25'),
(3, 'TXN-1754469805507-2', 2, NULL, 2500000.00, 'PAYMENT', 'BANK_TRANSFER', 'PAY-2023-002', 'Tuition payment 2023/2', '2023-08-10 07:00:00', '2025-08-06 08:43:25'),
(4, 'TXN-1754469805508-3', 2, NULL, 200000.00, 'PAYMENT', 'CASH', 'CASH-2023-001', 'Examination fees 2023/2', '2023-11-20 08:00:00', '2025-08-06 08:43:25'),
(5, 'TXN-1754469805508-4', 2, NULL, 2750000.00, 'PAYMENT', 'BANK_TRANSFER', 'PAY-2024-001', 'Tuition payment 2024/1', '2024-02-12 08:00:00', '2025-08-06 08:43:25'),
(6, 'TXN-1754469805508-5', 2, NULL, 300000.00, 'PAYMENT', 'MOBILE_MONEY', 'MM-2024-001', 'Lab fees 2024/1', '2024-03-05 08:00:00', '2025-08-06 08:43:25'),
(7, 'TXN-1754469805589-6', 2, NULL, 2000000.00, 'PAYMENT', 'BANK_TRANSFER', 'PAY-2024-003', 'Partial tuition payment 2024/25', '2024-08-15 07:00:00', '2025-08-06 08:43:25'),
(8, 'TXN-1754469805590-7', 2, NULL, 100000.00, 'PAYMENT', 'MOBILE_MONEY', 'MM-2024-002', 'Internet fee payment 2024/25', '2024-09-01 07:00:00', '2025-08-06 08:43:25');

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img` varchar(100) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `img`, `category`) VALUES
(50, '132372302photo-gallery-2.jpg', NULL),
(51, '1455171349photo-gallery-7.jpg', 'Campus Photos'),
(52, '267563397photo-gallery-8.jpg', 'Campus Photos'),
(53, '450481731photo-gallery-9.jpg', 'Campus Photos'),
(55, '1983454792photo-gallery-6.jpg', 'Athletics Photos'),
(56, '1448007338photo-gallery-5.jpg', 'Videos'),
(57, '513988499photo-gallery-4.jpg', 'Videos'),
(58, '1409853482photo-gallery-3.jpg', 'Arts');

-- --------------------------------------------------------

--
-- Table structure for table `graduations`
--

DROP TABLE IF EXISTS `graduations`;
CREATE TABLE IF NOT EXISTS `graduations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `ceremony_date` date NOT NULL,
  `honors_level` enum('none','cum_laude','magna_cum_laude','summa_cum_laude') DEFAULT 'none',
  `diploma_issued` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_graduations_student` (`student_id`),
  KEY `idx_graduations_date` (`ceremony_date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `graduation_candidates`
--

DROP TABLE IF EXISTS `graduation_candidates`;
CREATE TABLE IF NOT EXISTS `graduation_candidates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(50) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `program` varchar(255) DEFAULT NULL,
  `cgpa` decimal(3,2) DEFAULT NULL,
  `credits_completed` int DEFAULT '0',
  `status` enum('eligible','pending','approved','graduated') DEFAULT 'eligible',
  `graduation_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `graduation_requests`
--

DROP TABLE IF EXISTS `graduation_requests`;
CREATE TABLE IF NOT EXISTS `graduation_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `program_id` int NOT NULL,
  `expected_graduation_date` date NOT NULL,
  `cgpa` decimal(3,2) NOT NULL,
  `credits_completed` int NOT NULL,
  `clearance_status` json DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `requested_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_by` int DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `program_id` (`program_id`),
  KEY `reviewed_by` (`reviewed_by`),
  KEY `idx_graduation_requests_status` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_no` varchar(50) NOT NULL,
  `student_id` int NOT NULL,
  `academic_year` varchar(20) NOT NULL,
  `semester` varchar(20) NOT NULL,
  `category` varchar(100) NOT NULL,
  `amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `paid_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `due_amount` decimal(15,2) GENERATED ALWAYS AS ((`amount` - `paid_amount`)) STORED,
  `currency` varchar(10) DEFAULT 'UGX',
  `narration` text,
  `type` varchar(50) DEFAULT 'TUITION',
  `status` varchar(20) DEFAULT 'ACTIVE',
  `allocation` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_no` (`invoice_no`),
  KEY `idx_student_year_sem` (`student_id`,`academic_year`,`semester`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `invoice_no`, `student_id`, `academic_year`, `semester`, `category`, `amount`, `paid_amount`, `currency`, `narration`, `type`, `status`, `allocation`, `created_at`, `updated_at`) VALUES
(1, 'INV-2023-1-001', 2, '2023', '1', 'Tuition Fees', 2500000.00, 2500000.00, 'UGX', 'First year first semester tuition fees', 'TUITION', 'ACTIVE', 'Academic Fees', '2025-08-06 08:43:24', '2025-08-06 08:43:24'),
(2, 'INV-2023-1-002', 2, '2023', '1', 'Registration Fees', 150000.00, 150000.00, 'UGX', 'First year registration and orientation', 'REGISTRATION', 'ACTIVE', 'Academic Fees', '2025-08-06 08:43:24', '2025-08-06 08:43:24'),
(3, 'INV-2023-1-003', 2, '2023', '1', 'Library Fees', 100000.00, 100000.00, 'UGX', 'Library access and services', 'FACILITY', 'ACTIVE', 'Academic Fees', '2025-08-06 08:43:24', '2025-08-06 08:43:24'),
(4, 'INV-2023-2-001', 2, '2023', '2', 'Tuition Fees', 2500000.00, 2500000.00, 'UGX', 'First year second semester tuition fees', 'TUITION', 'ACTIVE', 'Academic Fees', '2025-08-06 08:43:24', '2025-08-06 08:43:24'),
(5, 'INV-2023-2-002', 2, '2023', '2', 'Examination Fees', 200000.00, 200000.00, 'UGX', 'End of year examination fees', 'EXAMINATION', 'ACTIVE', 'Academic Fees', '2025-08-06 08:43:24', '2025-08-06 08:43:24'),
(6, 'INV-2024-1-001', 2, '2024', '1', 'Tuition Fees', 2750000.00, 2750000.00, 'UGX', 'Second year first semester tuition fees', 'TUITION', 'ACTIVE', 'Academic Fees', '2025-08-06 08:43:25', '2025-08-06 08:43:25'),
(7, 'INV-2024-1-002', 2, '2024', '1', 'Lab Fees', 300000.00, 300000.00, 'UGX', 'Computer lab and equipment usage', 'FACILITY', 'ACTIVE', 'Academic Fees', '2025-08-06 08:43:25', '2025-08-06 08:43:25'),
(8, 'INV-2024-25-001', 2, '2024/2025', 'SEMESTER I', 'Tuition Fees', 3000000.00, 2000000.00, 'UGX', 'Third year first semester tuition fees', 'TUITION', 'ACTIVE', 'Academic Fees', '2025-08-06 08:43:25', '2025-08-06 08:43:25'),
(9, 'INV-2024-25-002', 2, '2024/2025', 'SEMESTER I', 'Student Activities Fee', 150000.00, 0.00, 'UGX', 'Student union and activities fund', 'ACTIVITY', 'ACTIVE', 'Academic Fees', '2025-08-06 08:43:25', '2025-08-06 08:43:25'),
(10, 'INV-2024-25-003', 2, '2024/2025', 'SEMESTER I', 'Internet & WiFi Fee', 100000.00, 100000.00, 'UGX', 'High-speed internet access on campus', 'FACILITY', 'ACTIVE', 'Academic Fees', '2025-08-06 08:43:25', '2025-08-06 08:43:25');

-- --------------------------------------------------------

--
-- Table structure for table `lecturers`
--

DROP TABLE IF EXISTS `lecturers`;
CREATE TABLE IF NOT EXISTS `lecturers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `office` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `office_hours` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `lecturers`
--

INSERT INTO `lecturers` (`id`, `user_id`, `employee_id`, `department`, `title`, `office`, `phone`, `office_hours`) VALUES
(1, 2, 'LEC2024001', 'Computer Science', 'Dr.', 'CS Building, Room 210', '+1 (555) 123-4567', 'Tuesday 2-4 PM, Thursday 10-12 PM');

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

DROP TABLE IF EXISTS `login_attempts`;
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `success` tinyint(1) DEFAULT '0',
  `user_agent` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','warning','success','error') DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user_read` (`user_id`,`is_read`),
  KEY `idx_notifications_user_type_read` (`user_id`,`type`,`is_read`),
  KEY `idx_notifications_created` (`created_at`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `created_at`) VALUES
(1, 1, 'Results Published', 'Your CS301 midterm results are now available', 'info', 0, '2025-07-27 13:53:42'),
(2, 1, 'Payment Reminder', 'Tuition fee balance due in 30 days', 'warning', 0, '2025-07-27 13:53:42'),
(3, 1, 'System Maintenance', 'Portal will be down for maintenance on March 20', 'info', 0, '2025-07-27 13:53:42');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('bank_transfer','mobile_money','credit_card','cash') NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `receipt_number` varchar(100) DEFAULT NULL,
  `aprn` varchar(100) DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','completed','failed') DEFAULT 'completed',
  PRIMARY KEY (`id`),
  KEY `idx_payments_student` (`student_id`),
  KEY `idx_payments_student_method_date` (`student_id`,`payment_method`,`payment_date`),
  KEY `idx_payments_status_date` (`status`,`payment_date`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `student_id`, `amount`, `payment_method`, `transaction_id`, `receipt_number`, `aprn`, `payment_date`, `status`) VALUES
(1, 1, 12000.00, 'bank_transfer', 'TXN123456789', 'RCP001234', 'EIU-20240215-STD2024001-TUITION', '2024-02-15 18:30:00', 'completed'),
(2, 1, 3000.00, 'mobile_money', 'MM987654321', 'RCP001235', 'EIU-20240120-STD2024001-HOSTEL', '2024-01-20 22:15:00', 'completed'),
(3, 1, 3000.00, 'credit_card', 'CC456789123', 'RCP001236', 'EIU-20231210-STD2024001-REG', '2023-12-10 17:45:00', 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
CREATE TABLE IF NOT EXISTS `programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(20) NOT NULL,
  `college_id` int NOT NULL,
  `department_id` int DEFAULT NULL,
  `duration` int NOT NULL,
  `credits_required` int NOT NULL DEFAULT '120',
  `department` varchar(100) DEFAULT NULL,
  `degree_type` enum('Certificate','Diploma','Bachelor','Master','PhD') NOT NULL,
  `description` text,
  `requirements` text,
  `location` enum('On Campus','Online') NOT NULL DEFAULT 'On Campus',
  `application_deadline` date DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_programs_department` (`department_id`),
  KEY `idx_programs_college_status` (`college_id`,`status`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `programs`
--

INSERT INTO `programs` (`id`, `name`, `code`, `college_id`, `department_id`, `duration`, `credits_required`, `department`, `degree_type`, `description`, `requirements`, `location`, `application_deadline`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Bachelor of Science in Computer Science', 'BSC-CS', 1, 1, 4, 120, NULL, 'Bachelor', 'A comprehensive program covering the fundamentals of computer science, including algorithms, data structures, and software development.', '- High School Diploma or equivalent\n- Strong background in Mathematics and Physics\n- Passing grade in entrance examination', 'On Campus', '2025-08-31', 'active', '2025-07-28 14:50:02', '2025-07-28 14:50:02'),
(2, 'Master of Science in Software Engineering', 'MSC-SE', 1, 3, 2, 120, NULL, 'Master', 'An advanced program focusing on the principles and practices of software engineering, including agile methodologies, software architecture, and quality assurance.', '- Bachelor\'s degree in Computer Science or a related field\n- Minimum CGPA of 3.0\n- Letters of recommendation', 'Online', '2025-07-31', 'active', '2025-07-28 14:50:02', '2025-07-28 14:50:02'),
(3, 'Bachelor of Business Administration', 'BBA', 2, 4, 4, 120, NULL, 'Bachelor', 'This program provides a strong foundation in business principles, with specializations available in marketing, finance, and human resource management.', '- High School Diploma or equivalent\n- Proficiency in English\n- Entrance interview', 'On Campus', '2025-09-15', 'active', '2025-07-28 14:50:02', '2025-07-28 14:50:02'),
(4, 'PhD in Information Technology', 'PHD-IT', 1, 2, 5, 120, NULL, 'PhD', 'A research-intensive program for students wishing to pursue advanced topics in information technology and contribute to the field.', '- Master\'s degree in IT or a related field\n- Research proposal\n- Published articles are a plus', 'On Campus', '2025-06-30', 'active', '2025-07-28 14:50:02', '2025-07-28 14:50:02');

-- --------------------------------------------------------

--
-- Table structure for table `registration_history`
--

DROP TABLE IF EXISTS `registration_history`;
CREATE TABLE IF NOT EXISTS `registration_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `academic_year` varchar(20) NOT NULL,
  `semester` varchar(50) NOT NULL,
  `study_year` varchar(20) NOT NULL,
  `registration_type` enum('FULL REGISTRATION','PARTIAL REGISTRATION') NOT NULL,
  `registered_by` varchar(100) DEFAULT 'STAFF',
  `registered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','completed','cancelled') DEFAULT 'active',
  PRIMARY KEY (`id`),
  KEY `idx_registration_history_student` (`student_id`),
  KEY `idx_registration_history_year_sem` (`academic_year`,`semester`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `registration_history`
--

INSERT INTO `registration_history` (`id`, `student_id`, `academic_year`, `semester`, `study_year`, `registration_type`, `registered_by`, `registered_at`, `status`) VALUES
(1, 1, '2024/2025', 'SEMESTER I', 'YEAR 1', 'FULL REGISTRATION', 'STAFF', '2024-09-04 16:10:34', 'active'),
(2, 1, '2024/2025', 'SEMESTER II', 'YEAR 1', 'FULL REGISTRATION', 'STAFF', '2024-01-15 16:30:00', 'active'),
(3, 2, '2023', '1', '', '', 'system', '2023-08-15 17:00:00', 'active'),
(4, 2, '2023', '2', '', '', 'system', '2024-01-15 18:00:00', 'active'),
(5, 2, '2024', '1', '', '', 'system', '2024-08-15 17:00:00', 'active'),
(6, 2, '2024/2025', 'SEMESTER I', '', 'FULL REGISTRATION', 'system', '2025-08-01 17:00:00', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
CREATE TABLE IF NOT EXISTS `results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(50) NOT NULL,
  `academic_year` varchar(10) NOT NULL,
  `semester` varchar(50) NOT NULL,
  `course_code` varchar(20) NOT NULL,
  `course_title` varchar(255) NOT NULL,
  `credit_units` int NOT NULL,
  `cw_mark` int DEFAULT NULL,
  `ex_mark` int DEFAULT NULL,
  `final_mark` int GENERATED ALWAYS AS ((`cw_mark` + `ex_mark`)) STORED,
  `grade` varchar(5) DEFAULT NULL,
  `gpa` decimal(3,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `idx_results_student_year_semester` (`student_id`,`academic_year`,`semester`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `results`
--

INSERT INTO `results` (`id`, `student_id`, `academic_year`, `semester`, `course_code`, `course_title`, `credit_units`, `cw_mark`, `ex_mark`, `grade`, `gpa`, `created_at`) VALUES
(1, '1', '2024/2025', 'Semester II', 'BCM101', 'Introduction to Commerce', 3, 35, 55, 'B', 4.00, '2025-08-04 12:37:19'),
(2, '1', '2024/2025', 'Semester II', 'BCM102', 'Business Mathematics', 3, 30, 50, 'C', 3.00, '2025-08-04 12:37:19'),
(3, '1', '2024/2025', 'Semester II', 'BCM103', 'Principles of Accounting', 3, 40, 50, 'A', 5.00, '2025-08-04 12:37:19'),
(4, 'STD2024002', '2023', '1', 'CS101', 'Introduction to Programming', 3, 35, 50, 'A', 4.00, '2025-08-05 11:52:27'),
(5, 'STD2024002', '2023', '1', 'CS102', 'Computer Systems', 3, 32, 46, 'B+', 3.50, '2025-08-05 11:52:27'),
(6, 'STD2024002', '2023', '1', 'MATH101', 'Calculus I', 3, 30, 45, 'B', 3.00, '2025-08-05 11:52:27'),
(7, 'STD2024002', '2023', '1', 'ENG101', 'English Composition', 3, 34, 48, 'A-', 3.70, '2025-08-05 11:52:27'),
(8, 'STD2024002', '2023', '1', 'PHY101', 'Physics I', 3, 33, 46, 'B+', 3.50, '2025-08-05 11:52:27'),
(9, 'STD2024002', '2023', '2', 'CS201', 'Data Structures', 3, 35, 48, 'A-', 3.70, '2025-08-05 11:52:27'),
(10, 'STD2024002', '2023', '2', 'CS202', 'Object Oriented Programming', 3, 37, 50, 'A', 4.00, '2025-08-05 11:52:27'),
(11, 'STD2024002', '2023', '2', 'MATH201', 'Calculus II', 3, 32, 45, 'B+', 3.50, '2025-08-05 11:52:27'),
(12, 'STD2024002', '2023', '2', 'STAT201', 'Statistics', 3, 30, 44, 'B', 3.00, '2025-08-05 11:52:27'),
(13, 'STD2024002', '2023', '2', 'ENG201', 'Technical Writing', 3, 38, 50, 'A', 4.00, '2025-08-05 11:52:27'),
(14, 'STD2024002', '2024', '1', 'CS301', 'Database Systems', 3, 36, 48, 'A-', 3.70, '2025-08-05 11:52:27'),
(15, 'STD2024002', '2024', '1', 'CS302', 'Web Development', 3, 39, 50, 'A', 4.00, '2025-08-05 11:52:27'),
(16, 'STD2024002', '2024', '1', 'CS303', 'Software Engineering', 3, 32, 44, 'B+', 3.50, '2025-08-05 11:52:27'),
(17, 'STD2024002', '2024', '1', 'CS304', 'Computer Networks', 3, 34, 48, 'A-', 3.70, '2025-08-05 11:52:27'),
(18, 'STD2024002', '2024', '1', 'MATH301', 'Discrete Mathematics', 3, 30, 43, 'B', 3.00, '2025-08-05 11:52:27');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `permissions` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `permissions`, `created_at`) VALUES
(1, 'Super Admin', 'Full system access', '{\"all\": true}', '2025-07-27 13:56:07'),
(2, 'College Admin', 'College-level administration', '{\"college\": true, \"programs\": true, \"students\": true, \"lecturers\": true}', '2025-07-27 13:56:07'),
(3, 'Department Head', 'Department-level management', '{\"courses\": true, \"lecturers\": true, \"department\": true}', '2025-07-27 13:56:07'),
(4, 'Finance Officer', 'Financial management', '{\"fees\": true, \"finance\": true, \"payments\": true}', '2025-07-27 13:56:07'),
(5, 'Registrar', 'Academic records management', '{\"grades\": true, \"students\": true, \"transcripts\": true}', '2025-07-27 13:56:07');

-- --------------------------------------------------------

--
-- Table structure for table `schools`
--

DROP TABLE IF EXISTS `schools`;
CREATE TABLE IF NOT EXISTS `schools` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `department_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `department_id` (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`id`, `name`, `department_id`) VALUES
(1, 'School of the Arts', 1),
(2, 'School of Communication and Journalism', 4),
(3, 'School of Music', 9),
(4, 'School of Technology', 16),
(5, 'Lumpkin School of Business', 17);

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
CREATE TABLE IF NOT EXISTS `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `office` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `user_id`, `employee_id`, `department`, `position`, `office`, `phone`) VALUES
(1, 3, 'STF2024001', 'Student Services', 'Student Services Coordinator', 'Administration Building, Room 205', '+1 (555) 234-5678'),
(2, 7, 'REG2024001', 'Registry', 'Academic Registrar', 'Administration Building, Room 101', '+1 (555) 123-4567');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `program` varchar(255) DEFAULT NULL,
  `year` varchar(50) DEFAULT NULL,
  `semester` varchar(50) DEFAULT NULL,
  `gpa` decimal(3,2) DEFAULT NULL,
  `cgpa` decimal(3,2) DEFAULT NULL,
  `credits_completed` int DEFAULT '0',
  `expected_graduation` date DEFAULT NULL,
  `advisor_id` int DEFAULT NULL,
  `graduation_status` enum('active','pending_graduation','graduated','dropped') DEFAULT 'active',
  `user_program_hash` binary(16) GENERATED ALWAYS AS (unhex(md5(concat(`user_id`,_utf8mb4'-',`program`)))) STORED,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`),
  KEY `user_id` (`user_id`),
  KEY `advisor_id` (`advisor_id`),
  KEY `idx_students_student_id` (`student_id`),
  KEY `idx_students_program_year` (`program`(100),`year`),
  KEY `idx_students_graduation_status` (`graduation_status`),
  KEY `idx_students_user_program_hash` (`user_program_hash`)
) ;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `user_id`, `student_id`, `program`, `year`, `semester`, `gpa`, `cgpa`, `credits_completed`, `expected_graduation`, `advisor_id`, `graduation_status`) VALUES
(1, 1, 'STD2024001', 'BSC-CS', '3rd Year', '1', 3.75, 2.56, 89, '2025-05-15', 2, 'active'),
(2, 0, 'STD2024002', 'CS', '1', '1', 3.50, 3.40, 45, NULL, NULL, 'active');

--
-- Triggers `students`
--
DROP TRIGGER IF EXISTS `after_student_update`;
DELIMITER $$
CREATE TRIGGER `after_student_update` AFTER UPDATE ON `students` FOR EACH ROW BEGIN
    DELETE FROM dashboard_cache WHERE student_id = NEW.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `student_academics_view`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `student_academics_view`;
CREATE TABLE IF NOT EXISTS `student_academics_view` (
`student_id` varchar(50)
,`program` varchar(255)
,`year` varchar(50)
,`semester` varchar(50)
,`student_name` varchar(255)
,`program_name` varchar(255)
,`enrollment_academic_year` varchar(20)
,`enrollment_semester` varchar(50)
,`enrolled_as` enum('FRESHER','CONTINUING','TRANSFER')
,`enrolled_by` varchar(100)
,`enrolled_on` timestamp
,`registration_academic_year` varchar(20)
,`registration_semester` varchar(50)
,`registration_type` enum('FULL REGISTRATION','PARTIAL REGISTRATION')
,`registered_by` varchar(100)
,`registered_on` timestamp
,`result_academic_year` varchar(10)
,`result_semester` varchar(50)
,`course_code` varchar(20)
,`course_title` varchar(255)
,`credit_units` int
,`grade` varchar(5)
,`gpa` decimal(3,2)
);

-- --------------------------------------------------------

--
-- Table structure for table `student_clearance`
--

DROP TABLE IF EXISTS `student_clearance`;
CREATE TABLE IF NOT EXISTS `student_clearance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `clearance_step_id` int NOT NULL,
  `status` enum('pending','cleared','blocked') DEFAULT 'pending',
  `cleared_by` int DEFAULT NULL,
  `cleared_at` timestamp NULL DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_clearance` (`student_id`,`clearance_step_id`),
  KEY `clearance_step_id` (`clearance_step_id`),
  KEY `cleared_by` (`cleared_by`),
  KEY `idx_student_clearance_status` (`student_id`,`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_finances`
--

DROP TABLE IF EXISTS `student_finances`;
CREATE TABLE IF NOT EXISTS `student_finances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `semester` varchar(50) DEFAULT NULL,
  `year` varchar(10) DEFAULT NULL,
  `total_fees` decimal(10,2) NOT NULL,
  `paid_amount` decimal(10,2) DEFAULT '0.00',
  `balance` decimal(10,2) GENERATED ALWAYS AS ((`total_fees` - `paid_amount`)) STORED,
  `due_date` date DEFAULT NULL,
  `aprn` varchar(100) DEFAULT NULL,
  `status` enum('paid','partial','overdue') DEFAULT 'partial',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_student_finances_student_year` (`student_id`,`year`)
) ;

--
-- Dumping data for table `student_finances`
--

INSERT INTO `student_finances` (`id`, `student_id`, `semester`, `year`, `total_fees`, `paid_amount`, `due_date`, `aprn`, `status`, `created_at`) VALUES
(1, 1, 'Spring 2024', '2024', 24700.00, 18000.00, '2024-04-15', 'EIU-20240315-STD2024001-TUITION', 'partial', '2025-07-27 13:53:41'),
(2, 1, 'Spring 2024', '2024', 24700.00, 18000.00, '2024-04-15', 'EIU-20240315-STD2024001-TUITION', 'partial', '2025-07-30 15:37:43');

-- --------------------------------------------------------

--
-- Table structure for table `student_ledger`
--

DROP TABLE IF EXISTS `student_ledger`;
CREATE TABLE IF NOT EXISTS `student_ledger` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `entry_date` date NOT NULL,
  `description` text NOT NULL,
  `debit_amount` decimal(15,2) DEFAULT '0.00',
  `credit_amount` decimal(15,2) DEFAULT '0.00',
  `balance` decimal(15,2) NOT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `reference_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_student_date` (`student_id`,`entry_date`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student_ledger`
--

INSERT INTO `student_ledger` (`id`, `student_id`, `entry_date`, `description`, `debit_amount`, `credit_amount`, `balance`, `reference_type`, `reference_id`, `created_at`) VALUES
(1, 2, '2023-02-01', 'Opening balance for academic year 2023', 0.00, 0.00, 0.00, NULL, NULL, '2025-08-06 08:43:25'),
(2, 2, '2023-02-10', 'Semester 1 fees posted', 2750000.00, 0.00, 2750000.00, NULL, NULL, '2025-08-06 08:43:25'),
(3, 2, '2023-02-15', 'Payment received - Tuition', 0.00, 2500000.00, 250000.00, NULL, NULL, '2025-08-06 08:43:25'),
(4, 2, '2023-02-20', 'Payment received - Registration & Library', 0.00, 250000.00, 0.00, NULL, NULL, '2025-08-06 08:43:25'),
(5, 2, '2023-08-01', 'Semester 2 fees posted', 2700000.00, 0.00, 2700000.00, NULL, NULL, '2025-08-06 08:43:25'),
(6, 2, '2023-08-10', 'Payment received - Tuition', 0.00, 2500000.00, 200000.00, NULL, NULL, '2025-08-06 08:43:25'),
(7, 2, '2023-11-20', 'Payment received - Examination fees', 0.00, 200000.00, 0.00, NULL, NULL, '2025-08-06 08:43:25'),
(8, 2, '2024-02-01', 'Year 2 Semester 1 fees posted', 3050000.00, 0.00, 3050000.00, NULL, NULL, '2025-08-06 08:43:25'),
(9, 2, '2024-02-12', 'Payment received - Tuition', 0.00, 2750000.00, 300000.00, NULL, NULL, '2025-08-06 08:43:25'),
(10, 2, '2024-03-05', 'Payment received - Lab fees', 0.00, 300000.00, 0.00, NULL, NULL, '2025-08-06 08:43:25'),
(11, 2, '2024-08-01', 'Year 3 Semester 1 fees posted', 3250000.00, 0.00, 3250000.00, NULL, NULL, '2025-08-06 08:43:25'),
(12, 2, '2024-08-15', 'Payment received - Partial tuition', 0.00, 2000000.00, 1250000.00, NULL, NULL, '2025-08-06 08:43:25'),
(13, 2, '2024-09-01', 'Payment received - Internet fees', 0.00, 100000.00, 1150000.00, NULL, NULL, '2025-08-06 08:43:25');

-- --------------------------------------------------------

--
-- Table structure for table `student_results`
--

DROP TABLE IF EXISTS `student_results`;
CREATE TABLE IF NOT EXISTS `student_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `academic_year` varchar(20) NOT NULL,
  `semester` varchar(50) NOT NULL,
  `course_code` varchar(20) NOT NULL,
  `course_title` varchar(255) NOT NULL,
  `coursework_marks` int DEFAULT '0',
  `exam_marks` int DEFAULT '0',
  `final_marks` int DEFAULT '0',
  `grade` varchar(5) DEFAULT NULL,
  `grade_points` decimal(3,2) DEFAULT NULL,
  `credit_units` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_student_results_student` (`student_id`),
  KEY `idx_student_results_year_sem` (`academic_year`,`semester`)
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student_results`
--

INSERT INTO `student_results` (`id`, `student_id`, `academic_year`, `semester`, `course_code`, `course_title`, `coursework_marks`, `exam_marks`, `final_marks`, `grade`, `grade_points`, `credit_units`) VALUES
(1, 1, '2024/2025', 'SEMESTER I', 'COB1105', 'FUNDAMENTALS OF PROCUREMENT AND LOGISTICS MANAGEMENT', 23, 41, 64, 'B', 3.00, 3),
(2, 1, '2024/2025', 'SEMESTER I', 'COA1101', 'FUNDAMENTAL ACCOUNTING PRINCIPLES', 16, 24, 40, 'F', 0.00, 5),
(3, 1, '2024/2025', 'SEMESTER I', 'COA1102', 'QUANTITATIVE METHODS', 21, 39, 60, 'B-', 2.70, 4),
(4, 1, '2024/2025', 'SEMESTER I', 'COB1101', 'INTRODUCTION TO BUSINESS ADMINISTRATION', 22, 33, 55, 'C+', 2.30, 3),
(5, 1, '2024/2025', 'SEMESTER I', 'COB1103', 'BUSINESS COMMUNICATION SKILLS', 25, 43, 68, 'B+', 3.30, 3),
(6, 1, '2024/2025', 'SEMESTER I', 'COA1103', 'ENTREPRENEURSHIP PRINCIPLES', 20, 43, 63, 'B', 3.00, 3),
(7, 1, '2024/2025', 'SEMESTER II', 'COB1204', 'PRINCIPLES OF MARKETING', 24, 36, 60, 'B-', 2.70, 3),
(8, 1, '2024/2025', 'SEMESTER II', 'COA1205', 'BUSINESS STATISTICS', 18, 42, 60, 'B-', 2.70, 4),
(9, 1, '2024/2025', 'SEMESTER II', 'COA1202', 'ECONOMIC THEORY', 20, 34, 54, 'C+', 2.30, 3),
(10, 1, '2024/2025', 'SEMESTER II', 'COA1201', 'BUSINESS COMPUTING TECHNIQUES', 25, 51, 76, 'A-', 3.70, 4),
(11, 1, '2024/2025', 'SEMESTER II', 'COA1204', 'ORGANIZATIONAL THEORY AND MANAGEMENT', 20, 55, 75, 'A-', 3.70, 3),
(12, 1, '2024/2025', 'SEMESTER I', 'COB1105', 'FUNDAMENTALS OF PROCUREMENT AND LOGISTICS MANAGEMENT', 23, 41, 0, 'B', 3.00, 3),
(13, 1, '2024/2025', 'SEMESTER I', 'COA1101', 'FUNDAMENTAL ACCOUNTING PRINCIPLES', 16, 24, 0, 'F', 0.00, 5),
(14, 1, '2024/2025', 'SEMESTER I', 'COA1102', 'QUANTITATIVE METHODS', 21, 39, 0, 'B-', 2.70, 4),
(15, 1, '2024/2025', 'SEMESTER I', 'COB1101', 'INTRODUCTION TO BUSINESS ADMINISTRATION', 22, 33, 0, 'C+', 2.30, 3),
(16, 1, '2024/2025', 'SEMESTER I', 'COB1103', 'BUSINESS COMMUNICATION SKILLS', 25, 43, 0, 'B+', 3.30, 3),
(17, 1, '2024/2025', 'SEMESTER I', 'COA1103', 'ENTREPRENEURSHIP PRINCIPLES', 20, 43, 0, 'B', 3.00, 3),
(18, 1, '2024/2025', 'SEMESTER II', 'COB1204', 'PRINCIPLES OF MARKETING', 24, 36, 0, 'B-', 2.70, 3),
(19, 1, '2024/2025', 'SEMESTER II', 'COA1205', 'BUSINESS STATISTICS', 18, 42, 0, 'B-', 2.70, 4),
(20, 1, '2024/2025', 'SEMESTER II', 'COA1202', 'ECONOMIC THEORY', 20, 34, 0, 'C+', 2.30, 3),
(21, 1, '2024/2025', 'SEMESTER II', 'COA1201', 'BUSINESS COMPUTING TECHNIQUES', 25, 51, 0, 'A-', 3.70, 4),
(22, 1, '2024/2025', 'SEMESTER II', 'COA1204', 'ORGANIZATIONAL THEORY AND MANAGEMENT', 20, 55, 0, 'A-', 3.70, 3);

--
-- Triggers `student_results`
--
DROP TRIGGER IF EXISTS `after_student_results_update`;
DELIMITER $$
CREATE TRIGGER `after_student_results_update` AFTER INSERT ON `student_results` FOR EACH ROW BEGIN
    CALL CalculateStudentGPA(NEW.student_id);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `student_summary`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `student_summary`;
CREATE TABLE IF NOT EXISTS `student_summary` (
`student_id` int
,`name` varchar(255)
,`student_number` varchar(50)
,`program` varchar(255)
,`year` varchar(50)
,`cgpa` decimal(3,2)
,`enrolled_courses` int
,`pending_assignments` int
,`fee_balance` int
);

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

DROP TABLE IF EXISTS `support_tickets`;
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `ticket_id` varchar(20) NOT NULL,
  `category` enum('technical','academic','finance','general') NOT NULL,
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('open','in_progress','resolved','closed') DEFAULT 'open',
  `assigned_to` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_id` (`ticket_id`),
  KEY `assigned_to` (`assigned_to`),
  KEY `idx_support_tickets_user` (`user_id`),
  KEY `idx_support_tickets_status` (`status`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_alerts`
--

DROP TABLE IF EXISTS `system_alerts`;
CREATE TABLE IF NOT EXISTS `system_alerts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alert_type` enum('performance','data_integrity','security','maintenance') NOT NULL,
  `severity` enum('low','medium','high','critical') NOT NULL,
  `message` text NOT NULL,
  `details` json DEFAULT NULL,
  `resolved` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_alerts_type_severity` (`alert_type`,`severity`),
  KEY `idx_alerts_resolved` (`resolved`,`created_at`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text,
  `setting_type` enum('string','number','boolean','json') DEFAULT 'string',
  `description` text,
  `updated_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `updated_by` (`updated_by`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `description`, `updated_by`, `updated_at`) VALUES
(1, 'portal_name', 'Eyecab University Portal', 'string', 'Name of the university portal', NULL, '2025-07-27 13:56:07'),
(2, 'maintenance_mode', 'false', 'boolean', 'Enable/disable maintenance mode', NULL, '2025-07-27 13:56:07'),
(3, 'max_login_attempts', '5', 'number', 'Maximum login attempts before lockout', NULL, '2025-07-27 13:56:07'),
(4, 'session_timeout', '3600', 'number', 'Session timeout in seconds', NULL, '2025-07-27 13:56:07'),
(5, 'email_notifications', 'true', 'boolean', 'Enable email notifications', NULL, '2025-07-27 13:56:07'),
(6, 'sms_notifications', 'false', 'boolean', 'Enable SMS notifications', NULL, '2025-07-27 13:56:07'),
(7, 'current_academic_year', '2024/2025', 'string', 'Current academic year', NULL, '2025-07-30 15:37:43'),
(8, 'current_semester', 'Semester I', 'string', 'Current semester', NULL, '2025-07-30 15:37:43'),
(9, 'semester_start_date', '2024-08-26', 'string', 'Current semester start date', NULL, '2025-07-30 15:37:43'),
(10, 'semester_end_date', '2024-12-20', 'string', 'Current semester end date', NULL, '2025-07-30 15:37:43');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(20) NOT NULL,
  `transaction_id` varchar(50) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_date` date NOT NULL,
  `status` enum('Pending','Completed','Failed') DEFAULT 'Pending',
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `student_id` (`student_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `student_id`, `transaction_id`, `payment_method`, `amount`, `transaction_date`, `status`, `description`, `created_at`) VALUES
(1, 'STD2024002', 'PAY-2023-001-JD', 'Bank Transfer', 2250000.00, '2023-08-15', 'Completed', 'Tuition Payment Semester 1 2023', '2025-08-05 11:52:27'),
(2, 'STD2024002', 'PAY-2023-002-JD', 'Bank Transfer', 2700000.00, '2024-01-15', 'Completed', 'Tuition Payment Semester 2 2023', '2025-08-05 11:52:27'),
(3, 'STD2024002', 'PAY-2024-001-JD', 'Mobile Money', 1500000.00, '2024-08-20', 'Completed', 'Partial Tuition Payment Semester 1 2024', '2025-08-05 11:52:27'),
(4, 'STD2024002', 'PAY-2024-002-JD', 'Cash', 50000.00, '2024-08-25', 'Completed', 'Library Fee Payment', '2025-08-05 11:52:27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(191) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `provider` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','lecturer','staff','admin','academic_registrar') NOT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_role_status` (`role`,`status`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `image`, `provider`, `password`, `role`, `status`, `created_at`, `updated_at`, `reset_token`, `reset_token_expires`) VALUES
(0, 'John Doe', 'john.doe@student.eyecab.edu', NULL, NULL, '$2b$10$MigRDkaMfT88MEP6PHJxMOOczmHAZVBlbrzOvKSSV1MqSZ0zBSg86', 'student', 'active', '2025-07-27 13:53:41', '2025-08-05 14:45:16', NULL, NULL),
(2, 'Dr. Sarah Johnson', 'lecturer@eyecab.edu', NULL, NULL, '$2b$10$MigRDkaMfT88MEP6PHJxMOOczmHAZVBlbrzOvKSSV1MqSZ0zBSg86', 'lecturer', 'active', '2025-07-27 13:53:41', '2025-08-05 14:45:16', NULL, NULL),
(3, 'Maria Rodriguez', 'staff@eyecab.edu', NULL, NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff', 'active', '2025-07-27 13:53:41', '2025-07-27 13:53:41', NULL, NULL),
(4, 'Admin User', 'admin@eyecab.edu', NULL, NULL, '$2b$10$MigRDkaMfT88MEP6PHJxMOOczmHAZVBlbrzOvKSSV1MqSZ0zBSg86', 'admin', 'active', '2025-07-27 13:53:41', '2025-08-05 14:45:16', NULL, NULL),
(1, 'Chedikol Timothy', 'cheotim66@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocLxB1WiDrPcG9xNoLq8i5F6Jg8v6F4EyoCxbbxwQSCI6bFbng=s96-c', 'google', '', 'student', 'active', '2025-07-28 09:59:57', '2025-08-05 11:39:17', NULL, NULL),
(6, 'che timo', 'test@example.com', NULL, NULL, '$2b$10$bcXap4cOHoN0kaopdDtJb.4j2lT/egez3.V4TjSnuAMFpDXpBb5Ma', 'student', 'active', '2025-07-28 17:37:11', '2025-07-28 17:37:11', NULL, NULL),
(7, 'Dr. Sarah Academic Registrar', 'academic.registrar@university.edu', NULL, NULL, '$2b$10$MigRDkaMfT88MEP6PHJxMOOczmHAZVBlbrzOvKSSV1MqSZ0zBSg86', 'academic_registrar', 'active', '2025-08-05 10:12:42', '2025-08-05 14:45:16', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE IF NOT EXISTS `user_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `assigned_by` int DEFAULT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_role` (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  KEY `assigned_by` (`assigned_by`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `user_id`, `role_id`, `assigned_by`, `assigned_at`) VALUES
(1, 7, 5, NULL, '2025-08-05 10:12:43');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `session_token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL,
  `last_activity` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `device_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token` (`session_token`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_session_token` (`session_token`),
  KEY `idx_expires_at` (`expires_at`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_user_active` (`user_id`,`is_active`),
  KEY `idx_cleanup` (`expires_at`,`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `user_id`, `session_token`, `created_at`, `expires_at`, `last_activity`, `ip_address`, `user_agent`, `is_active`, `device_info`, `location`) VALUES
(1, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBzdHVkZW50LmV5ZWNhYi5lZHUiLCJyb2xlIjoic3R1ZGVudCIsImlzQWNhZGVtaWNSZWdpc3RyYXIiOmZhbHNlLCJpbWFnZSI6bnVsbCwiaWF0IjoxNzU0NDA4MzY2LCJleHAiOjE3NTUwMTMxNjZ9.T6V49OZkD', '2025-08-05 15:39:26', '2025-08-12 15:39:27', '2025-08-05 15:39:26', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, NULL, NULL),
(2, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBzdHVkZW50LmV5ZWNhYi5lZHUiLCJyb2xlIjoic3R1ZGVudCIsImlzQWNhZGVtaWNSZWdpc3RyYXIiOmZhbHNlLCJpbWFnZSI6bnVsbCwiaWF0IjoxNzU0NDA4NDI3LCJleHAiOjE3NTUwMTMyMjd9.LW20nP7rQ', '2025-08-05 15:40:27', '2025-08-12 15:40:27', '2025-08-05 15:40:27', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, NULL, NULL),
(3, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBzdHVkZW50LmV5ZWNhYi5lZHUiLCJyb2xlIjoic3R1ZGVudCIsImlzQWNhZGVtaWNSZWdpc3RyYXIiOmZhbHNlLCJpbWFnZSI6bnVsbCwiaWF0IjoxNzU0NDA4NjAxLCJleHAiOjE3NTUwMTM0MDF9.lqZrB5nsV', '2025-08-05 15:43:21', '2025-08-12 15:43:21', '2025-08-05 15:43:21', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, NULL, NULL),
(4, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBzdHVkZW50LmV5ZWNhYi5lZHUiLCJyb2xlIjoic3R1ZGVudCIsImlzQWNhZGVtaWNSZWdpc3RyYXIiOmZhbHNlLCJpbWFnZSI6bnVsbCwiaWF0IjoxNzU0NDA4NjM2LCJleHAiOjE3NTUwMTM0MzZ9.upqFIeVml', '2025-08-05 15:43:56', '2025-08-12 15:43:57', '2025-08-05 15:43:56', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, NULL, NULL),
(5, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBzdHVkZW50LmV5ZWNhYi5lZHUiLCJyb2xlIjoic3R1ZGVudCIsImlzQWNhZGVtaWNSZWdpc3RyYXIiOmZhbHNlLCJpbWFnZSI6bnVsbCwiaWF0IjoxNzU0NDA4NjUxLCJleHAiOjE3NTUwMTM0NTF9.f58OhgknK', '2025-08-05 15:44:11', '2025-08-12 15:44:12', '2025-08-05 15:44:11', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, NULL, NULL),
(6, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBzdHVkZW50LmV5ZWNhYi5lZHUiLCJyb2xlIjoic3R1ZGVudCIsImlzQWNhZGVtaWNSZWdpc3RyYXIiOmZhbHNlLCJpbWFnZSI6bnVsbCwiaWF0IjoxNzU0NDA4NjgzLCJleHAiOjE3NTUwMTM0ODN9.JdHQrt3-O', '2025-08-05 15:44:43', '2025-08-12 15:44:43', '2025-08-05 15:44:43', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, NULL, NULL),
(7, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBzdHVkZW50LmV5ZWNhYi5lZHUiLCJyb2xlIjoic3R1ZGVudCIsImlzQWNhZGVtaWNSZWdpc3RyYXIiOmZhbHNlLCJpbWFnZSI6bnVsbCwiaWF0IjoxNzU0NDA5MDA1LCJleHAiOjE3NTUwMTM4MDV9.v3IP-DjvS', '2025-08-05 15:50:05', '2025-08-12 15:50:05', '2025-08-05 15:50:05', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, NULL, NULL),
(8, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBzdHVkZW50LmV5ZWNhYi5lZHUiLCJyb2xlIjoic3R1ZGVudCIsImlzQWNhZGVtaWNSZWdpc3RyYXIiOmZhbHNlLCJpbWFnZSI6bnVsbCwiaWF0IjoxNzU0NDA5MDI2LCJleHAiOjE3NTUwMTM4MjZ9.nIItXN4p9', '2025-08-05 15:50:26', '2025-08-12 15:50:26', '2025-08-05 15:50:26', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, NULL, NULL),
(9, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBzdHVkZW50LmV5ZWNhYi5lZHUiLCJyb2xlIjoic3R1ZGVudCIsImlzQWNhZGVtaWNSZWdpc3RyYXIiOmZhbHNlLCJpbWFnZSI6bnVsbCwiaWF0IjoxNzU0NDA5MDQ1LCJleHAiOjE3NTUwMTM4NDV9.WcTL6SnPr', '2025-08-05 15:50:45', '2025-08-12 15:50:46', '2025-08-05 15:50:45', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, NULL, NULL),
(10, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBzdHVkZW50LmV5ZWNhYi5lZHUiLCJyb2xlIjoic3R1ZGVudCIsImlzQWNhZGVtaWNSZWdpc3RyYXIiOmZhbHNlLCJpbWFnZSI6bnVsbCwiaWF0IjoxNzU0NDA5MTkwLCJleHAiOjE3NTUwMTM5OTB9.q3YavW6gL', '2025-08-05 15:53:10', '2025-08-12 15:53:11', '2025-08-05 15:53:10', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `video_lectures`
--

DROP TABLE IF EXISTS `video_lectures`;
CREATE TABLE IF NOT EXISTS `video_lectures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `video_url` varchar(500) DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `duration` varchar(20) DEFAULT NULL,
  `watched` tinyint(1) DEFAULT '0',
  `instructor_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_video_lectures_course_watched` (`course_id`,`watched`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `video_lectures`
--

INSERT INTO `video_lectures` (`id`, `course_id`, `title`, `description`, `video_url`, `thumbnail`, `duration`, `watched`, `instructor_name`, `created_at`) VALUES
(1, 1, 'Binary Search Trees Implementation', 'Detailed implementation of BST operations', 'videos/cs301/bst_implementation.mp4', 'thumbnails/cs301/bst.jpg', '52:30', 0, 'Dr. Sarah Johnson', '2025-07-27 13:53:42'),
(2, 2, 'SQL Joins and Relationships', 'Understanding different types of SQL joins', 'videos/cs302/sql_joins.mp4', 'thumbnails/cs302/joins.jpg', '38:45', 0, 'Dr. Sarah Johnson', '2025-07-27 13:53:42'),
(3, 3, 'Agile Development Methodology', 'Introduction to Agile software development', 'videos/cs303/agile.mp4', 'thumbnails/cs303/agile.jpg', '41:20', 0, 'Dr. Sarah Johnson', '2025-07-27 13:53:42');

-- --------------------------------------------------------

--
-- Structure for view `course_summary`
--
DROP TABLE IF EXISTS `course_summary`;

DROP VIEW IF EXISTS `course_summary`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `course_summary`  AS SELECT `c`.`code` AS `code`, `c`.`name` AS `name`, `c`.`credits` AS `credits`, `u`.`name` AS `instructor`, count(distinct `e`.`student_id`) AS `enrolled_students`, count(distinct `a`.`id`) AS `total_assignments`, avg(`e`.`progress`) AS `average_progress` FROM ((((`courses` `c` left join `lecturers` `l` on((`c`.`instructor_id` = `l`.`id`))) left join `users` `u` on((`l`.`user_id` = `u`.`id`))) left join `enrollments` `e` on(((`c`.`id` = `e`.`course_id`) and (`e`.`status` = 'active')))) left join `assignments` `a` on((`c`.`id` = `a`.`course_id`))) WHERE (`c`.`status` = 'active') GROUP BY `c`.`id`, `c`.`code`, `c`.`name`, `c`.`credits`, `u`.`name` ;

-- --------------------------------------------------------

--
-- Structure for view `student_academics_view`
--
DROP TABLE IF EXISTS `student_academics_view`;

DROP VIEW IF EXISTS `student_academics_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `student_academics_view`  AS SELECT `s`.`student_id` AS `student_id`, `s`.`program` AS `program`, `s`.`year` AS `year`, `s`.`semester` AS `semester`, `u`.`name` AS `student_name`, `p`.`name` AS `program_name`, `eh`.`academic_year` AS `enrollment_academic_year`, `eh`.`semester` AS `enrollment_semester`, `eh`.`enrolled_as` AS `enrolled_as`, `eh`.`enrolled_by` AS `enrolled_by`, `eh`.`enrolled_at` AS `enrolled_on`, `rh`.`academic_year` AS `registration_academic_year`, `rh`.`semester` AS `registration_semester`, `rh`.`registration_type` AS `registration_type`, `rh`.`registered_by` AS `registered_by`, `rh`.`registered_at` AS `registered_on`, `r`.`academic_year` AS `result_academic_year`, `r`.`semester` AS `result_semester`, `r`.`course_code` AS `course_code`, `r`.`course_title` AS `course_title`, `r`.`credit_units` AS `credit_units`, `r`.`grade` AS `grade`, `r`.`gpa` AS `gpa` FROM (((((`students` `s` join `users` `u` on((`s`.`user_id` = `u`.`id`))) left join `programs` `p` on((`s`.`program` = `p`.`code`))) left join `enrollment_history` `eh` on((`s`.`id` = `eh`.`student_id`))) left join `registration_history` `rh` on((`s`.`id` = `rh`.`student_id`))) left join `results` `r` on((`s`.`student_id` = `r`.`student_id`))) ;

-- --------------------------------------------------------

--
-- Structure for view `student_summary`
--
DROP TABLE IF EXISTS `student_summary`;

DROP VIEW IF EXISTS `student_summary`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `student_summary`  AS SELECT `s`.`id` AS `student_id`, `u`.`name` AS `name`, `s`.`student_id` AS `student_number`, `s`.`program` AS `program`, `s`.`year` AS `year`, `s`.`cgpa` AS `cgpa`, 3 AS `enrolled_courses`, 2 AS `pending_assignments`, 0 AS `fee_balance` FROM (`students` `s` join `users` `u` on((`s`.`user_id` = `u`.`id`))) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments` ADD FULLTEXT KEY `title` (`title`,`description`);
ALTER TABLE `assignments` ADD FULLTEXT KEY `title_2` (`title`,`description`);

--
-- Indexes for table `blog`
--
ALTER TABLE `blog` ADD FULLTEXT KEY `title` (`title`,`descrip`,`content`);
ALTER TABLE `blog` ADD FULLTEXT KEY `title_2` (`title`,`descrip`,`content`);

--
-- Indexes for table `programs`
--
ALTER TABLE `programs` ADD FULLTEXT KEY `name` (`name`,`description`);
ALTER TABLE `programs` ADD FULLTEXT KEY `name_2` (`name`,`description`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`blog_id`) REFERENCES `blog` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

DELIMITER $$
--
-- Events
--
DROP EVENT IF EXISTS `cleanup_old_notifications`$$
CREATE DEFINER=`root`@`localhost` EVENT `cleanup_old_notifications` ON SCHEDULE EVERY 1 DAY STARTS '2025-07-30 09:26:34' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM notifications 
  WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY) 
    AND is_read = 1$$

DROP EVENT IF EXISTS `refresh_dashboard_cache`$$
CREATE DEFINER=`root`@`localhost` EVENT `refresh_dashboard_cache` ON SCHEDULE EVERY 1 HOUR STARTS '2025-07-30 09:26:34' ON COMPLETION NOT PRESERVE ENABLE DO CALL GenerateStudentDashboard('STD2024001')$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
