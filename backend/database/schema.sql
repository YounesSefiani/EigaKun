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
  serie_id INT NOT NULL,
  season_number INT NOT NULL,
  poster VARCHAR(255),
  first_episode_date DATE,
  last_episode_date DATE,
  synopsis TEXT,
  episodes INT,
  FOREIGN KEY (serie_id) REFERENCES series(id) ON DELETE CASCADE,
  CONSTRAINT unique_season_per_series UNIQUE(serie_id, season_number)
);

CREATE TABLE episodes (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  serie_id INT NOT NULL,
  season_id INT NOT NULL,
  episode_number INT NOT NULL,
  title VARCHAR(255),
  image VARCHAR(255),
  release_date DATE,
  synopsis TEXT,
  FOREIGN KEY (serie_id) REFERENCES series(id) ON DELETE CASCADE,
  FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
  CONSTRAINT unique_episode_per_season_and_series UNIQUE(serie_id, season_id, episode_number)
);

CREATE TABLE personalities (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  fullname VARCHAR(255) NOT NULL,
  image_src VARCHAR(255) NOT NULL,
  birthdate DATE NOT NULL,
  deathdate DATE,
  origin VARCHAR(255) NOT NULL,
  bio TEXT,
  profession VARCHAR(255) NOT NULL
);

CREATE TABLE movieCasting (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  movie_id INT NOT NULL,
  personality_id INT NOT NULL,
  side ENUM("Acting", "Realisation") NOT NULL,
  role VARCHAR(255) NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (personality_id) REFERENCES personalities(id) ON DELETE CASCADE,
  CONSTRAINT unique_personality_movie UNIQUE(movie_id, personality_id)
);

CREATE TABLE serieCasting (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  serie_id INT,
  personality_id INT,
  side ENUM("Acting", "Realisation") NOT NULL,
  role VARCHAR(255) NOT NULL,
  presence VARCHAR(255) NOT NULL,
  FOREIGN KEY (serie_id) REFERENCES series(id) ON DELETE CASCADE,
  FOREIGN KEY (personality_id) REFERENCES personalities(id) ON DELETE CASCADE
);


CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  pseudo VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  mail VARCHAR(255) NOT NULL UNIQUE,
  birthdate DATE NOT NULL,
  avatar VARCHAR(255),
  role ENUM("User", "Admin") DEFAULT "User",
  isValidated BOOLEAN DEFAULT 0
);

INSERT INTO users (pseudo, password, mail, birthdate, avatar)
VALUES ('admin', 'admin', 'H4QvM@example.com', '2000-01-01', 'avatar.jpg');
