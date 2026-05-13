-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 13-Maio-2026 às 16:24
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
(2, 'La Masia', 'Spain', 5, 'https://1000logos.net/wp-content/uploads/2016/10/Barcelona-Logo.png'),
(3, 'Academia Cristiano Ronaldo', 'Portugal', 5, 'https://1000logos.net/wp-content/uploads/2020/09/Sporting-logo.png'),
(4, 'FC Porto Academy', 'Portugal', 4, 'https://1000logos.net/wp-content/uploads/2020/09/Porto-logo.png'),
(5, 'Yung Ajax', 'Netherlands', 5, 'https://1000logos.net/wp-content/uploads/2016/10/Ajax-Logo.png'),
(6, 'SC Braga Academy', 'Portugal', 3, 'https://1000logos.net/wp-content/uploads/2022/01/Braga-logo.png'),
(7, 'La Fabrica', 'Spain', 5, 'https://1000logos.net/wp-content/uploads/2020/09/Real-Madrid-logo.png'),
(8, 'Academia River PLate', 'Argentina', 4, 'https://logodownload.org/wp-content/uploads/2015/05/river-plate-logo-0-1.png'),
(9, 'Chelsea Academy', 'Enlgand', 4, 'https://1000logos.net/wp-content/uploads/2016/11/Chelsea-Logo.png');

-- --------------------------------------------------------

--
-- Estrutura da tabela `dream_team`
--

CREATE TABLE `dream_team` (
  `id` int NOT NULL,
  `player_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `players_rows`
--

CREATE TABLE `players_rows` (
  `COL 1` int NOT NULL,
  `COL 2` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `COL 3` int DEFAULT NULL,
  `COL 4` varchar(20) NOT NULL,
  `COL 5` int NOT NULL,
  `COL 6` int NOT NULL,
  `COL 7` int NOT NULL,
  `COL 8` int NOT NULL,
  `COL 9` int NOT NULL,
  `COL 10` int NOT NULL,
  `COL 11` int NOT NULL,
  `COL 12` varchar(10) DEFAULT NULL,
  `COL 13` varchar(10) DEFAULT NULL,
  `COL 14` int DEFAULT NULL,
  `COL 15` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `players_rows`
--

INSERT INTO `players_rows` (`COL 1`, `COL 2`, `COL 3`, `COL 4`, `COL 5`, `COL 6`, `COL 7`, `COL 8`, `COL 9`, `COL 10`, `COL 11`, `COL 12`, `COL 13`, `COL 14`, `COL 15`) VALUES
(1, 'Diogo Ferreira', 1, 'Guarda-Redes', 3, 16, 10, 15, 17, 7, 3, '', '', 12, 19),
(2, 'João Fonseca', 1, 'Defesa Central', 4, 15, 18, 13, 3, 14, 6, '', '', 12, 19),
(3, 'Guilherme Peixoto', 1, 'Defesa Central', 8, 15, 15, 17, 4, 18, 8, '', '', 12, 19),
(4, 'Leandro Santos', 1, 'Defesa Direito', 9, 15, 14, 12, 4, 13, 15, '', '', 17, 18),
(5, 'Martim Ferreira', 1, 'Defesa Esquerdo', 7, 12, 14, 12, 3, 13, 13, '', '', 17, 18),
(6, 'Rafael Luís', 1, 'Médio Defensivo', 10, 17, 16, 15, 7, 15, 9, '', '', 13, 19),
(7, 'João Rêgo', 1, 'Médio Centro', 14, 16, 12, 16, 5, 12, 12, '', '', 15, 18),
(8, 'Olívio Tomé', 1, 'Médio Centro', 10, 16, 12, 14, 4, 8, 14, '', '', 14, 18),
(9, 'Gonçalo Moreira', 1, 'Extremo Direito', 15, 14, 10, 15, 5, 8, 16, '', '', 16, 17),
(10, 'Gustavo Varela', 1, 'Extremo Esquerdo', 15, 13, 13, 14, 4, 10, 14, '', '', 16, 17),
(11, 'Gerson Ca', 1, 'Ponta de Lança', 20, 10, 14, 13, 3, 14, 8, '', '', 17, 18),
(12, 'Áron Yaakobishvili', 2, 'Guarda-Redes', 5, 12, 7, 17, 17, 7, 6, '', '', 12, 19),
(13, 'Andrés Cuenca', 2, 'Defesa Central', 7, 12, 17, 14, 4, 18, 9, '', '', 13, 19),
(14, 'Emanuel Benjamin', 2, 'Defesa Central', 8, 14, 19, 16, 5, 15, 6, '', '', 15, 19),
(15, 'Landry Farré', 2, 'Defesa Direito', 9, 11, 12, 12, 4, 11, 16, '', '', 19, 18),
(16, 'Albert Navarro', 2, 'Defesa Esquerdo', 6, 14, 15, 16, 6, 14, 15, '', '', 19, 18),
(17, 'Marc Bernal', 2, 'Médio Defensivo', 11, 18, 16, 17, 6, 14, 11, '', '', 12, 19),
(18, 'Guille Fernández', 2, 'Médio Centro', 15, 17, 10, 16, 7, 9, 14, '', '', 15, 18),
(19, 'Quim Junyent', 2, 'Médio Centro', 12, 19, 14, 15, 4, 10, 12, '', '', 16, 18),
(20, 'Toni Fernández', 2, 'Extremo Direito', 15, 16, 13, 15, 6, 7, 14, '', '', 16, 17),
(21, 'Juan Hernández', 2, 'Extremo Esquerdo', 14, 13, 9, 14, 7, 7, 14, '', '', 19, 17),
(22, 'Oscar Gistau', 2, 'Ponta de Lança', 16, 13, 13, 14, 5, 18, 7, '', '', 16, 18),
(23, 'Miguel Gouveia', 3, 'Guarda-Redes', 7, 13, 9, 14, 16, 7, 5, '', '', 12, 19),
(24, 'Lucas Taibo', 3, 'Defesa Central', 6, 14, 19, 16, 3, 15, 6, '', '', 11, 19),
(25, 'Rafael Mota', 3, 'Defesa Central', 6, 11, 19, 17, 4, 18, 6, '', '', 11, 19),
(26, 'Salvador Blopa', 3, 'Defesa Direito', 6, 11, 13, 12, 3, 12, 13, '', '', 19, 18),
(27, 'Denilson Santos', 3, 'Defesa Esquerdo', 7, 13, 15, 13, 7, 11, 17, '', '', 19, 18),
(28, 'Eduardo Felicíssimo', 3, 'Médio Defensivo', 11, 14, 17, 18, 5, 11, 9, '', '', 13, 19),
(29, 'João Simões', 3, 'Médio Centro', 12, 18, 13, 17, 3, 8, 11, '', '', 15, 18),
(30, 'Manuel Mendonça', 3, 'Médio Centro', 12, 15, 11, 15, 4, 12, 14, '', '', 13, 18),
(31, 'Geovany Quenda', 3, 'Extremo Direito', 15, 14, 14, 15, 5, 10, 16, '', '', 18, 17),
(32, 'Flávio Gonçalves', 3, 'Extremo Esquerdo', 12, 12, 13, 13, 3, 8, 15, '', '', 19, 17),
(33, 'Gabriel Silva', 3, 'Ponta de Lança', 18, 13, 12, 14, 2, 14, 9, '', '', 16, 18),
(34, 'Gonçalo Ribeiro', 4, 'Guarda-Redes', 6, 13, 9, 15, 16, 10, 6, '', '', 10, 19),
(35, 'Gabriel Brás', 4, 'Defesa Central', 5, 13, 16, 13, 7, 18, 5, '', '', 13, 19),
(36, 'Filipe Darby', 4, 'Defesa Central', 4, 11, 19, 16, 7, 18, 6, '', '', 11, 19),
(37, 'Luís Gomes', 4, 'Defesa Direito', 10, 11, 13, 12, 7, 10, 14, '', '', 18, 18),
(38, 'Martim Cunha', 4, 'Defesa Esquerdo', 6, 15, 13, 16, 7, 10, 17, '', '', 15, 18),
(39, 'André Oliveira', 4, 'Médio Defensivo', 11, 17, 18, 19, 6, 13, 10, '', '', 12, 19),
(40, 'Gil Martins', 4, 'Médio Centro', 11, 17, 13, 15, 5, 11, 13, '', '', 12, 18),
(41, 'João Teixeira', 4, 'Médio Centro', 10, 18, 14, 18, 3, 8, 15, '', '', 13, 18),
(42, 'Gonçalo Sousa', 4, 'Extremo Direito', 14, 13, 10, 15, 3, 8, 15, '', '', 17, 17),
(43, 'Cardoso Varela', 4, 'Extremo Esquerdo', 13, 15, 13, 15, 7, 11, 14, '', '', 20, 17),
(44, 'Anha Candé', 4, 'Ponta de Lança', 18, 9, 13, 15, 2, 14, 10, '', '', 15, 18),
(45, 'Tommy Setford', 5, 'Guarda-Redes', 5, 14, 10, 14, 16, 7, 5, '', '', 12, 19),
(46, 'Precious Ugwu', 5, 'Defesa Central', 7, 13, 15, 13, 6, 16, 5, '', '', 11, 19),
(47, 'Dies Janse', 5, 'Defesa Central', 6, 15, 15, 15, 6, 16, 8, '', '', 15, 19),
(48, 'Gerald Alders', 5, 'Defesa Direito', 6, 11, 12, 13, 7, 10, 15, '', '', 19, 18),
(49, 'Lucas Jetten', 5, 'Defesa Esquerdo', 10, 12, 15, 13, 3, 12, 15, '', '', 15, 18),
(50, 'Mark Verkuijl', 5, 'Médio Defensivo', 10, 14, 15, 15, 6, 15, 12, '', '', 14, 19),
(51, 'Sean Steur', 5, 'Médio Centro', 11, 16, 11, 15, 6, 8, 12, '', '', 14, 18),
(52, 'Teun Gijselhart', 5, 'Médio Centro', 13, 16, 12, 15, 3, 11, 11, '', '', 15, 18),
(53, 'Jan Faberski', 5, 'Extremo Direito', 13, 13, 12, 15, 5, 8, 15, '', '', 16, 17),
(54, 'Skye Vink', 5, 'Extremo Esquerdo', 13, 15, 11, 15, 3, 9, 16, '', '', 20, 17),
(55, 'Don-Angelo Konadu', 5, 'Ponta de Lança', 19, 13, 14, 13, 2, 16, 7, '', '', 18, 18),
(56, 'Tai Jader', 6, 'Guarda-Redes', 5, 12, 6, 17, 18, 8, 5, '', '', 12, 19),
(57, 'Miguel Vilela', 6, 'Defesa Central', 8, 15, 15, 16, 7, 15, 7, '', '', 11, 19),
(58, 'Diogo Casimiro', 6, 'Defesa Central', 7, 11, 19, 17, 4, 16, 8, '', '', 11, 19),
(59, 'Nuno Matos', 6, 'Defesa Direito', 8, 15, 14, 12, 5, 14, 15, '', '', 18, 18),
(60, 'Francisco Chissumba', 6, 'Defesa Esquerdo', 8, 14, 14, 16, 4, 11, 16, '', '', 18, 18),
(61, 'Tiago Helguera', 6, 'Médio Defensivo', 9, 17, 18, 17, 7, 15, 9, '', '', 12, 19),
(62, 'Guilherme Barbosa', 6, 'Médio Centro', 12, 16, 13, 18, 7, 10, 14, '', '', 15, 18),
(63, 'João Vasconcelos', 6, 'Médio Centro', 13, 16, 14, 17, 4, 8, 13, '', '', 16, 18),
(64, 'Ruben Furtado', 6, 'Extremo Direito', 16, 14, 9, 14, 5, 8, 15, '', '', 17, 17),
(65, 'Dinis Rodrigues', 6, 'Extremo Esquerdo', 12, 12, 10, 16, 7, 7, 17, '', '', 19, 17),
(66, 'José Rodrigues', 6, 'Ponta de Lança', 20, 10, 15, 16, 5, 15, 7, '', '', 14, 18),
(67, 'Fran González', 7, 'Guarda-Redes', 3, 15, 7, 14, 19, 9, 3, '', '', 12, 19),
(68, 'Joan Martínez', 7, 'Defesa Central', 6, 14, 16, 16, 6, 17, 9, '', '', 14, 19),
(69, 'Jacobo Ramón', 7, 'Defesa Central', 6, 14, 19, 17, 6, 18, 8, '', '', 12, 19),
(70, 'Jesús Fortea', 7, 'Defesa Direito', 9, 14, 14, 13, 5, 14, 16, '', '', 16, 18),
(71, 'Liberto Navascués', 7, 'Defesa Esquerdo', 8, 14, 12, 14, 4, 12, 15, '', '', 17, 18),
(72, 'Pol Durán', 7, 'Médio Defensivo', 12, 13, 15, 16, 5, 14, 10, '', '', 11, 19),
(73, 'Roberto Martín', 7, 'Médio Centro', 10, 18, 13, 16, 7, 11, 14, '', '', 12, 18),
(74, 'Daniel Mesonero', 7, 'Médio Centro', 11, 18, 13, 18, 3, 12, 14, '', '', 15, 18),
(75, 'José Antonio Reyes Jr', 7, 'Extremo Direito', 12, 14, 11, 16, 6, 11, 18, '', '', 20, 17),
(76, 'Paulo Iago', 7, 'Extremo Esquerdo', 14, 17, 10, 16, 6, 10, 15, '', '', 16, 17),
(77, 'Enzo Alves', 7, 'Ponta de Lança', 17, 12, 13, 14, 3, 16, 10, '', '', 15, 18),
(78, 'Santiago Beltrán', 8, 'Guarda-Redes', 6, 16, 10, 13, 15, 9, 4, '', '', 12, 19),
(79, 'Ulises Giménez', 8, 'Defesa Central', 5, 11, 17, 16, 5, 15, 8, '', '', 13, 19),
(80, 'Facundo González', 8, 'Defesa Central', 6, 14, 17, 16, 5, 14, 8, '', '', 11, 19),
(81, 'Lisandro Tejada', 8, 'Defesa Direito', 10, 11, 14, 13, 3, 10, 13, '', '', 16, 18),
(82, 'Lucas Flores', 8, 'Defesa Esquerdo', 7, 11, 16, 13, 4, 11, 16, '', '', 15, 18),
(83, 'Bautista Aguirre', 8, 'Médio Defensivo', 12, 14, 17, 17, 6, 12, 13, '', '', 14, 19),
(84, 'Tobías Leiva', 8, 'Médio Centro', 10, 16, 12, 14, 7, 8, 13, '', '', 16, 18),
(85, 'Juan Cruz Meza', 8, 'Médio Centro', 13, 18, 11, 14, 7, 9, 11, '', '', 14, 18),
(86, 'Felipe Esquivel', 8, 'Extremo Direito', 16, 12, 13, 13, 5, 11, 17, '', '', 18, 17),
(87, 'Ian Subiabre', 8, 'Extremo Esquerdo', 13, 15, 11, 15, 6, 10, 16, '', '', 17, 17),
(88, 'Agustín Ruberto', 8, 'Ponta de Lança', 18, 12, 14, 14, 3, 15, 8, '', '', 15, 18),
(89, 'Max Merrick', 9, 'Guarda-Redes', 7, 15, 9, 16, 19, 8, 5, '', '', 10, 19),
(90, 'Travis Akomeah', 9, 'Defesa Central', 4, 13, 18, 14, 6, 18, 9, '', '', 14, 19),
(91, 'Harrison Murray-Campbell', 9, 'Defesa Central', 6, 11, 18, 15, 4, 17, 6, '', '', 13, 19),
(92, 'Josh Acheampong', 9, 'Defesa Direito', 8, 13, 14, 16, 5, 14, 13, '', '', 19, 18),
(93, 'Ishe Samuels-Smith', 9, 'Defesa Esquerdo', 7, 11, 13, 15, 6, 14, 14, '', '', 18, 18),
(94, 'Kiano Dyer', 9, 'Médio Defensivo', 11, 16, 15, 16, 6, 12, 12, '', '', 14, 19),
(95, 'Michael Golding', 9, 'Médio Centro', 12, 19, 12, 17, 7, 12, 13, '', '', 15, 18),
(96, 'Ollie Harrison', 9, 'Médio Centro', 14, 17, 12, 17, 5, 10, 13, '', '', 13, 18),
(97, 'Frankie Runham', 9, 'Extremo Direito', 12, 13, 11, 13, 7, 8, 15, '', '', 17, 17),
(98, 'Tyrique George', 9, 'Extremo Esquerdo', 15, 14, 13, 17, 7, 9, 14, '', '', 17, 17),
(99, 'Shim Mheuka', 9, 'Ponta de Lança', 16, 10, 15, 13, 4, 14, 10, '', '', 17, 18);

-- --------------------------------------------------------

--
-- Estrutura da tabela `senior_players`
--

CREATE TABLE `senior_players` (
  `id` int NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `team_id` int DEFAULT NULL,
  `position` varchar(30) DEFAULT NULL,
  `finishing` int DEFAULT NULL,
  `passing` int DEFAULT NULL,
  `agression` int DEFAULT NULL,
  `decisions` int DEFAULT NULL,
  `reflexes` int DEFAULT NULL,
  `heading` int DEFAULT NULL,
  `crossing` int DEFAULT NULL,
  `pace` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `senior_players`
--

INSERT INTO `senior_players` (`id`, `name`, `team_id`, `position`, `finishing`, `passing`, `agression`, `decisions`, `reflexes`, `heading`, `crossing`, `pace`) VALUES
(1, 'Anatoliy Trubin', 1, 'GR', 5, 17, 9, 18, 20, 7, 5, 15),
(2, 'Amar Dedic', 1, 'DD', 13, 17, 17, 16, 5, 15, 18, 19),
(3, 'Tomas Araujo', 1, 'DC', 9, 16, 18, 18, 5, 19, 9, 17),
(4, 'Nicolas Otamendi', 1, 'DC', 11, 16, 20, 20, 5, 20, 8, 14),
(5, 'Samuel Dahl', 1, 'DE', 12, 17, 16, 16, 5, 14, 18, 18),
(6, 'Leandro Barreiro', 1, 'MC', 15, 18, 20, 17, 5, 16, 14, 17),
(7, 'Fredrik Aursnes', 1, 'MC', 16, 19, 18, 20, 5, 16, 18, 17),
(8, 'Gianluca Prestianni', 1, 'ED', 17, 18, 13, 16, 5, 9, 17, 19),
(9, 'Andreas Schjelderup', 1, 'EE', 17, 18, 12, 18, 5, 11, 18, 18),
(10, 'Rafa Silva', 1, 'MOC', 18, 18, 11, 17, 5, 11, 17, 20),
(11, 'Vangelis Pavlidis', 1, 'PL', 20, 16, 17, 18, 5, 19, 12, 18),
(12, 'Rui Silva', 2, 'GR', 5, 16, 9, 18, 19, 7, 5, 14),
(13, 'Ivan Fresneda', 2, 'DD', 11, 17, 16, 17, 5, 15, 18, 18),
(14, 'Ousmane Diomande', 2, 'DC', 9, 17, 20, 18, 5, 20, 8, 18),
(15, 'Goncalo Inacio', 2, 'DC', 11, 19, 18, 19, 5, 19, 13, 17),
(16, 'Zeno Debast', 2, 'DC', 9, 18, 17, 18, 5, 18, 11, 17),
(17, 'Nuno Santos', 2, 'DE', 17, 19, 20, 17, 5, 13, 20, 18),
(18, 'Morten Hjulmand', 2, 'MC', 14, 19, 20, 20, 5, 17, 15, 16),
(19, 'Pedro Goncalves', 2, 'MOC', 19, 20, 15, 19, 5, 13, 19, 18),
(20, 'Francisco Trincao', 2, 'ED', 18, 19, 12, 18, 5, 11, 19, 19),
(21, 'Fotis Ioannidis', 2, 'PL', 19, 16, 18, 17, 5, 19, 11, 18),
(22, 'Luis Suarez', 2, 'PL', 20, 17, 20, 19, 5, 18, 13, 16),
(23, 'Diogo Costa', 3, 'GR', 5, 19, 10, 19, 20, 7, 5, 15),
(24, 'Martim Fernandes', 3, 'DD', 12, 16, 16, 17, 5, 14, 17, 19),
(25, 'Thiago Silva', 3, 'DC', 11, 19, 18, 20, 4, 20, 9, 13),
(26, 'Jan Bednarek', 3, 'DC', 8, 15, 19, 18, 5, 20, 7, 15),
(27, 'Francisco Moura', 3, 'DE', 13, 17, 17, 17, 5, 15, 19, 18),
(28, 'Alan Varela', 3, 'MC', 14, 19, 20, 19, 5, 16, 15, 16),
(29, 'Seko Fofana', 3, 'MC', 17, 18, 19, 18, 5, 17, 14, 18),
(30, 'Gabri Veiga', 3, 'MOC', 18, 18, 14, 18, 5, 14, 17, 17),
(31, 'Pepe', 3, 'ED', 17, 17, 16, 18, 5, 15, 18, 19),
(32, 'Samu', 3, 'PL', 19, 15, 19, 17, 5, 19, 10, 20),
(33, 'Luuk de Jong', 3, 'PL', 19, 16, 17, 19, 5, 20, 12, 14),
(34, 'Lukas Hornicek', 4, 'GR', 4, 14, 9, 16, 18, 7, 5, 13),
(35, 'Victor Gomez', 4, 'DD', 11, 16, 15, 16, 5, 13, 18, 19),
(36, 'Gustaf Lagerbielke', 4, 'DC', 8, 15, 18, 17, 5, 19, 8, 15),
(37, 'Bright Arrey-Mbi', 4, 'DC', 8, 14, 18, 16, 5, 18, 8, 18),
(38, 'Sikou Niakate', 4, 'DC', 9, 14, 19, 17, 5, 19, 8, 16),
(39, 'Florian Grillitsch', 4, 'MC', 15, 19, 17, 19, 5, 15, 16, 15),
(40, 'Joao Moutinho', 4, 'MC', 14, 20, 15, 20, 5, 13, 19, 13),
(41, 'Rodrigo Zalazar', 4, 'MOC', 17, 18, 17, 18, 5, 14, 18, 17),
(42, 'Ricardo Horta', 4, 'ED', 19, 18, 13, 19, 5, 13, 18, 17),
(43, 'Diego Rodrigues', 4, 'EE', 16, 16, 12, 16, 5, 11, 17, 19),
(44, 'Pau Victor', 4, 'PL', 18, 15, 15, 17, 5, 17, 12, 18),
(45, 'Charles Silva', 5, 'GR', 4, 14, 9, 16, 18, 7, 5, 13),
(46, 'Tony Strata', 5, 'DD', 10, 15, 15, 15, 5, 13, 16, 17),
(47, 'Óscar Rivas', 5, 'DC', 7, 14, 18, 16, 5, 18, 7, 14),
(48, 'Thiago Balieiro', 5, 'DC', 8, 14, 17, 16, 5, 18, 8, 15),
(49, 'Miguel Nogueira', 5, 'DE', 9, 15, 15, 15, 5, 13, 16, 17),
(50, 'Goncalo Nogueira', 5, 'MC', 13, 16, 16, 16, 5, 13, 15, 15),
(51, 'Ibrahima Camara', 5, 'MC', 12, 16, 18, 16, 5, 15, 13, 16),
(52, 'Beni Mukendi', 5, 'MC', 13, 17, 17, 17, 5, 14, 14, 16),
(53, 'Joao Mendes', 5, 'MOC', 16, 17, 13, 17, 5, 12, 16, 16),
(54, 'Samu', 5, 'PL', 17, 14, 15, 16, 5, 16, 11, 17),
(55, 'Oliveira', 5, 'PL', 16, 14, 15, 16, 5, 17, 11, 15),
(56, 'Bernardo Fontes', 6, 'GR', 4, 13, 8, 15, 16, 6, 4, 12),
(57, 'Bebeto', 6, 'DD', 9, 14, 15, 15, 5, 12, 15, 16),
(58, 'Christian Marques', 6, 'DC', 7, 13, 16, 15, 5, 17, 7, 14),
(59, 'Antunes', 6, 'DE', 12, 17, 16, 17, 5, 13, 18, 14),
(60, 'Rodrigo Conceição', 6, 'ED', 14, 15, 15, 15, 5, 12, 16, 18),
(61, 'Joe Hodge', 6, 'MC', 13, 16, 16, 16, 5, 13, 15, 15),
(62, 'Rodriguez', 6, 'MC', 13, 16, 15, 16, 5, 13, 15, 15),
(63, 'Kassoum Ouattara', 6, 'EE', 14, 15, 14, 15, 5, 12, 15, 18),
(64, 'Hugo Félix', 6, 'MOC', 15, 17, 11, 16, 5, 11, 16, 16),
(65, 'Rony Lopes', 6, 'PL', 16, 16, 12, 16, 5, 12, 16, 17),
(66, 'Pedro Maranhão', 6, 'PL', 16, 14, 14, 15, 5, 14, 12, 17),
(67, 'Thibaut Courtois', 7, 'GR', 5, 16, 10, 20, 20, 8, 5, 13),
(68, 'Trent Alexander-Arnold', 7, 'DD', 15, 20, 14, 19, 5, 13, 20, 18),
(69, 'Antonio Rudiger', 7, 'DC', 10, 16, 20, 19, 5, 20, 10, 19),
(70, 'Dean Huijsen', 7, 'DC', 9, 17, 17, 18, 5, 19, 11, 16),
(71, 'Alvaro Carreras', 7, 'DE', 12, 17, 16, 17, 5, 14, 17, 18),
(72, 'Aurelien Tchouameni', 7, 'MC', 14, 19, 19, 19, 5, 18, 14, 17),
(73, 'Eduardo Camavinga', 7, 'MC', 14, 19, 18, 19, 5, 16, 16, 18),
(74, 'Federico Valverde', 7, 'MC', 17, 19, 18, 20, 5, 15, 17, 20),
(75, 'Arda Guler', 7, 'MOC', 18, 20, 12, 19, 5, 12, 18, 18),
(76, 'Vinicius Jr', 7, 'EE', 20, 18, 14, 19, 5, 12, 18, 20),
(77, 'Kylian Mbappe', 7, 'PL', 20, 18, 14, 20, 5, 15, 17, 20),
(78, 'James Trafford', 8, 'GR', 5, 17, 9, 17, 18, 7, 5, 14),
(79, 'Abdukodir Khusanov', 8, 'DC', 8, 16, 19, 17, 5, 19, 9, 17),
(80, 'Marc Guehi', 8, 'DC', 9, 17, 18, 19, 5, 19, 9, 17),
(81, 'Matheus Nunes', 8, 'MC', 15, 19, 16, 18, 5, 14, 16, 19),
(82, 'Rodri', 8, 'MC', 16, 20, 19, 20, 5, 18, 16, 15),
(83, 'Nico O\'Reilly', 8, 'MC', 14, 17, 15, 16, 5, 14, 15, 16),
(84, 'Bernardo Silva', 8, 'MOC', 18, 20, 16, 20, 5, 12, 19, 17),
(85, 'Rayan Cherki', 8, 'ED', 17, 19, 12, 18, 5, 11, 18, 18),
(86, 'Antoine Semenyo', 8, 'EE', 17, 16, 17, 17, 5, 15, 16, 19),
(87, 'Jeremy Doku', 8, 'EE', 16, 17, 12, 16, 5, 10, 17, 20),
(88, 'Erling Haaland', 8, 'PL', 20, 15, 19, 20, 5, 20, 12, 20),
(89, 'Joan Garcia', 9, 'GR', 5, 16, 9, 17, 19, 7, 5, 14),
(90, 'João Cancelo', 9, 'DD', 16, 20, 15, 18, 5, 14, 20, 19),
(91, 'Pau Cubarsi', 9, 'DC', 8, 19, 16, 19, 5, 17, 11, 16),
(92, 'Ronald Araujo', 9, 'DC', 10, 16, 20, 19, 5, 20, 9, 19),
(93, 'Gerard Martin', 9, 'DE', 10, 16, 15, 16, 5, 14, 16, 17),
(94, 'Eric Garcia', 9, 'MC', 12, 19, 17, 19, 5, 16, 13, 15),
(95, 'Pedri', 9, 'MC', 16, 20, 14, 20, 5, 12, 19, 17),
(96, 'Fermin Lopez', 9, 'MC', 18, 17, 17, 17, 5, 14, 15, 17),
(97, 'Dani Olmo', 9, 'MOC', 19, 20, 13, 20, 5, 13, 18, 18),
(98, 'Lamine Yamal', 9, 'ED', 18, 20, 12, 19, 5, 11, 19, 20),
(99, 'Marcus Rashford', 9, 'EE', 18, 17, 14, 17, 5, 15, 17, 20),
(100, 'Manuel Neuer', 10, 'GR', 5, 20, 10, 20, 19, 8, 5, 14),
(101, 'Josip Stanisic', 10, 'DD', 11, 17, 16, 17, 5, 16, 16, 17),
(102, 'Dayot Upamecano', 10, 'DC', 9, 17, 19, 17, 5, 19, 10, 19),
(103, 'Jonathan Tah', 10, 'DC', 9, 16, 19, 18, 5, 20, 9, 17),
(104, 'Konrad Laimer', 10, 'DE', 13, 17, 20, 18, 5, 15, 16, 19),
(105, 'Aleksandar Pavlovic', 10, 'MC', 14, 19, 16, 18, 5, 15, 15, 16),
(106, 'Joshua Kimmich', 10, 'MC', 15, 20, 18, 20, 5, 15, 20, 16),
(107, 'Michael Olise', 10, 'ED', 18, 19, 12, 18, 5, 12, 19, 19),
(108, 'Serge Gnabry', 10, 'EE', 18, 17, 14, 17, 5, 13, 17, 19),
(109, 'Luis Diaz', 10, 'EE', 18, 17, 15, 18, 5, 14, 17, 20),
(110, 'Harry Kane', 10, 'PL', 20, 20, 15, 20, 5, 20, 16, 16),
(111, 'David Raya', 11, 'GR', 5, 19, 9, 18, 19, 7, 5, 13),
(112, 'Ben White', 11, 'DD', 12, 18, 17, 18, 5, 16, 17, 17),
(113, 'William Saliba', 11, 'DC', 9, 18, 18, 20, 5, 19, 10, 18),
(114, 'Gabriel Magalhaes', 11, 'DC', 11, 16, 20, 18, 5, 20, 9, 17),
(115, 'Piero Hincapie', 11, 'DE', 10, 17, 18, 17, 5, 17, 16, 18),
(116, 'Martin Zubimendi', 11, 'MC', 13, 20, 17, 20, 5, 15, 16, 16),
(117, 'Declan Rice', 11, 'MC', 15, 19, 19, 20, 5, 17, 15, 17),
(118, 'Eberechi Eze', 11, 'MOC', 18, 18, 13, 18, 5, 12, 17, 18),
(119, 'Bukayo Saka', 11, 'ED', 19, 19, 14, 19, 5, 12, 19, 19),
(120, 'Leandro Trossard', 11, 'EE', 18, 18, 13, 18, 5, 13, 17, 17),
(121, 'Viktor Gyökeres', 11, 'PL', 20, 16, 19, 18, 5, 18, 14, 20),
(122, 'Joel Robles', 12, 'GR', 4, 14, 8, 16, 17, 7, 4, 12),
(123, 'Ricard Sanchez', 12, 'DD', 10, 15, 15, 15, 5, 13, 16, 17),
(124, 'Felix Bacher', 12, 'DC', 7, 14, 17, 15, 5, 17, 7, 14),
(125, 'Ferro', 12, 'DC', 8, 16, 15, 16, 5, 17, 9, 13),
(126, 'Antef Tsoungui', 12, 'DE', 9, 14, 16, 15, 5, 15, 15, 16),
(127, 'Jandro Orellana', 12, 'MC', 12, 17, 15, 16, 5, 13, 15, 15),
(128, 'Jordan Holsgrove', 12, 'MC', 13, 16, 15, 16, 5, 13, 15, 15),
(129, 'Pedro Carvalho', 12, 'ED', 14, 15, 12, 15, 5, 12, 16, 17),
(130, 'João Carvalho', 12, 'MOC', 15, 17, 11, 16, 5, 11, 16, 15),
(131, 'Yanis Begraoui', 12, 'EE', 15, 15, 13, 15, 5, 13, 15, 18),
(132, 'Alejandro Marques', 12, 'PL', 16, 14, 15, 16, 5, 17, 11, 16);

-- --------------------------------------------------------

--
-- Estrutura da tabela `senior_teams`
--

CREATE TABLE `senior_teams` (
  `id` int NOT NULL,
  `club_name` varchar(30) NOT NULL,
  `overall` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `senior_teams`
--

INSERT INTO `senior_teams` (`id`, `club_name`, `overall`) VALUES
(1, 'SL Benfica', 82.5),
(2, 'Sporting CP', 81),
(3, 'FC Porto', 81.5),
(4, 'SC Braga', 78.5),
(5, 'Vitória SC', 76),
(6, 'CD Tondela', 70),
(7, 'Real Madrid', 89),
(8, 'Manchester City', 90),
(9, 'FC Barcelona', 85.5),
(10, 'Bayern Munique', 88),
(11, 'Arsenal FC', 85),
(12, 'Estoril Praia', 67.5);

-- --------------------------------------------------------

--
-- Estrutura da tabela `shortlist`
--

CREATE TABLE `shortlist` (
  `id` int NOT NULL,
  `player_id` int DEFAULT NULL,
  `data_adicionado` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`, `created_at`) VALUES
(1, 'BernasQPH', 'bernardo', 'bernardo.henriques02@gmail.com', '2026-04-23 14:06:20');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `academies`
--
ALTER TABLE `academies`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `dream_team`
--
ALTER TABLE `dream_team`
  ADD PRIMARY KEY (`id`),
  ADD KEY `player_id` (`player_id`);

--
-- Índices para tabela `players_rows`
--
ALTER TABLE `players_rows`
  ADD PRIMARY KEY (`COL 1`),
  ADD KEY `fk_player_academy` (`COL 3`);

--
-- Índices para tabela `senior_players`
--
ALTER TABLE `senior_players`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_senior_team` (`team_id`);

--
-- Índices para tabela `senior_teams`
--
ALTER TABLE `senior_teams`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `shortlist`
--
ALTER TABLE `shortlist`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `academies`
--
ALTER TABLE `academies`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de tabela `dream_team`
--
ALTER TABLE `dream_team`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `shortlist`
--
ALTER TABLE `shortlist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `dream_team`
--
ALTER TABLE `dream_team`
  ADD CONSTRAINT `player_id` FOREIGN KEY (`player_id`) REFERENCES `players_rows` (`COL 1`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Limitadores para a tabela `players_rows`
--
ALTER TABLE `players_rows`
  ADD CONSTRAINT `fk_player_academy` FOREIGN KEY (`COL 3`) REFERENCES `academies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Limitadores para a tabela `senior_players`
--
ALTER TABLE `senior_players`
  ADD CONSTRAINT `fk_senior_team` FOREIGN KEY (`team_id`) REFERENCES `senior_teams` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
