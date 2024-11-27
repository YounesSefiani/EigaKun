// Import access to database tables
const tables = require('../tables');

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all movies from the database
    const movies = await tables.movies.readAll();

    // Respond with the movies in JSON format
    res.json(movies);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific movie from the database based on the provided ID
    const movie = await tables.movies.read(req.params.id);

    // If the movie is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the movie in JSON format
    if (movie == null) {
      res.sendStatus(404);
    } else {
      res.json(movie);
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

    await tables.movies.update(id, updatedMovieDatas);

    const updatedMovie = await tables.movies.read(id);

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
const add = async (req, res, next) => {
  // Extract the movie data from the request body
  const movie = req.body;
  const { files } = req;

  const movieData = {
    ...movie,
    poster: files.poster ? files.poster[0].filename : null,
    background: files.background ? files.background[0].filename : null,
    logo: files.logo ? files.logo[0].filename : null,
  };

  try {
    // Insert the movie into the database
    const insertMovieId = await tables.movies.create(movieData);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted movie
    res.status(201).json({ insertMovieId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroy = async (req, res, next) => {
  try {
    await tables.movies.delete(req.params.id);
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
