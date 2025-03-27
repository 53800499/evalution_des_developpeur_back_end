-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 26 mars 2025 à 12:21
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `hlab`
--

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `unique_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`skills`)),
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `unique_id`, `first_name`, `last_name`, `email`, `password`, `last_login`, `is_verified`, `skills`, `created_at`, `updated_at`) VALUES
(1, '36f97ecc-2fdf-4b9b-9405-63b480e33253', 'Jean', 'Dupont', 'jean.dupont@example.com', '$2b$10$XC9CFl/Xp8Vkdr0657Z5kOHj9Sw0Ji3N0iyoboWyjtWkiT0v.Bwd.', NULL, 0, '[]', '2025-03-26 05:58:12', '2025-03-26 05:58:12'),
(3, 'b15e6a20-0aa9-4747-9dae-d99a4cdf6050', 'MerveilleBoss', 'ALLADATIN', 'nouveau.email@example.com', '$2b$10$5s3dK7.L3VDov4BxYD5A3e5wDuiyEF/vyOhwSc9xQI/lxlookrUeW', NULL, 0, '[]', '2025-03-26 05:59:17', '2025-03-26 06:49:58'),
(4, '40ba333b-f951-409b-9d97-432407e3a7ea', 'Eustache', 'ALLADATIN', 'eustache@example.com', '$2b$10$cYjaTk8VAUptdwAAyMG.DeDL.Ch44jNitxFNOmkCZhMqh85.LsFZu', NULL, 0, '[]', '2025-03-26 05:59:39', '2025-03-26 05:59:39'),
(6, '6ebbde36-b986-43f7-be5b-5b741beac5d0', 'dev', 'Boss', 'ddev@example.com', '$2b$10$DeRuNG9zQR6rRqITD8vjNuaHaFFvLWUeP0Plqfafnjxbyj5qlmJrq', NULL, 0, '[]', '2025-03-26 06:01:46', '2025-03-26 06:01:46'),
(7, '89ad1c9d-fdf4-4b45-bb3c-7d19b2ba4c1d', 'Junior', 'Boss', 'boss@example.com', '$2b$10$v00dVx2DfkEU/PzLLIvZv.D8cFAo3vvSm//xlGRMbexjb0C9WjgH2', NULL, 0, '[]', '2025-03-26 06:53:39', '2025-03-26 06:53:39');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_id` (`unique_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
