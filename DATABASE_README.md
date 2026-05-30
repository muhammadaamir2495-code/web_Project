# Smart Learning Portal - Database Setup Guide

## Overview

This is a comprehensive MySQL database schema for the Smart Learning Portal project. The database includes tables for user management, assignments, quizzes, attendance tracking, notes, progress monitoring, and more.

## Database Name
```
project_database
```

## Installation Steps

### 1. Create Database

Copy and paste the SQL code from `database/project_database.sql` into **phpMyAdmin**:

1. Open `http://localhost/phpmyadmin`
2. Click on the **SQL** tab
3. Paste the entire content of `project_database.sql`
4. Click **Go** to execute

Or use command line:
```bash
mysql -u root -p < database/project_database.sql
```

### 2. Configure Database Connection

Edit `db_config.php` with your database credentials:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'project_database');
```

## Database Tables

### 1. **users** - User Management
Stores all user information (students, teachers, admins)

```sql
Columns:
- id: Primary key
- fullName: User full name
- username: Unique username
- email: Unique email
- phone: Contact number
- password: Hashed password
- role: student/admin/teacher
- status: active/inactive/suspended
- registeredAt: Registration timestamp
- lastLogin: Last login timestamp
```

Sample Login:
- Email: admin@gmail.com | Password: admin123
- Email: student@gmail.com | Password: student123

### 2. **courses** - Course Management
Stores course information

```sql
Columns:
- id: Primary key
- courseName: Course name
- courseCode: Unique course code
- description: Course description
- instructor_id: Foreign key to users
- totalSessions: Number of sessions
- status: active/inactive/completed
```

### 3. **assignments** - Assignments
Stores assignment details

```sql
Columns:
- id: Primary key
- title: Assignment title
- description: Assignment description
- course_id: Foreign key to courses
- assignedBy: Teacher ID
- dueDate: Due date
- maxScore: Maximum score
- status: active/closed/graded
```

### 4. **assignment_submissions** - Student Submissions
Stores student assignment submissions

```sql
Columns:
- id: Primary key
- assignment_id: Foreign key to assignments
- student_id: Foreign key to users
- submissionFile: File path
- submissionText: Submission content
- score: Score obtained
- status: pending/submitted/graded
```

### 5. **attendance** - Attendance Tracking
Stores attendance records

```sql
Columns:
- id: Primary key
- course_id: Foreign key to courses
- student_id: Foreign key to users
- session_date: Date of session
- status: present/absent/late/excused
- markedBy: Teacher ID
```

### 6. **notes** - Student Notes
Stores student notes

```sql
Columns:
- id: Primary key
- title: Note title
- category: Note category
- content: Note content
- course_id: Foreign key to courses
- student_id: Foreign key to users
- color: Note color
- isPinned: Boolean for pinned status
```

### 7. **quizzes** - Quiz Management
Stores quiz details

```sql
Columns:
- id: Primary key
- title: Quiz title
- course_id: Foreign key to courses
- createdBy: Teacher ID
- totalQuestions: Number of questions
- timeLimit: Time limit in minutes
- totalMarks: Total marks
- passingMarks: Passing marks
- status: draft/published/closed
```

### 8. **quiz_questions** - Quiz Questions
Stores individual quiz questions

```sql
Columns:
- id: Primary key
- quiz_id: Foreign key to quizzes
- questionNumber: Question number
- questionText: Question text
- questionType: multiple-choice/true-false/short-answer
- marks: Marks for this question
```

### 9. **quiz_options** - Quiz Answer Options
Stores answer options for multiple choice questions

```sql
Columns:
- id: Primary key
- question_id: Foreign key to quiz_questions
- optionText: Option text
- isCorrect: Boolean for correct answer
```

### 10. **quiz_attempts** - Quiz Attempts
Stores student quiz attempts

```sql
Columns:
- id: Primary key
- quiz_id: Foreign key to quizzes
- student_id: Foreign key to users
- marksObtained: Marks obtained
- percentage: Percentage score
- status: passed/failed/in-progress
- startTime: Start time
- endTime: End time
```

### 11. **quiz_answers** - Quiz Answers
Stores individual student answers

```sql
Columns:
- id: Primary key
- attempt_id: Foreign key to quiz_attempts
- question_id: Foreign key to quiz_questions
- selectedOption_id: Selected option
- studentAnswer: Text answer
- isCorrect: Boolean for correctness
```

### 12. **progress** - Student Progress
Stores overall student progress

```sql
Columns:
- id: Primary key
- student_id: Foreign key to users
- course_id: Foreign key to courses
- assignmentScore: Average assignment score
- quizScore: Average quiz score
- attendancePercentage: Attendance %
- overallScore: Overall score
- grade: Grade letter
```

### 13. **contacts** - Contact Messages
Stores contact form submissions

```sql
Columns:
- id: Primary key
- name: Sender name
- email: Sender email
- subject: Message subject
- message: Message content
- status: new/read/replied/closed
- reply: Reply text
```

### 14. **course_enrollment** - Course Enrollment
Tracks student course enrollments

```sql
Columns:
- id: Primary key
- student_id: Foreign key to users
- course_id: Foreign key to courses
- status: active/completed/dropped
```

### 15. **announcements** - Course Announcements
Stores course announcements

```sql
Columns:
- id: Primary key
- title: Announcement title
- content: Announcement content
- course_id: Foreign key to courses
- createdBy: Creator ID
- priority: low/medium/high
- isPinned: Boolean for pinned status
```

## API Endpoints

### Authentication (`api_auth.php`)
- `POST /api_auth.php?action=register` - User registration
- `POST /api_auth.php?action=login` - User login
- `GET /api_auth.php?action=profile&userId=1` - Get user profile
- `PUT /api_auth.php?action=update-profile` - Update profile
- `POST /api_auth.php?action=change-password` - Change password

### Assignments (`api_assignments.php`)
- `GET /api_assignments.php?action=get-course-assignments&courseId=1` - Get course assignments
- `GET /api_assignments.php?action=get-assignment&assignmentId=1` - Get single assignment
- `POST /api_assignments.php?action=create-assignment` - Create assignment
- `PUT /api_assignments.php?action=update-assignment` - Update assignment
- `DELETE /api_assignments.php?action=delete-assignment&assignmentId=1` - Delete assignment
- `POST /api_assignments.php?action=submit-assignment` - Submit assignment
- `GET /api_assignments.php?action=get-submissions&assignmentId=1` - Get submissions
- `PUT /api_assignments.php?action=grade-submission` - Grade submission

### Quiz (`api_quiz.php`)
- `GET /api_quiz.php?action=get-course-quizzes&courseId=1` - Get course quizzes
- `GET /api_quiz.php?action=get-quiz&quizId=1` - Get quiz with questions
- `POST /api_quiz.php?action=start-attempt` - Start quiz attempt
- `POST /api_quiz.php?action=submit-answer` - Submit quiz answer
- `POST /api_quiz.php?action=end-attempt` - End quiz attempt
- `GET /api_quiz.php?action=get-history&studentId=1` - Get student quiz history

### Attendance (`api_attendance.php`)
- `GET /api_attendance.php?action=get-attendance&studentId=1&courseId=1` - Get student attendance
- `POST /api_attendance.php?action=mark-attendance` - Mark attendance
- `GET /api_attendance.php?action=get-course-report&courseId=1` - Get course report
- `GET /api_attendance.php?action=get-by-date&courseId=1&sessionDate=2026-06-01` - Get attendance by date
- `POST /api_attendance.php?action=bulk-mark` - Bulk mark attendance

## Sample Data Included

- **Users**: 2 demo students, 1 teacher, 1 admin
- **Courses**: 4 sample courses (Web Development, Data Science, Database Design, UI/UX)
- **Assignments**: 4 sample assignments with different due dates
- **Notes**: 4 sample student notes
- **Quizzes**: 2 HTML and CSS quizzes with sample questions
- **Progress**: Sample progress records for students

## User Roles

### Student
- View courses and assignments
- Submit assignments
- Take quizzes
- View attendance
- Create personal notes
- Track progress

### Teacher
- Create courses and assignments
- Create quizzes
- Mark attendance
- Grade assignments
- View student progress

### Admin
- Manage all users
- Manage all courses
- View system analytics
- System settings

## Important Notes

1. **Passwords** are hashed using `PASSWORD_BCRYPT` algorithm
2. **Foreign Keys** are set with `ON DELETE CASCADE` for data integrity
3. **Indexes** are created for better query performance
4. **Timestamps** are automatically updated using `CURRENT_TIMESTAMP`
5. **UTF-8 Charset** is set for international character support

## Database Backup

To backup the database:

```bash
mysqldump -u root -p project_database > backup.sql
```

To restore:

```bash
mysql -u root -p project_database < backup.sql
```

## Security Recommendations

1. Change default passwords in sample data
2. Use environment variables for database credentials
3. Implement input validation in all APIs
4. Use prepared statements (already implemented)
5. Add CSRF protection for forms
6. Implement rate limiting for APIs
7. Use HTTPS for all communications
8. Implement proper authentication tokens

## Troubleshooting

### Connection Failed
- Check if MySQL is running
- Verify database credentials in `db_config.php`
- Ensure database exists

### Permission Denied
- Check user permissions in phpMyAdmin
- Verify MySQL user has appropriate privileges

### Foreign Key Constraint Error
- Ensure all referenced records exist
- Check data types match between tables

## Support

For issues or questions, refer to the project documentation or contact the development team.

---

**Version**: 1.0  
**Last Updated**: May 30, 2026
