const AbstractManager = require('./AbstractManager');

class EpisodesManager extends AbstractManager {
  constructor() {
    super({ table: 'episodes' });
  }

  async create(episode) {
    try {
      const [season] = await this.database.query(
        `SELECT * FROM seasons WHERE id = ? AND serie_id = ?`,
        [episode.season_id, episode.serie_id]
      );

      const [serie] = await this.database.query(
        `SELECT * FROM series WHERE id = ?`,
        [episode.serie_id]
      );

      if (season.length === 0) {
        throw new Error('Saison non trouvée dans cette série');
      }

      if (serie.length === 0) {
        throw new Error('Série non trouvée');
      }

      const [existingEpisode] = await this.database.query(
        `SELECT * FROM episodes WHERE serie_id = ? AND season_id = ? AND episode_number = ?`,
        [episode.serie_id, episode.season_id, episode.episode_number]
      );

      if (existingEpisode.length > 0) {
        throw new Error('Cet épisode existe déjà pour cette saison');
      }

      if (episode.episode_number > 1) {
        const [previousEpisodes] = await this.database.query(
          `SELECT episode_number FROM episodes WHERE serie_id = ? AND season_id = ? AND episode_number < ?`,
          [episode.serie_id, episode.season_id, episode.episode_number]
        );

        if (previousEpisodes.length < episode.episode_number - 1) {
          return {
            success: false,
            message:
              "Un ou plusieurs épisodes précédant celui-ci n'existe(nt) pas, veuillez insérez cet épisode ou ces épisodes avant !",
          };
        }
      }

      const [tooManyEpisodes] = await this.database.query(
        `SELECT episodes FROM seasons WHERE id = ?`,
        [episode.season_id]
      );

      const maxEpisodes = tooManyEpisodes[0].episodes;

      const [currentEpisodes] = await this.database.query(
        `SELECT COUNT(*) as count FROM episodes where serie_id = ? AND season_id = ?`,
        [episode.serie_id, episode.season_id]
      );

      const episodeCount = currentEpisodes[0].count;

      if (episodeCount >= maxEpisodes) {
        return {
          success: false,
          message: `Selon les infos de cette saison, le nombre d'épisodes de celle-ci est de (${maxEpisodes}). Vous avez inséré un épisode de trop, veuillez mettre à jour vos données et réessayez.`,
        };
      }

      const [result] = await this.database.query(
        `INSERT INTO ${this.table} (serie_id, season_id, episode_number, title, image, release_date, synopsis) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          episode.serie_id,
          episode.season_id,
          episode.episode_number,
          episode.title,
          episode.image,
          episode.release_date,
          episode.synopsis,
        ]
      );

      return {
        success: true,
        message: 'Episode crée avec succès',
        episode: {
          id: result.insertId,
          serie_id: episode.serie_id,
          season_id: episode.season_id,
          episode_number: episode.episode_number,
          title: episode.title,
          image: episode.image,
          release_date: episode.release_date,
          synopsis: episode.synopsis,
        },
      };
    } catch (err) {
      throw new Error(
        `Erreur lors de l'insertion de l'épisode : ${err.message}`
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

  async readBySeasonId(seasonId) {
    const [rows] = await this.database.query(
      `SELECT seasons.id AS seasons_id, ${this.table}.*
      FROM ${this.table} 
      JOIN seasons on ${this.table}.season_id = seasons.id
      WHERE season_id = ?`,
      [seasonId]
    );
    return rows;
  }

  async readEpisodesBySerieId(serieId) {
    const [rows] = await this.database.query(
      `SELECT * FROM episodes WHERE serie_id = ?`,
      [serieId]
    );
    return rows;
  }

  async update(id, episode) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET serie_id = ?, season_id = ?, episode_number = ?, title = ?, image = ?, release_date = ?, synopsis = ? WHERE id = ?`,
      [
        episode.serie_id,
        episode.season_id,
        episode.episode_number,
        episode.title,
        episode.image,
        episode.release_date,
        episode.synopsis,
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

module.exports = EpisodesManager;
