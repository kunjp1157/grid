
-- The Grid: MySQL Database Schema
-- Use this to set up your local database in XAMPP (phpMyAdmin)

CREATE DATABASE IF NOT EXISTS the_grid_db;
USE the_grid_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('citizen', 'admin') DEFAULT 'citizen',
    zoneId VARCHAR(50),
    mobile VARCHAR(20),
    address TEXT,
    pincode VARCHAR(10),
    bloodGroup VARCHAR(5),
    emergencyContactName VARCHAR(100),
    emergencyContactNumber VARCHAR(20),
    medicalConditions TEXT,
    isVolunteer BOOLEAN DEFAULT FALSE,
    skills TEXT, -- Comma separated
    certifications TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Zones Table
CREATE TABLE IF NOT EXISTS zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 3. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    status ENUM('New', 'Assigned', 'In Progress', 'Resolved', 'Overdue') DEFAULT 'New',
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    timestamp DATETIME NOT NULL,
    mediaUrl TEXT,
    assignedAdminId VARCHAR(50),
    resolutionDeadline DATETIME,
    rating INT,
    feedback TEXT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Chat Messages Table
CREATE TABLE IF NOT EXISTS report_messages (
    id VARCHAR(50) PRIMARY KEY,
    reportId VARCHAR(50) NOT NULL,
    senderId VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE
);

-- 5. Community Resources Table
CREATE TABLE IF NOT EXISTS community_resources (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Volunteer Tasks Table
CREATE TABLE IF NOT EXISTS volunteer_tasks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200),
    requiredSkills TEXT,
    volunteersNeeded INT DEFAULT 1,
    status ENUM('Open', 'In Progress', 'Completed') DEFAULT 'Open',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Volunteer Assignments Table
CREATE TABLE IF NOT EXISTS volunteer_assignments (
    taskId VARCHAR(50) NOT NULL,
    userId VARCHAR(50) NOT NULL,
    assignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (taskId, userId),
    FOREIGN KEY (taskId) REFERENCES volunteer_tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Barter Posts Table
CREATE TABLE IF NOT EXISTS barter_posts (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    have TEXT NOT NULL,
    need TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Initial Admin Account (Optional)
INSERT IGNORE INTO users (id, name, email, role) 
VALUES ('admin-1', 'Kunj Patel', 'kunjp1157@gmail.com', 'admin');

-- Initial Zones
INSERT IGNORE INTO zones (id, name) VALUES 
('zone1', 'North Zone'),
('zone2', 'South Zone'),
('zone3', 'East Zone'),
('zone4', 'West Zone');
