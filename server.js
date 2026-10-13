// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const deedsRouter = require('./routes/deeds');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // parses form POST data
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', deedsRouter);

app.get('/', (req, res) => {
  res.redirect('/register');
});

app.listen(PORT, () => {
  console.log(`LandTech DeedVerify running at http://localhost:${PORT}`);
});