const AbstractManager = require("./AbstractManager");

class PersonalityManager extends AbstractManager {
    constructor() {
        super({table: "personalities"});
    }

    // C - CRUD - Create
    async create(personality) {
        const imageSrc = personality.image_src || "default.jpg";
        try {

            const [existingPersonality] = await this.database.query(
                `SELECT * FROM ${this.table} WHERE fullname = ?`,
                [personality.fullname]
            );
            if (existingPersonality.length > 0) {
                return { success: false, message: "Personnalité existante" };
            }
            const [resultPersonality] = await this.database.query(
                `INSERT INTO ${this.table} (fullname, image_src, birthdate, deathdate, origin, bio, profession) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    personality.fullname,
                    imageSrc,
                    personality.birthdate,
                    personality.deathdate,
                    personality.origin,
                    personality.bio,
                    personality.profession
                ]
            );
            return {
                success: true,
                id: resultPersonality.insertId,
                message: "Personnalité créée avec succès !"
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // R - CRUD - Read
    async readAllPersonalities() {
        const [personalities] = await this.database.query(`SELECT * FROM ${this.table}`);
        return personalities;
    }

    async read(id) {
        const [personality] = await this.database.query(
            `SELECT * FROM ${this.table} WHERE id = ?`,
            [id]
        );
        return personality[0];
    }

    // U - CRUD - Update
    async update(personality) {
        const [updatePersonality] = await this.database.query(
            `UPDATE ${this.table} SET fullname = ?, image_src = ?, birthdate = ?, deathdate = ?, origin = ?, bio = ?, profession = ? WHERE id = ?`,
            [
                personality.fullname,
                personality.image_src,
                personality.birthdate,
                personality.deathdate,
                personality.origin,
                personality.bio,
                personality.profession,
                personality.id
            ]
        );
        return updatePersonality.affectedRows > 0;
    }

    // D - CRUD - Delete
    async delete(id) {
        const [deletePersonality] = await this.database.query(
            `DELETE FROM ${this.table} WHERE id = ?`,
            [id]
        );
        return deletePersonality.affectedRows > 0;
    }


}

module.exports = PersonalityManager;