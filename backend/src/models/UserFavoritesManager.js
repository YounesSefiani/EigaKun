const AbstractManager = require("./AbstractManager");

class UserFavoritesManager extends AbstractManager {
  constructor() {
    super({ table: "userFavorites" });
  }

  async addFavorite(userId, favoriteId, favoriteType, status) {
    await this.database.query(
      `INSERT INTO userFavorites (user_id, favorite_id, favorite_type, status)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      [userId, favoriteId, favoriteType, status]
    );
  }

  async removeFavorite(userId, favoriteId, favoriteType, status) {
    await this.database.query(
      `DELETE FROM userFavorites WHERE user_id = ? AND favorite_id = ? AND favorite_type = ? AND status = ?`,
      [userId, favoriteId, favoriteType, status]
    );
  }

  async getAllByUser(userId) {
    const [rows] = await this.database.query(
      `SELECT * FROM userFavorites WHERE user_id = ?`,
      [userId]
    );
    return rows;
  }

  async getUserFavoritesMovies(userId) {

    const [movies] = await this.database.query(
      `SELECT movies.id AS movie_id, movies.title AS movie_title, movies.poster AS movie_poster, ${this.table}.status FROM movies
      JOIN userFavorites ON movies.id = userFavorites.favorite_id AND userFavorites.favorite_type = "movie" AND userFavorites.user_id = ?`,
      [userId]
    );
    return movies;
  }

  async getUserFavoritesSeries(userId) {

    const [series] = await this.database.query(
      `SELECT series.id AS serie_id, series.title AS serie_title, series.poster AS serie_poster, ${this.table}.status FROM series
      JOIN userFavorites ON series.id = userFavorites.favorite_id AND userFavorites.favorite_type = "serie" AND userFavorites.user_id = ?`,
      [userId]
    );
    return series;
  }

    async getUserFavoritesPersonalities(userId) {

    const [personalities] = await this.database.query(
      `SELECT personalities.id AS personality_id, personalities.fullname AS personality_fullname, personalities.image_src AS personality_image, ${this.table}.status FROM personalities
      JOIN userFavorites ON personalities.id = userFavorites.favorite_id AND userFavorites.favorite_type = "personality" AND userFavorites.user_id = ?`,
      [userId]
    );
    return personalities;
  }

}

module.exports = UserFavoritesManager;