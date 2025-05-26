const tables = require("../tables");
const fs = require('fs');
const path = require('path');

const browse = async (req, res, next) => {
  try {
    const episodes = await tables.episodes.readAllEpisodes();
    res.json(episodes);
  } catch (err) {
    next(err);
  }
};

const read = async (req, res, next) => {
  const episode = await tables.episodes.read(req.params.id);
  if (!episode) {
    return res.status(404).json({ error: "Episode not found" });
  }
  res.json(episode);
};

const getEpisodesBySeason = async (req, res, next) => {
  const episodes = await tables.episodes.readBySeason(req.params.id);
  if (!episodes) {
    return res.status(404).json({ error: "Episodes not found" });
  }
  res.json(episodes);
};

const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateEpisode = req.body;
    const { file } = req;

    const episode = await tables.episodes.read(id);

    const updatedEpisodeDatas = {
      id,
      serie_id: updateEpisode.serie_id || episode.serie_id || null,
        season_id: updateEpisode.season_id || episode.season_id || null,
              episode_number: updateEpisode.episode_number || episode.episode_number || null,
      title: updateEpisode.title || episode.title || null,
      synopsis: updateEpisode.synopsis || episode.synopsis || null,
        image: file ? file.filename : updateEpisode.image || episode.image || null,
        release_date: updateEpisode.release_date || episode.release_date || null,
        duration: updateEpisode.duration || episode.duration || null
    };

    await tables.episodes.update(updatedEpisodeDatas);

    const updatedEpisode = await tables.episodes.read(id);

    if (!updatedEpisode) {
      return res.status(404).json({ error: "Updated Episode not found" });
    }

    return res.status(200).json({
      message: "Episode mise à jour avec succès",
      updateEpisode: updatedEpisode,
    });
  } catch (err) {
    next(err);
  }
};

const add = async (req, res, next) => {
  try {
    const episodeDatas = req.body;
    episodeDatas.image = req.file ? req.file.filename : null;

    const result = await tables.episodes.create(episodeDatas);

    if (!result.success) {
      // Si un fichier a été uploadé, on le supprime
      if (req.file) {
        const filePath = path.join(__dirname, '../assets/Series/Episodes/Images', req.file.filename);
        fs.unlink(filePath, (err) => {
          if (err) console.error('Erreur lors de la suppression du fichier:', err);
        });
      }
      return res.status(400).json(result); // <-- Correction ici
    }

    return res.status(201).json(result);
  } catch (err) {
    next(err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const episode = await tables.episodes.read(id);
    if (!episode) {
      return res.status(404).json({ error: "Episode not found" });
    }
    await tables.episodes.delete(id);
    res.status(200).json({ message: "Episode deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  browse,
  read,
  getEpisodesBySeason,
  edit,
  add,
  destroy,
};
