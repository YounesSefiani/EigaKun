const AbstractManager = require('./AbstractManager');

class serieManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "serie" as configuration
    super({ table: 'series' });
  }

  // The C of CRUD - Create operation

  async create(serie) {
    // Execute the SQL INSERT query to add a new serie to the "serie" table
    const [result] = await this.database.query(
      `insert into ${this.table} (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, ending_date, screen, streaming, country, universe, seasons, episodes, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        serie.title,
        serie.poster,
        serie.background,
        serie.logo,
        serie.trailer,
        serie.synopsis,
        serie.genre,
        serie.theme,
        serie.release_date,
        serie.ending_date,
        serie.screen,
        serie.streaming,
        serie.country,
        serie.universe,
        serie.seasons,
        serie.episodes,
        serie.statut,
      ]
    );

    // Return the ID of the newly inserted serie
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific serie by its ID
    const [rows] = await this.database.query(
      `select * from ${this.table} where id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the serie
    return rows[0];
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all series from the "serie" table
    const [rows] = await this.database.query(`select * from ${this.table}`);

    // Return the array of series
    return rows;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing serie

  async update(id, serie, files) {
    const fieldsToUpdateserie = [];
    const values = [];

    Object.entries(serie).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        fieldsToUpdateserie.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fieldsToUpdateserie.length === 0) {
      return { affectedRows: 0 };
    }

    // Ajout de l'ID à la fin des valeurs pour la clause WHERE
    values.push(id);

    const query = `UPDATE ${this.table} SET ${fieldsToUpdateserie.join(
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
  // TODO: Implement the delete operation to remove an serie by its ID

  async delete(id) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = serieManager;
