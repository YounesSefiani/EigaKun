const express = require("express");
const router = express.Router();

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

module.exports = router;
