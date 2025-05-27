const tables = require("../tables");

const browse = async (req, res, next) => {
  try {
    const movieCastings = await tables.movieCasting.readAll();
    res.json(movieCastings);
  } catch (err) {
    next(err);
  }
};

const read = async (req, res, next) => {
  const movieCasting = await tables.movieCasting.read(req.params.id);
  if (!movieCasting) {
    return res.status(404).json({ error: "Movie casting not found" });
  }
  res.json(movieCasting);
};

const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateMovieCasting = req.body;

    const movieCasting = await tables.movieCasting.read(id);

    const updatedMovieCastingDatas = {
      id,
      movie_id: updateMovieCasting.movie_id || movieCasting.movie_id || null,
      personality_id:
        updateMovieCasting.personality_id ||
        movieCasting.personality_id || null,
      role: updateMovieCasting.role || movieCasting.role || null,
      side: updateMovieCasting.side || movieCasting.side || null,
    };

    await tables.movieCasting.update(updatedMovieCastingDatas);

    const updatedMovieCasting = await tables.movieCasting.read(id);
    if (!updatedMovieCasting) {
      return res.status(404).json({ error: "Updated Movie Casting not found" });
    }
    res.json(updatedMovieCasting);
  } catch (err) {
    next(err);
  }
};

const add = async (req, res, next) => {
  try {
    const movieCasting = req.body;
    const result = await tables.movieCasting.create(movieCasting);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await tables.movieCasting.delete(id);
    if (result === 0) {
      return res.status(404).json({ error: "Movie casting not found" });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {browse, add, read, edit, destroy};