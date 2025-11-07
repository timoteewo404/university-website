-- Sample data for the 'programs' table
-- Please adjust the college_id and department_id to match the IDs in your database.

INSERT INTO `programs` (`name`, `code`, `college_id`, `department_id`, `duration`, `degree_type`, `description`, `requirements`, `status`, `location`, `application_deadline`)
VALUES
('Bachelor of Science in Computer Science', 'BSC-CS', 1, 1, 4, 'Bachelor', 'A comprehensive program covering the fundamentals of computer science, including algorithms, data structures, and software development.', '- High School Diploma or equivalent\n- Strong background in Mathematics and Physics\n- Passing grade in entrance examination', 'active', 'On Campus', '2025-08-31'),
('Master of Science in Software Engineering', 'MSC-SE', 1, 3, 2, 'Master', 'An advanced program focusing on the principles and practices of software engineering, including agile methodologies, software architecture, and quality assurance.', '- Bachelor''s degree in Computer Science or a related field\n- Minimum CGPA of 3.0\n- Letters of recommendation', 'active', 'Online', '2025-07-31'),
('Bachelor of Business Administration', 'BBA', 2, 4, 4, 'Bachelor', 'This program provides a strong foundation in business principles, with specializations available in marketing, finance, and human resource management.', '- High School Diploma or equivalent\n- Proficiency in English\n- Entrance interview', 'active', 'On Campus', '2025-09-15'),
('PhD in Information Technology', 'PHD-IT', 1, 2, 5, 'PhD', 'A research-intensive program for students wishing to pursue advanced topics in information technology and contribute to the field.', '- Master''s degree in IT or a related field\n- Research proposal\n- Published articles are a plus', 'active', 'On Campus', '2025-06-30');
