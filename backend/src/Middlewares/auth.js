/* eslint-disable consistent-return */
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

console.log('JWT_SECRET:', process.env.JWT_SECRET);

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
  console.log('Payload:', payload);
  console.log('Secret:', process.env.JWT_SECRET);

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  console.log('Generated Token:', token);

};

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization');
    console.log('Authorization Header:', authorizationHeader);

    if (!authorizationHeader) {
      return res
        .status(401)
        .json({ message: 'Authorization header is missing' });
    }

    const [type, token] = authorizationHeader.split(' ');
    console.log('Type:', type);
    console.log('Token:', token);

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Invalid authorization format' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decodedToken);

    req.user = decodedToken;

    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = {
  hashPassword,
  generateToken,
  verifyPassword,
  verifyToken,
};
