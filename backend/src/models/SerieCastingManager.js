const AbstractManager = require("./AbstractManager");

class SerieCastingManager extends AbstractManager {
  constructor() {
    super({ table: "serieCasting" });
  }

  // C - CRUD - Create
  async create(serieCasting) {
    try {
      const [serie] = await this.database.query(
        `SELECT * FROM series WHERE id = ?`,
        [serieCasting.serie_id]
      );
      if (serie.length === 0) {
        return { success: false, message: "Ce film est introuvable !" };
      }

      const [personality] = await this.database.query(
        `SELECT * FROM personalities WHERE id = ?`,
        [serieCasting.personality_id]
      );
      if (personality.length === 0) {
        return {
          success: false,
          message: "Cette personnalité est introuvable!",
        };
      }

      const [serieCast] = await this.database.query(
        `INSERT INTO ${this.table} (serie_id, personality_id, role, side, presence) VALUES (?, ?, ?, ?, ?)`,
        [
          serieCasting.serie_id,
          serieCasting.personality_id,
          serieCasting.role,
          serieCasting.side,
          serieCasting.presence,
        ]
      );

      return {
        success: true,
        message: "Casting ajouté avec succès !",
        serieCastingId: serieCast.insertId,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // R - CRUD - Read
  async readAll() {
    const [serieCasting] = await this.database.query(
      `SELECT * FROM ${this.table}`
    );
    return serieCasting;
  }

  async read(id) {
    try {
      const [serieCasting] = await this.database.query(
        `SELECT * FROM ${this.table} WHERE id = ?`,
        [id]
      );
      return serieCasting[0];
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

    async seriesByPersonalityId(personalityId) {
    const [casting] = await this.database.query(
      `SELECT series.id AS serie_id, series.title AS serie_title, series.poster AS serie_poster, series.release_date AS serie_release_date, series.ending_date AS serie_ending_date, serieCasting.role, serieCasting.side, serieCasting.presence
      FROM ${this.table}
      JOIN series ON ${this.table}.serie_id = series.id
      WHERE ${this.table}.personality_id = ?`,
      [personalityId]
    );
    return casting;
  }


  // U - CRUD - Update
  async update(serieCasting) {
    const [updateSerieCasting] = await this.database.query(
      `UPDATE ${this.table} SET serie_id = ?, personality_id = ?, role = ?, side = ? WHERE id = ?`,
      [
        serieCasting.serie_id,
        serieCasting.personality_id,
        serieCasting.role,
        serieCasting.side,
        serieCasting.id,
      ]
    );
    return updateSerieCasting.affectedRows;
  }

  // D - CRUD - Delete
  async delete(id) {
    const [deleteSerieCasting] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return deleteSerieCasting;
  }
}

module.exports = SerieCastingManager;
