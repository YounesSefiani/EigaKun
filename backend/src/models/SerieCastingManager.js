const AbstractManager = require('./AbstractManager');

class SerieCastingManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "serieCasting" as configuration
    super({ table: 'serieCasting' }); // Assuming the table name is "serie_casting"
  }

  // The C of CRUD - Create operation
  async create(serieCasting) {
    const [result] = await this.database.query(
      `INSERT INTO ${this.table} (serie_id, personality_id, side, role, presence) VALUES (?, ?, ?, ?, ?)`,
      [
        serieCasting.serie_id,
        serieCasting.personality_id,
        serieCasting.side,
        serieCasting.role,
        serieCasting.presence,
      ]
    );
    return result.insertId;
  }

  // The Rs of CRUD - Read operations
  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific serieCasting by its ID
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the serieCasting
    return rows[0];
  }

  async castingBySerieId(serieId) {
    const [rows] = await this.database.query(
      `SELECT series.id AS series_id, series.title AS series_title, personalities.id AS personalities_id, personalities.fullname AS personalities_fullname, personalities.image_src AS personalities_image, serieCasting.side, serieCasting.role, serieCasting.presence
          FROM ${this.table}
          JOIN series ON ${this.table}.serie_id = series.id
          JOIN personalities ON ${this.table}.personality_id = personalities.id
          WHERE ${this.table}.serie_id = ?`,
      [serieId]
    );

    return rows;
  }

  async seriesByPersonalityId(personalityId) {
    const [casting] = await this.database.query(
      `SELECT series.*, series.id AS series_id, serieCasting.role, serieCasting.presence
      FROM ${this.table}
      JOIN series ON serieCasting.serie_id = series.id
      WHERE serieCasting.personality_id = ?`,
      [personalityId]
    );
    return casting;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all serieCastings from the "serieCasting" table
    const [rows] = await this.database.query(`SELECT * FROM ${this.table}`);

    // Return the array of serieCastings
    return rows;
  }

  // The U of CRUD - Update operation
  async update(id, serieCasting) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET serie_id = ?, personality_id = ?, side = ?, role = ?, presence = ? WHERE id = ?`,
      [
        serieCasting.serie_id,
        serieCasting.personality_id,
        serieCasting.side,
        serieCasting.role,
        serieCasting.presence,
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

module.exports = SerieCastingManager;
