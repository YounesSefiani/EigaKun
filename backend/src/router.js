const express = require("express");
const router = express.Router();

// MOVIES //

const moviesControllers = require("./controllers/moviesControllers");
const uploadMovies = require("./Middlewares/Multer/MulterMovies");

router.get("/movies", moviesControllers.browse);
router.get("/movies/:id", moviesControllers.read);
router.post(
  "/movies",
  uploadMovies.fields([
    { name: "poster", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  moviesControllers.add
);
router.put(
  "/movies/:id",
  uploadMovies.fields([
    { name: "poster", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  moviesControllers.edit
);
router.delete("/movies/:id", moviesControllers.destroy);

// SERIES //
const seriesControllers = require("./controllers/seriesControllers");
const uploadSeries = require("./Middlewares/Multer/MulterSeries");
router.get("/series", seriesControllers.browse);
router.get("/series/:id", seriesControllers.read);
router.post(
  "/series",
  uploadSeries.fields([
    { name: "poster", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  seriesControllers.add
);
router.put(
  "/series/:id",
  uploadSeries.fields([
    { name: "poster", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  seriesControllers.edit
);
router.delete("/series/:id", seriesControllers.destroy);

module.exports = router;
