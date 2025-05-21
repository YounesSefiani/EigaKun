const AbstractManager = require('./AbstractManager');

class MovieManager extends AbstractManager {
    constructor() {
        super({ table: 'movies' });
    }

    // C - CRUD - Create

    async create(movie) {
        const [resultMovie] = await this.database.query(
            `INSERT INTO ${this.table} (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, screen, streaming, original, duration, country, universe, subUniverse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                movie.original,
                movie.duration,
                movie.country,
                movie.universe,
                movie.subUniverse
            ]
        );
        return resultMovie.insertId;
    }

    // R - CRUD - Read

    async readAllMovies() {
        const [movies] = await this.database.query(
            `SELECT * FROM ${this.table}`
        );
        return movies;
    }

    async read(id) {
        const [movie] = await this.database.query(
            `SELECT * FROM ${this.table} WHERE id = ?`,
            [id]
        );
        return movie[0];
    }
    // U - CRUD - Update

    async update(movie) {
        const [updateMovie] = await this.database.query(
            `UPDATE ${this.table} SET title = ?, poster = ?, background = ?, logo = ?, trailer = ?, synopsis = ?, genre = ?, theme = ?, release_date = ?, screen = ?, streaming = ?, original = ?, duration = ?, country = ?, universe = ?, subUniverse = ? WHERE id = ?`,
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
                movie.original,
                movie.duration,
                movie.country,
                movie.universe,
                movie.subUniverse,
                movie.id
            ]
        );
        return updateMovie;
    }

    // D - CRUD - Delete

    async delete(id) {
        const [deleteMovie] = await this.database.query(
            `DELETE FROM ${this.table} WHERE id = ?`,
            [id]
        );
        return deleteMovie;
    }
}

module.exports = MovieManager;