const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const nodemailer = require("../Middlewares/nodemailer");
const tables = require("../tables");
const fs = require("fs");
const path = require("path");

// BREAD - Browse (Read All)
const browse = async (req, res, next) => {
  try {
    const users = await tables.users.readAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// BREAD - Read (Read One)
const read = async (req, res, next) => {
  try {
    const user = await tables.users.read(req.params.id);
    if (!user) {
      res.sendStatus(404);
    } else {
      res.json({ user });
    }
  } catch (err) {
    next(err);
  }
};

// BREAD - Add (Create)
const add = async (req, res, next) => {
  try {
    // Prépare l'objet user à valider
    const user = {
      username: req.body.username,
      email: req.body.email,
      birthdate: req.body.birthdate,
      password: req.body.password,
      avatar: req.file ? req.file.filename : null,
      isValidated: false,
    };

    // Validation via le manager
    const result = await tables.users.create(user);

    if (!result.success) {
      // Supprime l'avatar uploadé si erreur
      if (req.file) {
        fs.unlink(
          path.join(__dirname, "../assets/Users/Avatars", req.file.filename),
          () => {}
        );
      }
      return res.status(400).json({ errors: result.errors });
    }

    // Hash du mot de passe (après validation)
    const hashedPassword = await argon2.hash(user.password);
    user.password = hashedPassword;

    // Mise à jour du mot de passe hashé en base
    await tables.users.update(result.insertId, { password: user.password });

    // Génération du token de validation
    const verificationToken = jwt.sign(
      { email: user.email, isValidated: user.isValidated },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    const verificationLink = `http://localhost:3994/api/users/validate/${verificationToken}`;

    // Envoi de l'email de validation
    await nodemailer.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Veuillez confirmer votre compte",
      text: `Merci de confirmer votre compte en cliquant sur le lien suivant : ${verificationLink}`,
    });

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
};
// BREAD - Edit (Update)
const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.avatar = req.file.filename;
    }

    // Hash le mot de passe si fourni et valide
    if (
      typeof updatedData.password === "string" &&
      updatedData.password.trim() !== ""
    ) {
      updatedData.password = await argon2.hash(updatedData.password);
    } else {
      delete updatedData.password;
    }

    await tables.users.update(id, updatedData, req.file);
    const updatedUser = await tables.users.read(id);

    const token = jwt.sign(
      {
        sub: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        birthdate: updatedUser.birthdate,
        isValidated: updatedUser.isValidated,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, user: updatedUser });
  } catch (err) {
    next(err);
  }
};

// BREAD - Destroy (Delete)
const destroy = async (req, res, next) => {
  try {
    await tables.users.delete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

// Validation du compte par email
const validateUser = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await tables.users.findByEmail(decoded.email);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (user.isValidated) {
      return res.status(400).json({ message: "Compte déjà validé." });
    }

    const result = await tables.users.update(user.id, { isValidated: true });

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Compte validé avec succès.", user });
    }
    return res
      .status(500)
      .json({ message: "Erreur lors de la validation du compte." });
  } catch (error) {
    console.error("Erreur de validation :", error);
    return res.status(400).json({ message: "Token invalide ou expiré." });
  }
};

// Mot de passe oublié
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await tables.users.findByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Aucun utilisateur trouvé avec cet e-mail." });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `http://localhost:3994/reset-password-confirm/${resetToken}`;

    await nodemailer.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reinitialisation de votre mot de passe",
      text: `Merci de confirmer votre compte en cliquant sur le lien suivant : ${resetLink}`,
    });
    return res.json({
      message: "Un lien de réinitialisation a été envoyé à votre boite mail.",
    });
  } catch (err) {
    return next(err);
  }
};

// Réinitialisation du mot de passe
const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await argon2.hash(newPassword);
    await tables.users.update(decoded.id, { password: hashedPassword });

    res.json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (err) {
    next(err);
  }
};

// Connexion utilisateur
const login = async (req, res, next) => {
  try {
    const user = await tables.users.findByEmail(req.body.email);

    if (!user || user.isValidated === 0) {
      return res
        .status(401)
        .json({ message: "Compte non vérifié ou identifiants incorrects." });
    }

    const isValidPassword = await argon2.verify(
      user.password,
      req.body.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
        birthdate: user.birthdate,
        isValidated: user.isValidated,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token, user:{
      username: user.username,
      birthdate: user.birthdate,
      email: user.email,
      role: user.role,
      isValidated: user.isValidated,
      avatar: user.avatar,
    } });
  } catch (err) {
    next(err);
    return res.sendStatus(500);
  }
};

module.exports = {
  browse,
  read,
  edit,
  add,
  validateUser,
  resetPassword,
  forgotPassword,
  destroy,
  login,
};
