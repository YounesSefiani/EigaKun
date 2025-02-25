// Import access to database tables
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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
      res.json({ user });
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.avatar = req.file.filename;
    }

    // Vérifiez si le mot de passe est fourni et non vide
    if (!updatedData.password || updatedData.password.trim() === '') {
      delete updatedData.password; // Ne pas inclure le mot de passe dans l'objet de mise à jour
    } else {
      // Ici, vous pouvez également ajouter la logique pour hasher le nouveau mot de passe avant de l'enregistrer
      updatedData.password = await argon2.hash(updatedData.password);
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
  } catch (err) {
    next(err);
  }
};
// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  const user = {
    pseudo: req.body.pseudo,
    mail: req.body.mail,
    birthdate: req.body.birthdate,
    password: req.body.password, // Assurez-vous que le mot de passe est hashé si ce n'est pas déjà fait
    avatar: req.file ? req.file.filename : null, // Assurez-vous que le middleware Multer est configuré correctement
  };

  try {
    const insertId = await tables.users.create(user);

    const verificationToken = jwt.sign(
      { mail: user.mail, isValidated: user.isValidated },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    const verificationLink = `http://localhost:5173/user/validation/${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.mail,
      subject: 'Veuillez confirmer votre compte',
      text: `Merci de confirmer votre compte en cliquant sur le lien suivant : ${verificationLink}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({
      message: 'Un e-mail de confirmation vient de vous être envoyé',
      insertId,
      user,
      token: verificationToken,
    });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await tables.users.findByEmail(decoded.mail);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Compte déjà vérifié.' });
    }

    await tables.users.update(user.id, { isValidated: true });

    return res.json({ message: 'Compte vérifié avec succès !' });
  } catch (err) {
    console.error('Erreur de vérification :', err);
    return res
      .status(400)
      .json({ message: 'Lien de validation invalide ou expiré.' });
  }
};

const validateUser = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await tables.users.authByMail(decoded.mail);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    if (user.isValidated) {
      return res.status(400).json({ message: 'Compte déjà validé.' });
    }

    const result = await tables.users.update(user.id, { isValidated: true });

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: 'Compte validé avec succès.', user });
    }
    return res
      .status(500)
      .json({ message: 'Erreur lors de la validation du compte.' });
  } catch (error) {
    console.error('Erreur de validation :', error);
    return res.status(400).json({ message: 'Token invalide ou expiré.' });
  }
};

const forgotPassword = async (req, res, next) => {
  const { mail } = req.body;

  try {
    const user = await tables.users.authByMail(mail);
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Aucun utilisateur trouvé avec cet e-mail.' });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const resetLink = `http://localhost:5173/reset-password-confirm/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: mail,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Pour réinitialiser votre mot de passe, veuillez cliquer sur ce lien : ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      message:
        'Un lien de réinitialisation du mot de passe a été envoyé à votre adresse e-mail.',
    });
  } catch (err) {
    return next(err);
  }
};

const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await argon2.hash(newPassword);
    await tables.users.update(decoded.id, { password: hashedPassword });

    res.json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (err) {
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
const destroy = async (req, res, next) => {
  try {
    await tables.users.delete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await tables.users.authByMail(req.body.mail);

    if (!user || user.isValidated === 0) {
      return res
        .status(401)
        .json({ message: 'Compte non vérifié ou identifiants incorrects.' });
    }

    const isValidPassword = await argon2.verify(
      user.password,
      req.body.password
    );
    if (!isValidPassword) {
      return res.sendStatus(422);
    }

    const token = jwt.sign(
      {
        sub: user.id,
        mail: user.mail,
        pseudo: user.pseudo,
        avatar: user.avatar,
        role: user.role,
        birthdate: user.birthdate,
        isVerified: user.isVerified,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token, user }); // Ensure to return this response
  } catch (err) {
    next(err);
    return res.sendStatus(500); // Ensure to return a response in case of an error
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  edit,
  add,
  verifyEmail,
  validateUser,
  resetPassword,
  forgotPassword,
  destroy,
  login,
};
