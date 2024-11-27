const MovieManager = require('./models/MovieManager');
const SerieManager = require('./models/SerieManager');
const SeasonManager = require('./models/SeasonManager');
const EpisodeManager = require('./models/EpisodeManager');

const managers = [MovieManager, SerieManager, SeasonManager, EpisodeManager];

const tables = {};

managers.forEach((ManagerClass) => {
  const manager = new ManagerClass();
  tables[manager.table] = manager;
});

module.exports = new Proxy(tables, {
  get(obj, prop) {
    if (prop in obj) return obj[prop];

    throw new ReferenceError(
      `tables.${prop} is not defined. Did you register it in ${__filename} ?`
    );
  },
});
