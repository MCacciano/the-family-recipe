const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

const axios = require('axios');

// env
dotenv.config({ path: './config/.config.env' });

const app = express();

// dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', async (req, res) => {
  const { data } = await axios.get(
    `https://api.edamam.com/search?q=${req.params.query}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMA_APP_KEY}`
  );
  const recipes = data.hits;

  res.json({ recipes });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} on port: ${process.env.PORT}`
      .green.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
