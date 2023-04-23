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

const add_tip = require("./routes/add_tip")
app.post('/add_tip', add_tip)

const add_review = require("./routes/add_review")
app.post('/add_review', add_review)

const register = require("./routes/register")
app.post('/register', register)

const profile = require("./routes/profile")
app.get('/profile/:user_id', profile)

const login = require("./routes/login")
app.post('/login', login)

const recommendation = require("./routes/recommendation")
app.get('/recommendation', recommendation)

const getTips = require("./routes/tips");
app.get("/tips/:business_id", getTips);

const search_business = require("./routes/search_business")
app.post('/search_business', search_business)

const reviews = require("./routes/reviews")
app.get('/reviews/:business_id', reviews)

const business = require("./routes/business")
app.get("/business/:business_id", business)

const similar_taste_users_favourite = require("./routes/similar_taste")
app.get("/similar_taste_users_favourite/:user_id", similar_taste_users_favourite)

const top_reviews = require("./routes/top_reviews")
app.get('/top_reviews/:business_id', top_reviews)

const highest_star_category_review_count = require("./routes/highest_star_category")
app.get('/highest_star_category_review_count', highest_star_category_review_count)

const business_in_city_lowest_review = require("./routes/business_in_city")
app.get('/business_in_city_lowest_review', business_in_city_lowest_review)

const find_friend = require("./routes/find_friend")
app.get('/find_friend', find_friend)

const request_add_friend = require("./routes/request_add_friend")
app.post('/request_add_friend', request_add_friend)

const pending_friend_request = require("./routes/pending_friend_request")
app.get('/pending_friend_request/:user_id', pending_friend_request)

const respond_add_friend = require("./routes/respond_add_friend")
app.post('/respond_add_friend', respond_add_friend)

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
