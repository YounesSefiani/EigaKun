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
    screen ENUM('Cinema', 'TV', 'DVD', 'Streaming') NULL,
    streaming VARCHAR(255) NULL,
    original BOOLEAN NULL,
    duration TIME NULL,
    country VARCHAR(255) NULL,
    universe VARCHAR(255) NULL,
    subUniverse VARCHAR(255) NULL
);