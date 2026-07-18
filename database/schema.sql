CREATE DATABASE IF NOT EXISTS gpap_db;
USE gpap_db;

-- 1. colleges
CREATE TABLE IF NOT EXISTS colleges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    domain VARCHAR(150) NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. departments
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_dept_college FOREIGN KEY (college_id) REFERENCES colleges(id)
);

-- 3. courses
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_course_dept FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Users (Base table for Staff and Students)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_users_college FOREIGN KEY (college_id) REFERENCES colleges(id)
);

-- 4. staff
CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    department_id INT NULL,
    employee_id VARCHAR(50) NULL,
    CONSTRAINT fk_staff_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_staff_dept FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- 5. students
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    department_id INT NULL,
    course_id INT NULL,
    batch_year VARCHAR(20) NULL,
    section VARCHAR(20) NULL,
    roll_number VARCHAR(50) NULL,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_student_dept FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT fk_student_course FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 6. tests
CREATE TABLE IF NOT EXISTS tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(100) NULL,
    department_id INT NULL,
    batch_year VARCHAR(20) NULL,
    section VARCHAR(20) NULL,
    difficulty VARCHAR(50) DEFAULT 'Medium',
    total_questions INT NOT NULL,
    total_marks INT NOT NULL,
    duration_minutes INT DEFAULT 30,
    passing_marks INT DEFAULT 0,
    negative_marking FLOAT DEFAULT 0,
    shuffle_questions BOOLEAN DEFAULT FALSE,
    shuffle_options BOOLEAN DEFAULT FALSE,
    allow_calculator BOOLEAN DEFAULT FALSE,
    allow_review BOOLEAN DEFAULT TRUE,
    requires_fullscreen BOOLEAN DEFAULT TRUE,
    password VARCHAR(50) NULL,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    created_by INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tests_college FOREIGN KEY (college_id) REFERENCES colleges(id),
    CONSTRAINT fk_tests_dept FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT fk_tests_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 7. question_bank
CREATE TABLE IF NOT EXISTS question_bank (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    question_text TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- single, multiple, true_false, etc.
    option_a TEXT NULL,
    option_b TEXT NULL,
    option_c TEXT NULL,
    option_d TEXT NULL,
    correct_answer VARCHAR(50) NOT NULL, -- A, B, C, D
    explanation TEXT NULL,
    marks INT DEFAULT 1,
    difficulty VARCHAR(50) DEFAULT 'Medium',
    topic VARCHAR(100) NULL,
    bloom_level VARCHAR(50) NULL,
    department_id INT NULL,
    subject VARCHAR(100) NULL,
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_qb_college FOREIGN KEY (college_id) REFERENCES colleges(id),
    CONSTRAINT fk_qb_dept FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT fk_qb_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 8. test_questions
CREATE TABLE IF NOT EXISTS test_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    question_id INT NOT NULL,
    order_index INT NULL,
    CONSTRAINT fk_tq_test FOREIGN KEY (test_id) REFERENCES tests(id),
    CONSTRAINT fk_tq_question FOREIGN KEY (question_id) REFERENCES question_bank(id)
);

-- 9. student_answers
CREATE TABLE IF NOT EXISTS student_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    student_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option VARCHAR(50) NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    time_taken_seconds INT DEFAULT 0,
    CONSTRAINT fk_sa_test FOREIGN KEY (test_id) REFERENCES tests(id),
    CONSTRAINT fk_sa_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_sa_question FOREIGN KEY (question_id) REFERENCES question_bank(id)
);

-- 10. student_results
CREATE TABLE IF NOT EXISTS student_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    student_id INT NOT NULL,
    total_marks FLOAT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    wrong_answers INT DEFAULT 0,
    skipped INT DEFAULT 0,
    percentage FLOAT DEFAULT 0,
    grade VARCHAR(20) NULL,
    status VARCHAR(20) NULL, -- Pass / Fail
    risk_score INT DEFAULT 0, -- AI Cheating Score
    started_at DATETIME NULL,
    submitted_at DATETIME NULL,
    ip_address VARCHAR(50) NULL,
    browser VARCHAR(100) NULL,
    device VARCHAR(100) NULL,
    CONSTRAINT fk_sr_test FOREIGN KEY (test_id) REFERENCES tests(id),
    CONSTRAINT fk_sr_student FOREIGN KEY (student_id) REFERENCES students(id)
);

-- 11. test_logs
CREATE TABLE IF NOT EXISTS test_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    student_id INT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    description TEXT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tl_test FOREIGN KEY (test_id) REFERENCES tests(id),
    CONSTRAINT fk_tl_student FOREIGN KEY (student_id) REFERENCES students(id)
);

-- 12. cheating_logs
CREATE TABLE IF NOT EXISTS cheating_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    student_id INT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    duration_seconds INT DEFAULT 0,
    severity VARCHAR(50) NULL,
    ip_address VARCHAR(50) NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cl_test FOREIGN KEY (test_id) REFERENCES tests(id),
    CONSTRAINT fk_cl_student FOREIGN KEY (student_id) REFERENCES students(id)
);

-- 13. activity_logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_al_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 14. reports
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    generated_by INT NOT NULL,
    type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rep_user FOREIGN KEY (generated_by) REFERENCES users(id)
);

-- Insert Dummy Data
INSERT INTO colleges (code, name, domain, is_active) VALUES
('GENFINIX', 'Genfinix College', 'genfinix.edu', TRUE);

INSERT INTO users (college_id, full_name, email, password, role, is_active, created_at) VALUES
(1, 'Super Admin', 'superadmin@genfinix.com', 'admin123', 'super_admin', TRUE, NOW()),
(1, 'College Admin', 'admin@genfinix.com', 'admin123', 'college_admin', TRUE, NOW()),
(1, 'Staff Trainer', 'staff@genfinix.com', 'admin123', 'staff', TRUE, NOW()),
(1, 'Student User', 'student@genfinix.com', 'admin123', 'student', TRUE, NOW());

INSERT INTO departments (college_id, code, name) VALUES
(1, 'CS', 'Computer Science');

INSERT INTO staff (user_id, department_id, employee_id) VALUES
(3, 1, 'EMP001');

INSERT INTO students (user_id, department_id, batch_year, section, roll_number) VALUES
(4, 1, '2024', 'A', '1001');
