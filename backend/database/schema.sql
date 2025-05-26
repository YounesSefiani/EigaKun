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
    original VARCHAR(255) NULL,
    duration TIME NULL,
    country VARCHAR(255) NULL,
    universe VARCHAR(255) NULL,
    subUniverse VARCHAR(255) NULL
);

INSERT INTO movies (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse)
VALUES ("Silent Hill", "https://image.tmdb.org/t/p/original/2I6UnjiJqmrYOzpsjIMjINcRSKF.jpg", "https://image.tmdb.org/t/p/original/fVxGOuEtac6By43qoVArpER2JCS.jpg", "https://image.tmdb.org/t/p/original/lzC2mzjGp09SbWyGf868tlrJ7Xs.png", "https://www.youtube.com/embed/EEuEavdbmhY?si=EkEccJfHHoxxaw-8", "De plus en plus souvent, la petite Sharon rêve d'une ville abandonnée, Silent Hill. Sa mère, Rose, décidée à comprendre l'étrange mal dont souffre son enfant, décide de l'accompagner sur place. Alors qu'elles pénètrent dans cet univers lugubre, Sharon disparaît. Rose se lance à sa poursuite, mais se rend vite compte que ce lieu étrange ne ressemble à rien de normal. Noyée dans le brouillard, peuplée d'étranges créatures, hantée par des ténèbres vivantes qui dévorent littéralement tout ce qu'elles touchent, cette dimension va peu à peu livrer ses terrifiants secrets... Avec l'aide de Cybil, de la police locale, Rose se jette dans une quête éperdue pour arracher sa fille au monde de Silent Hill. D'indices en épreuves, elle va découvrir tout ce que Sharon risque et ce qu'elle représente dans une malédiction qui dépasse tout... Adaptation cinématographique du jeu vidéo éponyme", "Horreur", "Adaptation, Jeux vidéo, Mystères", "2006-04-26", "Cinéma", null, null, "2:05:00", "USA, France", "Silent Hill", null);
INSERT INTO movies (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse)
VALUES ("L'Immensita", "https://www.themoviedb.org/t/p/original/xpCBosabexDxAxqg8NMbWR4b313.jpg", "https://www.themoviedb.org/t/p/original/bCTLIwTUm75rMzXKZ1iefCNTC1r.jpg", "https://image.tmdb.org/t/p/original/wagrDNTVuxtG2F3RQVhi9u7szv.png", "https://www.youtube.com/embed/pkN94C2PqLY?si=uJWigpY89bJN8VQD", "Rome dans les années 1970. Dans la vague des changements sociaux et culturels, Clara et Felice Borghetti ne s’aiment plus mais sont incapables de se quitter. Désemparée, Clara trouve refuge dans la relation complice qu’elle entretient avec ses trois enfants, en particulier avec l’aînée née dans un corps qui ne lui correspond pas. Faisant fi des jugements, Clara va insuffler de la fantaisie et leur transmettre le goût de la liberté, au détriment de l’équilibre familial…", "Drame", "Famille", "2023-01-11", "Cinéma", null, null, "1:39:00", "Italie", null, null);
INSERT INTO movies (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse)
VALUES ("Les Rascals", "https://www.themoviedb.org/t/p/original/wLRLbM2llYKCWabFqcMCF8GycTR.jpg", "https://www.themoviedb.org/t/p/original/j7ISL9Szxc6LDT8peWmN7BscVO7.jpg", "https://image.tmdb.org/t/p/original/jp9YOKHJXVcX1jFnlEEap8iZWpk.png", "https://www.youtube.com/embed/thumLqwMIXs?si=DFzzEJxPLR6dt58C", "Les Rascals, une bande de jeunes de banlieue, profite de la vie insouciante des années 80. Chez un disquaire, l’un d’eux reconnait un skin qui l’avait agressé et décide de se faire justice lui-même. Témoin de la scène, la jeune sœur du skin se rapproche d’un étudiant extrémiste qui lui promet de se venger des Rascals. Alors que l’extrême droite gagne du terrain dans tout le pays, la bande d’amis est prise dans un engrenage. C’est la fin de l’innocence…", "Drame", "Faits réels", "2023-01-11", "Cinéma", null, null, "1:45:00", "France", null, null);
INSERT INTO movies (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse)
VALUES ("Goodbye", "https://www.themoviedb.org/t/p/original/9w5mFsAX9YPI5IFOnd26q1RVStq.jpg", "https://www.themoviedb.org/t/p/original/5kmdAHM3gu1PLZafXCnMm0BE7n9.jpg", null, "https://www.youtube.com/embed/5NDn6IAHSaA?si=5Z9-nbtXR1Tiukln", "Roma est un jeune garçon qui vit à la campagne. Avec son ami d’enfance Toto ils se font appeler les « DonGlees » et ils organisent un petit spectacle de feu d’artifice tous les étés. A l’issue de sa première année de lycée, Toto revient de Tokyo où il étudie. Un nouveau venu, Drop, se joint aux DonGlees pour filmer avec son drone le spectacle vu du ciel. Mais cette fois-ci, rien ne va, les feux d’artifices ne fonctionnent pas et le drone est emporté par le vent. Au même moment, un feu de forêt se déclenche pour une cause indéterminée. La toile s’affole et blâme les DonGlees. Roma, Toto et Drop partent à la recherche du drone pour prouver leur innocence.", "Animation", "Voyage", "2023-01-18", "Cinéma", null, null, "1:35:00", "Japon", null, null);
INSERT INTO movies (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse)
VALUES ("La Famille Asada", "https://www.themoviedb.org/t/p/original/eEOSiBnmm9q20W6hEkjpKGads2U.jpg", "https://www.themoviedb.org/t/p/original/2EGhE1LQwc1jiq9xbDYmGMs6Lns.jpg", "https://image.tmdb.org/t/p/original/zpHUg6ZrNujDL4oCEnuSA22Aynr.png", "https://player.vimeo.com/video/661441208?h=9eacc87eae", "Dans la famille Asada, chacun a un rêve secret : le père aurait aimé être pompier, le grand-frère pilote de formule 1 et la mère se serait bien imaginée en épouse de yakuza ! Masashi, lui, a réalisé le sien : devenir photographe. Grâce à son travail, il va permettre à chacun de réaliser que le bonheur est à portée de main.", "Drame", "Famille", "2023-01-25", "Cinéma", null, null, "2:07:00", "Japon", null, null);
INSERT INTO movies (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse)
VALUES ("About Kim Sohee", "https://www.themoviedb.org/t/p/original/xMyRhSLUonwcSXwO0Hgv1KQCa3j.jpg", "https://www.themoviedb.org/t/p/original/nsuL8cSkS3Zzkr09X0LWminnOlZ.jpg", null, "https://www.youtube.com/embed/tG1fKlHakX4?si=JwcU1EP0xctbeFb5", "So-Hee, lycéenne qui travaille en apprentissage dans un centre d'appels, est impliquée dans une affaire. Le détective Yoo-Jin enquête sur l'affaire.", "Drame", "Société", "2023-02-08", "Cinéma", null, null, "2:15:00", "Corée du Sud", null, null);
INSERT INTO movies (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse)
VALUES ("Spider-Man", "https://image.tmdb.org/t/p/original/gh4cZbhZxyTbgxQPxD0dOudNPTn.jpg", "https://image.tmdb.org/t/p/original/2PDTWfuBWQKVC7aPAqJK5UCpz08.jpg", "https://image.tmdb.org/t/p/original/kNPXwReF35JpWBqGw8HadykznPT.png", "https://www.youtube.com/embed/OFijO5eH3ok?si=87nHMN3kZVDKaxEz", "Orphelin, Peter Parker est élevé par sa tante May et son oncle Ben dans le quartier Queens de New York. Tout en poursuivant ses études de biophysique à l'université, il trouve un emploi de photographe au journal Daily Bugle. Cependant, après avoir été mordu par une araignée radioactive, ce dernier est sujet à des transformations physiques : son agilité et sa force se sont accrues, et il se voit doter de pouvoirs surnaturels. Peter décide alors de participer à un combat de catch qu'il remporte avec une facilité déconcertante. Mais l'organisateur du spectacle, décrétant qu'il y a eu tricherie, refuse de lui remettre le prix de 3 000 dollars qui lui revient de droit. Au même moment, l'homme d'affaires mégalomane Norman Osborn expérimente sur lui-même de dangereuses solutions chimiques. Des mutations s'opèrent bientôt sur son corps et son esprit. Il se transforme alors en Bouffon Vert.", "Action, Science-Fiction", "Super-Héros", "2002-06-12", "Cinéma", null, null, "2:01:00", "USA", "Marvel", "Spider-Man");
INSERT INTO movies (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse)
VALUES ("Spider-Man 2", "https://image.tmdb.org/t/p/original/olxpyq9kJAZ2NU1siLshhhXEPR7.jpg", "https://image.tmdb.org/t/p/original/9OMNK3jt8uA3PP2IpIUkWCrlJ7t.jpg", "https://image.tmdb.org/t/p/original/qdQT0IXmpbhxZerwwX0HnDWE687.png", "https://www.youtube.com/embed/3sDoiPWrook?si=Sx0tcu1jZRxkE-Ig", "2 ans après avoir choisi sa vie de super-héros, Peter Parker ne parvient plus à gérer sa double vie. Il perd son boulot, Mary-Jane sait qu'elle ne peut plus compter sur lui, et ses études prennent le même chemin. Il décide de raccrocher le costume de Spiderman. Son ami Harry lui présente un ami de son professeur de science, le bienveillant docteur Otto Octavius sur lequel il doit rédiger un mémoire. Celui-ci travaille sur la fusion qu'il croit pouvoir contrôler. Mais une démonstration de ses recherches tourne mal, et le docteur se voit doter de 4 membres mécaniques supplémentaires greffés sur sa colonne vertébrale et qui prennent le contrôle de son esprit…", "Action, Science-Fiction", "Super-Héros", "2004-07-14", "Cinéma", null, null, "2:08:00", "USA", "Marvel", "Spider-Man");
INSERT INTO movies (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse)
VALUES ("Spider-Man 3", "https://image.tmdb.org/t/p/original/qFmwhVUoUSXjkKRmca5yGDEXBIj.jpg", "https://image.tmdb.org/t/p/original/eSGBbCOX7KM3Rf8HHwK8tglklyS.jpg", "https://image.tmdb.org/t/p/original/xYaPsUe7IxlXL4VsRe7lTz6RSbE.png", "https://www.youtube.com/embed/oB09PpOoknM?si=DCIdLFDm0hYM4mqu", "Peter Parker a retrouvé un équilibre de vie et il veut se marier avec Mary Jane. Pendant une nuit au parc, alors que Peter et Mary Jane sont ensemble, une petite météorite tombe tout près du lieu où ils se trouvent, et une particule s'en échappe, libérant, en éclatant, une matière visqueuse, la Venom, qui s'attache à la mobylette de Peter. Pendant ce temps, Flint Marko s'échappe de la prison où il était détenu pour cambriolage afin d'aller revoir sa fillette qui lui manque terriblement, mais dont il n'a pas le droit de s'approcher à cause de l'injonction d'éloignement obtenue contre lui par son ex-femme ; pendant sa fuite, il tombe dans un accélérateur de particules, qui fond son corps avec le sable et il devient l’Homme-Sable. Le meilleur ami de Peter, Harry Osborn, veut venger la mort de son père, et, croyant que Spider-Man est la cause de cette mort, l'attaque.", "Action, Science-Fiction", "Super-Héros", "2007-05-01", "Cinéma", null, null, "2:19:00", "USA", "Marvel", "Spider-Man");
INSERT INTO movies (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse)
VALUES ("Ju-On", "https://image.tmdb.org/t/p/original/xuLEYvlIvEsy19SYfzmG5PfFL8Y.jpg", "https://image.tmdb.org/t/p/original/rIuZGmnmEaMSsEN8xZa38kcjY4C.jpg", null, "https://www.youtube.com/embed/BxbBdEA7ZCQ?si=r-bRIR-sMOhpGxbt", "Shunsuke Kobayashi, instituteur primaire, apprend que l'un de ses élèves, Toshio Saeki, n'est pas venu à l'école depuis des jours. Il décide d'aller rencontrer la famille du petit garçon. Arrivé chez eux, il découvre la maison vide, en désordre, et ainsi que Toshio,seul, blessé, dans la salle de bain. Décidant d'attendre les parents, Takeo et Kayako Saeki, il décide d'apprendre ce qui s'est passé dans la maison. Mais en regardant par la fenêtre, des phénomènes étranges surgissent, ainsi qu'une silhouette blanche apparaissant au premier étage....", "Horreur", "Fantômes", "2000-02-11", "Cinéma", null, null, "1:10:00", "Japon", "Ju-On / The Grudge", null);
INSERT INTO movies (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse)
VALUES ("Ça", "https://image.tmdb.org/t/p/original/3SUz0F0I2Bodcj9Ev2pYSWnE9zp.jpg", "https://image.tmdb.org/t/p/original/rAQcPrEaPzDRVNX7XX5TWyxCGFN.jpg", "https://image.tmdb.org/t/p/original/orpkQDCphLW8nLRopfuEbPMZr1T.png", "https://www.youtube.com/embed/0zkm6IPr3Jw?si=KPoLoNFFEPzb8a55", "À Derry, dans le Maine, aux États-Unis, 7 gamins, ayant du mal à s’intégrer, se sont regroupés au sein du Club des Ratés. Rejetés par leurs camarades, ils sont les cibles favorites des gros durs de l’école. Ils ont aussi en commun d’avoir éprouvé leur plus grande terreur face à un terrible prédateur métamorphe qu’ils appellent Ça...", "Horreur", "Clown, Adaptation d'un livre", "2017-09-15", "Cinéma", null, null, "2:15:00", "USA", "ça", null);
INSERT INTO movies (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse)
VALUES ("Venom : The Last Dance", "https://image.tmdb.org/t/p/original/8mRrl8lc7TrbdA1PFzUhQ0nFZ7R.jpg", "https://image.tmdb.org/t/p/original/fUiKX7u3XZSxGn4sNszq1UQyxEb.jpg", "https://image.tmdb.org/t/p/original/3zyq38OmyZtEBeqhtUhGCBbj2R3.png", "https://www.youtube.com/embed/TEg5kTBN22I?si=e0nTNeIsxbiFAwkL", "Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie's last dance.", "Action, Science-Fiction", "Super-Héros", "2024-10-30", "Cinéma", null, null, "01:49:00", "USA", "Marvel", "Venom / Spider-Man");
INSERT INTO movies (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse)
VALUES ("Kraven The Hunter", "https://image.tmdb.org/t/p/original/1GvBhRxY6MELDfxFrete6BNhBB5.jpg", "https://image.tmdb.org/t/p/original/unNWOdnrdVraksBgMobtfvZpWpb.jpg", "https://image.tmdb.org/t/p/original/wEuiG5gakvzTthDVz0X5gfEz7T1.png", "https://www.youtube.com/embed/7T2vVYC6fb4?si=Xuur8RpRsnh-7OMg", "Sergei Kravinoff est un chasseur de gros gibier, qui prend un sérum magique lui donnant des capacités surhumaines et une vie plus longue...", "Action, Science-Fiction", "Super-Héros", "2024-12-11", "Cinéma", null, null, "02:07:00", "USA", "Marvel", "Spider-Man");
INSERT INTO movies (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse)
VALUES ("Spider-Man: Brand New Day", null, null, null, null, null, "Action, Science-Fiction", "Super-Héros", "2026-07-29", "Cinéma", null, null, null, "USA", "Marvel", "Spider-Man");


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
  subUniverse VARCHAR(255),
  release_date DATE,
  ending_date DATE,
  statut ENUM('En cours', 'Terminée', 'Fin de saison', 'Annulée') NULL,
  seasons INT,
  episodes INT,
  duration VARCHAR(255),
  country VARCHAR(255),
  screen ENUM('TV', 'Streaming'),
  streaming VARCHAR(255),
  original VARCHAR(255)
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
  duration TIME,
  FOREIGN KEY (serie_id) REFERENCES series(id) ON DELETE CASCADE,
  FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
  CONSTRAINT unique_episode_per_season_and_series UNIQUE(serie_id, season_id, episode_number)
);


/* Marvel's DAREDEVIL */
INSERT INTO series (title, poster, background, logo, trailer, synopsis, genre, theme, universe, subUniverse, release_date, ending_date, statut, seasons, episodes, country, screen, streaming, original)
VALUES ("Marvel's Daredevil", "https://image.tmdb.org/t/p/original/doJ6axLfzLCDaPqFSSHjaSTYKb2.jpg", "https://image.tmdb.org/t/p/original/rZ1ynks9dDkIR87KGNfhZFHfEgj.jpg", "https://image.tmdb.org/t/p/original/jbYIbMDDMP6gTA4VjBfoMDJ3L85.png", "https://www.youtube.com/embed/-g8fSUNeYIE?si=oy9p_w--BZUydVx0", "Victime d'un accident sur la route pendant son enfance, Matt Murdock perd la vue mais ses sens se sont décuplés d'une grande ampleur. Aujourd'hui, Matt Murdock partage une double vie et combat pour la justice de deux manières. Avocat de jour, et justicier masqué de nuit sous le nom de Daredevil.", "Action / Thriller", "Super-Héros / Enquêtes", "Marvel", "Daredevil", "2015-04-10", "2018-10-19", "Terminée", "3", "39", "USA", "TV", "Disney +", "Netflix");

INSERT INTO seasons (serie_id, season_number, poster, first_episode_date, last_episode_date, synopsis, episodes)
VALUES ("1", "1", "https://image.tmdb.org/t/p/original/kdLJYXXHF0JJO3gy7lUNSk3LPgK.jpg", "2015-04-10", "2015-04-10", "Matt Murdock et Foogy Nelson enquêtent sur l'affaire du meurtre dont la coupable se dit innocente. Murdock découvre que cette affaire en tant qu'avocat et son combat contre une organisation criminelle en tant que Daredevil ne font qu'un.", "13");

INSERT INTO episodes (serie_id, season_id, episode_number, title, image, release_date, synopsis, duration)
VALUES ("1", "1", "1", "Sur le ring", "https://image.tmdb.org/t/p/original/3qqMt1XCVFZNqWtMLMp2oGUH6AJ.jpg", "2015-04-10", "Matt Murdock & Foggy Nelson prennent la défense d'une femme accusée de meurtre.", "00:53:00");

INSERT INTO episodes (serie_id, season_id, episode_number, title, image, release_date, synopsis, duration)
VALUES ("1", "1", "2", "L'Homme blessé", "https://image.tmdb.org/t/p/original/ujNuAv6IkFAkl1JJ1c9VF1VtqUZ.jpg", "2015-04-10", "Matt Murdock est gravement blessé suite à la confrontation avec les Russes. Une infirmière le retrouve inconscient dans une benne et l'emmène pour le soigner.", "00:53:00");

INSERT INTO episodes (serie_id, season_id, episode_number, title, image, release_date, synopsis, duration)
VALUES ("1", "1", "3", "Un lapin dans une tempête de neige", "https://image.tmdb.org/t/p/original/J4CRudWRH10yG9fCcanDuvt1v7.jpg", "2015-04-10", "Matt Murdock & Foggy Nelson sont engagés pour défendre un homme qui a tué un mafieux. Karen Page demande des réponses à un reporter concernant son article sur Union Allied.", "00:53:00");

INSERT INTO episodes (serie_id, season_id, episode_number, title, image, release_date, synopsis, duration)
VALUES ("1", "1", "4", "Liens de sang", "https://image.tmdb.org/t/p/original/bD8xT2dViVjt4pKctc1f6Hj32sl.jpg", "2015-04-10", "Vladimir et Anatoly kidnappent Claire sur ordre de Fisk, pour attirer Daredevil. Ben Ulrich et Karen Page enquêtent sur Union Allied", "00:53:00");

INSERT INTO episodes (serie_id, season_id, episode_number, title, image, release_date, synopsis, duration)
VALUES ("1", "1", "5", "Un monde en feu", "https://image.tmdb.org/t/p/original/vif8R3u4lakvK5GAtXNzpZij9Jo.jpg", "2015-04-10", "Fisk met en oeuvre son plan pour détruire Hell's Kitchen, Matt et Foggy veulent défendre ses habitants d'un marchand de sommeil.", "00:56:00");

INSERT INTO episodes (serie_id, season_id, episode_number, title, image, release_date, synopsis, duration)
VALUES ("1", "1", "6", "Condamné", "https://image.tmdb.org/t/p/original/5mbtaKTQp3K5bI8iCJUoIm1RqI0.jpg", "2015-04-10", "Daredevil et Vladimir sont coincés dans un immeuble en ruine suite à une explosion dans Hell's Kitchen. Karen et Foggy sont à l'hôpital auprès des victimes, dont Elena.", "00:49:00");

INSERT INTO episodes (serie_id, season_id, episode_number, title, image, release_date, synopsis, duration)
VALUES ("1", "1", "7", "Stick", "https://image.tmdb.org/t/p/original/ov9Xq6OiMO9boaYwuC3PvmOEuXo.jpg", "2015-04-10", "Matt retrouve Stick, une ancienne connaissance, lui aussi aveugle, qui l'a entrainé aux arts martiaux et à contrôler ses autres sens. Stick demande à Matt de l'aider à trouver et détruire une arme secrète qui menace Hell's Kitchen.", "00:51:00");

INSERT INTO episodes (serie_id, season_id, episode_number, title, image, release_date, synopsis, duration)
VALUES ("1", "1", "8", "Jeu d'ombre", "https://image.tmdb.org/t/p/original/6gUMciNHfEvTj8CNqz5ZCVI3gej.jpg", "2015-04-10", "Matt découvre que Foggy & Karen travaillent avec Ben Urich pour faire tomber Fisk", "00:54:00");

INSERT INTO episodes (serie_id, season_id, episode_number, title, image, release_date, synopsis, duration)
VALUES ("1", "1", "9", "L'habit du diable", "https://image.tmdb.org/t/p/original/3qqMt1XCVFZNqWtMLMp2oGUH6AJ.jpg", "2015-04-10", "Fisk s'est présenté au monde comme le bienfaiteur de Hell's Kitchen, mais reste cependant très mystérieux. Matt va donc chercher à connaitre son ennemi par Vanessa, alors que Ben, Foggy et Karen vont fouiller son passé.", "00:58:00");

INSERT INTO episodes (serie_id, season_id, episode_number, title, image, release_date, synopsis, duration)
VALUES ("1", "1", "10", "Nelson contre Murdock", "https://image.tmdb.org/t/p/original/9iHXMhqpGrvHB5O6ngEolyeDojL.jpg", "2015-04-10", "Foggy apprend que Matt & Daredevil ne font qu'un, ce qui met en péril leur amitié. Pendant ce temps-là, Karen & Ben ont une discussion avec une personne proche de Fisk.", "00:57:00");

INSERT INTO episodes (serie_id, season_id, episode_number, title, image, release_date, synopsis, duration)
VALUES ("1", "1", "11", "La marche des vertueux", "https://image.tmdb.org/t/p/original/qe61mt255BsP8pmsCx51URUoers.jpg", "2015-04-10", "Matt Murdock se remet de ses blessures suite au combat contre Fisk et Nobu. Il rencontre l'homme qui a conçu les costumes de Fisk pour lui demander de créer un nouveau costume. Fisk est au chevet de Vanessa à l'hôpital, Wesley veut se charger seul de Karen.", "00:59:00");

INSERT INTO episodes (serie_id, season_id, episode_number, title, image, release_date, synopsis, duration)
VALUES ("1", "1", "12", "Ceux qui restent", "https://image.tmdb.org/t/p/original/910qlBTtpkUtwC5OSM50Noo9qEM.jpg", "2015-04-10", "Karen ne se remet pas de sa dernière rencontre avec Wesley. Fisk a tout découvert concernant Karen et Ben et décide de mettre un terme.", "01:00:00");

INSERT INTO episodes (serie_id, season_id, episode_number, title, image, release_date, synopsis, duration)
VALUES ("1", "1", "13", "Daredevil", "https://image.tmdb.org/t/p/original/wJRC62B12NMrHcsXWwPvI0OW8lB.jpg", "2015-04-10", "Karen, Foggy et Matt décident de frapper un grand coup pour arrêter Fisk. Fisk et Daredevil, sous un nouveau costume, s'affrontent enfin.", "00:56:00");
