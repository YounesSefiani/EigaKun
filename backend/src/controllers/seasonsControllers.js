const tables = require("../tables");
const fs = require('fs');
const path = require('path');

const browse = async (req, res, next) => {
  try {
    const seasons = await tables.seasons.readAllSeasons();
    res.json(seasons);
  } catch (err) {
    next(err);
  }
};

const read = async (req, res, next) => {
  const season = await tables.seasons.read(req.params.id);
  if (!season) {
    return res.status(404).json({ error: "Season not found" });
  }
  res.json(season);
};

const getSeasonsBySerie = async (req, res, next) => {
  const seasons = await tables.seasons.readBySerie(req.params.id);
  if (!seasons) {
    return res.status(404).json({ error: "Seasons not found" });
  }
  res.json(seasons);
};

const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateSeason = req.body;
    const { file } = req;

    const season = await tables.seasons.read(id);

    const updatedSeasonDatas = {
      id,
      season_number: updateSeason.season_number || season.season_number || null,
      episodes: updateSeason.episodes || season.episodes || null,
      release_date: updateSeason.release_date || season.release_date || null,
      poster: file
        ? file.filename
        : updateSeason.poster || season.poster || null,
      first_episode_date:
        updateSeason.first_episode_date || season.first_episode_date || null,
      last_episode_date:
        updateSeason.last_episode_date || season.last_episode_date || null,
      synopsis: updateSeason.synopsis || season.synopsis || null,
    };

    await tables.seasons.update(updatedSeasonDatas);

    const updatedSeason = await tables.seasons.read(id);

    if (!updatedSeason) {
      return res.status(404).json({ error: "Updated Season not found" });
    }

    return res.status(200).json({
      message: "Saison mise à jour avec succès",
      updateSeason: updatedSeason,
    });
  } catch (err) {
    next(err);
  }
};

const add = async (req, res, next) => {
  try {
    const seasonDatas = req.body;
    seasonDatas.poster = req.file ? req.file.filename : null;

    const result = await tables.seasons.create(seasonDatas);

    if (result && result.success === false) {
      // Supprime l'image si elle a été uploadée
      if (req.file) {
        const filePath = path.join(__dirname, '../assets/Series/Seasons/Posters', req.file.filename);
        fs.unlink(filePath, (err) => {
          if (err) console.error('Erreur lors de la suppression du fichier:', err);
        });
      }
      return res.status(400).json(result);
    }

    return res.status(201).json({ id: result, seasonDatas });
  } catch (err) {
    next(err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const season = await tables.seasons.read(id);
    if (!season) {
      return res.status(404).json({ error: "Season not found" });
    }
    await tables.seasons.delete(id);
    res.status(200).json({ message: "Season deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  browse,
  read,
  getSeasonsBySerie,
  edit,
  add,
  destroy,
};
