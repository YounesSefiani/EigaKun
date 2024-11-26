const express = require('express');
const uploadMovies = require('./Middlewares/Multer/MulterMovies');
const uploadSeries = require('./Middlewares/Multer/MulterSeasons');
const uploadSeasons = require('./Middlewares/Multer/MulterSeasons');

const router = express.Router();

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

/* *********************************SERIES**************************************** */

// Import itemControllers module for handling item-related operations
const seriesControllers = require('./controllers/seriesControllers');

// Route to get a list of items
router.get('/series', seriesControllers.browse);

// Route to get a specific item by ID
router.get('/series/:id', seriesControllers.read);

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

module.exports = router;
