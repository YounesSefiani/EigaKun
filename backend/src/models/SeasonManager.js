const AbstractManager = require("./AbstractManager");

class SeasonManager extends AbstractManager {
  constructor() {
    super({ table: "seasons" });
  }

  // C - CRUD - Create
  async create(season) {
    try {
      // Vérifie que la série existe
      const [serie] = await this.database.query(
        `SELECT * FROM series WHERE id = ?`,
        [season.serie_id]
      );
      if (serie.length === 0) {
        return { success: false, message: "Serie non trouvée !" };
      }

      // Vérifie le nombre max de saisons pour la série
      const maxSeasons = serie[0].seasons;
      const [currentSeasons] = await this.database.query(
        `SELECT COUNT(*) as count FROM seasons WHERE serie_id = ?`,
        [season.serie_id]
      );
      const seasonsCount = currentSeasons[0].count;

      if (seasonsCount >= maxSeasons || season.season_number > maxSeasons) {
        return {
          success: false,
          message: `Cette série comporte ${maxSeasons} saison(s). Par conséquent, celle-ci est de trop !`,
        };
      }

      // Vérifie si la saison existe déjà
      const [existingSeason] = await this.database.query(
        `SELECT * FROM ${this.table} WHERE serie_id = ? AND season_number = ?`,
        [season.serie_id, season.season_number]
      );
      if (existingSeason.length > 0) {
        const [seasonAlreadyExisted] = await this.database.query(
          `SELECT * FROM ${this.table} WHERE serie_id = ? AND season_number = ?`,
          [season.serie_id, season.season_number]
        );
        const theSeason = seasonAlreadyExisted;
        return { success: false, message: "Cette saison existe déjà !", theSeason };
      }

      // Vérifie qu'il n'y a pas de "trou" dans la numérotation des saisons
      if (season.season_number > 1) {
        const [previousSeasons] = await this.database.query(
          `SELECT season_number FROM seasons WHERE serie_id = ? AND season_number < ? ORDER BY season_number ASC`,
          [season.serie_id, season.season_number]
        );
        if (previousSeasons.length < season.season_number - 1) {
          // Récupère toutes les saisons existantes pour aider l'utilisateur
          const [seasonsOfSerieRaw] = await this.database.query(
            `SELECT * FROM seasons WHERE serie_id = ? ORDER BY season_number ASC`,
            [season.serie_id]
          );
          const seasons = Array.isArray(seasonsOfSerieRaw)
            ? seasonsOfSerieRaw
            : [];
          return {
            success: false,
            message: "Veuillez ajouter la ou les saisons manquantes, avant celle-ci !",
            seasons,
          };
        }
      }

      // Création de la saison
      const [resultSeason] = await this.database.query(
        `INSERT INTO ${this.table} (serie_id, season_number, episodes, first_episode_date, last_episode_date, synopsis, poster) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          season.serie_id,
          season.season_number,
          season.episodes,
          season.first_episode_date,
          season.last_episode_date,
          season.synopsis,
          season.poster,
        ]
      );

      return {
        success: true,
        message: "Saison créée avec succès !",
        id: resultSeason.insertId,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // R - CRUD - Read
  async readAllSeasons() {
    const [seasons] = await this.database.query(`SELECT * FROM ${this.table}`);
    return seasons;
  }
  async read(id) {
    const [season] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return season[0];
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

  // U - CRUD - Update
  async update(season) {
    const [updateSeason] = await this.database.query(
      `UPDATE ${this.table} SET season_number = ?, episodes = ?, first_episode_date = ?, last_episode_date = ?, poster = ?, synopsis = ? WHERE id = ?`,
      [
        season.season_number,
        season.episodes,
        season.first_episode_date,
        season.last_episode_date,
        season.poster,
        season.synopsis,
        season.id,
      ]
    );
    return updateSeason;
  }

  // D - CRUD - Delete
  async delete(id) {
    const [deleteSeason] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return deleteSeason;
  }
}

module.exports = SeasonManager;
