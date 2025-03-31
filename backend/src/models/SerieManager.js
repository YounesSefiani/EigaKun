const AbstractManager = require("./AbstractManager");

class SeriesManager extends AbstractManager {
  constructor() {
    super({ table: "series" });
  }

  async create(serie) {
    const [result] = await this.database.query(
      `INSERT INTO ${this.table} (title, poster, background, logo, trailer, synopsis, genre, theme, release_date, ending_date, statut, seasons, episodes, country, screen, streaming, universe) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        serie.statut,
        serie.seasons,
        serie.episodes,
        serie.country,
        serie.screen,
        serie.streaming,
        serie.universe,
      ]
    );
    return result.insertId;
  }

  async read(id) {
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  async readAll() {
    const [rows] = await this.database.query(`SELECT * FROM ${this.table}`);
    return rows;
  }

  async update(id, serie) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET ? WHERE id = ?`,
      [serie, id]
    );
    return result.affectedRows;
  }

  async delete(id) {
    const result = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = SeriesManager;
