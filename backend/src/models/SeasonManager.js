const AbstractManager = require('./AbstractManager');

class seasonManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "season" as configuration

    super({ table: 'seasons' });
  }

  // The C of CRUD - Create operation

  async create(season) {
    try {
      const [serie] = await this.database.query(
        `SELECT * FROM series WHERE id = ?`,
        [season.serie_id]
      );

      if (serie.length === 0) {
        throw new Error('Série non trouvée');
      }

      const [existingSeason] = await this.database.query(
        `SELECT * FROM seasons WHERE serie_id = ? AND season_number = ?`,
        [season.serie_id, season.season_number]
      );

      if (existingSeason.length > 0) {
        throw new Error('Cette saison existe déjà pour cette série');
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
        message: 'Saison créée avec succès',
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

  // The Rs of CRUD - Read operations

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific season by its ID
    const [rows] = await this.database.query(
      `select * from ${this.table} where id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the season
    return rows[0];
  }

  async readBySerieId(serieId) {
    const [rows] = await this.database.query(
      `SELECT s.id AS season_id, s.season_number AS season_number, ss.title AS serie_title, s.first_episode_date AS first_episode_date, s.last_episode_date AS last_episode_date, s.synopsis AS synopsis
          FROM seasons AS s
          JOIN series AS ss ON s.serie_id = ss.id
          WHERE s.serie_id = ?`,
      [serieId]
    );

    return rows;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all seasons from the "season" table
    const [rows] = await this.database.query(`select * from ${this.table}`);

    // Return the array of seasons
    return rows;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing season

  async update(id, season, files) {
    const fieldsToUpdateSeason = [];
    const values = [];

    Object.entries(season).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        fieldsToUpdateSeason.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fieldsToUpdateSeason.length === 0) {
      return { affectedRows: 0 };
    }

    // Ajout de l'ID à la fin des valeurs pour la clause WHERE
    values.push(id);

    const query = `UPDATE ${this.table} SET ${fieldsToUpdateSeason.join(
      ', '
    )} WHERE id = ?`;

    try {
      const [result] = await this.database.query(query, values);

      // Gestion des fichiers après la mise à jour du film
      if (files && files.length > 0) {
        // Implémenter la logique pour gérer les fichiers
        await this.updateFiles(id, files); // Par exemple, une méthode pour gérer les fichiers
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du film :', error);
      throw error; // Relancer l'erreur pour qu'elle soit gérée en amont
    }
  }

  //   The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an season by its ID

  async delete(id) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = seasonManager;
