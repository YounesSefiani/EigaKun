const tables = require("../tables");

const browse = async (req, res, next) => {
  try {
    const serieCastings = await tables.serieCasting.readAll();
    res.json(serieCastings);
  } catch (err) {
    next(err);
  }
};

const read = async (req, res, next) => {
  const serieCasting = await tables.serieCasting.read(req.params.id);
  if (!serieCasting) {
    return res.status(404).json({ error: "Serie casting not found" });
  }
  res.json(serieCasting);
};

const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateSerieCasting = req.body;

    const serieCasting = await tables.serieCasting.read(id);

    const updatedSerieCastingDatas = {
      id,
      serie_id: updateSerieCasting.serie_id || serieCasting.serie_id || null,
      personality_id:
        updateSerieCasting.personality_id ||
        serieCasting.personality_id || null,
      role: updateSerieCasting.role || serieCasting.role || null,
      side: updateSerieCasting.side || serieCasting.side || null,
    };

    await tables.serieCasting.update(updatedSerieCastingDatas);

    const updatedSerieCasting = await tables.serieCasting.read(id);
    if (!updatedSerieCasting) {
      return res.status(404).json({ error: "Updated Serie Casting not found" });
    }
    res.json(updatedSerieCasting);
  } catch (err) {
    next(err);
  }
};

const add = async (req, res, next) => {
  try {
    const serieCasting = req.body;
    const result = await tables.serieCasting.create(serieCasting);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await tables.serieCasting.delete(id);
    if (result === 0) {
      return res.status(404).json({ error: "Serie casting not found" });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {browse, add, read, edit, destroy};