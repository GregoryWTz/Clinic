-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 30, 2025 at 03:07 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_rumahsakit`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `id_appointment` varchar(255) NOT NULL,
  `id_doctor` varchar(255) NOT NULL,
  `id_patient` varchar(255) NOT NULL,
  `queue` int(255) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `patient_note` varchar(255) DEFAULT NULL,
  `status` varchar(10) NOT NULL,
  `created_at` date NOT NULL,
  `last_updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointment`
--

INSERT INTO `appointment` (`id_appointment`, `id_doctor`, `id_patient`, `queue`, `appointment_date`, `appointment_time`, `patient_note`, `status`, `created_at`, `last_updated_at`) VALUES
('AP001', 'DOC002', 'P001', 1, '0001-11-11', '13:00:00', 'Ingin melakukan check up mata', 'SCHEDULE', '2025-09-25', '2025-09-25'),
('AP005', 'DOC002', 'P001', 2, '0001-11-11', '13:00:00', 'Perut tidak enak dan mual', 'FINISHED', '2025-09-25', '2025-09-25'),
('AP008', 'DOC004', 'P001', 2, '0001-11-11', '16:00:00', 'Muntah-muntah', 'SCHEDULE', '2025-09-27', '2025-09-27'),
('AP009', 'DOC004', 'P001', 3, '0001-11-11', '16:00:00', '-', 'FINISHED', '2025-09-27', '2025-09-27');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id_category` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` date NOT NULL,
  `last_updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id_category`, `name`, `created_at`, `last_updated_at`) VALUES
('CAT002', 'Neurology', '2025-09-24', '2025-09-24'),
('CAT003', 'Pediatrics', '2025-09-24', '2025-09-24'),
('CAT004', 'Orthopedics', '2025-09-24', '2025-09-24'),
('CAT005', 'General Medicine', '2025-09-24', '2025-09-24');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id_doctor` varchar(255) NOT NULL,
  `id_category` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` date NOT NULL,
  `last_updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id_doctor`, `id_category`, `name`, `gender`, `phone`, `email`, `photo`, `created_at`, `last_updated_at`) VALUES
('DOC002', 'CAT002', 'Dr. Budi Santoso', 'Male', '081234567891', 'budi.santoso@example.com', '', '2025-09-24', '2025-09-24'),
('DOC003', 'CAT003', 'Dr. Clara Sari', 'Female', '081234567892', 'clara.sari@example.com', '', '2025-09-24', '2025-09-24'),
('DOC004', 'CAT004', 'Dr. Dimas Putra', 'Male', '081234567893', 'dimas.putra@example.com', '', '2025-09-24', '2025-09-24'),
('DOC005', 'CAT005', 'Dr. Elisa Anggraini', 'Female', '081234567894', 'elisa.anggraini@example.com', '', '2025-09-24', '2025-09-24');

-- --------------------------------------------------------

--
-- Table structure for table `medical_record`
--

CREATE TABLE `medical_record` (
  `id_record` varchar(255) NOT NULL,
  `id_appointment` varchar(255) NOT NULL,
  `id_patient` varchar(255) NOT NULL,
  `diagnosis` varchar(255) NOT NULL,
  `prescription` varchar(255) NOT NULL,
  `doctor_note` varchar(255) DEFAULT NULL,
  `created_at` date NOT NULL,
  `last_updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medical_record`
--

INSERT INTO `medical_record` (`id_record`, `id_appointment`, `id_patient`, `diagnosis`, `prescription`, `doctor_note`, `created_at`, `last_updated_at`) VALUES
('MR001', 'AP001', 'P001', 'Gangguan mata ringan', 'Tetes mata', 'Perlu pemeriksaan lanjutan', '2025-09-27', '2025-09-27'),
('MR002', 'AP005', 'P001', 'Gangguan pencernaan', 'Obat maag dan anti mual', 'Istirahat dan perhatikan pola makan', '2025-09-27', '2025-09-27'),
('MR004', 'AP008', 'P001', 'Muntah-muntah', 'Oralit dan antiemetik', 'Hidrasi cukup dan pantau kondisi', '2025-09-27', '2025-09-27'),
('MR005', 'AP009', 'P001', 'Mual ringan', 'Obat mual', 'Perhatikan pola makan', '2025-09-27', '2025-09-27');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id_patient` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `city_of_birth` varchar(50) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `blood_type` varchar(3) DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  `last_updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id_patient`, `first_name`, `last_name`, `phone_number`, `email`, `city_of_birth`, `date_of_birth`, `address`, `gender`, `blood_type`, `created_at`, `last_updated_at`) VALUES
('P001', 'Alice', 'Johnson', '081234567890', 'alice.johnson@example.com', 'Jakarta', '1990-05-15', 'Jl. Merdeka No.10, Jakarta', 'Female', 'A', '2025-09-25', '2025-09-25'),
('P002', 'Bob', 'Smith', '082345678901', 'bob.smith@example.com', 'Bandung', '1985-11-23', 'Jl. Sudirman No.25, Bandung', 'Male', 'O', '2025-09-25', '2025-09-25'),
('P003', 'Cindy', 'Lee', '083456789012', 'cindy.lee@example.com', 'Surabaya', '1992-07-08', 'Jl. Diponegoro No.5, Surabaya', 'Female', 'B', '2025-09-25', '2025-09-25'),
('P004', 'David', 'Tan', '084567890123', 'david.tan@example.com', 'Medan', '1988-03-30', 'Jl. Gatot Subroto No.12, Medan', 'Male', 'AB', '2025-09-25', '2025-09-25'),
('P005', 'Eva', 'Maria', '085678901234', 'eva.maria@example.com', 'Yogyakarta', '1995-12-17', 'Jl. Malioboro No.20, Yogyakarta', 'Female', 'O', '2025-09-25', '2025-09-25');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`id_appointment`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id_category`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id_doctor`),
  ADD KEY `doctor_category` (`id_category`);

--
-- Indexes for table `medical_record`
--
ALTER TABLE `medical_record`
  ADD PRIMARY KEY (`id_record`),
  ADD KEY `record_appointment` (`id_appointment`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id_patient`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctor_category` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id_category`);

--
-- Constraints for table `medical_record`
--
ALTER TABLE `medical_record`
  ADD CONSTRAINT `record_appointment` FOREIGN KEY (`id_appointment`) REFERENCES `appointment` (`id_appointment`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
