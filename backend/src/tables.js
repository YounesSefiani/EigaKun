const MovieManager = require('./models/MovieManager');
const SerieManager = require('./models/SerieManager');

const managers = [
    MovieManager,
    SerieManager,
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