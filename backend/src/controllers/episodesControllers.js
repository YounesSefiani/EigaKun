// Import access to database tables
const tables = require("../tables");

const EpisodesManager = require("../models/EpisodeManager");
const SeasonsManager = require("../models/SeasonManager");

const episodesManager = new EpisodesManager();
const seasonsManager = new SeasonsManager();

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all episodes from the database
    const episodes = await tables.episodes.readAll();

    // Respond with the episodes in JSON format
    res.json(episodes);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific episode from the database based on the provided ID
    const episode = await tables.episodes.read(req.params.id);

    // If the episodes is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the episode in JSON format
    if (episode == null) {
      res.sendStatus(404);
    } else {
      res.json(episode);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const getEpisodesBySeasonId = async (req, res, next) => {
  try {
    const seasonId = req.params.id;
    const seasons = await seasonsManager.read(seasonId);
    if (seasons === null) {
      res.sendStatus(404);
      return;
    }
    const episodes = await episodesManager.readBySeasonId(seasonId);
    seasons.episodes = episodes;
    res.json({ seasons, episodes });
  } catch (err) {
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const episode = req.body;
    const updatedRows = await episodesManager.update(id, episode);

    if (updatedRows > 0) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the episode data from the request body
  const episode = req.body;

  try {
    // Insert the episode into the database
    const insertId = await tables.episodes.create(episode);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted episodes
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroy = async (req, res, next) => {
  try {
    await tables.episodes.delete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  getEpisodesBySeasonId,
  edit,
  add,
  destroy,
};
