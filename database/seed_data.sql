-- database/seed_data.sql

-- Insert default admin roles if not exists (assuming a roles table exists)
-- This is a placeholder for actual seed data based on the schema

INSERT INTO `users` (`email`, `hashed_password`, `role`, `is_active`) VALUES
('superadmin@gpap.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'super_admin', 1)
ON DUPLICATE KEY UPDATE `email`=`email`;

-- Insert sample colleges
INSERT INTO `colleges` (`name`, `domain`, `status`) VALUES
('Engineering Institute of Technology', 'eit.edu', 'active'),
('National Science College', 'nsc.edu', 'active')
ON DUPLICATE KEY UPDATE `name`=`name`;
