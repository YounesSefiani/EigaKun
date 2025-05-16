// Import access to database tables
const tables = require('../../tables');

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all favoritesMovies from the database
    const usersFavorites = await tables.usersFavorites.readAll();

    // Respond with the favoritesMovies in JSON format
    res.json(usersFavorites);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const readUserSeenMovies = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const movies = await tables.usersHasSeen.readSeenMovies(userId);

    if (!movies) {
      return res.status(404).send('Utilisateur introuvable.');
    }

    return res.json({
      id: movies.user.id,
      pseudo: movies.user.pseudo,
      seenMovies: movies.seenMovies,
    });
  } catch (err) {
    return next(err);
  }
};

const readUserSeenSeries = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const series = await tables.usersHasSeen.readSeenSeries(userId);

    if (!series) {
      return res.status(404).send('Utilisateur introuvable.');
    }

    return res.json({
      id: series.user.id,
      pseudo: series.user.pseudo,
      seenSeries: series.seenSeries,
    });
  } catch (err) {
    return next(err);
  }
};

// The A of BREAD - Add (Create) operation
const addSeenMovie = async (req, res, next) => {
  // Récupérer l'ID utilisateur et de film depuis les paramètres de la route
  const { userId, movieId } = req.params;

  // Vérifier que userId et movieId sont valides
  if (!userId || !movieId) {
    return res.status(400).json({ error: 'Utilisateur ou film manquant' });
  }

  try {
    // Vérifier si l'utilisateur existe dans la base de données
    const user = await tables.users.read(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier si le film existe dans la base de données
    const movie = await tables.movies.read(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Film non trouvé' });
    }

    // Créer un objet likedMovie avec l'user_id et movie_id
    const seenMovie = {
      user_id: userId, // Utiliser userId directement
      movie_id: movieId, // Utiliser movieId directement
    };

    // Insérer le likedMovie dans la base de données
    const insertMovieId = await tables.usersHasSeen.hasSeenMovie(seenMovie);

    // Répondre avec le statut HTTP 201 (Créé) et l'ID du film inséré
    return res.status(201).json({ insertMovieId });
  } catch (err) {
    // Passer toute erreur à la gestion des erreurs
    return next(err);
  }
};

const addSeenSerie = async (req, res, next) => {
  // Récupérer l'ID utilisateur et de film depuis les paramètres de la route
  const { userId, serieId } = req.params;

  // Vérifier que userId et movieId sont valides
  if (!userId || !serieId) {
    return res.status(400).json({ error: 'Utilisateur ou série manquante' });
  }

  try {
    // Vérifier si l'utilisateur existe dans la base de données
    const user = await tables.users.read(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier si le film existe dans la base de données
    const serie = await tables.series.read(serieId);
    if (!serie) {
      return res.status(404).json({ error: 'Série non trouvée' });
    }

    // Créer un objet likedMovie avec l'user_id et movie_id
    const seenSerie = {
      user_id: userId, // Utiliser userId directement
      serie_id: serieId, // Utiliser movieId directement
    };

    // Insérer le likedMovie dans la base de données
    const insertSerieId = await tables.usersHasSeen.hasSeenSerie(seenSerie);

    // Répondre avec le statut HTTP 201 (Créé) et l'ID du film inséré
    return res.status(201).json({ insertSerieId });
  } catch (err) {
    // Passer toute erreur à la gestion des erreurs
    return next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroySeenMovie = async (req, res, next) => {
  const { userId, movieId } = req.params;

  if (!userId || !movieId) {
    return res.status(400).send('Utilisateur ou film manquant.');
  }

  try {
    const user = await tables.users.read(userId);

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé.');
    }

    const movie = await tables.movies.read(movieId);

    if (!movie) {
      return res.status(404).send('Film non trouvé.');
    }

    const unseenMovie = {
      user_id: userId,
      movie_id: movieId,
    };

    const deleted = await tables.usersHasSeen.unseenMovie(unseenMovie);

    return res.status(201).json({ deleted, message: 'Le film a été retiré' });
  } catch (err) {
    return next(err);
  }
};

const destroySeenSerie = async (req, res, next) => {
  const { userId, serieId } = req.params;

  if (!userId || !serieId) {
    return res.status(400).send('Utilisateur ou film manquant.');
  }

  try {
    const user = await tables.users.read(userId);

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé.');
    }

    const serie = await tables.series.read(serieId);

    if (!serie) {
      return res.status(404).send('Série non trouvée.');
    }

    const unseenSerie = {
      user_id: userId,
      serie_id: serieId,
    };

    const deleted = await tables.usersHasSeen.unseenSerie(unseenSerie);

    return res.status(201).json({ deleted, message: 'Le film a été retiré' });
  } catch (err) {
    return next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  readUserSeenMovies,
  readUserSeenSeries,
  addSeenMovie,
  addSeenSerie,
  destroySeenMovie,
  destroySeenSerie,
};
