const AbstractManager = require('./AbstractManager');

class MovieCastingManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "movieCasting" as configuration
    super({ table: 'movieCasting' }); // Assuming the table name is "movie_casting"
  }

  // The C of CRUD - Create operation
  async create(movieCasting) {
    const [result] = await this.database.query(
      `INSERT INTO ${this.table} (movie_id, personality_id, side, role) VALUES (?, ?, ?, ?)`,
      [
        movieCasting.movie_id,
        movieCasting.personality_id,
        movieCasting.side,
        movieCasting.role,
      ]
    );
    return result.insertId;
  }

  // The Rs of CRUD - Read operations
  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific movieCasting by its ID
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the movieCasting
    return rows[0];
  }

  async readByMovieId(movieId) {
    const [rows] = await this.database.query(
      `SELECT movies.id AS movies_id, movies.title AS movies_title, movieCasting.role, movieCasting.side, 
      personalities.id AS personalities_id, personalities.image_src AS personalities_image, 
      personalities.fullname AS personalities_fullname
          FROM ${this.table}
          JOIN movies ON ${this.table}.movie_id = movies.id
          JOIN personalities ON ${this.table}.personality_id = personalities.id
          WHERE ${this.table}.movie_id = ?`,
      [movieId]
    );

    return rows;
  }

  async moviesByPersonalityId(personalityId) {
    const [casting] = await this.database.query(
      `SELECT movies.*, movies.id AS movies_id, movieCasting.role
      FROM ${this.table}
      JOIN movies ON movieCasting.movie_id = movies.id
      WHERE movieCasting.personality_id = ?`,
      [personalityId]
    );
    return casting;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all movieCastings from the "movieCasting" table
    const [rows] = await this.database.query(`SELECT * FROM ${this.table}`);

    // Return the array of movieCastings
    return rows;
  }

  // The U of CRUD - Update operation
  async update(id, movieCasting) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET movie_id = ?, personality_id = ?, role = ? WHERE id = ?`,
      [
        movieCasting.movie_id,
        movieCasting.personality_id,
        movieCasting.role,
        id,
      ]
    );
    return result.affectedRows; // Use affectedRows to check how many rows were updated
  }

  // The D of CRUD - Delete operation
  async delete(id) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result.affectedRows; // Use affectedRows to check how many rows were deleted
  }
}

module.exports = MovieCastingManager;
