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
const readUserIsWatchingSeries = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const series =
      await tables.usersIsWatchingSeries.readIsWatchingSeries(userId);

    if (!series) {
      return res.status(404).send('Utilisateur introuvable.');
    }

    return res.json({
      id: series.user.id,
      pseudo: series.user.pseudo,
      isWatchingSeries: series.isWatchingSeries,
    });
  } catch (err) {
    return next(err);
  }
};
// The A of BREAD - Add (Create) operation

const addIsWatchingSerie = async (req, res, next) => {
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
    const isWatchingSerie = {
      user_id: userId, // Utiliser userId directement
      serie_id: serieId, // Utiliser movieId directement
    };

    // Insérer le likedMovie dans la base de données
    const insertSerieId =
      await tables.usersIsWatchingSeries.isWatchingSerie(isWatchingSerie);

    // Répondre avec le statut HTTP 201 (Créé) et l'ID du film inséré
    return res.status(201).json({ insertSerieId });
  } catch (err) {
    // Passer toute erreur à la gestion des erreurs
    return next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation

const destroyIsWatchingSerie = async (req, res, next) => {
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

    const isNotWatchingSerie = {
      user_id: userId,
      serie_id: serieId,
    };

    const deleted =
      await tables.usersIsWatchingSeries.deleteIsWatchingSerie(
        isNotWatchingSerie
      );

    return res.status(200).json({
      deleted,
      message: `Vous ne regardez plus la série "${serie.title}".`,
    });
  } catch (err) {
    return next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  readUserIsWatchingSeries,
  addIsWatchingSerie,
  destroyIsWatchingSerie,
};
