const MovieManager = require('./models/MovieManager');
const SerieManager = require('./models/SerieManager');
const SeasonManager = require('./models/SeasonManager');
const EpisodeManager = require('./models/EpisodeManager');
const PersonalityManager = require('./models/PersonalityManager');
const MovieCastingManager = require('./models/MovieCastingManager');
const SerieCastingManager = require('./models/SerieCastingManager');

const managers = [
    MovieManager,
    SerieManager,
    SeasonManager,
    EpisodeManager,
    PersonalityManager,
    MovieCastingManager,
    SerieCastingManager,
    // Add other managers here
];

const tables = {};

managers.forEach((ManagerClass) => {
    const manager = new ManagerClass();
    tables[manager.table] = manager;
});

module.exports = new Proxy(tables, {
    get(obj, prop) {
        if (prop in obj) {
            return obj[prop];
        }
        throw new ReferenceError(`Table ${prop} does not exist. Did you register it in ${__filename}?`);
    },
});