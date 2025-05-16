const AbstractManager = require('../AbstractManager');

class usersToWatchManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "toWatchMovie" as configuration
    super({ table: 'usersHasToWatch' });
  }

  // The C of CRUD - Create operation

  async toWatchMovie(movie) {
    // Execute the SQL INSERT query to add a new toWatchMovie to the "toWatchMovie" table
    const [result] = await this.database.query(
      `insert into ${this.table} (user_id, movie_id) VALUES (?, ?)`,
      [movie.user_id, movie.movie_id]
    );

    // Return the ID of the newly inserted toWatchMovie
    return result.insertId;
  }

  async toWatchSerie(serie) {
    // Execute the SQL INSERT query to add a new toWatchMovie to the "toWatchMovie" table
    const [result] = await this.database.query(
      `insert into ${this.table} (user_id, serie_id) VALUES (?, ?)`,
      [serie.user_id, serie.serie_id]
    );

    // Return the ID of the newly inserted toWatchMovie
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async readToWatchMovies(userId) {
    // Execute the SQL SELECT query to retrieve a specific toWatchMovie by its ID
    const [userRows] = await this.database.query(
      `SELECT id, pseudo FROM users WHERE id = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      return null;
    }

    const [movieRows] = await this.database.query(
      `SELECT movies.id AS movie_id, movies.title AS movie_title, movies.poster AS movie_poster
      FROM ${this.table}
      JOIN movies ON ${this.table}.movie_id = movies.id
      WHERE ${this.table}.user_id = ?`,
      [userId]
    );

    return {
      user: userRows[0],
      toWatchMovies: movieRows,
    };
  }

  async readToWatchSeries(userId) {
    // Execute the SQL SELECT query to retrieve a specific toWatchMovie by its ID
    const [userRows] = await this.database.query(
      `SELECT id, pseudo FROM users WHERE id = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      return null;
    }

    const [serieRows] = await this.database.query(
      `SELECT series.id AS serie_id, series.title AS serie_title, series.poster AS serie_poster
      FROM ${this.table}
      JOIN series ON ${this.table}.serie_id = series.id
      WHERE ${this.table}.user_id = ?`,
      [userId]
    );

    return {
      user: userRows[0],
      toWatchSeries: serieRows,
    };
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all toWatchMovies from the "toWatchMovie" table
    const [rows] = await this.database.query(`select * from ${this.table}`);

    // Return the array of toWatchMovies
    return rows;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing toWatchMovie

  async update(id, toWatchMovie, files) {
    const fieldsToUpdateMovie = [];
    const values = [];

    Object.entries(toWatchMovie).forEach(([key, value]) => {
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
  // TODO: Implement the delete operation to remove an toWatchMovie by its ID

  async deleteToWatchMovie(movie) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE user_id = ? AND movie_id = ?`,
      [movie.user_id, movie.movie_id]
    );
    return result.affectedRows;
  }

  async deleteToWatchSerie(serie) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE user_id = ? AND serie_id = ?`,
      [serie.user_id, serie.serie_id]
    );
    return result.affectedRows;
  }
}

module.exports = usersToWatchManager;
