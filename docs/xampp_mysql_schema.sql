
-- The Grid: AI-Powered Crisis Management Platform
-- Database Schema & Initial Data for XAMPP/MySQL

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- 1. Table structure for `zones`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `zones` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `zones` (`id`, `name`) VALUES
('zone1', 'North Zone'),
('zone2', 'South Zone'),
('zone3', 'East Zone'),
('zone4', 'West Zone');

-- --------------------------------------------------------
-- 2. Table structure for `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('citizen','admin') DEFAULT 'citizen',
  `zoneId` varchar(50) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `bloodGroup` varchar(5) DEFAULT NULL,
  `emergencyContactName` varchar(100) DEFAULT NULL,
  `emergencyContactNumber` varchar(20) DEFAULT NULL,
  `medicalConditions` text DEFAULT NULL,
  `isVolunteer` boolean DEFAULT FALSE,
  `skills` text DEFAULT NULL, -- Comma separated
  `certifications` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  FOREIGN KEY (`zoneId`) REFERENCES `zones`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `name`, `email`, `role`, `zoneId`, `mobile`, `address`, `pincode`, `bloodGroup`, `emergencyContactName`, `emergencyContactNumber`, `isVolunteer`, `skills`) VALUES
('admin1', 'Kunj Patel', 'kunjp1157@gmail.com', 'admin', 'zone1', '+91-9876543210', 'Admin HQ, Sector 1', '110001', 'O+', 'Emergency Desk', '100', FALSE, NULL),
('user1', 'John Doe', 'citizen@example.com', 'citizen', NULL, '+91-8888888888', '123 Main St, Apartment 4B', '110022', 'A+', 'Jane Doe', '+91-9999999999', TRUE, 'First Aid, Driving');

-- --------------------------------------------------------
-- 3. Table structure for `reports`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reports` (
  `id` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lng` decimal(11,8) NOT NULL,
  `status` enum('New','Assigned','In Progress','Resolved','Overdue') DEFAULT 'New',
  `priority` enum('Low','Medium','High','Critical') DEFAULT 'Medium',
  `timestamp` timestamp DEFAULT CURRENT_TIMESTAMP,
  `mediaUrl` varchar(255) DEFAULT NULL,
  `assignedAdminId` varchar(50) DEFAULT NULL,
  `resolutionDeadline` timestamp NULL DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`),
  FOREIGN KEY (`assignedAdminId`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `reports` (`id`, `userId`, `type`, `description`, `lat`, `lng`, `status`, `priority`, `timestamp`, `assignedAdminId`, `resolutionDeadline`) VALUES
('report-1740000000', 'user1', 'Waterlogging', 'Heavy flooding near Central Metro Station. Roads are impassable.', 28.6139, 77.2090, 'New', 'High', CURRENT_TIMESTAMP, 'admin1', DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 HOUR)),
('report-1740000001', 'user1', 'Road Damage', 'A large sinkhole has opened up on the main crossing.', 28.6145, 77.2100, 'Assigned', 'Critical', CURRENT_TIMESTAMP, 'admin1', DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 HOUR)),
('report-1740000002', 'user1', 'Power Outage', 'Entire neighborhood is without power for 4 hours.', 28.6150, 77.2110, 'Resolved', 'Medium', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY), 'admin1', NULL);

-- --------------------------------------------------------
-- 4. Table structure for `report_messages`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `report_messages` (
  `id` varchar(50) NOT NULL,
  `reportId` varchar(50) NOT NULL,
  `senderId` varchar(50) NOT NULL,
  `text` text NOT NULL,
  `timestamp` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`senderId`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `report_messages` (`id`, `reportId`, `senderId`, `text`) VALUES
('msg1', 'report-1740000000', 'admin1', 'We have received your report. A rescue team is on its way.'),
('msg2', 'report-1740000000', 'user1', 'Thank you. Please hurry, the water is entering ground floor houses.');

-- --------------------------------------------------------
-- 5. Table structure for `community_resources`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `community_resources` (
  `id` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lng` decimal(11,8) NOT NULL,
  `timestamp` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `community_resources` (`id`, `userId`, `type`, `description`, `lat`, `lng`) VALUES
('res1', 'user1', 'Clean Water', 'Have 10 extra cases of mineral water available for those in need.', 28.6130, 77.2085),
('res2', 'user1', 'Safe Shelter', 'Can provide temporary stay for up to 4 people.', 28.6135, 77.2095);

-- --------------------------------------------------------
-- 6. Table structure for `volunteer_tasks`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `volunteer_tasks` (
  `id` varchar(50) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `requiredSkills` text DEFAULT NULL,
  `volunteersNeeded` int DEFAULT 1,
  `status` enum('Open','In Progress','Completed') DEFAULT 'Open',
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `volunteer_tasks` (`id`, `title`, `description`, `location`, `requiredSkills`, `volunteersNeeded`, `status`) VALUES
('task1', 'Sandbagging at Riverbank', 'Help required to place sandbags to prevent overflow.', 'Riverfront North', 'Physical Strength', 10, 'Open'),
('task2', 'Food Distribution', 'Pack and distribute dry rations at the relief camp.', 'Community Center', 'None', 5, 'In Progress');

-- --------------------------------------------------------
-- 7. Table structure for `volunteer_assignments`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `volunteer_assignments` (
  `taskId` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  PRIMARY KEY (`taskId`,`userId`),
  FOREIGN KEY (`taskId`) REFERENCES `volunteer_tasks`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `volunteer_assignments` (`taskId`, `userId`) VALUES
('task2', 'user1');

-- --------------------------------------------------------
-- 8. Table structure for `barter_posts`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `barter_posts` (
  `id` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `have` text NOT NULL,
  `need` text NOT NULL,
  `timestamp` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `barter_posts` (`id`, `userId`, `have`, `need`) VALUES
('barter1', 'user1', '2 Fully charged Power Banks', 'Pack of Baby Diapers (Large)'),
('barter2', 'user1', 'Canned Food (Beans, Tuna)', 'Emergency Flashlight/Batteries');

COMMIT;
