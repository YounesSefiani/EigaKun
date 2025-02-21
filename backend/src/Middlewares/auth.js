/* eslint-disable consistent-return */
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const tables = require('../tables');

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = async (req, res, next) => {
  try {
    if (!req.body.password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const hashedPassword = await argon2.hash(req.body.password, hashingOptions);
    req.body.password = hashedPassword;

    next();
  } catch (err) {
    console.error('Hashing error:', err);
    res.sendStatus(500);
  }
};

const updateHashPassword = async (req, res, next) => {
  try {
    if (!req.body.password) {
      return next(); // Si pas de nouveau mot de passe, on passe
    }

    // Vérifier que currentPassword est bien fourni
    if (!req.body.currentPassword) {
      return res
        .status(400)
        .json({ message: 'Veuillez entrer votre mot de passe actuel.' });
    }

    // Récupérer l'utilisateur actuel
    const user = await tables.users.read(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier si currentPassword correspond au hash en base
    const isMatch = await argon2.verify(
      user.password,
      req.body.currentPassword
    );
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Mot de passe actuel incorrect.' });
    }

    // Hacher le nouveau mot de passe
    req.body.password = await argon2.hash(req.body.password, hashingOptions);
    next();
  } catch (err) {
    console.error('Hashing error:', err);
    res.sendStatus(500);
  }
};

const verifyPassword = async (password, hashed) => {
  try {
    return await argon2.verify(hashed, password, hashingOptions);
  } catch (error) {
    console.error('Password verification error:', error);
    throw new Error('Invalid credentials');
  }
};

const generateToken = (user) => {
  const payload = {
    sub: user.id,
    mail: user.mail,
    pseudo: user.pseudo,
    avatar: user.avatar,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization');

    if (!authorizationHeader) {
      return res
        .status(401)
        .json({ message: 'Authorization header is missing' });
    }

    const [type, token] = authorizationHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Invalid authorization format' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;

    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = {
  updateHashPassword,
  hashPassword,
  generateToken,
  verifyPassword,
  verifyToken,
};
