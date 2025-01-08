// Import access to database tables
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const tables = require('../tables');

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all users from the database
    const users = await tables.users.readAll();

    // Respond with the users in JSON format
    res.json(users);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific user from the database based on the provided ID
    const user = await tables.users.read(req.params.id);

    // If the user is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the user in JSON format
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  try {
    console.log("Données reçues", req.body);
    console.log("Fichier reçu :", req.file);
    const { id } = req.params;
    const updatedData = req.body;

    if (req.file) {
      updatedData.avatar = req.file.filename;
    }
    await tables.users.update(id, updatedData, req.file);

    const updatedUser = await tables.users.read(id);

    const token = jwt.sign(
      {
        sub: updatedUser.id,
        mail: updatedUser.mail,
        pseudo: updatedUser.pseudo,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        birthdate: updatedUser.birthdate,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token, user: updatedUser });
    console.log("token", token);
  } catch (err) {
    next(err);
  }
};
// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the user data from the request body
  const user = {
    ...req.body,
    avatar: req.file ? req.file.filename : null,
  };

  try {
    // Insert the user into the database
    const insertUserId = await tables.users.create(user);
    // Respond with HTTP 201 (Created) and the ID of the newly inserted user
    res.status(201).json({ insertUserId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroy = async (req, res, next) => {
  try {
    await tables.users.delete(req.params.id);
    res.status(204).json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await tables.users.authByMail(req.body.mail);

    if (user == null) {
      res.status(401).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    const isValidPassword = await argon2.verify(
      user.password,
      req.body.password
    );
    if (isValidPassword) {
      delete user.password;

      const token = jwt.sign(
        {
          sub: user.id,
          mail: user.mail,
          pseudo: user.pseudo,
          avatar: user.avatar,
          role: user.role,
          birthdate: user.birthdate,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Le jeton expire dans une heure
      );

      const userResponse = {
        id: user.id,
        pseudo: user.pseudo,
        email: user.mail,
        role: user.role,
        avatar: user.avatar,
        birthdate: user.birthdate,
      };

      // 5. Répondre avec les détails de l'utilisateur et le jeton
      res.status(200).json({
        token,
        user: userResponse,
      });
    } else {
      res.sendStatus(422);
    }
  } catch (err) {
    next(err); // Passer l'erreur au middleware de gestion des erreurs
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
  login,
};
