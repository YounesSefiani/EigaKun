const express = require("express");
const router = express.Router();

// MOVIES //

const moviesControllers = require("./controllers/moviesControllers");
const uploadMovies = require("./Middlewares/Multer/MulterMovies");

router.get("/movies", moviesControllers.browse);
router.get("/movies/:id", moviesControllers.readMovie);

// SERIES //
const seriesControllers = require("./controllers/seriesControllers");
const uploadSeries = require("./Middlewares/Multer/MulterSeries");
router.get("/series", seriesControllers.browse);
router.get("/series/:id", seriesControllers.getFullSerie);

// SEASONS //
const seasonsControllers = require("./controllers/seasonsControllers");
const uploadSeasons = require("./Middlewares/Multer/MulterSeasons");
router.get("/seasons", seasonsControllers.browse);
router.get("/seasons/:id", seasonsControllers.read);
router.get("/seasons/series/:id", seasonsControllers.getSeasonsBySerie);

// EPISODES //
const episodesControllers = require("./controllers/episodesControllers");
const uploadEpisodes = require("./Middlewares/Multer/MulterEpisodes");

router.get("/episodes", episodesControllers.browse);
router.get("/episodes/:id", episodesControllers.read);
router.get("/episodes/seasons/:id", episodesControllers.getEpisodesBySeason);

// PERSONALITIES
const personalitiesControllers = require("./controllers/personalitiesControllers");
const uploadPersonalities = require("./Middlewares/Multer/MulterPersonalities");

router.get("/personalities", personalitiesControllers.browse);
router.get("/personalities/:id", personalitiesControllers.read);

// MOVIES CASTINGS //
const movieCastingControllers = require("./controllers/movieCastingControllers");

router.get("/movieCasting", movieCastingControllers.browse);
router.get("/movieCasting/:id", movieCastingControllers.read);

// SERIES CASTINGS //
const serieCastingControllers = require("./controllers/serieCastingControllers");

router.get("/serieCasting", serieCastingControllers.browse);
router.get("/serieCasting/:id", serieCastingControllers.read);

// USERS //

const {
  hashPassword,
  updateHashPassword,
  verifyToken,
  // validateUserForm,
} = require("./Middlewares/auth");


const usersControllers = require("./controllers/usersControllers");
const uploadUsers = require("./Middlewares/Multer/MulterUsers");

router.get("/users",  verifyToken, usersControllers.browse);
router.get("/users/:id", verifyToken, usersControllers.read);
router.get("/users/validate/:token", usersControllers.validateUser);
router.post("/users", uploadUsers.single("avatar"), hashPassword, usersControllers.add);
router.post("/users/login", usersControllers.login);
router.post("/users/forgot-password", usersControllers.forgotPassword);
router.post("/users/reset-password-confirm/:token", usersControllers.resetPassword);
router.put("/users/:id", verifyToken, uploadUsers.single("avatar"), updateHashPassword, usersControllers.edit);
router.delete("/users/:id", verifyToken, usersControllers.destroy);


// WALL //

router.post(
  "/movies",
  uploadMovies.fields([
    { name: "poster", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  verifyToken,
  moviesControllers.add
);
router.put(
  "/movies/:id",
  uploadMovies.fields([
    { name: "poster", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  verifyToken,
  moviesControllers.edit
);
router.delete("/movies/:id", moviesControllers.destroy);

router.post(
  "/series",
  uploadSeries.fields([
    { name: "poster", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  verifyToken,
  seriesControllers.add
);
router.put(
  "/series/:id",
  uploadSeries.fields([
    { name: "poster", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  verifyToken,
  seriesControllers.edit
);
router.delete("/series/:id", verifyToken, seriesControllers.destroy);

router.post("/seasons", uploadSeasons.single("poster"), verifyToken, seasonsControllers.add);
router.put(
  "/seasons/:id",
  uploadSeasons.single("poster"),
  verifyToken,
  seasonsControllers.edit
);
router.delete("/seasons/:id", verifyToken, seasonsControllers.destroy);

router.post(
  "/episodes",
  uploadEpisodes.single("image"),
  verifyToken,
  episodesControllers.add
);
router.put(
  "/episodes/:id",
  uploadEpisodes.single("image"),
  verifyToken,
  episodesControllers.edit
);
router.delete("/episodes/:id", verifyToken, episodesControllers.destroy);

router.post(
  "/personalities",
  uploadPersonalities.single("image_src"),
  verifyToken,
  personalitiesControllers.add
);
router.put(
  "/personalities/:id",
  uploadPersonalities.single("image_src"),
  verifyToken,
  personalitiesControllers.edit
);
router.delete("/personalities/:id", verifyToken, personalitiesControllers.destroy);

router.post("/movieCasting", verifyToken, movieCastingControllers.add);
router.put("/movieCasting/:id", verifyToken, movieCastingControllers.edit);
router.delete("/movieCasting/:id", verifyToken, movieCastingControllers.destroy);

router.post("/serieCasting", verifyToken, serieCastingControllers.add);
router.put("/serieCasting/:id", verifyToken, serieCastingControllers.edit);
router.delete("/serieCasting/:id", verifyToken, serieCastingControllers.destroy);


module.exports = router;
