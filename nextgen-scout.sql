-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 06-Abr-2026 às 14:47
-- Versão do servidor: 8.4.3
-- versão do PHP: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de dados: `nextgen-scout`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `academies`
--

CREATE TABLE `academies` (
  `id` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `rating` int DEFAULT '5',
  `logo_url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `academies`
--

INSERT INTO `academies` (`id`, `nome`, `pais`, `rating`, `logo_url`) VALUES
(1, 'Benfica Campus', 'Portugal', 5, 'https://1000logos.net/wp-content/uploads/2020/09/Benfica-logo.png'),
(2, 'La Masia', 'Espanha', 5, 'https://1000logos.net/wp-content/uploads/2016/10/Barcelona-Logo.png'),
(3, 'Academia Cristiano Ronaldo', 'Portugal', 5, 'https://1000logos.net/wp-content/uploads/2020/09/Sporting-logo.png');

-- --------------------------------------------------------

--
-- Estrutura da tabela `players_rows`
--

CREATE TABLE `players_rows` (
  `COL 1` varchar(3) NOT NULL,
  `COL 2` varchar(19) DEFAULT NULL,
  `COL 3` varchar(17) DEFAULT NULL,
  `COL 4` varchar(16) DEFAULT NULL,
  `COL 5` varchar(9) DEFAULT NULL,
  `COL 6` varchar(7) DEFAULT NULL,
  `COL 7` varchar(10) DEFAULT NULL,
  `COL 8` varchar(9) DEFAULT NULL,
  `COL 9` varchar(8) DEFAULT NULL,
  `COL 10` varchar(7) DEFAULT NULL,
  `COL 11` varchar(8) DEFAULT NULL,
  `COL 12` varchar(10) DEFAULT NULL,
  `COL 13` varchar(10) DEFAULT NULL,
  `COL 14` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `players_rows`
--

INSERT INTO `players_rows` (`COL 1`, `COL 2`, `COL 3`, `COL 4`, `COL 5`, `COL 6`, `COL 7`, `COL 8`, `COL 9`, `COL 10`, `COL 11`, `COL 12`, `COL 13`, `COL 14`) VALUES
('109', 'André Gomes', 'Academia Benfica', 'Guarda-redes', '5', '12', '10', '14', '17', '8', '5', '', '', 8),
('110', 'Gustavo Marques', 'Academia Benfica', 'Defesa Central', '8', '15', '18', '17', '10', '18', '10', '', '', 12),
('111', 'Gonçalo Oliveira', 'Academia Benfica', 'Defesa Central', '7', '16', '14', '16', '10', '15', '12', '', '', 13),
('112', 'João Tomane', 'Academia Benfica', 'Defesa Direito', '10', '13', '15', '13', '11', '12', '16', '', '', 14),
('113', 'Kevin Pinto', 'Academia Benfica', 'Defesa Esquerdo', '12', '15', '14', '15', '10', '12', '17', '', '', 15),
('114', 'João Neves', 'Academia Benfica', 'Médio Centro', '14', '19', '19', '19', '12', '14', '15', '', '', 0),
('115', 'Hugo Félix', 'Academia Benfica', 'Médio Ofensivo', '16', '17', '12', '17', '10', '10', '16', '', '', 15),
('116', 'Rafael Rodrigues', 'Academia Benfica', 'Médio Centro', '12', '14', '15', '14', '11', '13', '14', '', '', 0),
('117', 'Gianluca Prestianni', 'Academia Benfica', 'Extremo Direito', '17', '15', '12', '15', '10', '8', '17', '', '', 18),
('118', 'João Rêgo', 'Academia Benfica', 'Extremo Esquerdo', '14', '16', '14', '15', '10', '12', '18', '', '', 0),
('119', 'Henrique Araújo', 'Academia Benfica', 'Ponta de Lança', '18', '13', '14', '16', '10', '17', '10', '', '', 0),
('120', 'Diego Callai', 'Academia Sporting', 'Guarda-redes', '5', '13', '10', '14', '18', '8', '5', '', '', 0),
('121', 'Ousmane Diomande', 'Academia Sporting', 'Defesa Central', '8', '15', '18', '16', '10', '17', '10', '', '', 0),
('122', 'Eduardo Quaresma', 'Academia Sporting', 'Defesa Central', '10', '15', '16', '15', '11', '15', '11', '', '', 0),
('123', 'Geovany Quenda', 'Academia Sporting', 'Defesa Direito', '15', '16', '14', '16', '12', '10', '18', '', '', 0),
('124', 'João Muniz', 'Academia Sporting', 'Defesa Esquerdo', '10', '14', '15', '14', '10', '16', '13', '', '', 0),
('125', 'Dário Essugo', 'Academia Sporting', 'Médio Defensivo', '11', '15', '19', '16', '12', '14', '12', '', '', 12),
('126', 'Mateus Fernandes', 'Academia Sporting', 'Médio Centro', '14', '18', '15', '17', '11', '12', '15', '', '', 0),
('127', 'João Simões', 'Academia Sporting', 'Médio Centro', '13', '16', '15', '15', '10', '12', '14', '', '', 0),
('128', 'Geny Catamo', 'Academia Sporting', 'Extremo Direito', '16', '15', '14', '15', '10', '10', '17', '', '', 0),
('129', 'Afonso Moreira', 'Academia Sporting', 'Extremo Esquerdo', '15', '14', '12', '15', '10', '11', '16', '', '', 0),
('130', 'Rodrigo Ribeiro', 'Academia Sporting', 'Ponta de Lança', '17', '14', '13', '15', '10', '15', '11', '', '', 0),
('id', 'name', 'team', 'position', 'finishing', 'passing', 'aggression', 'decisions', 'reflexes', 'heading', 'crossing', 'created_at', 'updated_at', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `shortlist`
--

CREATE TABLE `shortlist` (
  `id` int NOT NULL,
  `player_id` int DEFAULT NULL,
  `data_adicionado` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `academies`
--
ALTER TABLE `academies`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `players_rows`
--
ALTER TABLE `players_rows`
  ADD PRIMARY KEY (`COL 1`);

--
-- Índices para tabela `shortlist`
--
ALTER TABLE `shortlist`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `academies`
--
ALTER TABLE `academies`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `shortlist`
--
ALTER TABLE `shortlist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
