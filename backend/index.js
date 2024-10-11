const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Bienvenue sur cette application');
});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});