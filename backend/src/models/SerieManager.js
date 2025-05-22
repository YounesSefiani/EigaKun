const AbstractManager = require('./AbstractManager');

class SerieManager extends AbstractManager {
    constructor() {
        super({ table: 'series' });
    }

    // C - CRUD - Create

    async create(serie) {
        const [resultSerie] = await this.database.query(
            `INSERT INTO ${this.table} (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, ending_date, seasons, episodes, statut, screen, streaming, original, duration, country, universe, subUniverse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                serie.seasons,
                serie.episodes,
                serie.statut,
                serie.screen,
                serie.streaming,
                serie.original,
                serie.duration,
                serie.country,
                serie.universe,
                serie.subUniverse
            ]
        );
        return resultSerie.insertId;
    }

    // R - CRUD - Read

    async readAllSeries() {
        const [series] = await this.database.query(
            `SELECT * FROM ${this.table}`
        );
        return series;
    }

    async read(id) {
        const [serie] = await this.database.query(
            `SELECT * FROM ${this.table} WHERE id = ?`,
            [id]
        );
        return serie[0];
    }
    // U - CRUD - Update

    async update(serie) {
        const [updateSerie] = await this.database.query(
            `UPDATE ${this.table} SET title = ?, poster = ?, background = ?, logo = ?, trailer = ?, synopsis = ?, genre = ?, theme = ?, release_date = ?, ending_date = ?, seasons = ?, episodes = ?, statut = ?, screen = ?, streaming = ?, original = ?, duration = ?, country = ?, universe = ?, subUniverse = ? WHERE id = ?`,
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
                serie.seasons,
                serie.episodes,
                serie.statut,
                serie.screen,
                serie.streaming,
                serie.original,
                serie.duration,
                serie.country,
                serie.universe,
                serie.subUniverse,
                serie.id
            ]
        );
        return updateSerie;
    }

    // D - CRUD - Delete

    async delete(id) {
        const [deleteSerie] = await this.database.query(
            `DELETE FROM ${this.table} WHERE id = ?`,
            [id]
        );
        return deleteSerie;
    }
}

module.exports = SerieManager;