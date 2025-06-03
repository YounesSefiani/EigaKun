const AbstractManager = require('./AbstractManager');

class UserManager extends AbstractManager {
  constructor() {
    super({ table: 'users' });
  }

  // C - CRUD - Create
async create(user) {
  try {
    const errors = [];
    const age = new Date().getFullYear() - new Date(user.birthdate).getFullYear();

    if (age < 18) {
      errors.push({ message: "Vous devez avoir 18 ans ou plus !" });
    }
    if (!user.username || user.username.trim() === "") {
      errors.push({ message: "Le nom d'utilisateur est obligatoire." });
    }
    if (!user.email || user.email.trim() === "") {
      errors.push({ message: "L'email est obligatoire." });
    }
    if (!user.password || user.password.trim() === "") {
      errors.push({ message: "Le mot de passe est obligatoire." });
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    // Ici, tu ajoutes l'utilisateur en base (exemple générique)
    const [result] = await this.database.query(
      `INSERT INTO ${this.table} (username, email, birthdate, password, avatar) VALUES (?, ?, ?, ?, ?)`,
      [user.username, user.email, user.birthdate, user.password, user.avatar]
    );
    return { success: true, insertId: result.insertId };
  } catch (error) {
    return { success: false, errors: [{ message: error.message }] };
  }
}

  // R - CRUD - Read all
  async readAll() {
    const [users] = await this.database.query(`SELECT * FROM ${this.table}`);
    return users;
  }

  // R - CRUD - Read one
  async read(id) {
    const [user] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return user[0];
  }

  // R - Find by email
  async findByEmail(email) {
    const [user] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE email = ?`,
      [email]
    );
    return user[0];
  }

  // U - CRUD - Update
  async update(id, user) {
    const fieldsToUpdate = [];
    const values = [];

    if (user.username) {
      fieldsToUpdate.push('username = ?');
      values.push(user.username);
    }
    if (user.email) {
      fieldsToUpdate.push('email = ?');
      values.push(user.email);
    }
    if (user.birthdate) {
      fieldsToUpdate.push('birthdate = ?');
      values.push(user.birthdate);
    }
    if (user.avatar) {
      fieldsToUpdate.push('avatar = ?');
      values.push(user.avatar);
    }
    if (typeof user.isValidated !== "undefined") {
      fieldsToUpdate.push('isValidated = ?');
      values.push(user.isValidated);
    }
    if (
      typeof user.password === "string" &&
      user.password.trim() !== ""
    ) {
      fieldsToUpdate.push('password = ?');
      values.push(user.password);
    }
    if (user.role) {
      fieldsToUpdate.push('role = ?');
      values.push(user.role);
    }

    if (fieldsToUpdate.length === 0) {
      throw new Error('Aucune donnée à mettre à jour.');
    }

    values.push(id);

    const query = `UPDATE ${this.table} SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    const [result] = await this.database.query(query, values);
    return result;
  }

  // D - CRUD - Delete
  async delete(id) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = UserManager;