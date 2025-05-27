const AbstractManager = require("./AbstractManager");

class MovieCastingManager extends AbstractManager {
  constructor() {
    super({ table: "movieCasting" });
  }

  // C - CRUD - Create
  async create(movieCasting) {
    try {
      const [movie] = await this.database.query(
        `SELECT * FROM movies WHERE id = ?`,
        [movieCasting.movie_id]
      );
      if (movie.length === 0) {
        return { success: false, message: "Ce film est introuvable !" };
      }

      const [personality] = await this.database.query(
        `SELECT * FROM personalities WHERE id = ?`,
        [movieCasting.personality_id]
      );
      if (personality.length === 0) {
        return {
          success: false,
          message: "Cette personnalité est introuvable!",
        };
      }

      const [movieCast] = await this.database.query(
        `INSERT INTO ${this.table} (movie_id, personality_id, role, side) VALUES (?, ?, ?, ?)`,
        [
          movieCasting.movie_id,
          movieCasting.personality_id,
          movieCasting.role,
          movieCasting.side,
        ]
      );

      return {
        success: true,
        message: "Casting ajouté avec succès !",
        movieCastingId: movieCast.insertId,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // R - CRUD - Read
  async readAll() {
    const [movieCasting] = await this.database.query(
      `SELECT * FROM ${this.table}`
    );
    return movieCasting;
  }

  async read(id) {
    try {
      const [movieCasting] = await this.database.query(
        `SELECT * FROM ${this.table} WHERE id = ?`,
        [id]
      );
      return movieCasting[0];
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async readByMovie(movieId) {
    const [movieCasting] = await this.database.query(
      `SELECT movies.id AS movie_id, movies.title AS movie_title, personalities.id AS personality_id, personalities.fullname AS personality_fullname, personalities.image_src AS personality_image, ${this.table}.* 
       FROM ${this.table} 
       JOIN movies ON ${this.table}.movie_id = movies.id 
         JOIN personalities ON ${this.table}.personality_id = personalities.id
       WHERE ${this.table}.movie_id = ?`,
      [movieId]
    );

    return movieCasting;
  }

  // U - CRUD - Update
  async update(movieCasting) {
    const [updateMovieCasting] = await this.database.query(
      `UPDATE ${this.table} SET movie_id = ?, personality_id = ?, role = ?, side = ? WHERE id = ?`,
      [
        movieCasting.movie_id,
        movieCasting.personality_id,
        movieCasting.role,
        movieCasting.side,
        movieCasting.id,
      ]
    );
    return updateMovieCasting.affectedRows;
  }

  // D - CRUD - Delete
  async delete(id) {
    const [deleteMovieCasting] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return deleteMovieCasting;
  }
}

module.exports = MovieCastingManager;
