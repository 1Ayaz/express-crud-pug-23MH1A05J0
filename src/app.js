const express = require('express');
const path = require('path');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', studentRoutes);

// Error handling - for 404
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

module.exports = app;
