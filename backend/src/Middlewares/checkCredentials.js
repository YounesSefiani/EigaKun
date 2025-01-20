const { verifyToken } = require('./auth');

const checkCredentials = (req, res, next) => {
  try {
    const token = req.cookies.authToken; // Lire le cookie contenant le token
    const decode = verifyToken(token);
    if (decode) {
      req.user = decode;
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.error('Échec de la vérification du token :', error);
    res.sendStatus(401);
  }
};

module.exports = checkCredentials;
