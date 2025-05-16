const AbstractManager = require('../AbstractManager');

class userLikedManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "likedMovie" as configuration
    super({ table: 'usersHasLiked' });
  }

  // The C of CRUD - Create operation

  async toLikeMovie(likeMovie) {
    // Execute the SQL INSERT query to add a new likedMovie to the "likedMovie" table
    const [result] = await this.database.query(
      `insert into ${this.table} (user_id, movie_id) VALUES (?, ?)`,
      [likeMovie.user_id, likeMovie.movie_id]
    );

    // Return the ID of the newly inserted likedMovie
    return result.insertId;
  }

  async toLikeSerie(likeSerie) {
    // Execute the SQL INSERT query to add a new likedMovie to the "likedMovie" table
    const [result] = await this.database.query(
      `insert into ${this.table} (user_id, serie_id) VALUES (?, ?)`,
      [likeSerie.user_id, likeSerie.serie_id]
    );

    // Return the ID of the newly inserted likedMovie
    return result.insertId;
  }

  async toLikePersonality(likePersonality) {
    // Execute the SQL INSERT query to add a new likedMovie to the "likedMovie" table
    const [result] = await this.database.query(
      `insert into ${this.table} (user_id, personality_id) VALUES (?, ?)`,
      [likePersonality.user_id, likePersonality.personality_id]
    );

    // Return the ID of the newly inserted likedMovie
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async readLikedMovies(userId) {
    // Execute the SQL SELECT query to retrieve a specific likedMovie by its ID
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
      likedMovies: movieRows,
    };
  }

  async readLikedSeries(userId) {
    // Execute the SQL SELECT query to retrieve a specific likedMovie by its ID
    const [userRows] = await this.database.query(
      `SELECT id, pseudo FROM users WHERE id = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      return null;
    }

    const [seriesRows] = await this.database.query(
      `SELECT series.id AS serie_id, series.title AS serie_title, series.poster AS serie_poster
      FROM ${this.table}
      JOIN series ON ${this.table}.serie_id = series.id
      WHERE ${this.table}.user_id = ?`,
      [userId]
    );

    return {
      user: userRows[0],
      likedSeries: seriesRows,
    };
  }

  async readLikedPersonalities(userId) {
    // Execute the SQL SELECT query to retrieve a specific likedMovie by its ID
    const [userRows] = await this.database.query(
      `SELECT id, pseudo FROM users WHERE id = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      return null;
    }

    const [personalitiesRows] = await this.database.query(
      `SELECT personalities.id AS personality_id, personalities.fullname AS personality_fullname, personalities.image_src AS personality_image
      FROM ${this.table}
      JOIN personalities ON ${this.table}.personality_id = personalities.id
      WHERE ${this.table}.user_id = ?`,
      [userId]
    );

    return {
      user: userRows[0],
      likedPersonalities: personalitiesRows,
    };
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all likedMovies from the "likedMovie" table
    const [rows] = await this.database.query(`select * from ${this.table}`);

    // Return the array of likedMovies
    return rows;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing likedMovie

  async update(id, likedMovie, files) {
    const fieldsToUpdateMovie = [];
    const values = [];

    Object.entries(likedMovie).forEach(([key, value]) => {
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
  // TODO: Implement the delete operation to remove an likedMovie by its ID

  async toUnlikeMovie(unlikedMovie) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE user_id = ? AND movie_id = ?`,
      [unlikedMovie.user_id, unlikedMovie.movie_id]
    );
    return result.affectedRows;
  }

  async toUnlikeSerie(unlikedSerie) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE user_id = ? AND serie_id = ?`,
      [unlikedSerie.user_id, unlikedSerie.serie_id]
    );
    return result.affectedRows;
  }

  async toUnlikePersonality(unlikedPersonality) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE user_id = ? AND personality_id = ?`,
      [unlikedPersonality.user_id, unlikedPersonality.personality_id]
    );
    return result.affectedRows;
  }
}

module.exports = userLikedManager;
