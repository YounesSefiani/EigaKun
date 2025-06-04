require('dotenv').config();

const app = require('./src/app'); // Import the Express app

const port = process.env.APP_PORT;

app
  .listen(port, () => {
    console.info(`Server is listening on port ${port}`);
  })
  .on('error', (err) => {
    console.error('Error:', err.message);
  });