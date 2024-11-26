CREATE TABLE movies (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(255) NOT NULL,
    poster VARCHAR(255) NULL,
    background VARCHAR(255) NULL,
    logo VARCHAR(255) NULL,
    trailer VARCHAR(255) NULL,
    synopsis TEXT NULL,
    genre VARCHAR(255) NULL,
    theme VARCHAR(255) NULL,
    release_date DATE NULL,
    screen ENUM('Cinéma', 'TV', 'DVD', 'Streaming') NULL,
    streaming ENUM('', 'Netflix', 'Disney +', 'Amazon Prime Vidéo', 'Paramount +', 'Apple TV', 'Salto', 'OCS', 'Canal +') NULL DEFAULT '',
    duration TIME NULL,
    country VARCHAR(255) NULL,
    universe VARCHAR(255) NULL,
    subUniverse VARCHAR(255) NULL
);

CREATE TABLE series (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  title VARCHAR(255) NOT NULL,
  poster VARCHAR(255),
  background VARCHAR(255),
  logo VARCHAR(255),
  trailer VARCHAR(255),
  synopsis TEXT,
  genre VARCHAR(255),
  theme VARCHAR(255),
  universe VARCHAR(255),
  release_date DATE,
  ending_date DATE,
  statut ENUM('En cours', 'Terminée', 'Fin de saison', 'Annulée') NULL,
  seasons INT,
  episodes INT,
  country VARCHAR(255),
  screen ENUM('TV', 'Streaming'),
  streaming ENUM('Netflix', 'Disney +', 'Amazon Prime Vidéo', 'Paramount +', 'Apple TV', 'Salto', 'OCS', 'Canal +') NULL
  );

  CREATE TABLE seasons (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  season_number INT NOT NULL,
  poster VARCHAR(255),
  first_episode_date DATE,
  last_episode_date DATE,
  trailer VARCHAR(255),
  synopsis TEXT,
  episodes INT
);
