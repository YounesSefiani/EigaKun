const AbstractManager = require('./AbstractManager');

class userManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "user" as configuration
    super({ table: 'users' });
  }

  // The C of CRUD - Create operation

  async create(user) {
    // Execute the SQL INSERT query to add a new user to the "user" table
    const [result] = await this.database.query(
      `insert into ${this.table} (pseudo, password, mail, birthdate, avatar) VALUES (?, ?, ?, ?, ?)`,
      [user.pseudo, user.password, user.mail, user.birthdate, user.avatar]
    );

    // Return the ID of the newly inserted user
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific user by its ID
    const [rows] = await this.database.query(
      `select * from ${this.table} where id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the user
    return rows[0];
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all users from the "user" table
    const [rows] = await this.database.query(`select * from ${this.table}`);

    // Return the array of users
    return rows;
  }

  async authByMail(mail) {
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE mail = ?`,
      [mail]
    );
    return rows[0];
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing user

  async update(id, user, files) {
    const fieldsToUpdateUser = [];
    const values = [];

    Object.entries(user).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        fieldsToUpdateUser.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fieldsToUpdateUser.length === 0) {
      return { affectedRows: 0 };
    }

    // Ajout de l'ID à la fin des valeurs pour la clause WHERE
    values.push(id);

    const query = `UPDATE ${this.table} SET ${fieldsToUpdateUser.join(
      ', '
    )} WHERE id = ?`;

    try {
      const [result] = await this.database.query(query, values);

      // Gestion des fichiers après la mise à jour de l'utilisateur
      if (files && files.length > 0) {
        // Implémenter la logique pour gérer les fichiers
        await this.updateFiles(id, files); // Par exemple, une méthode pour gérer les fichiers
      }

      return result;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      throw error; // Relancer l'erreur pour qu'elle soit gérée en amont
    }
  }

  //   The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an user by its ID

  async delete(id) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = userManager;
