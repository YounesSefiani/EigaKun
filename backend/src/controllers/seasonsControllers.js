// Import access to database tables
const tables = require("../tables");

const SeasonsManager = require("../models/SeasonManager");

const seasonsManager = new SeasonsManager();

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

    // If the seasons is not found, respond with HTTP 404 (Not Found)
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

const getSeasonsBySerieId = async (req, res, next) => {
  try {
    const { serieId } = req.params;
    const seasons = await seasonsManager.readBySerieId(serieId);
    res.json(seasons);
  } catch (err) {
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const seasons = req.body;
    const updatedRows = await seasonsManager.update(id, seasons);

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
  // Extract the seasons data from the request body
  const season = req.body;

  try {
    // Insert the seasons into the database
    const insertId = await tables.seasons.create(season);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted seasons
    res.status(201).json({ insertId });
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
  getSeasonsBySerieId,
  edit,
  add,
  destroy,
};
