-- =========================================
-- SMART LEARNING PORTAL DATABASE
-- MySQL Database Schema
-- =========================================

-- =========================================
-- CREATE DATABASE
-- =========================================

CREATE DATABASE IF NOT EXISTS `project_database`;
USE `project_database`;

-- =========================================
-- 1. USERS TABLE
-- =========================================

CREATE TABLE `users` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `fullName` VARCHAR(100) NOT NULL,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `phone` VARCHAR(15),
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('student', 'admin', 'teacher') DEFAULT 'student',
    `profilePicture` VARCHAR(255),
    `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    `registeredAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `lastLogin` TIMESTAMP NULL,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================
-- 2. COURSES TABLE
-- =========================================

CREATE TABLE `courses` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `courseName` VARCHAR(100) NOT NULL,
    `courseCode` VARCHAR(20) UNIQUE NOT NULL,
    `description` TEXT,
    `instructor_id` INT NOT NULL,
    `totalSessions` INT DEFAULT 0,
    `status` ENUM('active', 'inactive', 'completed') DEFAULT 'active',
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`instructor_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- =========================================
-- 3. ASSIGNMENTS TABLE
-- =========================================

CREATE TABLE `assignments` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `course_id` INT NOT NULL,
    `assignedBy` INT NOT NULL,
    `dueDate` DATE NOT NULL,
    `maxScore` INT DEFAULT 100,
    `fileURL` VARCHAR(255),
    `status` ENUM('active', 'closed', 'graded') DEFAULT 'active',
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`assignedBy`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- =========================================
-- 4. ASSIGNMENT SUBMISSIONS TABLE
-- =========================================

CREATE TABLE `assignment_submissions` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `assignment_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `submissionFile` VARCHAR(255),
    `submissionText` LONGTEXT,
    `score` INT,
    `feedback` TEXT,
    `submittedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `gradedAt` TIMESTAMP NULL,
    `status` ENUM('pending', 'submitted', 'graded', 'late') DEFAULT 'pending',
    FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_submission` (`assignment_id`, `student_id`)
);

-- =========================================
-- 5. ATTENDANCE TABLE
-- =========================================

CREATE TABLE `attendance` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `course_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `session_date` DATE NOT NULL,
    `status` ENUM('present', 'absent', 'late', 'excused') DEFAULT 'absent',
    `remarks` VARCHAR(255),
    `markedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `markedBy` INT,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`markedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    UNIQUE KEY `unique_attendance` (`course_id`, `student_id`, `session_date`)
);

-- =========================================
-- 6. NOTES TABLE
-- =========================================

CREATE TABLE `notes` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `category` VARCHAR(50),
    `content` LONGTEXT NOT NULL,
    `course_id` INT,
    `student_id` INT NOT NULL,
    `color` VARCHAR(7) DEFAULT '#2563eb',
    `isPinned` BOOLEAN DEFAULT FALSE,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- =========================================
-- 7. QUIZ TABLE
-- =========================================

CREATE TABLE `quizzes` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `course_id` INT NOT NULL,
    `createdBy` INT NOT NULL,
    `totalQuestions` INT NOT NULL,
    `timeLimit` INT DEFAULT 30,
    `totalMarks` INT DEFAULT 100,
    `passingMarks` INT DEFAULT 40,
    `startDate` DATETIME,
    `endDate` DATETIME,
    `shuffleQuestions` BOOLEAN DEFAULT FALSE,
    `showResults` BOOLEAN DEFAULT TRUE,
    `status` ENUM('draft', 'published', 'closed') DEFAULT 'draft',
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- =========================================
-- 8. QUIZ QUESTIONS TABLE
-- =========================================

CREATE TABLE `quiz_questions` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `quiz_id` INT NOT NULL,
    `questionNumber` INT NOT NULL,
    `questionText` LONGTEXT NOT NULL,
    `questionType` ENUM('multiple-choice', 'true-false', 'short-answer') DEFAULT 'multiple-choice',
    `marks` INT DEFAULT 1,
    `image` VARCHAR(255),
    `explanation` TEXT,
    FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE CASCADE
);

-- =========================================
-- 9. QUIZ OPTIONS TABLE
-- =========================================

CREATE TABLE `quiz_options` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `question_id` INT NOT NULL,
    `optionText` TEXT NOT NULL,
    `isCorrect` BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (`question_id`) REFERENCES `quiz_questions`(`id`) ON DELETE CASCADE
);

-- =========================================
-- 10. QUIZ ATTEMPTS TABLE
-- =========================================

CREATE TABLE `quiz_attempts` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `quiz_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `totalMarks` INT,
    `marksObtained` INT,
    `percentage` DECIMAL(5, 2),
    `status` ENUM('passed', 'failed', 'in-progress') DEFAULT 'in-progress',
    `startTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `endTime` TIMESTAMP NULL,
    `timeTaken` INT COMMENT 'Time taken in seconds',
    FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- =========================================
-- 11. QUIZ ANSWERS TABLE
-- =========================================

CREATE TABLE `quiz_answers` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `attempt_id` INT NOT NULL,
    `question_id` INT NOT NULL,
    `selectedOption_id` INT,
    `studentAnswer` TEXT,
    `isCorrect` BOOLEAN,
    `marksObtained` INT DEFAULT 0,
    FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`question_id`) REFERENCES `quiz_questions`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`selectedOption_id`) REFERENCES `quiz_options`(`id`) ON DELETE SET NULL
);

-- =========================================
-- 12. PROGRESS TABLE
-- =========================================

CREATE TABLE `progress` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `student_id` INT NOT NULL,
    `course_id` INT NOT NULL,
    `assignmentScore` DECIMAL(5, 2) DEFAULT 0,
    `quizScore` DECIMAL(5, 2) DEFAULT 0,
    `attendancePercentage` DECIMAL(5, 2) DEFAULT 0,
    `overallScore` DECIMAL(5, 2) DEFAULT 0,
    `totalAssignments` INT DEFAULT 0,
    `completedAssignments` INT DEFAULT 0,
    `totalQuizzes` INT DEFAULT 0,
    `passedQuizzes` INT DEFAULT 0,
    `totalClasses` INT DEFAULT 0,
    `classesAttended` INT DEFAULT 0,
    `grade` VARCHAR(5),
    `remarks` TEXT,
    `lastUpdated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_progress` (`student_id`, `course_id`)
);

-- =========================================
-- 13. CONTACTS TABLE
-- =========================================

CREATE TABLE `contacts` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(15),
    `subject` VARCHAR(150) NOT NULL,
    `message` LONGTEXT NOT NULL,
    `status` ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
    `category` VARCHAR(50),
    `reply` LONGTEXT,
    `repliedAt` TIMESTAMP NULL,
    `submittedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `email_idx` (`email`),
    INDEX `status_idx` (`status`)
);

-- =========================================
-- 14. ANNOUNCEMENTS TABLE
-- =========================================

CREATE TABLE `announcements` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `course_id` INT,
    `createdBy` INT NOT NULL,
    `priority` ENUM('low', 'medium', 'high') DEFAULT 'medium',
    `isPinned` BOOLEAN DEFAULT FALSE,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- =========================================
-- 15. COURSE ENROLLMENT TABLE
-- =========================================

CREATE TABLE `course_enrollment` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `student_id` INT NOT NULL,
    `course_id` INT NOT NULL,
    `enrolledAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `status` ENUM('active', 'completed', 'dropped') DEFAULT 'active',
    FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_enrollment` (`student_id`, `course_id`)
);

-- =========================================
-- 16. AUDIT LOG TABLE
-- =========================================

CREATE TABLE `audit_logs` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT,
    `action` VARCHAR(100) NOT NULL,
    `entity` VARCHAR(50),
    `entityId` INT,
    `details` LONGTEXT,
    `ipAddress` VARCHAR(45),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    INDEX `user_idx` (`user_id`),
    INDEX `action_idx` (`action`),
    INDEX `date_idx` (`createdAt`)
);

-- =========================================
-- 17. SYSTEM SETTINGS TABLE
-- =========================================

CREATE TABLE `system_settings` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `settingKey` VARCHAR(100) UNIQUE NOT NULL,
    `settingValue` LONGTEXT,
    `description` TEXT,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================
-- INSERT SAMPLE DATA
-- =========================================

-- Sample Users
INSERT INTO `users` (`fullName`, `username`, `email`, `phone`, `password`, `role`) VALUES
('Muhammad Aamir', 'admin', 'admin@gmail.com', '03001234567', 'admin123', 'admin'),
('Ali Khan', 'student1', 'student@gmail.com', '03009876543', 'student123', 'student'),
('Fatima Ahmed', 'student2', 'fatima@gmail.com', '03005555555', 'pass123', 'student'),
('Dr. Hassan', 'teacher1', 'hassan@gmail.com', '03002222222', 'teacher123', 'teacher'),
('Sara Malik', 'student3', 'sara@gmail.com', '03003333333', 'sara123', 'student');

-- Sample Courses
INSERT INTO `courses` (`courseName`, `courseCode`, `description`, `instructor_id`) VALUES
('Web Development', 'WD101', 'Learn HTML, CSS, JavaScript and modern frameworks', 4),
('Data Science', 'DS101', 'Introduction to Python and Data Analysis', 4),
('Database Design', 'DB101', 'MySQL and Database Management Systems', 4),
('UI/UX Design', 'UX101', 'User Interface and User Experience Design', 4);

-- Sample Assignments
INSERT INTO `assignments` (`title`, `description`, `course_id`, `assignedBy`, `dueDate`, `maxScore`) VALUES
('Build a Portfolio Website', 'Create a responsive portfolio website using HTML5 and CSS3', 1, 4, '2026-06-15', 100),
('JavaScript Functions', 'Write functions to solve 10 programming problems', 1, 4, '2026-06-10', 50),
('Python Data Analysis', 'Analyze a dataset using Pandas and Numpy', 2, 4, '2026-06-20', 100),
('Database Schema Design', 'Design a database schema for an e-commerce platform', 3, 4, '2026-06-12', 75);

-- Sample Notes
INSERT INTO `notes` (`title`, `category`, `content`, `course_id`, `student_id`, `color`, `isPinned`) VALUES
('HTML Basics', 'HTML', 'HTML is the markup language for web pages', 1, 2, '#2563eb', TRUE),
('CSS Flexbox', 'CSS', 'Flexbox is a powerful layout system in CSS', 1, 2, '#7c3aed', TRUE),
('JavaScript ES6', 'JavaScript', 'ES6 introduced arrow functions, classes, and more', 1, 3, '#16a34a', FALSE),
('Python Lists', 'Python', 'Lists are mutable collections in Python', 2, 2, '#f59e0b', FALSE);

-- Sample Quiz
INSERT INTO `quizzes` (`title`, `description`, `course_id`, `createdBy`, `totalQuestions`, `timeLimit`, `totalMarks`, `passingMarks`, `status`) VALUES
('HTML Quiz', 'Test your knowledge of HTML', 1, 4, 5, 10, 50, 30, 'published'),
('CSS Quiz', 'Test your knowledge of CSS', 1, 4, 5, 15, 50, 30, 'published');

-- Sample Quiz Questions
INSERT INTO `quiz_questions` (`quiz_id`, `questionNumber`, `questionText`, `questionType`, `marks`) VALUES
(1, 1, 'What does HTML stand for?', 'multiple-choice', 10),
(1, 2, 'HTML elements are represented by?', 'multiple-choice', 10),
(1, 3, 'The <body> tag contains the main content of the page', 'true-false', 10),
(1, 4, 'What is the purpose of the <head> tag?', 'multiple-choice', 10),
(1, 5, 'Write the basic structure of an HTML document', 'short-answer', 10);

-- Sample Quiz Options
INSERT INTO `quiz_options` (`question_id`, `optionText`, `isCorrect`) VALUES
(1, 'Hyper Text Markup Language', TRUE),
(1, 'High Tech Modern Language', FALSE),
(1, 'Home Tool Markup Language', FALSE),
(1, 'Hyperlinks and Text Markup Language', FALSE),
(2, 'Tags', TRUE),
(2, 'Elements', FALSE),
(2, 'Scripts', FALSE),
(2, 'None of the above', FALSE),
(4, 'Contains metadata about the document', TRUE),
(4, 'Contains the main content', FALSE),
(4, 'Defines the page layout', FALSE),
(4, 'Contains all images', FALSE);

-- Sample Progress Records
INSERT INTO `progress` (`student_id`, `course_id`, `assignmentScore`, `quizScore`, `attendancePercentage`, `overallScore`, `grade`, `remarks`) VALUES
(2, 1, 85.00, 80.00, 90.00, 85.00, 'A', 'Excellent progress'),
(3, 1, 75.00, 70.00, 85.00, 75.00, 'B', 'Good work'),
(2, 2, 80.00, 78.00, 88.00, 82.00, 'A', 'Very good'),
(5, 1, 90.00, 88.00, 95.00, 90.00, 'A+', 'Outstanding performance');

-- Sample System Settings
INSERT INTO `system_settings` (`settingKey`, `settingValue`, `description`) VALUES
('app_name', 'Smart Learning Portal', 'Application name'),
('app_version', '1.0.0', 'Application version'),
('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
('max_upload_size', '5242880', 'Maximum upload size in bytes'),
('session_timeout', '3600', 'Session timeout in seconds'),
('email_notifications', 'true', 'Enable email notifications');

-- =========================================
-- CREATE INDEXES FOR PERFORMANCE
-- =========================================

CREATE INDEX `idx_user_email` ON `users`(`email`);
CREATE INDEX `idx_user_role` ON `users`(`role`);
CREATE INDEX `idx_assignment_course` ON `assignments`(`course_id`);
CREATE INDEX `idx_assignment_dueDate` ON `assignments`(`dueDate`);
CREATE INDEX `idx_submission_student` ON `assignment_submissions`(`student_id`);
CREATE INDEX `idx_submission_status` ON `assignment_submissions`(`status`);
CREATE INDEX `idx_attendance_date` ON `attendance`(`session_date`);
CREATE INDEX `idx_attendance_student` ON `attendance`(`student_id`);
CREATE INDEX `idx_notes_student` ON `notes`(`student_id`);
CREATE INDEX `idx_notes_course` ON `notes`(`course_id`);
CREATE INDEX `idx_quiz_course` ON `quizzes`(`course_id`);
CREATE INDEX `idx_attempt_student` ON `quiz_attempts`(`student_id`);
CREATE INDEX `idx_attempt_quiz` ON `quiz_attempts`(`quiz_id`);
CREATE INDEX `idx_progress_student` ON `progress`(`student_id`);
CREATE INDEX `idx_enrollment_student` ON `course_enrollment`(`student_id`);
CREATE INDEX `idx_enrollment_course` ON `course_enrollment`(`course_id`);

-- =========================================
-- DATABASE SETUP COMPLETE
-- =========================================
