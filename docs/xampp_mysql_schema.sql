
-- The Grid: AI-Powered Crisis Management Platform
-- MySQL Database Schema for XAMPP / Local MySQL Setup

CREATE DATABASE IF NOT EXISTS the_grid_db;
USE the_grid_db;

-- 1. Table for Operational Zones
CREATE TABLE IF NOT EXISTS zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 2. Table for User Profiles
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('citizen', 'admin') DEFAULT 'citizen',
    zone_id VARCHAR(50),
    mobile VARCHAR(20),
    address TEXT,
    pincode VARCHAR(10),
    blood_group VARCHAR(5),
    emergency_contact_name VARCHAR(100),
    emergency_contact_number VARCHAR(20),
    medical_conditions TEXT,
    is_volunteer BOOLEAN DEFAULT FALSE,
    skills TEXT, -- Stored as comma-separated values
    certifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (zone_id) REFERENCES zones(id)
);

-- 3. Table for Crisis Reports
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    status ENUM('New', 'Assigned', 'In Progress', 'Resolved', 'Overdue') DEFAULT 'New',
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    media_url VARCHAR(255),
    assigned_admin_id VARCHAR(50),
    resolution_deadline DATETIME,
    rating INT,
    feedback TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (assigned_admin_id) REFERENCES users(id)
);

-- 4. Table for Chat Messages (Linked to Reports)
CREATE TABLE IF NOT EXISTS report_messages (
    id VARCHAR(50) PRIMARY KEY,
    report_id VARCHAR(50),
    sender_id VARCHAR(50),
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- 5. Table for Community Resources
CREATE TABLE IF NOT EXISTS community_resources (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 6. Table for Volunteer Tasks
CREATE TABLE IF NOT EXISTS volunteer_tasks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    required_skills TEXT,
    location VARCHAR(255),
    volunteers_needed INT DEFAULT 1,
    status ENUM('Open', 'In Progress', 'Completed') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Table for Volunteer Task Assignments (Linking Users to Tasks)
CREATE TABLE IF NOT EXISTS volunteer_assignments (
    task_id VARCHAR(50),
    user_id VARCHAR(50),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id, user_id),
    FOREIGN KEY (task_id) REFERENCES volunteer_tasks(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 8. Table for Barter/Exchange Posts
CREATE TABLE IF NOT EXISTS barter_posts (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    have_items TEXT NOT NULL,
    need_items TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Initial Mock Data for Zones
INSERT INTO zones (id, name) VALUES ('zone1', 'North Zone'), ('zone2', 'South Zone'), ('zone3', 'East Zone'), ('zone4', 'West Zone');
