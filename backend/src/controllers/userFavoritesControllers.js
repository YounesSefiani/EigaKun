const tables = require("../tables");

const addFavorite = async (req, res, next) => {
  try {
    const { favoriteId, favoriteType, status } = req.body;
    const userId = req.user.id;
    await tables.userFavorites.addFavorite(userId, favoriteId, favoriteType, status);
    res.status(200).json({ message: "Favori ajouté/mis à jour !" });
  } catch (err) {
    next(err);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    // Récupère depuis req.query au lieu de req.body
    const { favoriteId, favoriteType, status } = req.method === "DELETE" ? req.query : req.body;
    const userId = req.user.id;
    await tables.userFavorites.removeFavorite(userId, favoriteId, favoriteType, status);
    res.status(200).json({ message: "Favori supprimé !" });
  } catch (err) {
    next(err);
  }
};

const getAllFavoritesDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const favorites = await tables.userFavorites.getAllByUser(userId);

    // Regroupe les IDs par type et statut
    const moviesIds = favorites
      .filter(fav => fav.favorite_type === "movie")
      .map(fav => fav.favorite_id);
    const seriesIds = favorites
      .filter(fav => fav.favorite_type === "serie")
      .map(fav => fav.favorite_id);
    const personalitiesIds = favorites
      .filter(fav => fav.favorite_type === "personality")
      .map(fav => fav.favorite_id);

    // Récupère les infos détaillées en une seule requête par type
    let movies = [];
    let series = [];
    let personalities = [];

    if (moviesIds.length) {
      [movies] = await tables.movies.database.query(
        `SELECT movies.id AS movie_id, movies.title AS movie_title, movies.poster AS movie_poster FROM movies WHERE id IN (${moviesIds.map(() => "?").join(",")})`,
        moviesIds
      );
    }
    if (seriesIds.length) {
      [series] = await tables.series.database.query(
        `SELECT series.id AS serie_id, series.title AS serie_title, series.poster AS serie_poster FROM series WHERE id IN (${seriesIds.map(() => "?").join(",")})`,
        seriesIds
      );
    }
    if (personalitiesIds.length) {
      [personalities] = await tables.personalities.database.query(
        `SELECT personalities.id AS personality_id, personalities.fullname AS personality_fullname, personalities.image_src AS personality_image FROM personalities WHERE id IN (${personalitiesIds.map(() => "?").join(",")})`,
        personalitiesIds
      );
    }

    // Tu peux aussi renvoyer les statuts associés si besoin
    res.json({
      movies,
      series,
      personalities,
      rawFavorites: favorites, // pour retrouver les statuts si besoin
    });
  } catch (err) {
    next(err);
  }
};

const getFavoritesMovies = async (req, res, next) => {
  try {
    const userId = req.params.userId

    if(!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    const movies = await tables.userFavorites.getUserFavoritesMovies(userId);
    res.json(movies);
  } catch (err) {
    next(err);
  }
}

const getFavoritesSeries = async (req, res, next) => {
  try {
    const userId = req.params.userId

    if(!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    const series = await tables.userFavorites.getUserFavoritesSeries(userId);
    res.json(series);
  } catch (err) {
    next(err);
  }
}

const getFavoritesPersonalities = async (req, res, next) => {
  try {
    const userId = req.params.userId

    if(!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    const personalities = await tables.userFavorites.getUserFavoritesPersonalities(userId);
    res.json(personalities);
  } catch (err) {
    next(err);
  }
}


module.exports = { addFavorite, removeFavorite, getAllFavoritesDetails, getFavoritesMovies, getFavoritesSeries, getFavoritesPersonalities };