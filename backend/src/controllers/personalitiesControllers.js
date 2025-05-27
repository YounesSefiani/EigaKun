// Import access to database tables
const fs = require('fs');
const path = require('path');
const tables = require('../tables');

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all personalities from the database
    const personalities = await tables.personalities.readAllPersonalities();

    // Respond with the personalities in JSON format
    res.json(personalities);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific personality from the database based on the provided ID
    const personality = await tables.personalities.read(req.params.id);

    // If the personalitie is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the personalitie in JSON format
    if (personality == null) {
      res.sendStatus(404);
    } else {
      res.json(personality);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// eslint-disable-next-line consistent-return
const getFilmography = async (req, res) => {
  try {
    const personalityId = req.params.id;
    const personality = await personalityManager.read(personalityId);
    if (!personality) {
      return res.status(404).send('Personnalité non trouvée');
    }

    const movies =
      await movieCastingManager.moviesByPersonalityId(personalityId);

    const series =
      await serieCastingManager.seriesByPersonalityId(personalityId);

    const fullFilmography = { personality, movies, series };

    res.json(fullFilmography);
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatePersonality = req.body;
    const { file } = req;

    const personality = await tables.personalities.read(id);

    const updatedPersonalityDatas = {
        id,
        fullname: updatePersonality.fullname || personality.fullname || null,
        birthdate: updatePersonality.birthdate || personality.birthdate || null,
        deathdate: updatePersonality.deathdate || personality.deathdate || null,
        image_src: file ? file.filename : updatePersonality.image_src || personality.image_src || null,
        bio: updatePersonality.bio || personality.bio || null,
        origin: updatePersonality.origin || personality.origin || null,
        profession: updatePersonality.profession || personality.profession || null,
    }

    await tables.personalities.update(updatedPersonalityDatas);

    const updatedPersonality = await tables.personalities.read(id);

    if (!updatedPersonality) {
      return res
        .status(404)
        .json({ message: 'Personnalité non trouvée ou mise à jour échouée.' });
    }

    return res.status(200).json({
      message: 'Personnalité mise à jour avec succès',
      updatePersonality: updatedPersonality,
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la personnalité:', err);
    next(err);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  try {
    const personalityDatas = req.body;
    personalityDatas.image_src = req.file ? req.file.filename : "default.jpg";

    const result = await tables.personalities.create(personalityDatas);

    if (!result.success) {
      // suppression image si upload
      if (req.file) {
        const filePath = path.join(__dirname, '../assets/Personalities/Images', req.file.filename);
        fs.unlink(filePath, (err) => {
          if (err) console.error('Erreur lors de la suppression du fichier:', err);
        });
      }
      return res.status(400).json(result);
    }

    return res.status(201).json({ id: result.id, personalityDatas });
  } catch (err) {
    next(err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};


// The D of BREAD - Destroy (Delete) operation
const destroy = async (req, res, next) => {
  try {
    await tables.personalities.delete(req.params.id);
    res.status(200).json({ message: 'Personnalité supprimée avec succès.' });
  } catch (err) {
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  getFilmography,
  edit,
  add,
  destroy,
};