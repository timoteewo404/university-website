-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 04, 2025 at 01:50 PM
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
-- Database: `university_website`
--

-- --------------------------------------------------------

--
-- Table structure for table `admissions`
--

DROP TABLE IF EXISTS `admissions`;
CREATE TABLE IF NOT EXISTS `admissions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deadline` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isRequired` tinyint(1) NOT NULL DEFAULT '1',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `order` int NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admissions`
--

INSERT INTO `admissions` (`id`, `type`, `title`, `description`, `details`, `amount`, `deadline`, `isRequired`, `isActive`, `order`, `createdAt`, `updatedAt`) VALUES
('1', 'requirement', 'Academic Transcripts', 'Official transcripts from all previously attended institutions required', 'Submit official transcripts directly from your school to our admissions office. Unofficial transcripts can be submitted for initial review.', NULL, NULL, 1, 1, 1, '2025-11-02 19:51:43.391', '2025-11-02 19:51:43.391'),
('2', 'deadline', 'Fall 2025 Application Deadline', 'Final deadline for fall semester applications', NULL, NULL, '2025-07-15', 1, 1, 2, '2025-11-02 19:51:43.391', '2025-11-02 19:51:43.391'),
('3', 'fee', 'Application Fee', 'Non-refundable application processing fee', NULL, '$75', NULL, 1, 1, 3, '2025-11-02 19:51:43.391', '2025-11-02 19:51:43.391');

-- --------------------------------------------------------

--
-- Table structure for table `colleges`
--

DROP TABLE IF EXISTS `colleges`;
CREATE TABLE IF NOT EXISTS `colleges` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deanId` int DEFAULT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `colleges`
--

INSERT INTO `colleges` (`id`, `name`, `description`, `deanId`, `logo`, `status`, `createdAt`, `updatedAt`) VALUES
(9, 'College of Medicine', 'Medical education and healthcare programs', NULL, NULL, 'active', '2025-11-03 20:54:10.512', '2025-11-03 20:54:10.512'),
(10, 'College of Natural Sciences', 'Programs in biological, physical, and mathematical sciences', NULL, NULL, 'active', '2025-11-03 20:54:10.985', '2025-11-03 20:54:10.985'),
(11, 'College of Business and Management', 'Excellence in business education and management studies', NULL, NULL, 'active', '2025-11-03 20:54:10.992', '2025-11-03 20:54:10.992'),
(12, 'College of Humanities and Social Sciences', 'Programs in humanities, social sciences, and related fields', NULL, NULL, 'active', '2025-11-03 20:54:10.996', '2025-11-03 20:54:10.996'),
(13, 'College of Veterinary Medicine', 'Veterinary medicine and animal health programs', NULL, NULL, 'active', '2025-11-03 20:54:11.001', '2025-11-03 20:54:11.001'),
(14, 'College of Education and External Studies', 'Teacher education and external studies programs', NULL, NULL, 'active', '2025-11-03 20:54:11.007', '2025-11-03 20:54:11.007'),
(15, 'College of Law', 'Legal education and jurisprudence programs', NULL, NULL, 'active', '2025-11-03 20:54:11.012', '2025-11-03 20:54:11.012'),
(16, 'College of Agricultural and Environmental Sciences', 'Agricultural sciences and environmental studies programs', NULL, NULL, 'active', '2025-11-03 20:54:11.016', '2025-11-03 20:54:11.016'),
(17, 'College of Arts and Sciences', 'Liberal arts and interdisciplinary science programs', NULL, NULL, 'active', '2025-11-03 20:54:11.048', '2025-11-03 20:54:11.048'),
(18, 'College of Engineering, Design, Art and Technology', 'Engineering, design, art, and technology programs', NULL, NULL, 'active', '2025-11-03 20:54:11.050', '2025-11-03 20:54:11.050'),
(19, 'College of Computing and Information Sciences', 'Leading college in technology and computer sciences', NULL, NULL, 'active', '2025-11-03 20:54:11.053', '2025-11-03 20:54:11.053');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `isReplied` tinyint(1) NOT NULL DEFAULT '0',
  `reply` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `repliedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `phone`, `subject`, `message`, `isRead`, `isReplied`, `reply`, `repliedAt`, `createdAt`, `updatedAt`) VALUES
('1', 'John Doe', 'john.doe@example.com', '+1-555-0123', 'Admission Inquiry', 'I am interested in applying to EYECAB University. Can you provide information about the admission process and scholarship opportunities?', 0, 0, NULL, NULL, '2025-11-02 19:51:43.188', '2025-11-02 19:51:43.188'),
('2', 'Jane Smith', 'jane.smith@example.com', '+1-555-0456', 'Partnership Opportunity', 'We would like to discuss potential research collaboration opportunities with your institution.', 1, 1, 'Thank you for your interest in partnering with EYECAB University. We would be happy to discuss collaboration opportunities.', '2025-10-14 16:00:00.000', '2025-11-02 19:51:43.188', '2025-11-02 19:51:43.188');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `collegeId` int NOT NULL,
  `headId` int DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `collegeId`, `headId`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Computer Science', 19, NULL, 'active', '2025-11-03 20:54:11.058', '2025-11-03 20:54:11.058'),
(2, 'Information Technology', 19, NULL, 'active', '2025-11-03 20:54:11.214', '2025-11-03 20:54:11.214'),
(3, 'Software Engineering', 19, NULL, 'active', '2025-11-03 20:54:11.218', '2025-11-03 20:54:11.218'),
(4, 'Business Administration', 11, NULL, 'active', '2025-11-03 20:54:11.226', '2025-11-03 20:54:11.226'),
(5, 'Finance', 11, NULL, 'active', '2025-11-03 20:54:11.230', '2025-11-03 20:54:11.230'),
(6, 'Marketing', 11, NULL, 'active', '2025-11-03 20:54:11.234', '2025-11-03 20:54:11.234'),
(7, 'Civil Engineering', 3, NULL, 'active', '2025-11-03 20:54:11.238', '2025-11-03 20:54:11.238'),
(8, 'Electrical Engineering', 3, NULL, 'active', '2025-11-03 20:54:11.243', '2025-11-03 20:54:11.243'),
(9, 'Mechanical Engineering', 3, NULL, 'active', '2025-11-03 20:54:11.246', '2025-11-03 20:54:11.246'),
(10, 'Medicine', 9, NULL, 'active', '2025-11-03 20:54:11.249', '2025-11-03 20:54:11.249'),
(11, 'Surgery', 9, NULL, 'active', '2025-11-03 20:54:11.251', '2025-11-03 20:54:11.251'),
(12, 'Public Health', 9, NULL, 'active', '2025-11-03 20:54:11.256', '2025-11-03 20:54:11.256'),
(13, 'Biology', 10, NULL, 'active', '2025-11-03 20:54:11.262', '2025-11-03 20:54:11.262'),
(14, 'Chemistry', 10, NULL, 'active', '2025-11-03 20:54:11.265', '2025-11-03 20:54:11.265'),
(15, 'Physics', 10, NULL, 'active', '2025-11-03 20:54:11.268', '2025-11-03 20:54:11.268'),
(16, 'Mathematics', 10, NULL, 'active', '2025-11-03 20:54:11.275', '2025-11-03 20:54:11.275'),
(17, 'History', 12, NULL, 'active', '2025-11-03 20:54:11.279', '2025-11-03 20:54:11.279'),
(18, 'Sociology', 12, NULL, 'active', '2025-11-03 20:54:11.282', '2025-11-03 20:54:11.282'),
(19, 'Psychology', 12, NULL, 'active', '2025-11-03 20:54:11.285', '2025-11-03 20:54:11.285'),
(20, 'Literature', 12, NULL, 'active', '2025-11-03 20:54:11.288', '2025-11-03 20:54:11.288'),
(21, 'Veterinary Medicine', 13, NULL, 'active', '2025-11-03 20:54:11.294', '2025-11-03 20:54:11.294'),
(22, 'Animal Science', 13, NULL, 'active', '2025-11-03 20:54:11.298', '2025-11-03 20:54:11.298'),
(23, 'Education', 14, NULL, 'active', '2025-11-03 20:54:11.300', '2025-11-03 20:54:11.300'),
(24, 'Adult Education', 14, NULL, 'active', '2025-11-03 20:54:11.303', '2025-11-03 20:54:11.303'),
(25, 'Law', 15, NULL, 'active', '2025-11-03 20:54:11.308', '2025-11-03 20:54:11.308'),
(26, 'International Law', 15, NULL, 'active', '2025-11-03 20:54:11.312', '2025-11-03 20:54:11.312'),
(27, 'Agriculture', 16, NULL, 'active', '2025-11-03 20:54:11.315', '2025-11-03 20:54:11.315'),
(28, 'Environmental Science', 16, NULL, 'active', '2025-11-03 20:54:11.318', '2025-11-03 20:54:11.318'),
(29, 'Forestry', 16, NULL, 'active', '2025-11-03 20:54:11.320', '2025-11-03 20:54:11.320'),
(30, 'Fine Arts', 17, NULL, 'active', '2025-11-03 20:54:11.325', '2025-11-03 20:54:11.325'),
(31, 'Music', 17, NULL, 'active', '2025-11-03 20:54:11.328', '2025-11-03 20:54:11.328'),
(32, 'Theater', 17, NULL, 'active', '2025-11-03 20:54:11.331', '2025-11-03 20:54:11.331'),
(33, 'Design', 18, NULL, 'active', '2025-11-03 20:54:11.333', '2025-11-03 20:54:11.333'),
(34, 'Architecture', 18, NULL, 'active', '2025-11-03 20:54:11.335', '2025-11-03 20:54:11.335'),
(35, 'Technology', 18, NULL, 'active', '2025-11-03 20:54:11.340', '2025-11-03 20:54:11.340');

-- --------------------------------------------------------

--
-- Table structure for table `hero_badges`
--

DROP TABLE IF EXISTS `hero_badges`;
CREATE TABLE IF NOT EXISTS `hero_badges` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `text` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variant` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `order` int NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hero_badges`
--

INSERT INTO `hero_badges` (`id`, `text`, `variant`, `isActive`, `order`, `createdAt`, `updatedAt`) VALUES
('1', 'Leading Innovation in Higher Education', 'default', 1, 1, '2025-11-02 19:51:42.165', '2025-11-03 20:53:04.541'),
('2', 'Ranked #1 University in East Africa', 'secondary', 1, 2, '2025-11-02 19:51:42.165', '2025-11-03 20:53:14.179'),
('3', 'Excellence in Research & Development', 'outline', 1, 3, '2025-11-02 19:51:42.165', '2025-11-03 20:53:14.185');

-- --------------------------------------------------------

--
-- Table structure for table `news_events`
--

DROP TABLE IF EXISTS `news_events`;
CREATE TABLE IF NOT EXISTS `news_events` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eventDate` datetime(3) DEFAULT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `podcastDuration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `podcastPlatforms` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `audioUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reportUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `views` int NOT NULL DEFAULT '0',
  `order` int NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news_events`
--

INSERT INTO `news_events` (`id`, `type`, `title`, `description`, `content`, `imageUrl`, `category`, `eventDate`, `location`, `author`, `role`, `podcastDuration`, `podcastPlatforms`, `audioUrl`, `reportUrl`, `isActive`, `isFeatured`, `views`, `order`, `createdAt`, `updatedAt`) VALUES
('1', 'news', 'EYECAB University Launches New AI Research Center', 'State-of-the-art facility will focus on artificial intelligence applications in healthcare and education.', 'EYECAB International University proudly announces the opening of its new Artificial Intelligence Research Center, a cutting-edge facility dedicated to advancing AI applications in healthcare ', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3', 'Research', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1250, 1, '2025-11-02 19:51:43.095', '2025-11-02 19:51:43.095'),
('2', 'event', 'Annual Tech Conference 2025', 'Join us for the biggest technology conference featuring industry leaders and innovators.', 'Our annual technology conference brings together thought leaders, researchers, and innovators to discuss the latest trends in technology and their impact on society.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3', 'Technology', '2025-11-15 09:00:00.000', 'Main Auditorium', NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 890, 2, '2025-11-02 19:51:43.095', '2025-11-02 19:51:43.095'),
('3', 'news', 'New Scholarship Program for International Students', 'Comprehensive scholarship opportunities now available for international students from developing countries.', 'EYECAB University announces a new scholarship program specifically designed to support international students from developing countries.', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3', 'Education', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 650, 3, '2025-11-02 19:51:43.095', '2025-11-02 19:51:43.095'),
('4', 'event', 'University Open House', 'Visit our campus and discover what makes EYECAB University special.', 'Join us for our University Open House event where prospective students and families can tour our facilities, meet faculty, and learn about our programs.', 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3', 'Admissions', '2025-12-01 10:00:00.000', 'Campus Grounds', NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 420, 4, '2025-11-02 19:51:43.095', '2025-11-02 19:51:43.095'),
('5', 'news', 'Breaking Cancer Research Breakthrough', 'EYECAB researchers discover new treatment pathway for aggressive cancers.', 'Our medical research team has made a significant breakthrough in cancer treatment, identifying a new therapeutic pathway that shows promise for treating aggressive forms of cancer.', 'https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3', 'Medical Research', NULL, NULL, 'Dr. Sarah Mitchell', 'Lead Researcher', NULL, NULL, NULL, NULL, 1, 1, 2100, 5, '2025-11-02 19:51:43.095', '2025-11-02 19:51:43.095'),
('6', 'podcast', 'The Future of Education Technology', 'A deep dive into how AI and digital tools are reshaping higher education.', 'Join our hosts as they explore the latest trends in educational technology, featuring interviews with leading experts in AI-driven learning platforms and digital transformation in universitie', 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3', 'Technology', NULL, NULL, 'Prof. Michael Chen', 'Education Technology Director', '23:45', 'Apple Podcasts, Google Podcasts, Stitcher', 'https://example.com/podcast/education-tech-episode-1.mp3', NULL, 1, 1, 890, 6, '2025-11-02 19:51:43.095', '2025-11-02 19:51:43.095'),
('7', 'report', 'Climate Change Impact Assessment 2024', 'Comprehensive report on environmental challenges and university sustainability initiatives.', 'This detailed report examines the impact of climate change on educational institutions and outlines EYECAB University\'s comprehensive sustainability strategy for the next decade.', 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?ixlib=rb-4.0.3', 'Environment', NULL, NULL, 'Dr. Emily Rodriguez', 'Environmental Science Dean', NULL, NULL, NULL, 'https://example.com/reports/climate-impact-2024.pdf', 1, 1, 654, 7, '2025-11-02 19:51:43.095', '2025-11-02 19:51:43.095');

-- --------------------------------------------------------

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
CREATE TABLE IF NOT EXISTS `programs` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `collegeId` int NOT NULL,
  `departmentId` int DEFAULT NULL,
  `duration` int NOT NULL DEFAULT '4',
  `creditsRequired` int NOT NULL DEFAULT '120',
  `department` varchar(191) DEFAULT NULL,
  `degreeType` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `requirements` varchar(191) DEFAULT NULL,
  `location` varchar(191) NOT NULL DEFAULT 'On Campus',
  `applicationDeadline` datetime(3) DEFAULT NULL,
  `tuition` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'active',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `order` int NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `programs_code_key` (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `programs`
--

INSERT INTO `programs` (`id`, `name`, `code`, `collegeId`, `departmentId`, `duration`, `creditsRequired`, `department`, `degreeType`, `description`, `requirements`, `location`, `applicationDeadline`, `tuition`, `status`, `isActive`, `order`, `createdAt`, `updatedAt`) VALUES
('wivkkacfsujmhjenbzs', 'BSc Medical Radiography (BMR)', 'BMR', 9, 77, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('oayg8ncozqmhjenc21', 'BSc Agribusiness Management (AGM)', 'AGM', 16, 81, 3, 120, NULL, 'Certificate', NULL, 'UGX 1,171,074 / UGX 1,756,611 per semester', 'On Campus', NULL, 'UGX 1,171,074 / UGX 1,756,611 per semester', 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('lklr5dkk33mhjenc22', 'BSc Optometry (BPT)', 'BPT', 9, 76, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('6pxg1zlyxjcmhjenc23', 'BSc Cytotechnology (BYT)', 'BYT', 9, 75, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('8ov9fr0k71smhjenc24', 'School of Engineering', 'SE', 10, 18, 4, 120, NULL, 'Bachelor', 'Makerere functional fees apply; lab/workshop fees likely', NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('db30r0klqe8mhjenc8b', 'School of the Built Environment', 'SBE', 10, 18, 4, 120, NULL, 'Bachelor', 'Makerere functional fees; studio/atelier or recess fees may apply', NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('h1evnwshbj5mhjenc8d', 'BSc Biomedical Engineering (BBI)', 'BBI', 9, 74, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('auemy9dthzpmhjenc8e', 'BCom – Bachelor of Commerce (COE)', 'COE', 11, 95, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('8ihoevx5z7pmhjenc8f', 'BSc Environmental Health Sciences (BEH)', 'BEH', 9, 72, 3, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('816srsu93asmhjenc8g', 'BSc Speech & Language Therapy (BSL)', 'BSL', 9, 73, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('asdjk2q4a7omhjenc8h', 'BSc Nursing Science (NUR)', 'NUR', 9, 71, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('danowgsj4ajmhjenc8i', 'BSc Dental Laboratory Technology (BDT)', 'BDT', 9, 70, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('ul1hdr1p78mhjenc8j', 'BDS – Bachelor of Dental Surgery (BOS)', 'BOS', 9, 69, 5, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('bz130hp4z9mmhjenc8k', 'BSc Pharmacy (PHA)', 'PHA', 0, 67, 5, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('p3y5z6bivd9mhjenc8l', 'MBChB – Bachelor of Medicine & Surgery (MAM)', 'MAM', 15, 68, 5, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('rrlpdi8ptenmhjenc8m', 'Bachelor of Science in Civil Engineering', 'CIV', 12, 23, 4, 120, NULL, 'Bachelor', 'Department page contains curriculum & lab requirements.', NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('cva20u88qzmhjenc8m', 'Bachelor of Science in Electrical Engineering', 'ELE', 12, 24, 4, 120, NULL, 'Bachelor', 'Practical attachment and instrument/lab costs may apply.', NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('q69dk2oy1vmhjenc8o', 'Bachelor of Architecture', 'ARC', 12, 25, 4, 120, NULL, 'Bachelor', 'Studio/recess noted in PDF.', NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('7mi6mbz414gmhjenc8q', 'BA Economics (ECO)', 'ECO', 11, 93, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('xq65nzh1i5qmhjenc8q', 'BSc Quantitative Economics (BQE)', 'BQE', 11, 94, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('wtzndx5k66dmhjenc8r', 'BSc Statistics (STA)', 'STA', 13, 91, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('j17foqvbys7mhjenc8r', 'BSc Actuarial Science (SAS)', 'SAS', 13, 92, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('smik9hd4a4omhjenc8s', 'BSc Biotechnology (BBT)', 'BBT', 12, 131, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('ptiviavyv1hmhjenc8t', 'BSc Science (External) (SCX)', 'SCX', 13, 132, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('11l118f5fqsfmhjenc8t', 'BSc Conservation Biology (BCB)', 'BCB', 13, 130, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('8l110yoauxqmhjenc8u', 'BSc Petroleum Geoscience & Production (BPG)', 'BPG', 13, 129, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('o2hhhag857amhjenc8u', 'BSc Biological (SCB)', 'SCB', 0, 126, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('c5n6v7v70smhjenc8v', 'BSc Physical (SCP)', 'SCP', 0, 127, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('xcgod3uq6zkmhjenc8v', 'BSc Economics (SEC)', 'SEC', 11, 128, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('8wffvsp84smhjenc8v', 'Bachelor of Laws (LLB)', 'LLB', 14, 30, 4, 120, NULL, 'Bachelor', 'Law has its own faculty pages.', NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('pu857u3vbvmmhjencbx', 'Bachelor of Science with Education – Physical (EDP-Physical)', 'EDP-Physical', 13, 116, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('crlwzjr66ammhjencbz', 'Bachelor of Science with Education – Biological (EDB)', 'EDB', 13, 117, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('12yzqzwvbtcimhjencc0', 'Bachelor of Arts with Education (EDA)', 'EDA', 12, 114, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('5pxsbgfowq6mhjencc0', 'Bachelor of Science with Education (EDP)', 'EDP', 13, 115, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('2hifow0g7fqmhjencc1', 'BSc Agricultural Engineering (AGE)', 'AGE', 16, 80, 4, 120, NULL, 'Certificate', NULL, 'UGX 2,044,056 / UGX 3,406,760 per semester', 'On Campus', NULL, 'UGX 2,044,056 / UGX 3,406,760 per semester', 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('63jnqbibvcimhjencc1', 'BSc Agriculture (AGR)', 'AGR', 16, 78, 4, 120, NULL, 'Certificate', NULL, 'UGX 2,044,056 / UGX 3,406,760 per semester', 'On Campus', NULL, 'UGX 2,044,056 / UGX 3,406,760 per semester', 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('aw9zwabpqw9mhjencc2', 'BSc Food Science and Technology (FST)', 'FST', 16, 79, 4, 120, NULL, 'Certificate', NULL, 'UGX 2,044,056 / UGX 3,406,760 per semester', 'On Campus', NULL, 'UGX 2,044,056 / UGX 3,406,760 per semester', 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('zgxqnlxs1rmhjencc2', 'Bachelor of Veterinary Medicine', 'VET', 15, 141, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('l3y52h7sbmmhjencc3', 'Bachelor of Animal Production Technology and Management', 'BAP', 11, 142, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('qtb4l35n98mhjencc3', 'BSc Fisheries and Aquaculture (BFS)', 'BFS', 0, 124, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('z4qth6gsd0cmhjencc4', 'BSc Sports Science (BSP)', 'BSP', 13, 125, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('s8eim8nkkmhjencc5', 'Bachelor of Arts (ARS)', 'ARS', 12, 105, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('vp2cafv52komhjencc5', 'Bachelor of Arts in Music (MUS)', 'MUS', 12, 106, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('crzj9l9qjnlmhjencc6', 'Bachelor of Journalism and Communication (BJC)', 'BJC', 15, 104, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('pg2luzvpkmhjencc6', 'Bachelor of Arts in Social Sciences (ASS)', 'ASS', 12, 103, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('ixd01ol3d7mhjencc7', 'Bachelor of Social Work (SOW)', 'SOW', 15, 102, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('l22uu52mbfdmhjencc8', 'BSc Agricultural and Rural Innovation (BAR)', 'BAR', 16, 82, 3, 120, NULL, 'Certificate', NULL, 'UGX 2,129,225 / UGX 4,301,035 per semester', 'On Campus', NULL, 'UGX 2,129,225 / UGX 4,301,035 per semester', 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('kkd5bak94hgmhjencc8', 'BSc Human Nutrition & Dietetics (BHD)', 'BHD', 0, 83, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('bjr4l2zss6wmhjencc9', 'BSc Forestry (BOF)', 'BOF', 16, 84, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('5pe5t77q46omhjencc9', 'BSc Geographical Sciences (BGS)', 'BGS', 13, 85, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('yvb68eeoxrcmhjencca', 'BSc Tourism and Hospitality Management (BTH)', 'BTH', 11, 86, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('syspp90nrlmhjencca', 'BSc Bioprocessing Engineering (BBP)', 'BBP', 10, 87, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('akilp7vfvyomhjenccb', 'BSc Water and Irrigation Engineering (BWE)', 'BWE', 10, 88, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('m8epedcvdvmhjenccb', 'BSc Environmental Science (BVS)', 'BVS', 13, 89, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('b05klben1b8mhjenccc', 'BSc Agricultural and Rural Innovation (External) (BAX)', 'BAX', 16, 90, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('exwx8ailvfmhjenccd', 'BBA – Bachelor of Business Administration (ADM)', 'ADM', 11, 96, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('rr2y5ujm3simhjencce', 'BSc Population Studies (BPS)', 'BPS', 0, 97, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('5flem3h9f0cmhjenccf', 'BA Economics (Evening) (ECE)', 'ECE', 11, 98, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('xuc2ouyt7yemhjenccf', 'BCom (Evening) (CEO)', 'CEO', 0, 99, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('dieoql9o5gjmhjenccg', 'BBA (Evening) (ADN)', 'ADN', 0, 100, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('ndbqfkpmiz9mhjenccg', 'BCom (External) (COXI)', 'COXI', 0, 101, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('w94b2ht83wbmhjencch', 'Bachelor of Applied Psychology (APS)', 'APS', 15, 107, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('ujrzwac50dkmhjencch', 'Bachelor of Chinese and Asian Studies (BCA)', 'BCA', 15, 108, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('4ik8fz7yjt2mhjencch', 'Diploma in Performing Arts (DPA)', 'DPA', 12, 109, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('9ym8c7rptvbmhjencci', 'Evening Program – Bachelor of Journalism and Communication (BJE)', 'BJE', 15, 110, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('mktnqfmn05mhjencci', 'Evening Program – Bachelor of Arts in Social Sciences (ASE)', 'ASE', 12, 111, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('lcchsxbqjcqmhjenccj', 'Evening Program – Bachelor of Applied Psychology (JAPY)', 'JAPY', 15, 112, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('ng7ewvx04t8mhjenccj', 'Evening Program – Bachelor of Chinese and Asian Studies (BCC)', 'BCC', 15, 113, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('13q5wurp2c5qmhjenccj', 'Bachelor of Science with Education – Economics (EEC)', 'EEC', 11, 118, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('yprkoqba4vbmhjencck', 'Bachelor of Adult and Community Education (BAC)', 'BAC', 15, 119, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('sea0xrm4g1cmhjencck', 'Bachelor of Early Childhood Care and Education (BEY)', 'BEY', 15, 120, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('2e1f7c1u6t7mhjencck', 'Evening – Bachelor of Adult and Community Education (BCE)', 'BCE', 15, 121, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('8jm3tss7kimmhjenccl', 'External – Bachelor of Youth in Development Work (BYW)', 'BYW', 15, 122, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('5oru4jllphomhjenccl', 'Bachelor of Education (BED) (for Practising Diploma Holder Teachers)', 'BED', 15, 123, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('trhis0em2lnmhjenccl', 'BSc Computer Science (CSC)', 'CSC', 13, 133, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('a86a406mm69mhjenccl', 'BSc Information Systems and Technology (IST)', 'IST', 12, 134, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('wttczdonbynmhjenccm', 'BSc Software Engineering (BSW)', 'BSW', 10, 135, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('87lttfvcrmimhjenccm', 'BSc Library and Information Science (LIS)', 'LIS', 13, 136, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('xhvpinb2p8mhjenccm', 'BSc Computer Science (Evening) (CSE)', 'CSE', 13, 137, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('59i6skkdl1omhjenccm', 'BSc Information Systems and Technology (Evening) (BSI)', 'BSI', 12, 138, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('f1j2p1tprhlmhjenccn', 'BSc Software Engineering (Evening) (ISSE)', 'ISSE', 10, 139, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('hu8802kzvbnmhjenccn', 'BSc Library and Information Science (Evening) (BLE)', 'BLE', 13, 140, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('hjzlvmf0gh4mhjenccn', 'Bachelor of Industrial Livestock and Business', 'BLB', 11, 143, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('9gs9dwihhcvmhjenccn', 'Bachelor of Biomedical Laboratory Technology', 'MLT', 9, 144, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000'),
('0ov0zk41c9zmhjenccp', 'Bachelor of Medical Laboratory Technology', 'BLT', 9, 145, 4, 120, NULL, 'Certificate', NULL, NULL, 'On Campus', NULL, NULL, 'active', 1, 1, '2025-11-03 20:19:30.000', '2025-11-03 20:19:30.000');

-- --------------------------------------------------------

--
-- Table structure for table `research`
--

DROP TABLE IF EXISTS `research`;
CREATE TABLE IF NOT EXISTS `research` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `leadResearcher` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `funding` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publicationDate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `order` int NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `research`
--

INSERT INTO `research` (`id`, `type`, `title`, `description`, `details`, `leadResearcher`, `department`, `funding`, `publicationDate`, `imageUrl`, `isActive`, `isFeatured`, `order`, `createdAt`, `updatedAt`) VALUES
('1', 'project', 'AI Ethics and Bias Mitigation', 'Comprehensive research on artificial intelligence bias detection and mitigation strategies.', 'This project focuses on developing algorithmic solutions to identify and reduce bias in AI systems.', 'Dr. Maria Rodriguez', 'Computer Science', '$250,000', NULL, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3', 1, 1, 1, '2025-11-02 19:51:43.446', '2025-11-02 19:51:43.446'),
('2', 'publication', 'Climate Change Adaptation in Urban Planning', 'Peer-reviewed study on sustainable urban development strategies for climate resilience.', 'Published in the Journal of Environmental Planning, this research presents novel approaches to urban design.', 'Prof. Ahmed Hassan', 'Environmental Sciences', NULL, '2025-09-15', 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3', 1, 0, 2, '2025-11-02 19:51:43.446', '2025-11-02 19:51:43.446'),
('3', 'grant', 'NSF Grant for Quantum Computing Research', 'National Science Foundation funding for quantum algorithm development.', 'Five-year grant to advance quantum computing applications in cryptography and optimization problems.', 'Dr. Sarah Chen', 'Physics', '$1,200,000', NULL, 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3', 1, 1, 3, '2025-11-02 19:51:43.446', '2025-11-02 19:51:43.446');

-- --------------------------------------------------------

--
-- Table structure for table `student_life`
--

DROP TABLE IF EXISTS `student_life`;
CREATE TABLE IF NOT EXISTS `student_life` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactInfo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cost` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `schedule` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `order` int NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_life`
--

INSERT INTO `student_life` (`id`, `type`, `title`, `description`, `details`, `category`, `location`, `contactInfo`, `cost`, `capacity`, `schedule`, `imageUrl`, `isActive`, `isFeatured`, `order`, `createdAt`, `updatedAt`) VALUES
('1', 'event', 'Spring Festival 2025', 'Annual spring celebration with live music, food vendors, and student performances.', 'Join us for our biggest event of the year! The Spring Festival features live bands, cultural performances, local food vendors, and interactive activities.', 'Cultural', 'Main Campus Quad', 'events@university.edu', 'Free', 2000, 'April 15, 2025 12:00 PM - 8:00 PM', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3', 1, 1, 1, '2025-11-02 19:51:43.522', '2025-11-02 19:51:43.522'),
('2', 'club', 'Computer Science Society', 'Student organization for CS majors and tech enthusiasts.', 'The CS Society organizes coding competitions, tech talks, hackathons, and networking events with industry professionals.', 'Academic', 'Engineering Building Room 201', 'css@student.university.edu', '$25/semester', 150, 'Meetings every Friday 4:00 PM', 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3', 1, 1, 2, '2025-11-02 19:51:43.522', '2025-11-02 19:51:43.522'),
('3', 'facility', 'State-of-the-Art Fitness Center', 'Modern fitness facility with cardio equipment, weights, and group classes.', 'Our 15,000 sq ft fitness center features the latest equipment, group fitness studios, a rock climbing wall, and an indoor track.', 'Recreation', 'Student Recreation Center', 'fitness@university.edu', 'Included in student fees', 300, 'Daily 5:00 AM - 11:00 PM', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3', 1, 1, 3, '2025-11-02 19:51:43.522', '2025-11-02 19:51:43.522');

-- --------------------------------------------------------

--
-- Table structure for table `visit_requests`
--

DROP TABLE IF EXISTS `visit_requests`;
CREATE TABLE IF NOT EXISTS `visit_requests` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `preferredDate` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `preferredTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `groupSize` int NOT NULL DEFAULT '1',
  `interests` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `specialRequests` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `adminNotes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `respondedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `visit_requests`
--

INSERT INTO `visit_requests` (`id`, `firstName`, `lastName`, `email`, `phone`, `preferredDate`, `preferredTime`, `groupSize`, `interests`, `specialRequests`, `status`, `adminNotes`, `respondedAt`, `createdAt`, `updatedAt`) VALUES
('1', 'Alice', 'Johnson', 'alice.johnson@email.com', '+1-555-7890', '2025-11-15', '2:00 PM', 3, '[\"Engineering\",\"Computer Science\",\"Campus Life\"]', 'Would like to meet with faculty from the Engineering department', 'pending', NULL, NULL, '2025-11-02 19:51:43.258', '2025-11-02 19:51:43.258'),
('2', 'David', 'Chen', 'david.chen@student.com', '+1-555-9012', '2025-11-05', '11:00 AM', 1, '[\"Computer Science\",\"Research Labs\",\"International Programs\"]', NULL, 'approved', 'Approved for November 5th visit', '2025-10-20 10:00:00.000', '2025-11-02 19:51:43.258', '2025-11-02 19:51:43.258');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
