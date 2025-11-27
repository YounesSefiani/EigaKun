const AbstractManager = require("./AbstractManager");

class UserReviewsManager extends AbstractManager {
  constructor() {
    super({ table: "userReviews" });
  }

  // C - CRUD - Create

  async createMovieReview(userMovieReview) {
    const [resultUserMovieReview] = await this.database.query(
      `INSERT INTO ${this.table} (user_id, movie_id, review, rating, created_at) VALUES (?, ?, ?, ?, NOW())`,
      [
        userMovieReview.user_id,
        userMovieReview.movie_id,
        userMovieReview.review,
        userMovieReview.rating,
        userMovieReview.created_at,
      ]
    );
    return resultUserMovieReview.insertId;
  }

  async createSerieReview(userSerieReview) {
    const [resultUserSerieReview] = await this.database.query(
      `INSERT INTO ${this.table} (user_id, serie_id, review, rating, created_at) VALUES (?, ?, ?, ?, NOW())`,
      [
        userSerieReview.user_id,
        userSerieReview.serie_id,
        userSerieReview.review,
        userSerieReview.rating,
        userSerieReview.created_at,
      ]
    );
    return resultUserSerieReview.insertId;
  }

  async createPersonalityReview(userPersonalityReview) {
    const [resultUserPersonalityReview] = await this.database.query(
      `INSERT INTO ${this.table} (user_id, personality_id, review, rating, created_at) VALUES (?, ?, ?, ?, NOW())`,
      [
        userPersonalityReview.user_id,
        userPersonalityReview.personality_id,
        userPersonalityReview.review,
        userPersonalityReview.rating,
      ]
    );
    return resultUserPersonalityReview.insertId;
  }

  // R - CRUD - Read

  async readAll() {
    const [userReviews] = await this.database.query(
      `SELECT users.username AS user_username, movies.title AS movie_title, series.title AS serie_title, ${this.table}.* 
        FROM ${this.table}
        LEFT JOIN users ON ${this.table}.user_id = users.id
        LEFT JOIN movies ON ${this.table}.movie_id = movies.id
        LEFT JOIN series ON ${this.table}.serie_id = series.id`
    );
    return userReviews;
  }

  async read(id) {
    const [userReview] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return userReview[0];
  }

  async readByUserAndMovie(userId, movieId) {
    const [userReview] = await this.database.query(
      `SELECT ${this.table}.id, movies.title AS movie_title, users.username AS user_username, movie_id, user_id, review, rating, ${this.table}.created_at, ${this.table}.updated_at
        FROM ${this.table}
        JOIN movies ON ${this.table}.movie_id = movies.id
        JOIN users ON ${this.table}.user_id = users.id
        WHERE ${this.table}.user_id = ? AND ${this.table}.movie_id = ?`,
      [userId, movieId]
    );
    return userReview[0];
  }

  async readMovieReviews(movieId) {
    const [movieReviews] = await this.database.query(
      `SELECT ${this.table}.id, movies.title AS movie_title, users.username AS user_username, movie_id, user_id, review, rating, ${this.table}.created_at, ${this.table}.updated_at
        FROM ${this.table}
        JOIN users ON ${this.table}.user_id = users.id
        JOIN movies ON ${this.table}.movie_id = movies.id
        WHERE ${this.table}.movie_id = ?`,
      [movieId]
    );
    return movieReviews;
  }

  async readUserMoviesReviews(userId) {
    const [userReviews] = await this.database.query(
      `SELECT ${this.table}.id, movies.title AS movie_title, users.username AS user_username, movie_id, user_id, review, rating, ${this.table}.created_at, ${this.table}.updated_at
        FROM ${this.table}
        JOIN movies ON ${this.table}.movie_id = movies.id
        JOIN users ON ${this.table}.user_id = users.id
        WHERE ${this.table}.user_id = ?`,
      [userId]
    );
    return userReviews;
  }

  async readByUserAndSerie(userId, serieId) {
    const [userReview] = await this.database.query(
      `SELECT ${this.table}.id, series.title AS serie_title, users.username AS user_username, serie_id, user_id, review, rating, ${this.table}.created_at, ${this.table}.updated_at
         FROM ${this.table} 
        JOIN series ON ${this.table}.serie_id = series.id
        JOIN users ON ${this.table}.user_id = users.id
         WHERE ${this.table}.user_id = ? AND ${this.table}.serie_id = ?`,
      [userId, serieId]
    );
    return userReview[0];
  }

  async readUserSeriesReviews(userId) {
    const [userReviews] = await this.database.query(
      `SELECT ${this.table}.id, series.title AS serie_title, users.username AS user_username, serie_id, user_id, review, rating, ${this.table}.created_at, ${this.table}.updated_at
        FROM ${this.table}
        JOIN series ON ${this.table}.serie_id = series.id
        JOIN users ON ${this.table}.user_id = users.id
        WHERE ${this.table}.user_id = ?`,
      [userId]
    );
    return userReviews;
  }

   async readSerieReviews(serieId) {
    const [serieReviews] = await this.database.query(
      `SELECT ${this.table}.id, series.title AS serie_title, users.username AS user_username, serie_id, user_id, review, rating, ${this.table}.created_at, ${this.table}.updated_at
        FROM ${this.table}
        JOIN users ON ${this.table}.user_id = users.id
        JOIN series ON ${this.table}.serie_id = series.id
        WHERE ${this.table}.serie_id = ?`,
      [serieId]
    );
    return serieReviews;
  }

  async readByUserAndPersonality(userId) {
    const [userReview] = await this.database.query(
      `SELECT ${this.table}.id, personalities.fullname AS personality_fullname, users.username AS user_username, personality_id, user_id, review, rating, ${this.table}.created_at, ${this.table}.updated_at
         FROM ${this.table} 
        JOIN personalities ON ${this.table}.personality_id = personalities.id
        JOIN users ON ${this.table}.user_id = users.id
         WHERE ${this.table}.user_id = ?`,
      [userId]
    );
    return userReview[0];
  }

    async readUserPersonalitiesReviews(userId) {
    const [userReviews] = await this.database.query(
      `SELECT ${this.table}.id, personalities.fullname AS personality_fullname, users.username AS user_username, personality_id, user_id, review, rating, ${this.table}.created_at, ${this.table}.updated_at
        FROM ${this.table}
        JOIN personalities ON ${this.table}.personality_id = personalities.id
        JOIN users ON ${this.table}.user_id = users.id
        WHERE ${this.table}.user_id = ?`,
      [userId]
    );
    return userReviews;
  }

  async readPersonalityReviews(personalityId) {
    const [personalityReviews] = await this.database.query(
      `SELECT ${this.table}.id, personalities.fullname AS personality_fullname, users.username AS user_username, personality_id, user_id, review, rating, ${this.table}.created_at, ${this.table}.updated_at
        FROM ${this.table}
        JOIN users ON ${this.table}.user_id = users.id
        JOIN personalities ON ${this.table}.personality_id = personalities.id
        WHERE ${this.table}.personality_id = ?`,
      [personalityId]
    );
    return personalityReviews;
  }


  // U - CRUD - Update

  async updateMovieReview(userMovieReview) {
    const [updateUserMovieReview] = await this.database.query(
      `UPDATE ${this.table} SET review = ?, rating = ?, updated_at = NOW() WHERE id = ? AND user_id = ? AND movie_id = ? `,
      [
        userMovieReview.review,
        userMovieReview.rating,
        userMovieReview.id,
        userMovieReview.user_id,
        userMovieReview.movie_id,
      ]
    );
    return updateUserMovieReview.affectedRows;
  }

  async updateSerieReview(userSerieReview) {
    const [updateUserSerieReview] = await this.database.query(
      `UPDATE ${this.table} SET review = ?, rating = ?, updated_at = NOW() WHERE id = ? AND user_id = ? AND serie_id = ?`,
      [
        userSerieReview.review,
        userSerieReview.rating,
        userSerieReview.id,
        userSerieReview.user_id,
        userSerieReview.serie_id,
      ]
    );
    return updateUserSerieReview.affectedRows;
  }

  async updatePersonalityReview(userPersonalityReview) {
    const [updateUserPersonalityReview] = await this.database.query(
      `UPDATE ${this.table} SET review = ?, rating = ?, updated_at = NOW() WHERE id = ? AND user_id = ? AND personality_id = ?`,
      [
        userPersonalityReview.review,
        userPersonalityReview.rating,
        userPersonalityReview.id,
        userPersonalityReview.user_id,
        userPersonalityReview.personality_id,
      ]
    );
    return updateUserPersonalityReview.affectedRows;
  }
}

module.exports = UserReviewsManager;
