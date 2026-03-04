
-- The Grid: MySQL Schema for XAMPP
-- Database: the_grid_db

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('citizen','admin') NOT NULL DEFAULT 'citizen',
  `zoneId` varchar(50) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `bloodGroup` varchar(5) DEFAULT NULL,
  `emergencyContactName` varchar(100) DEFAULT NULL,
  `emergencyContactNumber` varchar(20) DEFAULT NULL,
  `medicalConditions` text DEFAULT NULL,
  `isVolunteer` boolean DEFAULT FALSE,
  `skills` text DEFAULT NULL, -- Comma separated skills
  `certifications` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Zones Table
CREATE TABLE IF NOT EXISTS `zones` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Reports Table
CREATE TABLE IF NOT EXISTS `reports` (
  `id` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lng` decimal(11,8) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'New',
  `priority` varchar(20) NOT NULL DEFAULT 'Medium',
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mediaUrl` varchar(255) DEFAULT NULL,
  `assignedAdminId` varchar(50) DEFAULT NULL,
  `resolutionDeadline` datetime DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Report Messages (Chat)
CREATE TABLE IF NOT EXISTS `report_messages` (
  `id` varchar(50) NOT NULL,
  `reportId` varchar(50) NOT NULL,
  `senderId` varchar(50) NOT NULL,
  `text` text NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Community Resources
CREATE TABLE IF NOT EXISTS `community_resources` (
  `id` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lng` decimal(11,8) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Volunteer Tasks
CREATE TABLE IF NOT EXISTS `volunteer_tasks` (
  `id` varchar(50) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `requiredSkills` text DEFAULT NULL, -- Comma separated
  `volunteersNeeded` int NOT NULL DEFAULT 1,
  `status` varchar(20) NOT NULL DEFAULT 'Open',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Volunteer Assignments
CREATE TABLE IF NOT EXISTS `volunteer_assignments` (
  `taskId` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `assignedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`taskId`, `userId`),
  FOREIGN KEY (`taskId`) REFERENCES `volunteer_tasks`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Barter Posts
CREATE TABLE IF NOT EXISTS `barter_posts` (
  `id` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `have` text NOT NULL,
  `need` text NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INITIAL SAMPLE DATA --

INSERT IGNORE INTO `users` (`id`, `name`, `email`, `role`, `mobile`, `address`, `pincode`, `isVolunteer`, `skills`) VALUES
('admin-1', 'Kunj Patel', 'kunjp1157@gmail.com', 'admin', '9876543210', 'Admin HQ, City Center', '380001', FALSE, NULL),
('citizen-1', 'John Doe', 'citizen@example.com', 'citizen', '9988776655', 'Apartment 402, Green Valley', '380015', TRUE, 'First Aid, Driving');

INSERT IGNORE INTO `zones` (`id`, `name`) VALUES
('zone-1', 'North District'),
('zone-2', 'South District'),
('zone-3', 'East Riverside'),
('zone-4', 'West Industrial');

INSERT IGNORE INTO `reports` (`id`, `userId`, `type`, `description`, `lat`, `lng`, `status`, `priority`, `timestamp`) VALUES
('rep-101', 'citizen-1', 'Waterlogging', 'Heavy flooding near the metro station. Cars are stranded.', 23.0225, 72.5714, 'New', 'High', NOW()),
('rep-102', 'citizen-1', 'Road Damage', 'Huge pothole on the main highway causing traffic jams.', 23.0338, 72.5850, 'InProgress', 'Medium', DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT IGNORE INTO `volunteer_tasks` (`id`, `title`, `description`, `location`, `requiredSkills`, `volunteersNeeded`, `status`) VALUES
('task-201', 'Flood Relief Distribution', 'Helping distribute water and food packets to affected families.', 'Riverside Community Center', 'Communication', 10, 'Open'),
('task-202', 'First Aid Station Assistance', 'Need volunteers with basic medical knowledge.', 'Metro Station Exit 2', 'First Aid', 5, 'InProgress');

INSERT IGNORE INTO `community_resources` (`id`, `userId`, `type`, `description`, `lat`, `lng`) VALUES
('res-301', 'citizen-1', 'Clean Water', 'Have 10 extra cases of mineral water available for pickup.', 23.0225, 72.5714),
('res-302', 'citizen-1', 'First Aid Kit', 'Emergency medical kit with trauma bandages.', 23.0225, 72.5714);

INSERT IGNORE INTO `barter_posts` (`id`, `userId`, `have`, `need`) VALUES
('bart-401', 'citizen-1', 'Power bank (20000mAh)', 'Dry baby food or formula'),
('bart-402', 'citizen-1', 'Pack of 5 blankets', 'Portable gas stove');

COMMIT;
