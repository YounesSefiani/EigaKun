// Import access to database tables
const tables = require('../tables');

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

    // If the episode is not found, respond with HTTP 404 (Not Found)
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

const wholeSerie = async (req, res, next) => {
  try {
    const serieId = req.params.id;
    const serie = await tables.series.read(serieId);

    if (!serie) {
      return res.status(404).json({ message: 'Serie not found' });
    }
    const seasons = await movieCastingManager.readByMovieId(serieId);
    serie.seasons = seasons;
    return res.json(serie);
  } catch (err) {
    return next(err);
  }
};


// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateEpisode = {
      ...req.body,
      image: req.file ? req.file.filename : null,
    };

    await tables.episodes.update(id, updateEpisode);

    const updatedEpisode = await tables.episodes.read(id);

    if (!updatedEpisode) {
      return res
        .status(404)
        .json({ message: 'Episode non trouvé ou mise à jour échouée.' });
    }

    return res.status(200).json({
      message: 'Episode mis à jour avec succès',
      updateEpisode: updatedEpisode,
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'épisode:", err);
    next(err);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the episode data from the request body
  const episode = {
    ...req.body,
    image: req.file ? req.file.filename : null,
  };

  try {
    // Insert the episode into the database
    const insertEpisodeId = await tables.episodes.create(episode);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted episode
    res.status(201).json({ insertEpisodeId });
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
  edit,
  add,
  destroy,
};
