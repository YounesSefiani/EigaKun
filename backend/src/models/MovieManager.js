const AbstractManager = require('./AbstractManager');

class movieManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "movie" as configuration
    super({ table: 'movies' });
  }

  // The C of CRUD - Create operation

  async create(movie) {
    // Execute the SQL INSERT query to add a new movie to the "movie" table
    const [result] = await this.database.query(
      `insert into ${this.table} (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, duration, country, universe, subUniverse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        movie.title,
        movie.poster,
        movie.background,
        movie.logo,
        movie.trailer,
        movie.synopsis,
        movie.genre,
        movie.theme,
        movie.release_date,
        movie.screen,
        movie.streaming,
        movie.duration,
        movie.country,
        movie.universe,
        movie.subUniverse,
      ]
    );

    // Return the ID of the newly inserted movie
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific movie by its ID
    const [rows] = await this.database.query(
      `select * from ${this.table} where id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the movie
    return rows[0];
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all movies from the "movie" table
    const [rows] = await this.database.query(`select * from ${this.table}`);

    // Return the array of movies
    return rows;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing movie

  async update(id, movie, files) {
    const fieldsToUpdateMovie = [];
    const values = [];

    Object.entries(movie).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        fieldsToUpdateMovie.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fieldsToUpdateMovie.length === 0) {
      return { affectedRows: 0 };
    }

    // Ajout de l'ID à la fin des valeurs pour la clause WHERE
    values.push(id);

    const query = `UPDATE ${this.table} SET ${fieldsToUpdateMovie.join(
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
  // TODO: Implement the delete operation to remove an movie by its ID

  async delete(id) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = movieManager;
