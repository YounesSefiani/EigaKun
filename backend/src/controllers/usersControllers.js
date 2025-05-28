const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const tables = require("../tables");
const fs = require("fs");
const path = require("path");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    const users = await tables.users.readAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    const user = await tables.users.read(req.params.id);
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json({ user });
    }
  } catch (err) {
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

    // Hash le mot de passe si fourni
    if (updatedData.password && updatedData.password.trim() !== "") {
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
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, user: updatedUser });
  } catch (err) {
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  try {
    // Vérification des champs obligatoires
    if (
      !req.body.username ||
      !req.body.email ||
      !req.body.birthdate ||
      !req.body.password
    ) {
      if (req.file) {
        // Supprime l'avatar uploadé si erreur de validation
        fs.unlink(
          path.join(__dirname, "../assets/Users/Avatars", req.file.filename),
          () => {}
        );
      }
      return res
        .status(400)
        .json({ message: "Champs obligatoires manquants." });
    }

    const hashedPassword = await argon2.hash(req.body.password);

    const user = {
      username: req.body.username,
      email: req.body.email,
      birthdate: req.body.birthdate,
      password: hashedPassword,
      avatar: req.file ? req.file.filename : null,
      isValidated: false,
    };

    const insertId = await tables.users.create(user);

    const verificationToken = jwt.sign(
      { email: user.email, isValidated: user.isValidated },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const verificationLink = `http://localhost:3994/api/users/validate/${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Veuillez confirmer votre compte",
      text: `Merci de confirmer votre compte en cliquant sur le lien suivant : ${verificationLink}`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Erreur lors de l'envoi du email de confirmation :", error);
    }

    res.status(201).json({ id: insertId });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await tables.users.findByEmail(decoded.email);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Compte déjà vérifié." });
    }

    await tables.users.update(user.id, { isValidated: true });

    return res.json({ message: "Compte vérifié avec succès !" });
  } catch (err) {
    console.error("Erreur de vérification :", err);
    return res
      .status(400)
      .json({ message: "Lien de validation invalide ou expiré." });
  }
};

const validateUser = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await tables.users.authByMail(decoded.email);

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

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await tables.users.authByMail(email);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Aucun utilisateur trouvé avec cet e-email." });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `http://localhost:5173/reset-password-confirm/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      text: `Pour réinitialiser votre mot de passe, veuillez cliquer sur ce lien : ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      message:
        "Un lien de réinitialisation du mot de passe a été envoyé à votre adresse e-email.",
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

    res.json({ message: "Mot de passe réinitialisé avec succès." });
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
    const user = await tables.users.authByMail(req.body.email);

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
      return res.sendStatus(422);
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
        birthdate: user.birthdate,
        isVerified: user.isVerified,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token, user });
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
  verifyEmail,
  validateUser,
  resetPassword,
  forgotPassword,
  destroy,
  login,
};
