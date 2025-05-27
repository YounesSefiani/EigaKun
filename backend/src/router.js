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
router.get("/series/:id", seriesControllers.getFullSerie);
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

// SEASONS //
const seasonsControllers = require("./controllers/seasonsControllers");
const uploadSeasons = require("./Middlewares/Multer/MulterSeasons");
router.get("/seasons", seasonsControllers.browse);
router.get("/seasons/:id", seasonsControllers.read);
router.get("/seasons/series/:id", seasonsControllers.getSeasonsBySerie);
router.post("/seasons", uploadSeasons.single("poster"), seasonsControllers.add);
router.put(
  "/seasons/:id",
  uploadSeasons.single("poster"),
  seasonsControllers.edit
);
router.delete("/seasons/:id", seasonsControllers.destroy);

// EPISODES //
const episodesControllers = require("./controllers/episodesControllers");
const uploadEpisodes = require("./Middlewares/Multer/MulterEpisodes");

router.get("/episodes", episodesControllers.browse);
router.get("/episodes/:id", episodesControllers.read);
router.get("/episodes/seasons/:id", episodesControllers.getEpisodesBySeason);
router.post(
  "/episodes",
  uploadEpisodes.single("image"),
  episodesControllers.add
);
router.put(
  "/episodes/:id",
  uploadEpisodes.single("image"),
  episodesControllers.edit
);
router.delete("/episodes/:id", episodesControllers.destroy);

// PERSONALITIES
const personalitiesControllers = require("./controllers/personalitiesControllers");
const uploadPersonalities = require("./Middlewares/Multer/MulterPersonalities");

router.get("/personalities", personalitiesControllers.browse);
router.get("/personalities/:id", personalitiesControllers.read);
router.post(
  "/personalities",
  uploadPersonalities.single("image_src"),
  personalitiesControllers.add
);
router.put(
  "/personalities/:id",
  uploadPersonalities.single("image_src"),
  personalitiesControllers.edit
);
router.delete(
  "/personalities/:id",
  personalitiesControllers.destroy
);

module.exports = router;
