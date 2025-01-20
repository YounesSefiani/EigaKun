// Import access to database tables
const tables = require('../tables');
const SerieCastingManager = require('../models/SerieCastingManager');

const serieCastingManager = new SerieCastingManager();

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all serieCasting from the database
    const serieCasting = await tables.serieCasting.readAll();

    // Respond with the serieCasting in JSON format
    res.json(serieCasting);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific serie casting from the database based on the provided ID
    const serieCasting = await tables.serieCasting.read(req.params.id);

    // If the serieCastingis not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the serieCasting JSON format
    if (serieCasting == null) {
      res.sendStatus(404);
    } else {
      res.json(serieCasting);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// Get Casting By Movie ID
const getCastingBySerieId = async (req, res, next) => {
  try {
    const { serieId } = req.params;
    const serieCasting = await serieCastingManager.castingBySerieId(serieId);
    res.json(serieCasting);
  } catch (err) {
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const serieCasting = req.body;
    const updatedRows = await serieCastingManager.update(id, serieCasting);

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
  try {
    // Extract the serieCastingdata from the request body
    const serieCasting = req.body;

    // Insert the serieCasting into the database
    const insertId = await serieCastingManager.create(serieCasting);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted serieCasting
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRows = await serieCastingManager.delete(id);

    if (deletedRows > 0) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  getCastingBySerieId,
  edit,
  add,
  destroy,
};
