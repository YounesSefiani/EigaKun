const tables = require("../tables");

// MOVIES

// B - BREAD - READ All

const browse = async (req, res, next) => {
  try {
    const reviews = await tables.userReviews.readAll();
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// R - BREAD - READ One //

const readMoviesReviewsByUser = async (req, res, next) => {
  try {
    const readUserMoviesReviews = await tables.userReviews.readByUserAndMovie(
      req.params.userId,
      req.params.movieId
    );
    if (!readUserMoviesReviews) {
      return res
        .status(404)
        .json({ error: "No reviews found for this user and this movie." });
    }
    res.json(readUserMoviesReviews);
  } catch (err) {
    next(err);
  }
};

const readUserMoviesReviews = async (req, res, next) => {
  try {
    const readUserMoviesReviews = await tables.userReviews.readUserMoviesReviews(
      req.params.userId,
      req.params.id
    );
    if (!readUserMoviesReviews || readUserMoviesReviews.length === 0) {
      return res
        .status(404)
        .json({ error: "No movies reviews found for this user." });
    }
    res.json(readUserMoviesReviews);
  } catch (err) {
    next(err);
  }
};

const readMovieReviews = async (req, res, next) => {
  try {
    const movieReviews = await tables.userReviews.readMovieReviews(
      req.params.movieId
    );
    if (!movieReviews || movieReviews.length === 0) {
      return res
        .status(404)
        .json({ error: "Aucune review pour ce film pour le moment." });
    }
    res.json(movieReviews);
  } catch (err) {
    next(err);
  }
}

const seriesReviewsByUser = async (req, res, next) => {
  try {
    const userSeriesReviews = await tables.userReviews.readByUserAndSerie(
      req.params.userId,
      req.params.serieId
    );
    if (!userSeriesReviews || userSeriesReviews.length === 0) {
      return res
        .status(404)
        .json({ error: "No reviews found for this user and this serie." });
    }
    res.json(userSeriesReviews);
  } catch (err) {
    next(err);
  }
};

const userSeriesReviews = async (req, res, next) => {
  try {
    const userSeriesReviews = await tables.userReviews.readUserSeriesReviews(
      req.params.userId
    );
    if (!userSeriesReviews || userSeriesReviews.length === 0) {
      return res
        .status(404)
        .json({ error: "No series reviews found for this user." });
    }
    res.json(userSeriesReviews);
  } catch (err) {
    next(err);
  }
};

const readSerieReviews = async (req, res, next) => {
  try {
    const serieReviews = await tables.userReviews.readSerieReviews(
      req.params.serieId
    );
    if (!serieReviews || serieReviews.length === 0) {
      return res
        .status(404)
        .json({ error: "Aucune review pour cette série pour le moment." });
    }
    res.json(serieReviews);
  } catch (err) {
    next(err);
  }
}

const personalitiesReviewsByUser = async (req, res, next) => {
  try {
    const userPersonalitiesReviews =
      await tables.userReviews.readByUserAndPersonality(
        req.params.userId,
        req.params.personalityId
      );
    if (!userPersonalitiesReviews) {
      return res.status(404).json({
        error: "No reviews found for this user and this personality.",
      });
    }
    res.json(userPersonalitiesReviews);
  } catch (err) {
    next(err);
  }
};

const userPersonalitiesReviews = async (req, res, next) => {
  try {
    const userPersonalitiesReviews =
      await tables.userReviews.readUserPersonalitiesReviews(
        req.params.userId,
        req.params.id
      );
    if (!userPersonalitiesReviews || userPersonalitiesReviews.length === 0) {
      return res
        .status(404)
        .json({ error: "No personalities reviews found for this user." });
    }
    res.json(userPersonalitiesReviews);
  } catch (err) {
    next(err);
  }
};

const readPersonalityReviews = async (req, res, next) => {
  try {
    const personalityReviews = await tables.userReviews.readPersonalityReviews(
      req.params.personalityId
    );
    if (!personalityReviews || personalityReviews.length === 0) {
      return res
        .status(404)
        .json({ error: "Aucune review pour cette personnalité pour le moment." });
    }
    res.json(personalityReviews);
  } catch (err) {
    next(err);
  }
}

// E - BREAD - EDIT //
const editMovieReview = async (req, res, next) => {
  try {
    const { review, rating } = req.body;

    // Validation
    if (!review && !rating) {
      return res.status(400).json({
        error: "At least review or rating must be provided.",
      });
    }

    if (rating && (rating < 1 || rating > 10)) {
      return res.status(400).json({
        error: "Rating must be between 1 and 10.",
      });
    }

    // Récupère la review existante
    const existingReview = await tables.userReviews.readByUserAndMovie(
      req.params.userId,
      req.params.movieId
    );

    if (!existingReview) {
      return res.status(404).json({
        error: "Review not found for this user and movie.",
      });
    }

    // Prépare les données à mettre à jour
    const updatedMovieReviewData = {
      id: existingReview.id,
      user_id: existingReview.user_id,
      movie_id: existingReview.movie_id,
      review: review || existingReview.review,
      rating: rating || existingReview.rating,
    };

    // Met à jour la review
    const affectedRows = await tables.userReviews.updateMovieReview(
      updatedMovieReviewData
    );

    if (affectedRows === 0) {
      return res.status(500).json({
        error: "Failed to update review.",
      });
    }

    // Récupère la review mise à jour
    const updatedMovieReview = await tables.userReviews.readByUserAndMovie(
      req.params.userId,
      req.params.movieId
    );

    res.json(updatedMovieReview);
  } catch (err) {
    next(err);
  }
};

const editSerieReview = async (req, res, next) => {
  try {
    const { review, rating } = req.body;

    // Validation
    if (!review && !rating) {
      return res.status(400).json({
        error: "At least review or rating must be provided.",
      });
    }

    if (rating && (rating < 1 || rating > 10)) {
      return res.status(400).json({
        error: "Rating must be between 1 and 10.",
      });
    }

    // Récupère la review existante
    const existingReview = await tables.userReviews.readByUserAndSerie(
      req.params.userId,
      req.params.serieId
    );

    if (!existingReview) {
      return res.status(404).json({
        error: "Review not found for this user and serie.",
      });
    }

    // Prépare les données à mettre à jour
    const updatedSerieReviewData = {
      id: existingReview.id,
      user_id: existingReview.user_id,
      serie_id: existingReview.serie_id,
      review: review || existingReview.review,
      rating: rating || existingReview.rating,
    };

    // Met à jour la review
    const affectedRows = await tables.userReviews.updateSerieReview(
      updatedSerieReviewData
    );

    if (affectedRows === 0) {
      return res.status(500).json({
        error: "Failed to update review.",
      });
    }

    // Récupère la review mise à jour
    const updatedSerieReview = await tables.userReviews.readByUserAndSerie(
      req.params.userId,
      req.params.serieId
    );

    res.json(updatedSerieReview);
  } catch (err) {
    next(err);
  }
};

const editPersonalityReview = async (req, res, next) => {
  try {
    const { review, rating } = req.body;

    // Validation
    if (!review && !rating) {
      return res.status(400).json({
        error: "At least review or rating must be provided.",
      });
    }

    if (rating && (rating < 1 || rating > 10)) {
      return res.status(400).json({
        error: "Rating must be between 1 and 10.",
      });
    }

    // Récupère la review existante
    const existingReview = await tables.userReviews.readByUserAndPersonality(
      req.params.userId,
      req.params.personalityId
    );

    if (!existingReview) {
      return res.status(404).json({
        error: "Review not found for this user and personality.",
      });
    }

    // Prépare les données à mettre à jour
    const updatedPersonalityReviewData = {
      id: existingReview.id,
      user_id: existingReview.user_id,
      personality_id: existingReview.personality_id,
      review: review || existingReview.review,
      rating: rating || existingReview.rating,
    };

    // Met à jour la review
    const affectedRows = await tables.userReviews.updatePersonalityReview(
      updatedPersonalityReviewData
    );

    if (affectedRows === 0) {
      return res.status(500).json({
        error: "Failed to update review.",
      });
    }

    // Récupère la review mise à jour
    const updatedPersonalityReview =
      await tables.userReviews.readByUserAndPersonality(
        req.params.userId,
        req.params.personalityId
      );

    res.json(updatedPersonalityReview);
  } catch (err) {
    next(err);
  }
};

// A - BREAD - ADD //

const addMovieReview = async (req, res, next) => {
  const { review, rating } = req.body;

  // Validation
  if (!review || !rating) {
    return res.status(400).json({
      error: "Review and rating are required.",
    });
  }

  if (rating < 1 || rating > 10) {
    return res.status(400).json({
      error: "Rating must be between 1 and 10.",
    });
  }

  try {
    const existingMovieReview = await tables.userReviews.readByUserAndMovie(
      req.params.userId,
      req.params.movieId
    );

    if (existingMovieReview) {
      return res.status(409).json({
        error:
          "Vous avez déjà fait une review pour ce film, si vous souhaitez, vous pouvez la modifier.",
      });
    }

    const movieReviewData = {
      user_id: req.params.userId,
      movie_id: req.params.movieId,
      review,
      rating,
    };

    const insertMovieReviewId = await tables.userReviews.createMovieReview(
      movieReviewData
    );

    const newReview = await tables.userReviews.readByUserAndMovie(
      req.params.userId,
      req.params.movieId
    );

    res.status(201).json({ id: insertMovieReviewId, ...newReview });
  } catch (err) {
    next(err);
  }
};

const addSerieReview = async (req, res, next) => {
  const { review, rating } = req.body;

  // Validation
  if (!review || !rating) {
    return res.status(400).json({
      error: "Review and rating are required.",
    });
  }

  if (rating < 1 || rating > 10) {
    return res.status(400).json({
      error: "Rating must be between 1 and 10.",
    });
  }

  try {
    const existingSerieReview = await tables.userReviews.readByUserAndSerie(
      req.params.userId,
      req.params.serieId
    );

    if (existingSerieReview) {
      return res.status(409).json({
        error:
          "Vous avez deja fait une review pour cette serie, si vous souhaitez, vous pouvez la modifier.",
      });
    }

    const serieReviewData = {
      user_id: req.params.userId,
      serie_id: req.params.serieId,
      review,
      rating,
    };

    const insertSerieReviewId = await tables.userReviews.createSerieReview(
      serieReviewData
    );

    const newSerieReview = await tables.userReviews.readByUserAndSerie(
      req.params.userId,
      req.params.serieId
    );
    res.status(201).json({ id: insertSerieReviewId, ...newSerieReview });
  } catch (err) {
    next(err);
  }
};

const addPersonalityReview = async (req, res, next) => {
  const { review, rating } = req.body;

  // Validation
  if (!review || !rating) {
    return res.status(400).json({
      error: "Review and rating are required.",
    });
  }

  if (rating < 1 || rating > 10) {
    return res.status(400).json({
      error: "Rating must be between 1 and 10.",
    });
  }

  try {
    const existingPersonalityReview =
      await tables.userReviews.readByUserAndPersonality(
        req.params.userId,
        req.params.personalityId
      );

    if (existingPersonalityReview) {
      return res.status(409).json({
        error:
          "Vous avez deja fait une review pour cette personnalité, si vous souhaitez, vous pouvez la modifier.",
      });
    }

    const personalityReviewData = {
      user_id: req.params.userId,
      personality_id: req.params.personalityId,
      review,
      rating,
    };
    const insertPersonalityReviewId =
      await tables.userReviews.createPersonalityReview(personalityReviewData);
    const newPersonalityReview =
      await tables.userReviews.readByUserAndPersonality(
        req.params.userId,
        req.params.personalityId
      );
    res
      .status(201)
      .json({ id: insertPersonalityReviewId, ...newPersonalityReview });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  browse,
  readMoviesReviewsByUser,
  readUserMoviesReviews,
  readMovieReviews,
  seriesReviewsByUser,
  userSeriesReviews,
  readSerieReviews,
  addMovieReview,
  addSerieReview,
  addPersonalityReview,
  editMovieReview,
  editSerieReview,
  editPersonalityReview,
  personalitiesReviewsByUser,
  userPersonalitiesReviews,
  readPersonalityReviews,
};
