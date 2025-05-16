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
const readUserLikedMovies = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const movies = await tables.usersHasLiked.readLikedMovies(userId);

    if (!movies) {
      return res.status(404).send('Utilisateur introuvable.');
    }

    return res.json({
      id: movies.user.id,
      pseudo: movies.user.pseudo,
      likedMovies: movies.likedMovies,
    });
  } catch (err) {
    return next(err);
  }
};

const readUserLikedSeries = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const series = await tables.usersHasLiked.readLikedSeries(userId);

    if (!series) {
      return res.status(404).send('Utilisateur introuvable.');
    }

    return res.json({
      id: series.user.id,
      pseudo: series.user.pseudo,
      likedSeries: series.likedSeries,
    });
  } catch (err) {
    return next(err);
  }
};

const readUserLikedPersonalities = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const personalities =
      await tables.usersHasLiked.readLikedPersonalities(userId);

    if (!personalities) {
      return res.status(404).send('Utilisateur introuvable.');
    }

    return res.json({
      id: personalities.user.id,
      pseudo: personalities.user.pseudo,
      likedPersonalities: personalities.likedPersonalities,
    });
  } catch (err) {
    return next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateMovie = req.body;
    const { files } = req;

    const updatedMovieDatas = {
      title: updateMovie.title || null,
      release_date: updateMovie.release_date || null,
      genre: updateMovie.genre || null,
      theme: updateMovie.theme || null,
      universe: updateMovie.universe || null,
      subUniverse: updateMovie.subUniverse || null,
      synopsis: updateMovie.synopsis || null,
      poster: files?.poster
        ? files.poster[0].filename
        : updateMovie.poster || null,
      logo: files?.logo ? files.logo[0].filename : updateMovie.logo || null,
      background: files?.background
        ? files.background[0].filename
        : updateMovie.background || null,
      trailer: updateMovie.trailer || null,
      country: updateMovie.country || null,
      duration: updateMovie.duration || null,
      screen: updateMovie.screen || null,
      streaming: updateMovie.streaming || null,
    };

    await tables.favoritesMovies.update(id, updatedMovieDatas);

    const updatedMovie = await tables.favoritesMovies.read(id);

    if (!updatedMovie) {
      return res
        .status(404)
        .json({ message: 'Film non trouvé ou mise à jour échouée.' });
    }

    return res.status(200).json({
      message: 'Film mis à jour avec succès',
      updateMovie: updatedMovie,
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du film:', err);
    next(err);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// The A of BREAD - Add (Create) operation
const addLikedMovie = async (req, res, next) => {
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
    const likeMovie = {
      user_id: userId, // Utiliser userId directement
      movie_id: movieId, // Utiliser movieId directement
    };

    // Insérer le likedMovie dans la base de données
    const insertMovieId = await tables.usersHasLiked.toLikeMovie(likeMovie);

    // Répondre avec le statut HTTP 201 (Créé) et l'ID du film inséré
    return res.status(201).json({ insertMovieId });
  } catch (err) {
    // Passer toute erreur à la gestion des erreurs
    return next(err);
  }
};

const addLikedSerie = async (req, res, next) => {
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
    const likeSerie = {
      user_id: userId, // Utiliser userId directement
      serie_id: serieId, // Utiliser movieId directement
    };

    // Insérer le likedMovie dans la base de données
    const insertSerieId = await tables.usersHasLiked.toLikeSerie(likeSerie);

    // Répondre avec le statut HTTP 201 (Créé) et l'ID du film inséré
    return res.status(201).json({ insertSerieId });
  } catch (err) {
    // Passer toute erreur à la gestion des erreurs
    return next(err);
  }
};

const addLikedPersonality = async (req, res, next) => {
  // Récupérer l'ID utilisateur et de film depuis les paramètres de la route
  const { userId, personalityId } = req.params;

  // Vérifier que userId et movieId sont valides
  if (!userId || !personalityId) {
    return res.status(400).json({ error: 'Utilisateur ou série manquante' });
  }

  try {
    // Vérifier si l'utilisateur existe dans la base de données
    const user = await tables.users.read(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier si le film existe dans la base de données
    const personality = await tables.personalities.read(personalityId);
    if (!personality) {
      return res.status(404).json({ error: 'Personnalité non trouvée' });
    }

    // Créer un objet likedMovie avec l'user_id et movie_id
    const likePersonality = {
      user_id: userId, // Utiliser userId directement
      personality_id: personalityId, // Utiliser movieId directement
    };

    // Insérer le likedMovie dans la base de données
    const insertPersonalityId =
      await tables.usersHasLiked.toLikePersonality(likePersonality);

    // Répondre avec le statut HTTP 201 (Créé) et l'ID du film inséré
    return res.status(201).json({ insertPersonalityId });
  } catch (err) {
    // Passer toute erreur à la gestion des erreurs
    return next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroyLikeMovie = async (req, res, next) => {
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

    const unlikedMovie = {
      user_id: userId,
      movie_id: movieId,
    };

    const deleted = await tables.usersHasLiked.toUnlikeMovie(unlikedMovie);

    return res.status(201).json({ deleted, message: 'Le film a été retiré' });
  } catch (err) {
    return next(err);
  }
};

const destroyLikeSerie = async (req, res, next) => {
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

    const unlikedSerie = {
      user_id: userId,
      serie_id: serieId,
    };

    const deleted = await tables.usersHasLiked.toUnlikeSerie(unlikedSerie);

    return res.status(200).json({
      deleted,
      message: `La série ${serie.title} a été supprimé de vos séries adorées`,
    });
  } catch (err) {
    return next(err);
  }
};

const destroyLikePersonality = async (req, res, next) => {
  const { userId, personalityId } = req.params;

  if (!userId || !personalityId) {
    return res.status(400).send('Utilisateur ou film manquant.');
  }

  try {
    const user = await tables.users.read(userId);

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé.');
    }

    const personality = await tables.personalities.read(personalityId);

    if (!personality) {
      return res.status(404).send('Personnalité non trouvée.');
    }

    const unlikedPersonality = {
      user_id: userId,
      personality_id: personalityId,
    };

    const deleted =
      await tables.usersHasLiked.toUnlikePersonality(unlikedPersonality);

    return res
      .status(201)
      .json({ deleted, message: 'La personnalité a été retiré' });
  } catch (err) {
    return next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  readUserLikedMovies,
  readUserLikedSeries,
  readUserLikedPersonalities,
  edit,
  addLikedMovie,
  addLikedSerie,
  addLikedPersonality,
  destroyLikeMovie,
  destroyLikeSerie,
  destroyLikePersonality,
};
