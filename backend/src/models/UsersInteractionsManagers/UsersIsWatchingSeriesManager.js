const AbstractManager = require('../AbstractManager');

class usersIsWatchingSeriesManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "isWatchingSerie" as configuration
    super({ table: 'usersIsWatchingSeries' });
  }

  // The C of CRUD - Create operation

  async isWatchingSerie(serie) {
    // Execute the SQL INSERT query to add a new isWatchingSerie to the "isWatchingSerie" table
    const [result] = await this.database.query(
      `insert into ${this.table} (user_id, serie_id) VALUES (?, ?)`,
      [serie.user_id, serie.serie_id]
    );

    // Return the ID of the newly inserted isWatchingSerie
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async readIsWatchingSeries(userId) {
    // Execute the SQL SELECT query to retrieve a specific isWatchingSerie by its ID
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
      isWatchingSeries: seriesRows,
    };
  }

  async deleteIsWatchingSerie(serie) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE user_id = ? AND serie_id = ?`,
      [serie.user_id, serie.serie_id]
    );
    return result.affectedRows;
  }
}

module.exports = usersIsWatchingSeriesManager;
