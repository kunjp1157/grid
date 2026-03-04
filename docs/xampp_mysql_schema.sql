-- THE GRID: MySQL Database Schema for XAMPP
-- Import this file into phpMyAdmin (the_grid_db)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
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
  `skills` text DEFAULT NULL,
  `certifications` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `zones`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `zones` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `reports`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reports` (
  `id` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lng` decimal(11,8) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'New',
  `priority` varchar(20) NOT NULL DEFAULT 'Medium',
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `mediaUrl` varchar(255) DEFAULT NULL,
  `assignedAdminId` varchar(50) DEFAULT NULL,
  `resolutionDeadline` datetime DEFAULT NULL,
  `rating` int(1) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `report_messages`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `report_messages` (
  `id` varchar(50) NOT NULL,
  `reportId` varchar(50) NOT NULL,
  `senderId` varchar(50) NOT NULL,
  `text` text NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `community_resources`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `community_resources` (
  `id` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lng` decimal(11,8) NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `volunteer_tasks`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `volunteer_tasks` (
  `id` varchar(50) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `requiredSkills` text DEFAULT NULL,
  `volunteersNeeded` int(11) NOT NULL DEFAULT 1,
  `status` varchar(20) NOT NULL DEFAULT 'Open',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `volunteer_assignments`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `volunteer_assignments` (
  `taskId` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  PRIMARY KEY (`taskId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `barter_posts`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `barter_posts` (
  `id` varchar(50) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `have` text NOT NULL,
  `need` text NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- INITIAL SAMPLE DATA
-- --------------------------------------------------------

-- Default Admin User
INSERT INTO `users` (`id`, `name`, `email`, `role`, `mobile`, `isVolunteer`) VALUES
('admin-1', 'Kunj Patel', 'kunjp1157@gmail.com', 'admin', '+91-9876543210', FALSE),
('citizen-1', 'John Doe', 'citizen@example.com', 'citizen', '+91-8888888888', TRUE);

-- Initial Zones
INSERT INTO `zones` (`id`, `name`) VALUES
('zone-1', 'North District'),
('zone-2', 'South District'),
('zone-3', 'East District'),
('zone-4', 'West District');

-- Sample Reports
INSERT INTO `reports` (`id`, `userId`, `type`, `description`, `lat`, `lng`, `status`, `priority`, `assignedAdminId`) VALUES
('report-101', 'citizen-1', 'Waterlogging', 'Heavy flooding near main square block A.', 28.6139, 77.2090, 'New', 'High', 'admin-1'),
('report-102', 'citizen-1', 'Fire', 'Dumpster fire reported behind Sector 4 market.', 28.6145, 77.2100, 'In Progress', 'Critical', 'admin-1');

-- Sample Resources
INSERT INTO `community_resources` (`id`, `userId`, `type`, `description`, `lat`, `lng`) VALUES
('res-1', 'citizen-1', 'Clean Water', 'Extra 20L water cans available for pickup.', 28.6130, 77.2085),
('res-2', 'admin-1', 'First Aid Kit', 'Emergency medical kits available at the district office.', 28.6200, 77.2200);

-- Sample Tasks
INSERT INTO `volunteer_tasks` (`id`, `title`, `description`, `location`, `volunteersNeeded`, `status`) VALUES
('task-1', 'Sandbagging', 'Need help placing sandbags near the river bank.', 'Riverfront Park', 10, 'Open'),
('task-2', 'Food Distribution', 'Help distribute rations at the community center.', 'Central Shelter', 5, 'InProgress');

-- Sample Barter
INSERT INTO `barter_posts` (`id`, `userId`, `have`, `need`) VALUES
('barter-1', 'citizen-1', 'Extra blankets and power banks.', 'Drinking water and candles.');

COMMIT;
