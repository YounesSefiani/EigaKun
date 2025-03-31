// Import access to database tables
const tables = require('../tables');

const SeasonsManager = require('../models/SeasonManager');

const EpisodesManager = require('../models/EpisodeManager');

const SerieCastingManager = require('../models/SerieCastingManager');

const serieCastingManager = new SerieCastingManager();

const seasonsManager = new SeasonsManager();

const episodesManager = new EpisodesManager();

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all series from the database
    const series = await tables.series.readAll();

    // Respond with the seriess in JSON format
    res.json(series);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific serie from the database based on the provided ID
    const series = await tables.series.read(req.params.id);

    // If the series is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the serie in JSON format
    if (series == null) {
      res.sendStatus(404);
    } else {
      res.json(series);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// eslint-disable-next-line consistent-return
const getFullSerie = async (req, res) => {
  try {
    const serieId = req.params.id;

    if (!serieId) {
      return res.status(400).send("L'id de la série est requis");
    }

    const serie = await tables.series.read(serieId);

    if (!serie) {
      return res.status(404).send('Série non trouvée');
    }

    const casting = await serieCastingManager.castingBySerieId(serie.id);

    serie.casting = casting;

    const seasons = await seasonsManager.readBySerieId(serie.id);

    const seasonsWithEpisodes = await Promise.all(
      seasons.map(async (season) => {
        const episodes = await episodesManager.readBySeasonId(season.id);
        return { ...season, episodes };
      })
    );

    const serieWithDetails = { ...serie, seasons: seasonsWithEpisodes };

    res.json(serieWithDetails);
  } catch (err) {
    res.status(500).send('Erreur Serveur');
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateSerie = req.body;
    const { files } = req;

    // Filtrer les champs valides pour la mise à jour
    const updatedSerieDatas = {
      title: updateSerie.title || null,
      release_date: updateSerie.release_date || null,
      ending_date: updateSerie.ending_date || null,
      statut: updateSerie.statut || null,
      seasons: updateSerie.seasons || null,
      episodes: updateSerie.episodes || null,
      genre: updateSerie.genre || null,
      theme: updateSerie.theme || null,
      universe: updateSerie.universe || null,
      synopsis: updateSerie.synopsis || null,
      poster: files?.poster
        ? files.poster[0].filename
        : updateSerie.poster || null,
      logo: files?.logo ? files.logo[0].filename : updateSerie.logo || null,
      trailer: updateSerie.trailer || null,
      country: updateSerie.country || null,
      screen: updateSerie.screen || null,
      streaming: updateSerie.streaming || null,
    };

    await tables.series.update(id, updatedSerieDatas);

    const updatedSerie = await tables.series.read(id);

    if (!updatedSerie) {
      return res
        .status(404)
        .json({ message: 'Série non trouvée ou mise à jour échouée.' });
    }

    res.status(200).json({
      message: 'Série mise à jour avec succès',
      updateSerie: updatedSerie,
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la série:', err);
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  const serie = req.body;
  const { files } = req;

  const serieData = {
    ...serie,
    poster: files.poster ? files.poster[0].filename : null,
    background: files.background ? files.background[0].filename : null,
    logo: files.logo ? files.logo[0].filename : null,
  };

  try {
    // Insérer le film dans la base de données
    const insertSerieId = await tables.series.create(serieData);

    // Répondre avec le statut HTTP 201 (Créé) et l'ID du film nouvellement inséré
    res.status(201).json({ insertSerieId });
  } catch (err) {
    // Passer les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroy = async (req, res, next) => {
  try {
    await tables.series.delete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  getFullSerie,
  edit,
  add,
  destroy,
};
