
-- SQL Schema for The Grid Crisis Management System
-- Use this to import into XAMPP/MySQL (phpMyAdmin)

CREATE DATABASE IF NOT EXISTS the_grid_db;
USE the_grid_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('citizen', 'admin') NOT NULL DEFAULT 'citizen',
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    status VARCHAR(20) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    timestamp DATETIME NOT NULL,
    mediaUrl TEXT,
    assignedAdminId VARCHAR(50),
    resolutionDeadline DATETIME,
    rating INT,
    feedback TEXT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Zones Table
CREATE TABLE IF NOT EXISTS zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 4. Report Messages (Chat)
CREATE TABLE IF NOT EXISTS report_messages (
    id VARCHAR(50) PRIMARY KEY,
    reportId VARCHAR(50) NOT NULL,
    senderId VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reportId) REFERENCES reports(id) ON DELETE CASCADE
);

-- 5. Community Resources
CREATE TABLE IF NOT EXISTS community_resources (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Volunteer Tasks
CREATE TABLE IF NOT EXISTS volunteer_tasks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requiredSkills TEXT,
    status VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    volunteersNeeded INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Barter Posts
CREATE TABLE IF NOT EXISTS barter_posts (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    have TEXT NOT NULL,
    need TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert Default Admin (Password is handled by application logic login check)
INSERT IGNORE INTO users (id, name, email, role, isVolunteer) 
VALUES ('admin1', 'Kunj Patel', 'kunjp1157@gmail.com', 'admin', false);

-- Insert Default Zones
INSERT IGNORE INTO zones (id, name) VALUES ('zone1', 'North Zone'), ('zone2', 'South Zone'), ('zone3', 'East Zone'), ('zone4', 'West Zone');
