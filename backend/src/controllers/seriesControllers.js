const tables = require("../tables");

// B - BREAD - READ ALL
const browse = async (req, res, next) => {
  try {
    const series = await tables.series.readAllSeries();
    res.json(series);
  } catch (err) {
    next(err);
  }
};

// R - BREAD - READ ONE
const read = async (req, res, next) => {
  const serie = await tables.series.read(req.params.id);
  if (!serie) {
    return res.status(404).json({ error: "Serie not found" });
  }
  res.json(serie);
};

// FULL SERIE

const getFullSerie = async (req, res, next) => {
  try {
    const serie = await tables.series.read(req.params.id);
    if (!serie) {
      return res.status(404).json({ error: "Cette série n'existe pas." });
    }

    const casting = await tables.serieCasting.readBySerie(serie.id);
    serie.casting = casting || [];

    const seasons = await tables.seasons.readBySerie(serie.id);

    const seasonsWithEpisodes = await Promise.all(
      seasons.map(async (season) => {
        const episodes = await tables.episodes.readBySeason(season.id);
        return { ...season, episodes: episodes || season.episodes };
      })
    );

    const fullSerie = {
      ...serie,
      seasons: seasonsWithEpisodes,
    };
    res.json(fullSerie);
  } catch (err) {
    console.error("Erreur dans getFullSerie:", err);
    res.status(500).json({ error: "Erreur Serveur" });
  }
};

// E - BREAD - EDIT
const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateSerie = req.body;
    const { files } = req;

    const serie = await tables.series.read(id);

    const updatedSerieDatas = {
      id,
      title: updateSerie.title || serie.title,
      release_date: updateSerie.release_date || serie.release_date || null,
      ending_date: updateSerie.ending_date || serie.ending_date || null,
      genre: updateSerie.genre || serie.genre || null,
      theme: updateSerie.theme || serie.theme || null,
      universe: updateSerie.universe || serie.universe || null,
      subUniverse: updateSerie.subUniverse || serie.subUniverse || null,
      synopsis: updateSerie.synopsis || serie.synopsis || null,
      poster: files?.poster
        ? files.poster[0].filename
        : updateSerie.poster || serie.poster || null,
      logo: files?.logo
        ? files.logo[0].filename
        : updateSerie.logo || serie.logo || null,
      background: files?.background
        ? files.background[0].filename
        : updateSerie.background || serie.background || null,
      statut: updateSerie.statut || serie.statut || null,
      seasons: updateSerie.seasons || serie.seasons || null,
      episodes: updateSerie.episodes || serie.episodes || null,
      trailer: updateSerie.trailer || serie.trailer || null,
      country: updateSerie.country || serie.country || null,
      duration: updateSerie.duration || serie.duration || null,
      screen: updateSerie.screen || serie.screen || null,
      streaming: updateSerie.streaming || serie.streaming || null,
      original: updateSerie.original || serie.original || null,
    };

    await tables.series.update(updatedSerieDatas);

    const updatedSerie = await tables.series.read(id);

    if (!updatedSerie) {
      return res
        .status(404)
        .json({ message: "Serie non trouvée ou misee à jour échouée." });
    }

    return res.status(200).json({
      message: "Serie mise à jour avec succès",
      updateSerie: updatedSerie,
    });
  } catch (err) {
    console.error("Erreur lors de la misee à jour du série:", err);
    next(err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// A - BREAD - ADD
const add = async (req, res, next) => {
  const serie = req.body;
  const { files } = req;

  const serieDatas = {
    ...serie,
    poster: files?.poster ? files.poster[0].filename : null,
    logo: files?.logo ? files.logo[0].filename : null,
    background: files?.background ? files.background[0].filename : null,
  };
  try {
    const insertSerieId = await tables.series.create(serieDatas);
    res.status(201).json({ id: insertSerieId, serieDatas });
  } catch (err) {
    next(err);
  }
};

// D - BREAD - DELETE
const destroy = async (req, res, next) => {
  try {
    const serie = await tables.series.read(req.params.id);
    if (!serie) {
      return res.status(404).json({ error: "Serie not found" });
    }
    await tables.series.delete(req.params.id);
    res.status(200).json({ message: "Serie supprimée !" });
  } catch (err) {
    next(err);
  }
};

module.exports = { browse, add, read, getFullSerie, edit, destroy };
