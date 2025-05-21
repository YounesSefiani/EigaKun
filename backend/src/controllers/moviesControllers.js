const tables = require('../tables');

// B - BREAD - READ ALL
const browse = async (req, res, next) => {
    try {
        const movies = await tables.movies.readAllMovies();
        res.json(movies);
    } catch (err) {
        next(err);
    }
};

// R - BREAD - READ ONE
const read = async (req, res, next) => {
    const movie = await tables.movies.read(req.params.id);
    if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
}

// E - BREAD - EDIT
const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateMovie = req.body;
    const { files } = req;

    const updatedMovieDatas = {
        id,
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
      original: updateMovie.original || null
    };

    await tables.movies.update(updatedMovieDatas);

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

// A - BREAD - ADD
const add = async (req, res, next) => {
    const movie = req.body;
    const { files } = req;

    const movieDatas = {
      ...movie,
      poster: files?.poster ? files.poster[0].filename : null,
      logo: files?.logo ? files.logo[0].filename : null,
      background: files?.background ? files.background[0].filename : null,
    }
    try {
        const insertMovieId = await tables.movies.create(movieDatas);
        res.status(201).json({ id: insertMovieId, movieDatas });
    } catch (err) {
        next(err);
    }
};

// D - BREAD - DELETE
const destroy = async (req, res, next) => {
    try {
        const movie = await tables.movies.read(req.params.id);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        await tables.movies.delete(req.params.id);
        res.status(200).json({ error: 'Film supprimé !'});
    } catch (err) {
        next(err);
    }
};




module.exports = { browse, add, read, edit, destroy };