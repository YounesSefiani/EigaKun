const express = require('express');
const uploadMovies = require('./Middlewares/Multer/MulterMovies');
const uploadSeries = require('./Middlewares/Multer/MulterSeries');
const uploadSeasons = require('./Middlewares/Multer/MulterSeasons');
const uploadEpisodes = require('./Middlewares/Multer/MulterEpisodes');
const uploadPersonalities = require('./Middlewares/Multer/MulterPersonalities');
const uploadUsers = require('./Middlewares/Multer/MulterUsers');

const router = express.Router();

const {
  hashPassword,
  updateHashPassword,
  verifyToken,
} = require('./Middlewares/auth');
/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

/* *********************************MOVIES**************************************** */

// Import itemControllers module for handling item-related operations
const moviesControllers = require('./controllers/moviesControllers');

// Route to get a list of items
router.get('/movies', moviesControllers.browse);

// Route to get a specific item by ID
router.get('/movies/:id', moviesControllers.read);

router.get('/movies/:id/full', moviesControllers.fullMovie);

// Route to add a new movie
router.post(
  '/movies',
  uploadMovies.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'background', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]),
  moviesControllers.add
);

// Route to update a movie
router.put(
  '/movies/:id',
  uploadMovies.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'background', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]),
  moviesControllers.edit
);

// Route to delete a movie
router.delete('/movies/:id', moviesControllers.destroy);

/* *********************************MOVIE*CASTING*************************************** */

// Import moviesControllers module for handling personalities-related operations
const movieCastingControllers = require('./controllers/movieCastingControllers');

// Route to get a list of movies
router.get('/movieCasting', movieCastingControllers.browse);

// Route to get a specific movie by ID
router.get('/movieCasting/:id', movieCastingControllers.read);

router.get(
  '/movieCasting/movies/:movieId',
  movieCastingControllers.getCastingByMovieId
);

// Route to add a new movie
router.post('/movieCasting', movieCastingControllers.add);

// Route to update a movie
router.put('/movieCasting/:id', movieCastingControllers.edit);

// Route to delete a movie
router.delete('/movieCasting/:id', movieCastingControllers.destroy);

/* *********************************SERIES**************************************** */

// Import itemControllers module for handling item-related operations
const seriesControllers = require('./controllers/seriesControllers');

// Route to get a list of items
router.get('/series', seriesControllers.browse);

// Route to get a specific item by ID
router.get('/series/:id', seriesControllers.read);

router.get('/series/:id/full', seriesControllers.fullSerie);

// Route to add a new movie
router.post(
  '/series',
  uploadSeries.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'background', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]),
  seriesControllers.add
);

// Route to update a movie
router.put(
  '/series/:id',
  uploadSeries.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'background', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]),
  seriesControllers.edit
);

// Route to delete a movie
router.delete('/series/:id', seriesControllers.destroy);

/* *********************************SEASONS**************************************** */

// Import itemControllers module for handling item-related operations
const seasonsControllers = require('./controllers/seasonsControllers');

// Route to get a list of items
router.get('/seasons', seasonsControllers.browse);

// Route to get a specific item by ID
router.get('/seasons/:id', seasonsControllers.read);

// Route to add a new movie
router.post('/seasons', uploadSeasons.single('poster'), seasonsControllers.add);

// Route to update a movie
router.put(
  '/seasons/:id',
  uploadSeasons.single('poster'),
  seasonsControllers.edit
);

// Route to delete a movie
router.delete('/seasons/:id', seasonsControllers.destroy);

/* *********************************EPISODES**************************************** */

// Import itemControllers module for handling item-related operations
const episodesControllers = require('./controllers/episodesControllers');

// Route to get a list of items
router.get('/episodes', episodesControllers.browse);

// Route to get a specific item by ID
router.get('/episodes/:id', episodesControllers.read);

// Route to add a new movie
router.post(
  '/episodes',
  uploadEpisodes.single('image'),
  episodesControllers.add
);

// Route to update a movie
router.put(
  '/episodes/:id',
  uploadEpisodes.single('image'),
  episodesControllers.edit
);

// Route to delete a movie
router.delete('/episodes/:id', episodesControllers.destroy);

/* *********************************SERIE*CASTING*************************************** */

// Import moviesControllers module for handling personalities-related operations
const serieCastingControllers = require('./controllers/serieCastingControllers');

// Route to get a list of movies
router.get('/serieCasting', serieCastingControllers.browse);

// Route to get a specific movie by ID
router.get('/serieCasting/:id', serieCastingControllers.read);

// Route to add a new movie
router.post('/serieCasting', serieCastingControllers.add);

// Route to update a movie
router.put('/serieCasting/:id', serieCastingControllers.edit);

// Route to delete a movie
router.delete('/serieCasting/:id', serieCastingControllers.destroy);

/* *********************************PERSONALITIES**************************************** */

const personalitiesControllers = require('./controllers/personalitiesControllers');

// Route to get a list of items
router.get('/personalities', personalitiesControllers.browse);

// Route to get a specific item by ID
router.get('/personalities/:id', personalitiesControllers.read);

router.get(
  '/personalities/:id/career',
  personalitiesControllers.getFilmography
);
// Route to add a new movie
router.post(
  '/personalities',
  uploadPersonalities.single('image_src'),
  personalitiesControllers.add
);

// Route to update a movie
router.put(
  '/personalities/:id',
  uploadPersonalities.single('image_src'),
  personalitiesControllers.edit
);

// Route to delete a movie
router.delete('/personalities/:id', personalitiesControllers.destroy);

/* *********************************USERS**************************************** */

// Import itemControllers module for handling item-related operations
const usersControllers = require('./controllers/usersControllers');

// Route to get a list of items
router.get('/users', usersControllers.browse);

// Route to get a specific item by ID
router.get('/users/:id', verifyToken, usersControllers.read);

// Route to add a new movie
router.post(
  '/users',
  uploadUsers.single('avatar'),
  hashPassword,
  usersControllers.add
);

// Route to update a movie
router.put(
  '/users/:id',
  uploadUsers.single('avatar'),
  updateHashPassword,
  verifyToken,
  usersControllers.edit
);

// Route to delete a movie
router.delete('/users/:id', usersControllers.destroy);

router.post('/login', usersControllers.login);
router.get('/verify/:token', usersControllers.verifyEmail);
router.get('/user/validate/:token', usersControllers.validateUser);
router.post('/users/forgot-password', usersControllers.forgotPassword);
router.post('/users/reset-password', usersControllers.resetPassword);
module.exports = router;
