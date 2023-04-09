const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes_archive');

const app = express();
app.use(cors({
  origin: '*',
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
// app.get('/author/:type', routes.author);

const add_review = require("./routes/add_review")
app.post('/add_review', add_review)


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
