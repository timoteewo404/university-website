-- Role-Based and College-Based Access Control Setup
-- This script updates the database schema to support university and college registrar roles

-- 1. Update users table to support new registrar roles
ALTER TABLE users 
MODIFY COLUMN role ENUM(
    'student',
    'lecturer',
    'staff',
    'admin',
    'university_registrar',  -- Full access across all colleges (same as academic_registrar)
    'college_registrar'      -- Limited to assigned college(s)
) NOT NULL;

-- 2. Add college_id to users table for college registrars
ALTER TABLE users ADD COLUMN college_id INT DEFAULT NULL AFTER role;
ALTER TABLE users ADD INDEX idx_users_college_id (college_id);

-- 3. Create user_college_assignments table for more flexible college assignments
CREATE TABLE IF NOT EXISTS user_college_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    college_id INT NOT NULL,
    role_type ENUM('college_registrar', 'dean', 'admin') NOT NULL,
    permissions JSON DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    assigned_by INT DEFAULT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_college_role (user_id, college_id, role_type),
    INDEX idx_user_college_active (user_id, college_id, is_active),
    INDEX idx_college_role_active (college_id, role_type, is_active)
);

-- 4. Add college_id to students table (derived from program)
ALTER TABLE students ADD COLUMN college_id INT DEFAULT NULL AFTER program;
ALTER TABLE students ADD INDEX idx_students_college_id (college_id);

-- 5. Update students college_id based on their program's college
UPDATE students s 
JOIN programs p ON s.program = p.code 
SET s.college_id = p.college_id 
WHERE s.college_id IS NULL;

-- 6. Add college_id to course_units table
ALTER TABLE course_units ADD COLUMN college_id INT DEFAULT NULL AFTER program_id;
ALTER TABLE course_units ADD INDEX idx_course_units_college_id (college_id);

-- 7. Update course_units college_id based on program
UPDATE course_units cu 
JOIN programs p ON cu.program_id = p.id 
SET cu.college_id = p.college_id 
WHERE cu.college_id IS NULL;

-- 8. Add college_id to exam_schedules table if it exists
ALTER TABLE exam_schedules ADD COLUMN college_id INT DEFAULT NULL;
ALTER TABLE exam_schedules ADD INDEX idx_exam_schedules_college_id (college_id);

-- 9. Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    actions JSON NOT NULL, -- ['create', 'read', 'update', 'delete', 'manage']
    conditions JSON DEFAULT NULL, -- Additional conditions like college restrictions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_role_resource (role_name, resource)
);

-- 10. Insert default role permissions
INSERT INTO role_permissions (role_name, resource, actions, conditions) VALUES
-- University Registrar - Full access
('university_registrar', 'students', '["create", "read", "update", "delete", "manage"]', '{"scope": "all_colleges"}'),
('university_registrar', 'courses', '["create", "read", "update", "delete", "manage"]', '{"scope": "all_colleges"}'),
('university_registrar', 'programs', '["create", "read", "update", "delete", "manage"]', '{"scope": "all_colleges"}'),
('university_registrar', 'exams', '["create", "read", "update", "delete", "manage"]', '{"scope": "all_colleges", "special": "exam_periods"}'),
('university_registrar', 'graduations', '["create", "read", "update", "delete", "manage"]', '{"scope": "all_colleges"}'),
('university_registrar', 'records', '["create", "read", "update", "delete", "manage"]', '{"scope": "all_colleges"}'),
('university_registrar', 'departments', '["create", "read", "update", "delete", "manage"]', '{"scope": "all_colleges"}'),
('university_registrar', 'colleges', '["create", "read", "update", "delete", "manage"]', '{"scope": "all_colleges"}'),
('university_registrar', 'schools', '["create", "read", "update", "delete", "manage"]', '{"scope": "all_colleges"}'),
('university_registrar', 'users', '["create", "read", "update", "delete", "assign_colleges"]', '{"scope": "all_colleges"}'),
('university_registrar', 'results', '["read", "update", "manage"]', '{"scope": "all_colleges"}'),

-- College Registrar - Limited to assigned college
('college_registrar', 'students', '["create", "read", "update", "delete", "manage"]', '{"scope": "assigned_college_only"}'),
('college_registrar', 'courses', '["create", "read", "update", "delete", "manage"]', '{"scope": "assigned_college_only"}'),
('college_registrar', 'programs', '["create", "read", "update", "delete", "manage"]', '{"scope": "assigned_college_only"}'),
('college_registrar', 'exams', '["read", "update", "manage"]', '{"scope": "assigned_college_only", "restriction": "no_period_control"}'),
('college_registrar', 'graduations', '["read", "update", "manage"]', '{"scope": "assigned_college_only"}'),
('college_registrar', 'records', '["create", "read", "update", "delete", "manage"]', '{"scope": "assigned_college_only"}'),
('college_registrar', 'departments', '["create", "read", "update", "delete", "manage"]', '{"scope": "assigned_college_only"}'),
('college_registrar', 'results', '["read"]', '{"scope": "assigned_college_only", "restriction": "view_only"}')
ON DUPLICATE KEY UPDATE
    actions = VALUES(actions),
    conditions = VALUES(conditions),
    updated_at = CURRENT_TIMESTAMP;

-- 11. Create audit log for role-based actions
CREATE TABLE IF NOT EXISTS role_audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    college_id INT DEFAULT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) DEFAULT NULL,
    details JSON DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user_date (user_id, created_at),
    INDEX idx_audit_college_date (college_id, created_at),
    INDEX idx_audit_resource (resource, resource_id),
    INDEX idx_audit_action_success (action, success)
);

-- 12. Create sample data for testing
-- Update existing academic registrar to university registrar
UPDATE users 
SET role = 'university_registrar' 
WHERE email = 'academic.registrar@university.edu';

-- Create sample college registrars
INSERT INTO users (name, email, password, role, college_id, status) VALUES
('Dr. Computing Registrar', 'registrar.computing@university.edu', '$2b$10$MigRDkaMfT88MEP6PHJxMOOczmHAZVBlbrzOvKSSV1MqSZ0zBSg86', 'college_registrar', 1, 'active'),
('Dr. Business Registrar', 'registrar.business@university.edu', '$2b$10$MigRDkaMfT88MEP6PHJxMOOczmHAZVBlbrzOvKSSV1MqSZ0zBSg86', 'college_registrar', 2, 'active'),
('Dr. Engineering Registrar', 'registrar.engineering@university.edu', '$2b$10$MigRDkaMfT88MEP6PHJxMOOczmHAZVBlbrzOvKSSV1MqSZ0zBSg86', 'college_registrar', 3, 'active'),
('Dr. Health Registrar', 'registrar.health@university.edu', '$2b$10$MigRDkaMfT88MEP6PHJxMOOczmHAZVBlbrzOvKSSV1MqSZ0zBSg86', 'college_registrar', 4, 'active');

-- Assign college registrars to their colleges
INSERT INTO user_college_assignments (user_id, college_id, role_type, permissions) 
SELECT u.id, u.college_id, 'college_registrar', 
    '{"students": ["create", "read", "update", "delete"], "courses": ["create", "read", "update", "delete"], "exams": ["read", "update"], "results": ["read"]}' 
FROM users u 
WHERE u.role = 'college_registrar' AND u.college_id IS NOT NULL;

-- 13. Create views for easy access control checking
CREATE OR REPLACE VIEW user_permissions AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    u.role,
    u.college_id as primary_college_id,
    rp.resource,
    rp.actions,
    rp.conditions,
    CASE 
        WHEN u.role = 'university_registrar' THEN 'all_colleges'
        WHEN u.role = 'college_registrar' THEN 'assigned_college_only'
        ELSE 'none'
    END as access_scope
FROM users u
LEFT JOIN role_permissions rp ON u.role = rp.role_name
WHERE u.status = 'active';

-- 14. Create helper functions for access control
DELIMITER $$

DROP FUNCTION IF EXISTS CheckCollegeAccess$$
CREATE FUNCTION CheckCollegeAccess(
    p_user_id INT,
    p_college_id INT,
    p_resource VARCHAR(100),
    p_action VARCHAR(50)
) RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_user_role VARCHAR(50);
    DECLARE v_user_college_id INT;
    DECLARE v_has_access BOOLEAN DEFAULT FALSE;
    
    -- Get user role and college
    SELECT role, college_id INTO v_user_role, v_user_college_id
    FROM users 
    WHERE id = p_user_id AND status = 'active';
    
    -- University registrar has access to everything
    IF v_user_role = 'university_registrar' THEN
        SET v_has_access = TRUE;
    -- College registrar has access only to their college
    ELSEIF v_user_role = 'college_registrar' AND v_user_college_id = p_college_id THEN
        -- Check if action is allowed for the resource
        SELECT COUNT(*) > 0 INTO v_has_access
        FROM role_permissions 
        WHERE role_name = v_user_role 
        AND resource = p_resource 
        AND JSON_CONTAINS(actions, CONCAT('"', p_action, '"'));
    END IF;
    
    RETURN v_has_access;
END$$

DELIMITER ;

-- 15. Create indexes for performance
CREATE INDEX idx_users_role_college ON users(role, college_id);
CREATE INDEX idx_students_college_program ON students(college_id, program);
CREATE INDEX idx_programs_college_status ON programs(college_id, status);

-- 16. Add constraints to ensure data integrity
-- Ensure college registrars have a college assigned
-- ALTER TABLE users ADD CONSTRAINT chk_college_registrar_college 
-- CHECK (role != 'college_registrar' OR college_id IS NOT NULL);

COMMIT;
