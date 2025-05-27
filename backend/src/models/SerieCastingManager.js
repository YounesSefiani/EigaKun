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

  async readBySerie(serieId) {
    const [serie] = await this.database.query(
      `SELECT series.id AS serie_id, series.title AS serie_title, personalities.id AS personality_id, personalities.fullname AS personality_fullname, personalities.image_src AS personality_image, ${this.table}.* 
       FROM ${this.table} 
       JOIN series ON ${this.table}.serie_id = series.id 
       JOIN personalities ON ${this.table}.personality_id = personalities.id  
       WHERE ${this.table}.serie_id = ?`,
      [serieId]
    );

    return serie;
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
