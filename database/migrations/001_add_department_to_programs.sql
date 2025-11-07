-- Add department_id to programs table to link programs to departments
ALTER TABLE `programs` ADD `department_id` INT NULL AFTER `college_id`;

-- Add a foreign key constraint to ensure data integrity
ALTER TABLE `programs` ADD CONSTRAINT `fk_programs_department` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Add location to programs table to allow filtering by location (On Campus/Online)
ALTER TABLE `programs` ADD `location` ENUM('On Campus', 'Online') NOT NULL DEFAULT 'On Campus' AFTER `requirements`;

-- Add application_deadline to programs table
ALTER TABLE `programs` ADD `application_deadline` DATE NULL AFTER `location`;

-- Example UPDATE statements to link existing programs to departments
-- You will need to replace the IDs with the correct ones for your data.
-- UPDATE `programs` SET `department_id` = (SELECT id FROM `departments` WHERE name = 'Computer Science') WHERE `name` LIKE '%Computer Science%';
-- UPDATE `programs` SET `department_id` = (SELECT id FROM `departments` WHERE name = 'Business Administration') WHERE `name` LIKE '%Business%';
