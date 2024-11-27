const AbstractManager = require('./AbstractManager');

class episodeManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "episode" as configuration

    super({ table: 'episodes' });
  }

  // The C of CRUD - Create operation

  async create(episode) {
    // Execute the SQL INSERT query to add a new episode to the "episode" table
    const [result] = await this.database.query(
      `insert into ${this.table} (episode_number, title, imgEpisode, release_date, synopsis) VALUES (?, ?, ?, ?, ?)`,
      [
        episode.episode_number,
        episode.title,
        episode.imgEpisode,
        episode.release_date,
        episode.synopsis,
      ]
    );

    // Return the ID of the newly inserted episode
    return result.insertId;
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
