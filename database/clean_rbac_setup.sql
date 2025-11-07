-- Clean Role-Based Access Control Setup Script
-- This script safely updates the database schema and handles duplicates

-- Clear any existing duplicate permissions first
DELETE FROM role_permissions WHERE role_name IN ('university_registrar', 'college_registrar');

-- Insert role permissions with clean data
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
('college_registrar', 'results', '["read"]', '{"scope": "assigned_college_only", "restriction": "view_only"}');

-- Create or update registrar accounts
INSERT INTO users (name, email, password, role, status, created_at) VALUES
('University Registrar', 'university.registrar@edu.com', '$2b$10$MigRDkaMfT88MEP6PHJxMOOczmHAZVBlbrzOvKSSV1MqSZ0zBSg86', 'university_registrar', 'active', NOW())
ON DUPLICATE KEY UPDATE 
role = 'university_registrar',
status = 'active',
updated_at = NOW();

-- Create college registrar accounts
INSERT INTO users (name, email, password, role, college_id, status, created_at) VALUES
('Computing College Registrar', 'college.registrar.computing@edu.com', '$2b$10$MigRDkaMfT88MEP6PHJxMOOczmHAZVBlbrzOvKSSV1MqSZ0zBSg86', 'college_registrar', 1, 'active', NOW()),
('Business College Registrar', 'college.registrar.business@edu.com', '$2b$10$MigRDkaMfT88MEP6PHJxMOOczmHAZVBlbrzOvKSSV1MqSZ0zBSg86', 'college_registrar', 2, 'active', NOW()),
('Engineering College Registrar', 'college.registrar.engineering@edu.com', '$2b$10$MigRDkaMfT88MEP6PHJxMOOczmHAZVBlbrzOvKSSV1MqSZ0zBSg86', 'college_registrar', 3, 'active', NOW())
ON DUPLICATE KEY UPDATE 
role = 'college_registrar',
status = 'active',
updated_at = NOW();

-- Add college assignments for college registrars
INSERT INTO user_college_assignments (user_id, college_id, role_type, is_active, assigned_at) 
SELECT u.id, u.college_id, 'college_registrar', TRUE, NOW()
FROM users u 
WHERE u.role = 'college_registrar' AND u.college_id IS NOT NULL
ON DUPLICATE KEY UPDATE 
is_active = TRUE,
assigned_at = NOW();

-- Display final status
SELECT 'Role-based access control setup completed successfully!' as Status;
SELECT 
    u.name, 
    u.email, 
    u.role, 
    u.college_id,
    'password123' as password
FROM users u 
WHERE u.role IN ('university_registrar', 'college_registrar') 
ORDER BY u.role, u.name;
