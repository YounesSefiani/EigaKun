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
      `insert into ${this.table} (username, password, email, birthdate, avatar) VALUES (?, ?, ?, ?, ?)`,
      [user.username, user.password, user.email, user.birthdate, user.avatar,]
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

  async authByMail(email) {
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE email = ?`,
      [email]
    );
    return rows[0];
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing user

  async update(id, user, file) {
    // Initialise les champs à mettre à jour et les valeurs
    const fieldsToUpdate = [];
    const values = [];

    // Ajoute les champs à mettre à jour seulement s'ils sont présents dans l'objet user
    if (user.pseudo) {
      fieldsToUpdate.push('pseudo = ?');
      values.push(user.pseudo);
    }

    if (user.email) {
      fieldsToUpdate.push('email = ?');
      values.push(user.email);
    }

    if (user.avatar) {
      fieldsToUpdate.push('avatar = ?');
      values.push(user.avatar);
    }

    if (user.role) {
      fieldsToUpdate.push('role = ?');
      values.push(user.role);
    }

    if (user.isValidated) {
      fieldsToUpdate.push('isValidated = ?');
      values.push(user.isValidated);
    }

    if (user.password) {
      // Vérifie si le mot de passe est différent de celui de l'utilisateur existant
      const [existingPassword] = await this.database.query(
        `SELECT password FROM users WHERE id = ?`,
        [id]
      );

      if (
        existingPassword.length > 0 &&
        existingPassword[0].password === user.password
      ) {
        throw new Error(
          'Ce mot de passe est le même mot de passe pour se connecter. Veuillez en créer un autre.'
        );
      }

      fieldsToUpdate.push('password = ?');
      values.push(user.password);
    }

    // Si aucun champ n'est fourni, renvoie une erreur
    if (fieldsToUpdate.length === 0) {
      throw new Error('Aucune donnée à mettre à jour.');
    }

    // Ajoute l'ID à la fin du tableau des valeurs pour la condition WHERE
    values.push(id, file);

    // Construit la requête SQL dynamiquement
    const query = `UPDATE ${this.table} SET ${fieldsToUpdate.join(
      ', '
    )} WHERE id = ?`;

    // Exécute la requête avec les valeurs dynamiques
    const [result] = await this.database.query(query, values, file);
    return result;
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