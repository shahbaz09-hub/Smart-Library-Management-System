-- =====================================================
-- Demo Data for Smart Library Management System
-- Frontend ke saare demo data ko MySQL mein insert karna
-- =====================================================

USE library_management;

-- =====================================================
-- 1. USERS/STUDENTS - Demo users with proper passwords
-- Password: demo123 (BCrypt encoded)
-- =====================================================

-- First, clear existing demo data (optional - comment out if you want to keep existing)
-- DELETE FROM book_issues WHERE id > 0;
-- DELETE FROM fines WHERE id > 0;
-- DELETE FROM books WHERE id > 0;
-- DELETE FROM users WHERE id > 0;

-- Insert Demo Admin (password: demo123)
INSERT INTO users (name, email, password, role, status, registration_date, department)
SELECT 'Demo Admin', 'admin@demo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'ADMIN', 'ACTIVE', NOW(), 'Administration'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@demo.com');

-- Insert Demo Librarian (password: demo123)
INSERT INTO users (name, email, password, role, status, registration_date, department)
SELECT 'Dr. Sunita Agarwal', 'librarian@demo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'LIBRARIAN', 'ACTIVE', NOW(), 'Library'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'librarian@demo.com');

-- Insert Demo Student/User (password: demo123)
INSERT INTO users (name, email, password, role, status, registration_date, roll_number, department, semester)
SELECT 'Demo Student', 'user@demo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'USER', 'ACTIVE', '2021-08-15', 'CSE21001', 'CSE', 6
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user@demo.com');

-- Insert More Students (password for all: demo123)
INSERT INTO users (name, email, password, role, status, registration_date, roll_number, department, semester, total_fines)
SELECT * FROM (
    SELECT 'Aman Kumar' as name, 'aman.kumar@college.edu' as email, '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi' as password, 'USER' as role, 'ACTIVE' as status, '2021-08-15' as registration_date, 'CSE21002' as roll_number, 'CSE' as department, 6 as semester, 25.0 as total_fines
    UNION ALL SELECT 'Priya Sharma', 'priya.sharma@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'USER', 'ACTIVE', '2021-08-15', 'MECH21045', 'Mechanical', 4, 0.0
    UNION ALL SELECT 'Neha Yadav', 'neha.yadav@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'USER', 'ACTIVE', '2021-08-15', 'CIVIL21023', 'Civil', 6, 15.0
    UNION ALL SELECT 'Rakesh Verma', 'rakesh.verma@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'USER', 'ACTIVE', '2021-08-15', 'BBA21067', 'BBA', 4, 0.0
    UNION ALL SELECT 'Ananya Gupta', 'ananya.gupta@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'USER', 'ACTIVE', '2022-08-15', 'MBA22012', 'MBA', 2, 10.0
    UNION ALL SELECT 'Rohit Singh', 'rohit.singh@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'USER', 'ACTIVE', '2021-08-15', 'BCA21089', 'BCA', 6, 0.0
    UNION ALL SELECT 'Pooja Patel', 'pooja.patel@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'USER', 'ACTIVE', '2022-08-15', 'MCA22034', 'MCA', 2, 20.0
    UNION ALL SELECT 'Vikash Jha', 'vikash.jha@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'USER', 'ACTIVE', '2021-08-15', 'DIP21156', 'Diploma', 4, 5.0
    UNION ALL SELECT 'Sneha Agarwal', 'sneha.agarwal@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'USER', 'ACTIVE', '2021-08-15', 'BHMCT21078', 'BHMCT', 6, 0.0
    UNION ALL SELECT 'Rahul Mishra', 'rahul.mishra@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'USER', 'ACTIVE', '2022-08-15', 'CSE22015', 'CSE', 4, 30.0
    UNION ALL SELECT 'Kavita Chauhan', 'kavita.chauhan@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'USER', 'ACTIVE', '2023-08-15', 'MECH23010', 'Mechanical', 2, 0.0
    UNION ALL SELECT 'Deepak Tiwari', 'deepak.tiwari@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'USER', 'ACTIVE', '2021-08-15', 'CIVIL21045', 'Civil', 6, 0.0
    UNION ALL SELECT 'Anjali Pandey', 'anjali.pandey@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'USER', 'ACTIVE', '2022-08-15', 'BBA22030', 'BBA', 4, 10.0
    UNION ALL SELECT 'Suresh Yadav', 'suresh.yadav@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx6g9atWpL7.K8X0HqLPIHi', 'USER', 'ACTIVE', '2023-08-15', 'MBA23005', 'MBA', 2, 0.0
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = tmp.email);

-- =====================================================
-- 2. BOOKS - Academic Books for College Library
-- =====================================================

-- CSE Department Books
INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Data Structures and Algorithms in C++' as title,
        'Dr. Rajesh Kumar' as author,
        '978-81-203-5467-2' as isbn,
        'Comprehensive guide to data structures and algorithms with practical C++ implementations. Essential for computer science students.' as description,
        'CSE' as department,
        'Computer Science' as subject,
        2023 as publish_year,
        'Tech Publications India' as publisher,
        652 as pages,
        'English' as language,
        'https://images.unsplash.com/photo-1613253932202-686cbcd993b0?w=400' as cover_url,
        5 as total_copies,
        3 as available_copies,
        2 as issued_copies,
        0 as reserved_copies,
        4.7 as rating,
        324 as review_count,
        'AVAILABLE' as status,
        'A1' as rack_number,
        'Floor 1, Section A' as shelf_location,
        NOW() as added_date
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-5467-2');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Database Management Systems',
        'Dr. Priya Sharma',
        '978-81-203-4521-7',
        'Complete coverage of database concepts, SQL, normalization, and modern database technologies for CSE students.',
        'CSE',
        'Database',
        2023,
        'Academic Press India',
        587,
        'English',
        'https://images.unsplash.com/photo-1664854953181-b12e6dda8b7c?w=400',
        4, 1, 3, 0, 4.6, 289, 'AVAILABLE', 'A1', 'Floor 1, Section A', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-4521-7');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Programming in Java',
        'Prof. Amit Gupta',
        '978-81-203-0123-7',
        'Object-oriented programming concepts in Java with practical examples and project-based learning.',
        'CSE',
        'Programming',
        2024,
        'Computer Learning India',
        623,
        'English',
        'https://images.unsplash.com/photo-1727522974621-c64b5ea90c0b?w=400',
        4, 2, 2, 0, 4.6, 387, 'AVAILABLE', 'A2', 'Floor 1, Section A', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-0123-7');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Computer Networks',
        'Dr. Sanjay Verma',
        '978-81-203-9876-5',
        'Comprehensive study of computer networking, protocols, and network security.',
        'CSE',
        'Networking',
        2023,
        'Network Tech Publications',
        534,
        'English',
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
        3, 2, 1, 0, 4.5, 256, 'AVAILABLE', 'A2', 'Floor 1, Section A', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-9876-5');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Operating Systems Concepts',
        'Dr. Meena Agarwal',
        '978-81-203-8765-4',
        'In-depth coverage of operating system principles, process management, and memory allocation.',
        'CSE',
        'Operating Systems',
        2022,
        'OS Publications',
        612,
        'English',
        'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400',
        4, 3, 1, 0, 4.4, 298, 'AVAILABLE', 'A3', 'Floor 1, Section A', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-8765-4');

-- Mechanical Engineering Books
INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Thermodynamics for Engineers',
        'Prof. Amit Verma',
        '978-81-203-6789-3',
        'Fundamental principles of thermodynamics with practical engineering applications and problem-solving techniques.',
        'Mechanical',
        'Thermodynamics',
        2022,
        'Engineering Books India',
        534,
        'English',
        'https://images.unsplash.com/photo-1732304720116-4195b021d8d0?w=400',
        6, 4, 2, 0, 4.5, 412, 'AVAILABLE', 'B1', 'Floor 1, Section B', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-6789-3');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Fluid Mechanics and Hydraulics',
        'Dr. Suresh Patel',
        '978-81-203-4567-1',
        'Principles of fluid mechanics, pump design, and hydraulic systems for mechanical engineering students.',
        'Mechanical',
        'Fluid Mechanics',
        2023,
        'Mechanical Engineering Press',
        598,
        'English',
        'https://images.unsplash.com/photo-1727522974614-b592018e49e1?w=400',
        4, 2, 2, 0, 4.6, 342, 'AVAILABLE', 'B1', 'Floor 1, Section B', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-4567-1');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Machine Design Fundamentals',
        'Prof. Rakesh Singh',
        '978-81-203-3456-9',
        'Comprehensive guide to machine design principles, materials selection, and manufacturing processes.',
        'Mechanical',
        'Machine Design',
        2023,
        'Design Tech Publications',
        678,
        'English',
        'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400',
        3, 2, 1, 0, 4.5, 278, 'AVAILABLE', 'B2', 'Floor 1, Section B', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-3456-9');

-- Civil Engineering Books
INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Structural Analysis and Design',
        'Dr. Neha Yadav',
        '978-81-203-7890-4',
        'Advanced structural analysis methods and design principles for civil engineering students and professionals.',
        'Civil',
        'Structural Engineering',
        2024,
        'Civil Engineering Press',
        678,
        'English',
        'https://images.unsplash.com/photo-1665069181618-5618c9b621ec?w=400',
        3, 1, 2, 0, 4.8, 567, 'AVAILABLE', 'C1', 'Floor 1, Section C', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-7890-4');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Reinforced Concrete Design',
        'Prof. Anjali Mehta',
        '978-81-203-5678-2',
        'Advanced concrete design principles, structural analysis, and construction techniques for civil engineers.',
        'Civil',
        'Concrete Design',
        2024,
        'Construction Tech India',
        723,
        'English',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400',
        3, 1, 2, 0, 4.7, 289, 'AVAILABLE', 'C1', 'Floor 1, Section C', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-5678-2');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Geotechnical Engineering',
        'Dr. Ramesh Kumar',
        '978-81-203-2345-8',
        'Soil mechanics, foundation design, and earth structures for civil engineering students.',
        'Civil',
        'Geotechnical',
        2023,
        'Geo Tech Publications',
        567,
        'English',
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
        4, 3, 1, 0, 4.4, 234, 'AVAILABLE', 'C2', 'Floor 1, Section C', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-2345-8');

-- BBA/MBA Books
INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Business Management Fundamentals',
        'Prof. Rakesh Gupta',
        '978-81-203-8901-5',
        'Essential business management concepts, organizational behavior, and strategic planning for BBA students.',
        'BBA',
        'Management',
        2023,
        'Business Education India',
        456,
        'English',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        5, 3, 2, 0, 4.4, 298, 'AVAILABLE', 'D1', 'Floor 2, Section D', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-8901-5');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Financial Management',
        'Dr. Rajesh Agrawal',
        '978-81-203-6790-3',
        'Corporate finance, investment analysis, and financial planning for business administration students.',
        'BBA',
        'Finance',
        2023,
        'Business Finance Press',
        512,
        'English',
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
        4, 3, 1, 0, 4.5, 234, 'AVAILABLE', 'D1', 'Floor 2, Section D', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-6790-3');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Marketing Strategy and Consumer Behavior',
        'Dr. Sunita Agarwal',
        '978-81-203-9012-6',
        'Advanced marketing concepts, digital marketing strategies, and consumer psychology for MBA students.',
        'MBA',
        'Marketing',
        2023,
        'MBA Studies Press',
        542,
        'English',
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
        4, 2, 2, 0, 4.3, 234, 'AVAILABLE', 'D2', 'Floor 2, Section D', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-9012-6');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Strategic Management',
        'Prof. Kavita Singh',
        '978-81-203-7891-4',
        'Advanced strategic planning, competitive analysis, and business transformation for MBA students.',
        'MBA',
        'Strategy',
        2024,
        'Strategy Education India',
        634,
        'English',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        2, 1, 1, 0, 4.8, 345, 'AVAILABLE', 'D2', 'Floor 2, Section D', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-7891-4');

-- BCA/MCA Books
INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Web Development with PHP',
        'Dr. Ankit Sharma',
        '978-81-203-8902-5',
        'Server-side programming with PHP, MySQL integration, and web application development for BCA students.',
        'BCA',
        'Web Development',
        2023,
        'Web Tech Publications',
        456,
        'English',
        'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
        3, 2, 1, 0, 4.4, 198, 'AVAILABLE', 'E1', 'Floor 2, Section E', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-8902-5');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Software Engineering Principles',
        'Prof. Vikram Patel',
        '978-81-203-1234-8',
        'Advanced software engineering methodologies, project management, and system design for MCA students.',
        'MCA',
        'Software Engineering',
        2023,
        'Software Tech Publications',
        789,
        'English',
        'https://images.unsplash.com/photo-1758685733395-dba201403b4d?w=400',
        3, 1, 2, 0, 4.5, 456, 'AVAILABLE', 'E1', 'Floor 2, Section E', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-1234-8');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Python Programming',
        'Dr. Rahul Joshi',
        '978-81-203-1122-3',
        'Complete Python programming from basics to advanced topics including data science and machine learning.',
        'BCA',
        'Programming',
        2024,
        'Python Publications India',
        523,
        'English',
        'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
        5, 3, 2, 0, 4.7, 412, 'AVAILABLE', 'E2', 'Floor 2, Section E', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-1122-3');

-- BHMCT Books
INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Hotel Operations Management',
        'Dr. Meera Joshi',
        '978-81-203-2345-9',
        'Comprehensive guide to hotel and hospitality management covering operations, customer service, and industry practices.',
        'BHMCT',
        'Hotel Management',
        2023,
        'Hospitality Education Press',
        487,
        'English',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        3, 2, 1, 0, 4.4, 278, 'AVAILABLE', 'F1', 'Floor 2, Section F', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-2345-9');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Food and Beverage Management',
        'Prof. Rajan Kapoor',
        '978-81-203-3344-5',
        'Complete guide to food service operations, menu planning, and restaurant management.',
        'BHMCT',
        'Food Service',
        2022,
        'Culinary Arts Press',
        423,
        'English',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
        3, 2, 1, 0, 4.3, 198, 'AVAILABLE', 'F1', 'Floor 2, Section F', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-3344-5');

-- Diploma Books
INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Diploma Engineering Mathematics',
        'Prof. Ravi Sharma',
        '978-81-203-3456-0',
        'Fundamental mathematics concepts for diploma engineering students including calculus, algebra, and applied mathematics.',
        'Diploma',
        'Mathematics',
        2022,
        'Diploma Education Press',
        456,
        'English',
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
        5, 3, 2, 0, 4.2, 412, 'AVAILABLE', 'G1', 'Floor 3, Section G', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-3456-0');

INSERT INTO books (title, author, isbn, description, department, subject, publish_year, publisher, pages, language, cover_url, total_copies, available_copies, issued_copies, reserved_copies, rating, review_count, status, rack_number, shelf_location, added_date)
SELECT * FROM (
    SELECT 
        'Basic Electrical Engineering',
        'Dr. Sunil Kumar',
        '978-81-203-4455-6',
        'Introduction to electrical circuits, machines, and power systems for diploma students.',
        'Diploma',
        'Electrical',
        2023,
        'Electrical Tech India',
        398,
        'English',
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400',
        4, 3, 1, 0, 4.3, 287, 'AVAILABLE', 'G1', 'Floor 3, Section G', NOW()
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-81-203-4455-6');

-- =====================================================
-- 3. BOOK ISSUES - Sample issued books
-- =====================================================

-- First get user and book IDs for issues
-- These will create some active book issues

INSERT INTO book_issues (user_id, book_id, issue_date, due_date, status, renew_count, max_renewals, issued_by)
SELECT u.id, b.id, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 4 DAY), 'ISSUED', 0, 2, 'Dr. Sunita Agarwal'
FROM users u, books b 
WHERE u.email = 'user@demo.com' AND b.isbn = '978-81-203-5467-2'
AND NOT EXISTS (SELECT 1 FROM book_issues bi WHERE bi.user_id = u.id AND bi.book_id = b.id AND bi.status = 'ISSUED');

INSERT INTO book_issues (user_id, book_id, issue_date, due_date, status, renew_count, max_renewals, issued_by)
SELECT u.id, b.id, DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY), 'OVERDUE', 1, 2, 'Dr. Sunita Agarwal'
FROM users u, books b 
WHERE u.email = 'aman.kumar@college.edu' AND b.isbn = '978-81-203-4521-7'
AND NOT EXISTS (SELECT 1 FROM book_issues bi WHERE bi.user_id = u.id AND bi.book_id = b.id AND bi.status IN ('ISSUED', 'OVERDUE'));

INSERT INTO book_issues (user_id, book_id, issue_date, due_date, status, renew_count, max_renewals, issued_by)
SELECT u.id, b.id, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 9 DAY), 'ISSUED', 0, 2, 'Dr. Sunita Agarwal'
FROM users u, books b 
WHERE u.email = 'priya.sharma@college.edu' AND b.isbn = '978-81-203-6789-3'
AND NOT EXISTS (SELECT 1 FROM book_issues bi WHERE bi.user_id = u.id AND bi.book_id = b.id AND bi.status = 'ISSUED');

INSERT INTO book_issues (user_id, book_id, issue_date, due_date, status, renew_count, max_renewals, issued_by)
SELECT u.id, b.id, DATE_SUB(NOW(), INTERVAL 12 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY), 'ISSUED', 0, 2, 'Dr. Sunita Agarwal'
FROM users u, books b 
WHERE u.email = 'neha.yadav@college.edu' AND b.isbn = '978-81-203-7890-4'
AND NOT EXISTS (SELECT 1 FROM book_issues bi WHERE bi.user_id = u.id AND bi.book_id = b.id AND bi.status = 'ISSUED');

INSERT INTO book_issues (user_id, book_id, issue_date, due_date, status, renew_count, max_renewals, issued_by)
SELECT u.id, b.id, DATE_SUB(NOW(), INTERVAL 18 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), 'OVERDUE', 0, 2, 'Dr. Sunita Agarwal'
FROM users u, books b 
WHERE u.email = 'rahul.mishra@college.edu' AND b.isbn = '978-81-203-1234-8'
AND NOT EXISTS (SELECT 1 FROM book_issues bi WHERE bi.user_id = u.id AND bi.book_id = b.id AND bi.status IN ('ISSUED', 'OVERDUE'));

-- =====================================================
-- 4. FINES - Sample fines for overdue books
-- =====================================================

INSERT INTO fines (user_id, book_issue_id, amount, days_past_due, due_date, status, type, created_date)
SELECT u.id, bi.id, 30.0, 6, bi.due_date, 'PENDING', 'LATE_RETURN', NOW()
FROM users u
JOIN book_issues bi ON bi.user_id = u.id
WHERE u.email = 'aman.kumar@college.edu' AND bi.status = 'OVERDUE'
AND NOT EXISTS (SELECT 1 FROM fines f WHERE f.book_issue_id = bi.id);

INSERT INTO fines (user_id, book_issue_id, amount, days_past_due, due_date, status, type, created_date)
SELECT u.id, bi.id, 20.0, 4, bi.due_date, 'PENDING', 'LATE_RETURN', NOW()
FROM users u
JOIN book_issues bi ON bi.user_id = u.id
WHERE u.email = 'rahul.mishra@college.edu' AND bi.status = 'OVERDUE'
AND NOT EXISTS (SELECT 1 FROM fines f WHERE f.book_issue_id = bi.id);

-- Some paid fines
INSERT INTO fines (user_id, amount, days_past_due, due_date, status, type, created_date, paid_date, payment_method)
SELECT u.id, 15.0, 3, DATE_SUB(NOW(), INTERVAL 30 DAY), 'PAID', 'LATE_RETURN', DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY), 'CASH'
FROM users u
WHERE u.email = 'neha.yadav@college.edu'
AND NOT EXISTS (SELECT 1 FROM fines f WHERE f.user_id = u.id AND f.status = 'PAID' AND f.amount = 15.0);

-- =====================================================
-- 5. SUMMARY - Display counts
-- =====================================================

SELECT 'Data Import Complete!' as Status;
SELECT COUNT(*) as 'Total Users' FROM users;
SELECT COUNT(*) as 'Total Books' FROM books;
SELECT COUNT(*) as 'Total Issues' FROM book_issues;
SELECT COUNT(*) as 'Total Fines' FROM fines;

-- Show demo login credentials
SELECT '=== DEMO LOGIN CREDENTIALS ===' as Info;
SELECT 'Admin: admin@demo.com / demo123' as Credentials
UNION ALL SELECT 'Librarian: librarian@demo.com / demo123'
UNION ALL SELECT 'Student: user@demo.com / demo123'
UNION ALL SELECT 'Student 2: aman.kumar@college.edu / demo123';
