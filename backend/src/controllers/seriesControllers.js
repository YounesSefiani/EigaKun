// Import access to database tables
const tables = require('../tables');

const SerieCastingManager = require('../models/SerieCastingManager');

const serieCastingManager = new SerieCastingManager();

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all series from the database
    const series = await tables.series.readAll();

    // Respond with the series in JSON format
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
    const serie = await tables.series.read(req.params.id);

    // If the serie is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the serie in JSON format
    if (serie == null) {
      res.sendStatus(404);
    } else {
      res.json(serie);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const fullSerie = async (req, res, next) => {
  try {
    const serieId = req.params.id;
    const serie = await tables.series.read(serieId);

    if (!serie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    const casting = await serieCastingManager.castingBySerieId(serieId);
    serie.casting = casting;

    const seasons = await tables.seasons.readBySerieId(serieId);
    serie.seasons = seasons;

    const episodes = await tables.episodes.readBySerieId(serieId);
    serie.episodes = episodes;
    return res.json(serie);
  } catch (err) {
    return next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateSerie = req.body;
    const { files } = req;

    const updatedSerieDatas = {
      title: updateSerie.title || null,
      release_date: updateSerie.release_date || null,
      ending_date: updateSerie.ending_date || null,
      seasons: updateSerie.seasons || null,
      episodes: updateSerie.episodes || null,
      genre: updateSerie.genre || null,
      theme: updateSerie.theme || null,
      statut: updateSerie.statut || null,
      universe: updateSerie.universe || null,
      subUniverse: updateSerie.subUniverse || null,
      synopsis: updateSerie.synopsis || null,
      poster: files?.poster
        ? files.poster[0].filename
        : updateSerie.poster || null,
      logo: files?.logo ? files.logo[0].filename : updateSerie.logo || null,
      background: files?.background
        ? files.background[0].filename
        : updateSerie.background || null,
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

    return res.status(200).json({
      message: 'Série mise à jour avec succès',
      updateSerie: updatedSerie,
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la série:', err);
    next(err);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the serie data from the request body
  const serie = req.body;
  const { files } = req;

  const serieData = {
    ...serie,
    poster: files.poster ? files.poster[0].filename : null,
    background: files.background ? files.background[0].filename : null,
    logo: files.logo ? files.logo[0].filename : null,
  };

  try {
    // Insert the serie into the database
    const insertSerieId = await tables.series.create(serieData);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted serie
    res.status(201).json({ insertSerieId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
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
  fullSerie,
  edit,
  add,
  destroy,
};
