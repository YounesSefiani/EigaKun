const MovieManager = require('./models/MovieManager');
const SerieManager = require('./models/SerieManager');
const SeasonManager = require('./models/SeasonManager');
const EpisodeManager = require('./models/EpisodeManager');
const PersonalityManager = require('./models/PersonalityManager');
const MovieCastingManager = require('./models/MovieCastingManager');
const SerieCastingManager = require('./models/SerieCastingManager');
const UserManager = require('./models/UserManager');
const UsersLikedManager = require('./models/UsersInteractionsManagers/UsersLikedManager');
const UsersFavoritesManager = require('./models/UsersInteractionsManagers/UsersFavoritesManager');
const UsersSeenManager = require('./models/UsersInteractionsManagers/UsersSeenManager');
const UsersToWatchManager = require('./models/UsersInteractionsManagers/UsersToWatchManager');
const UsersIsWatchingSeriesManager = require('./models/UsersInteractionsManagers/UsersIsWatchingSeriesManager');

const managers = [
  MovieManager,
  SerieManager,
  SeasonManager,
  EpisodeManager,
  PersonalityManager,
  MovieCastingManager,
  SerieCastingManager,
  UserManager,
  UsersLikedManager,
  UsersFavoritesManager,
  UsersSeenManager,
  UsersToWatchManager,
  UsersIsWatchingSeriesManager,
];

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
