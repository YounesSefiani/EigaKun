const AbstractManager = require('./AbstractManager');

class seasonManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "season" as configuration
    super({ table: 'seasons' });
  }

  // The C of CRUD - Create operation

  async create(season) {
    // Execute the SQL INSERT query to add a new season to the "season" table
    const [result] = await this.database.query(
      `insert into ${this.table} (season_number, poster, first_episode_date, last_episode_date, trailer, synopsis, episodes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        season.season_number,
        season.poster,
        season.first_episode_date,
        season.last_episode_date,
        season.trailer,
        season.synopsis,
        season.episodes,
      ]
    );

    // Return the ID of the newly inserted season
    return result.insertId;
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
