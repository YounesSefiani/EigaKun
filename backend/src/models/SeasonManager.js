const AbstractManager = require("./AbstractManager");

class SeasonsManager extends AbstractManager {
  constructor() {
    super({ table: "seasons" });
  }

  async create(season) {
    try {
      const [serie] = await this.database.query(
        `SELECT * FROM series WHERE id = ?`,
        [season.serie_id]
      );

      if (serie.length === 0) {
        throw new Error("Série non trouvée");
      }

      const [existingSeason] = await this.database.query(
        `SELECT * FROM seasons WHERE serie_id = ? AND season_number = ?`,
        [season.serie_id, season.season_number]
      );

      if (existingSeason.length > 0) {
        throw new Error("Cette saison existe déjà pour cette série");
      }

      if (season.season_number > 1) {
        const [previousEpisodes] = await this.database.query(
          `SELECT season_number FROM seasons WHERE serie_id = ? AND season_number < ?`,
          [season.serie_id, season.season_number]
        );

        if (previousEpisodes.length < season.season_number - 1) {
          return {
            success: false,
            message:
              "Une ou plusieurs saisons précédant celle-ci n'existent pas, veuillez insérez cette ou ces saisons avant !",
          };
        }
      }

      const [tooMuchSeasons] = await this.database.query(
        `SELECT seasons FROM series WHERE id = ?`,
        [season.serie_id]
      );

      const maxSeasons = tooMuchSeasons[0].seasons;

      const [currentSeasons] = await this.database.query(
        `SELECT COUNT(*) as count FROM seasons where serie_id = ?`,
        [season.serie_id]
      );

      const seasonCount = currentSeasons[0].count;

      if (seasonCount >= maxSeasons) {
        return {
          success: false,
          message: `Le nombre de saisons est de (${maxSeasons}). Vous avez inséré une saison de trop, veuillez revoir vos données et essayez de supprimer une saison si nécessaire.`,
        };
      }

      const [result] = await this.database.query(
        `INSERT INTO ${this.table} (serie_id, season_number, poster, first_episode_date, last_episode_date, synopsis, episodes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          season.serie_id,
          season.season_number,
          season.poster,
          season.first_episode_date,
          season.last_episode_date,
          season.synopsis,
          season.episodes,
        ]
      );

      return {
        success: true,
        message: "Saison créée avec succès",
        season: {
          id: result.insertId,
          serie_id: season.serie_id,
          season_number: season.season_number,
          poster: season.poster,
          first_episode_date: season.first_episode_date,
          last_episode_date: season.last_episode_date,
          synopsis: season.synopsis,
          episodes: season.episodes,
        },
      };
    } catch (err) {
      throw new Error(
        `Erreur lors de l'insertion de la saison : ${err.message}`
      );
    }
  }

  async read(id) {
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  async readAll() {
    const [rows] = await this.database.query(`SELECT * FROM ${this.table}`);
    return rows;
  }

  async readBySerieId(serieId) {
    const [rows] = await this.database.query(
      `SELECT series.id AS series_id, series.title AS series_title, ${this.table}.*
      FROM ${this.table} 
      JOIN series ON ${this.table}.serie_id = series.id
      WHERE ${this.table}.serie_id = ?`,
      [serieId]
    );

    return rows;
  }

  async update(id, season) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET serie_id = ?, season_number = ?, poster = ?, first_episode_date = ?, last_episode_date = ?, synopsis = ?, episodes = ? WHERE id = ?`,
      [
        season.serie_id,
        season.season_number,
        season.poster,
        season.first_episode_date,
        season.last_episode_date,
        season.synopsis,
        season.episodes,
        id,
      ]
    );
    return result.affectedRows;
  }

  async delete(id) {
    const result = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = SeasonsManager;
