const AbstractManager = require('./AbstractManager');

class episodeManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "episode" as configuration

    super({ table: 'episodes' });
  }

  // The C of CRUD - Create operation

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

  // The Rs of CRUD - Read operations

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific episode by its ID
    const [rows] = await this.database.query(
      `select * from ${this.table} where id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the episode
    return rows[0];
  }

  async readBySerieId(serieId) {
    const [rows] = await this.database.query(
      `SELECT series.id AS serie_id, series.title AS serie_title, seasons.id AS season_id, seasons.season_number AS season_number, e.id AS episode_id, e.title AS episode_title, e.image AS episode_image, e.release_date AS episode_release_date, e.synopsis AS episode_synopsis
  
          FROM ${this.table}
          JOIN series ON ${this.table}.serie_id = series.id
          JOIN seasons ON ${this.table}.season_id = seasons.id
          JOIN episodes AS e ON seasons.id = e.season_id
          WHERE ${this.table}.serie_id = ?`,
      [serieId]
    );
    return rows;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all episodes from the "episode" table
    const [rows] = await this.database.query(`select * from ${this.table}`);

    // Return the array of episodes
    return rows;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing episode

  async update(id, episode, files) {
    const fieldsToUpdateEpisode = [];
    const values = [];

    Object.entries(episode).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        fieldsToUpdateEpisode.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fieldsToUpdateEpisode.length === 0) {
      return { affectedRows: 0 };
    }

    // Ajout de l'ID à la fin des valeurs pour la clause WHERE
    values.push(id);

    const query = `UPDATE ${this.table} SET ${fieldsToUpdateEpisode.join(
      ', '
    )} WHERE id = ?`;

    try {
      const [result] = await this.database.query(query, values);

      // Gestion des fichiers après la mise à jour de l'épisode
      if (files && files.length > 0) {
        // Implémenter la logique pour gérer les fichiers
        await this.updateFiles(id, files); // Par exemple, une méthode pour gérer les fichiers
      }

      return result;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'épisode :", error);
      throw error; // Relancer l'erreur pour qu'elle soit gérée en amont
    }
  }

  //   The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an episode by its ID

  async delete(id) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = episodeManager;
