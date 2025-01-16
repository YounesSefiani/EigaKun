const AbstractManager = require('./AbstractManager');

class personalitiesManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "personalities" as configuration
    super({ table: 'personalities' });
  }

  // The C of CRUD - Create operation

  async create(personalities) {
    // Execute the SQL INSERT query to add a new personalities to the "personalities" table
    const [result] = await this.database.query(
      `insert into ${this.table} (fullname, image_src, profession, birthdate, origin, deathdate, bio) values (?, ?, ?, ?, ?, ?, ?)`,
      [
        personalities.fullname,
        personalities.image_src,
        personalities.profession,
        personalities.birthdate,
        personalities.origin,
        personalities.deathdate,
        personalities.bio,
      ]
    );

    // Return the ID of the newly inserted personalities
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific personalities by its ID
    const [rows] = await this.database.query(
      `select * from ${this.table} where id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the personalities
    return rows[0];
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all personalitiess from the "personalities" table
    const [rows] = await this.database.query(`select * from ${this.table}`);

    // Return the array of personalitiess
    return rows;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing personality

  async update(id, personalities) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET ? WHERE id = ?`,
      [personalities, id]
    );
    return result.insertId;
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an personalities by its ID

  async delete(id) {
    const result = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = personalitiesManager;
