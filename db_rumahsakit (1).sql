-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 02, 2025 at 03:30 AM
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
('AP001', 'DC001', 'PS001', 1, '2025-10-01', '09:00:00', 'pusing mingrain', 'SCHEDULE', '2025-10-01', '2025-10-01'),
('AP005', 'DC003', 'PS001', 1, '0001-11-11', '16:00:00', 'Sakit kepala', 'FINISHED', '2025-10-01', '2025-10-01'),
('AP006', 'DC003', 'PS001', 2, '0001-11-11', '16:00:00', 'pusing mingrain', 'SCHEDULE', '2025-10-01', '2025-10-01'),
('AP007', 'DC003', 'PS001', 3, '0001-11-11', '16:00:00', '-', 'SCHEDULE', '2025-10-01', '2025-10-01'),
('AP008', 'DC003', 'PS001', 4, '0001-11-11', '16:00:00', '-', 'SCHEDULE', '2025-10-01', '2025-10-01'),
('AP009', 'DC003', 'PS001', 5, '0001-11-11', '16:00:00', '-', 'SCHEDULE', '2025-10-01', '2025-10-01'),
('AP010', 'DC003', 'PS001', 6, '0001-11-11', '16:00:00', '-', 'SCHEDULE', '2025-10-01', '2025-10-01'),
('AP011', 'DC003', 'PS001', 7, '0001-11-11', '16:00:00', '-', 'SCHEDULE', '2025-10-01', '2025-10-01'),
('AP012', 'DC003', 'PS001', 8, '0001-11-11', '16:00:00', '-', 'SCHEDULE', '2025-10-01', '2025-10-01'),
('AP013', 'DC003', 'PS001', 9, '0001-11-11', '16:00:00', '-', 'SCHEDULE', '2025-10-01', '2025-10-01'),
('AP014', 'DC003', 'PS001', 10, '0001-11-11', '16:00:00', '-', 'SCHEDULE', '2025-10-01', '2025-10-01');

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
('CT001', 'Cardiology', '2025-10-01', '2025-10-01'),
('CT002', 'Dermatology', '2025-10-01', '2025-10-01'),
('CT003', 'Neurology', '2025-10-01', '2025-10-01'),
('CT004', 'Pediatrics', '2025-10-01', '2025-10-01'),
('CT005', 'Orthopedics', '2025-10-01', '2025-10-01'),
('CT006', 'Ophthalmology', '2025-10-01', '2025-10-01'),
('CT007', 'ENT', '2025-10-01', '2025-10-01'),
('CT008', 'Psychiatry', '2025-10-01', '2025-10-01'),
('CT009', 'Gastroenterology', '2025-10-01', '2025-10-01'),
('CT010', 'Endocrinology', '2025-10-01', '2025-10-01');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id_doctor` varchar(255) NOT NULL,
  `id_user` varchar(255) NOT NULL,
  `id_category` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `degree` varchar(255) NOT NULL,
  `experience` varchar(255) NOT NULL,
  `created_at` date NOT NULL,
  `last_updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id_doctor`, `id_user`, `id_category`, `first_name`, `last_name`, `gender`, `degree`, `experience`, `created_at`, `last_updated_at`) VALUES
('DC001', 'US002', 'CT002', 'Susan', 'Smith', 'Female', 'Sarjana Kedokteran Spesialis Kulit dan Kelamin', '-', '2025-10-01', '2025-10-01'),
('DC003', 'US003', 'CT003', 'Michael', 'Brown', 'Male', 'Sarjana Kedokteran Spesialis Saraf', '-', '2025-10-01', '2025-10-01'),
('DC004', 'US004', 'CT004', 'Anna', 'Davis', 'Female', 'Sarjana Kedokteran Spesialis Anak', '-', '2025-10-01', '2025-10-01');

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
('RC001', 'AP005', 'PS001', 'Sakit kepala', 'Paracetamol 500mg, diminum 3x sehari setelah makan', 'Pasien disarankan istirahat cukup dan minum banyak air.', '2025-10-01', '2025-10-01');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id_patient` varchar(255) NOT NULL,
  `id_user` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `city_of_birth` varchar(50) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `blood_type` varchar(3) DEFAULT NULL,
  `condition` varchar(255) NOT NULL,
  `created_at` date DEFAULT NULL,
  `last_updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id_patient`, `id_user`, `first_name`, `last_name`, `city_of_birth`, `date_of_birth`, `address`, `gender`, `blood_type`, `condition`, `created_at`, `last_updated_at`) VALUES
('PS001', 'US001', 'Vieny', 'Evelyn', 'Pontianak', '2006-05-29', 'Jl. Sei Raya Dalam komp. Villa Kelapa Gading Permai no. A3', 'Female', 'O-', 'maag', '2025-09-30', '2025-09-30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','doctor','patient','pharmacist') NOT NULL,
  `created_at` date NOT NULL,
  `last_updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `username`, `email`, `phone`, `password`, `role`, `created_at`, `last_updated_at`) VALUES
('US001', 'evelynv423', 'vieny.evelyn@student.umn.ac.id', '123-456-7890', '123', 'patient', '2025-09-30', '2025-09-30'),
('US002', 'dr_susan', 'susan@example.com', '081234567891', 'password456', 'doctor', '2025-10-01', '2025-10-01'),
('US003', 'dr_michael', 'michael@example.com', '081234567892', 'password789', 'doctor', '2025-10-01', '2025-10-01'),
('US004', 'dr_anna', 'anna@example.com', '081234567893', 'mypassword', 'doctor', '2025-10-01', '2025-10-01'),
('US005', 'admin', 'admin@hospital.com', '081234567890', 'admin123', 'admin', '2025-10-02', '2025-10-02');

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
  ADD KEY `doctor_category` (`id_category`),
  ADD KEY `doctor_user` (`id_user`);

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
  ADD PRIMARY KEY (`id_patient`),
  ADD KEY `patient_user` (`id_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctor_category` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id_category`),
  ADD CONSTRAINT `doctor_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Constraints for table `medical_record`
--
ALTER TABLE `medical_record`
  ADD CONSTRAINT `record_appointment` FOREIGN KEY (`id_appointment`) REFERENCES `appointment` (`id_appointment`);

--
-- Constraints for table `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `patient_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
