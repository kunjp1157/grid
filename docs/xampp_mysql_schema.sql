
-- Create Database
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
    skills TEXT,
    certifications TEXT
);

-- 2. Zones Table
CREATE TABLE IF NOT EXISTS zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 3. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50),
    type VARCHAR(50),
    description TEXT,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    status VARCHAR(20),
    priority VARCHAR(20),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    mediaUrl TEXT,
    assignedAdminId VARCHAR(50),
    resolutionDeadline DATETIME,
    rating INT,
    feedback TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- 4. Report Messages (Chat)
CREATE TABLE IF NOT EXISTS report_messages (
    id VARCHAR(50) PRIMARY KEY,
    reportId VARCHAR(50),
    senderId VARCHAR(50),
    text TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reportId) REFERENCES reports(id),
    FOREIGN KEY (senderId) REFERENCES users(id)
);

-- 5. Community Resources
CREATE TABLE IF NOT EXISTS community_resources (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50),
    type VARCHAR(50),
    description TEXT,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- 6. Volunteer Tasks
CREATE TABLE IF NOT EXISTS volunteer_tasks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    location VARCHAR(200),
    requiredSkills TEXT,
    volunteersNeeded INT,
    status VARCHAR(20),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Volunteer Assignments
CREATE TABLE IF NOT EXISTS volunteer_assignments (
    taskId VARCHAR(50),
    userId VARCHAR(50),
    assignedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (taskId, userId),
    FOREIGN KEY (taskId) REFERENCES volunteer_tasks(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- 8. Barter Posts
CREATE TABLE IF NOT EXISTS barter_posts (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50),
    have TEXT,
    need TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Insert Initial Admin (Password is 'password' in simulation)
INSERT IGNORE INTO users (id, name, email, role, isVolunteer) 
VALUES ('admin-1', 'Kunj Patel', 'kunjp1157@gmail.com', 'admin', FALSE);

-- Insert Initial Zones
INSERT IGNORE INTO zones (id, name) VALUES ('zone1', 'North Zone'), ('zone2', 'South Zone');
