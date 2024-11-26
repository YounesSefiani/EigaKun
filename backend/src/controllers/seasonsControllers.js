// Import access to database tables
const tables = require('../tables');

// const SeasonManager = require('../models/SeasonManager');

// const seasonsManager = new SeasonManager();

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all seasons from the database
    const seasons = await tables.seasons.readAll();

    // Respond with the seasons in JSON format
    res.json(seasons);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific season from the database based on the provided ID
    const season = await tables.seasons.read(req.params.id);

    // If the season is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the season in JSON format
    if (season == null) {
      res.sendStatus(404);
    } else {
      res.json(season);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateSeason = req.body;
    const { files } = req;

    const updatedSeasonDatas = {
      season_number: updateSeason.season_number || null,
      poster: files?.poster
        ? files.poster[0].filename
        : updateSeason.poster || null,
      first_episode_date: updateSeason.first_episode_date || null,
      last_episode_date: updateSeason.last_episode_date || null,
      trailer: updateSeason.trailer || null,
      synopsis: updateSeason.synopsis || null,
      episodes: updateSeason.episodes || null,
    };

    await tables.seasons.update(id, updatedSeasonDatas);

    const updatedSeason = await tables.seasons.read(id);

    if (!updatedSeason) {
      return res
        .status(404)
        .json({ message: 'Saison non trouvée ou mise à jour échouée.' });
    }

    return res.status(200).json({
      message: 'Saison mise à jour avec succès',
      updateSeason: updatedSeason,
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la saison:', err);
    next(err);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the season data from the request body
  const season = req.body;

  try {
    // Insert the season into the database
    const insertSeasonId = await tables.seasons.create(season);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted season
    res.status(201).json({ insertSeasonId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroy = async (req, res, next) => {
  try {
    await tables.seasons.delete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
// Ready to export the controller functions
module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
};
