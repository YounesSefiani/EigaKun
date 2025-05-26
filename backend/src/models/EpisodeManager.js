const AbstractManager = require("./AbstractManager");

class EpisodeManager extends AbstractManager {
  constructor() {
    super({ table: "episodes" });
  }

  // C - CRUD - Create
  async create(episode) {
    try {
      // Vérifie que la série existe
      const [serie] = await this.database.query(
        `SELECT * FROM series WHERE id = ?`,
        [episode.serie_id]
      );
      if (serie.length === 0) {
        return { success: false, message: "Serie non trouvée !" };
      }

      // Vérifie que la saison existe
      const [season] = await this.database.query(
        `SELECT * FROM seasons WHERE id = ?`,
        [episode.season_id]
      );
      if (season.length === 0) {
        return { success: false, message: "Saison non trouvée !" };
      }

      // Récupère le nombre max d'épisodes pour la saison
      const maxEpisodes = season[0].episodes;

      // Vérifie si le numéro d'épisode dépasse la limite
      if (episode.episode_number > maxEpisodes) {
        return {
          success: false,
          message: `Le numéro d'épisode (${episode.episode_number}) dépasse le nombre maximum d'épisodes (${maxEpisodes}) pour cette saison.`,
        };
      }

      // Vérifie si l'épisode existe déjà
      const [existingEpisode] = await this.database.query(
        `SELECT * FROM ${this.table} WHERE serie_id = ? AND season_id = ? AND episode_number = ?`,
        [episode.serie_id, episode.season_id, episode.episode_number]
      );
      if (existingEpisode.length > 0) {
        return {
          success: false,
          message: "Cette episode existe déjà dans la saison !",
        };
      }

      // Vérifie qu'il n'y a pas de "trou" dans la numérotation
      if (episode.episode_number > 1) {
        const [previousEpisodes] = await this.database.query(
          `SELECT episode_number FROM episodes WHERE serie_id = ? AND season_id = ? AND episode_number < ? ORDER BY episode_number ASC`,
          [episode.serie_id, episode.season_id, episode.episode_number]
        );
        if (previousEpisodes.length < episode.episode_number - 1) {
          // Récupère tous les épisodes existants de la saison pour aider l'utilisateur
          const [episodesOfSeasonRaw] = await this.database.query(
            `SELECT episode_number, title FROM episodes WHERE serie_id = ? AND season_id = ? ORDER BY episode_number ASC`,
            [episode.serie_id, episode.season_id]
          );
          // On s'assure que c'est bien un tableau
          const episodes = Array.isArray(episodesOfSeasonRaw)
            ? episodesOfSeasonRaw
            : [];
          console.log("episodes à renvoyer :", episodes);
          return {
            success: false,
            message: "Veuillez ajouter le ou les épisodes avant celui-ci !",
            episodes,
          };
        }
      }

      // Vérifie qu'on ne dépasse pas le nombre total d'épisodes autorisé (sécurité)
      const [currentEpisodes] = await this.database.query(
        `SELECT COUNT(*) as count FROM episodes WHERE serie_id = ? AND season_id = ?`,
        [episode.serie_id, episode.season_id]
      );
      const episodesCount = currentEpisodes[0].count;
      if (episodesCount >= maxEpisodes) {
        return {
          success: false,
          message: `Le nombre maximum de episodes est de (${maxEpisodes}). Par conséquent, ce nombre max a été atteint !`,
        };
      }

      // Création de l'épisode
      const [resultEpisode] = await this.database.query(
        `INSERT INTO ${this.table} (serie_id, season_id, episode_number, title, image, release_date, synopsis, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          episode.serie_id,
          episode.season_id,
          episode.episode_number,
          episode.title,
          episode.image,
          episode.release_date,
          episode.synopsis,
          episode.duration,
        ]
      );

      return {
        success: true,
        message: "Episode créé avec succès !",
        episode: {
          id: resultEpisode.insertId,
          serie_id: episode.serie_id,
          season_id: episode.season_id,
          episode_number: episode.episode_number,
          title: episode.title,
          image: episode.image,
          release_date: episode.release_date,
          synopsis: episode.synopsis,
        },
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // R - CRUD - Read
  async readAllEpisodes() {
    const [episodes] = await this.database.query(`SELECT * FROM ${this.table}`);
    return episodes;
  }
  async read(id) {
    const [episode] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return episode[0];
  }

  async readBySerie(serieId) {
    const [serie] = await this.database.query(
      `SELECT series.id AS serie_id, series.title AS serie_title, ${this.table}.*
        FROM ${this.table}
        JOIN series ON ${this.table}.serie_id = series.id
        WHERE ${this.table}.serie_id = ?`,
      [serieId]
    );

    return serie;
  }

  async readBySeason(seasonId) {
    const [episodes] = await this.database.query(
      `SELECT seasons.id AS season_id, ${this.table}.*
        FROM ${this.table}
        JOIN seasons ON ${this.table}.season_id = seasons.id
        WHERE ${this.table}.season_id = ?`,
      [seasonId]
    );
    return episodes;
  }

  // U - CRUD - Update
  async update(episode) {
    const [updateEpisode] = await this.database.query(
      `UPDATE ${this.table} SET serie_id = ?, season_id = ?, episode_number = ?, title = ?, image = ?, release_date = ?, synopsis = ?, duration = ? WHERE id = ?`,
      [
        episode.serie_id,
        episode.season_id,
        episode.episode_number,
        episode.title,
        episode.image,
        episode.release_date,
        episode.synopsis,
        episode.duration,
        episode.id,
      ]
    );
    return updateEpisode;
  }

  // D - CRUD - Delete
  async delete(id) {
    const [deleteEpisode] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return deleteEpisode;
  }
}

module.exports = EpisodeManager;
