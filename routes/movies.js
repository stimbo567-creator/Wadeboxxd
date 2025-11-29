const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');   

router.get('/', (req, res) => {
  const movies = Movie.getAll();
  res.json(movies);
});

router.get('/search', (req, res) => {
  const q = req.query.q || '';
  const results = Movie.search(q);
  res.json(results);
});

router.get('/:id', (req, res) => {
  const movie = Movie.getById(req.params.id);
  if (!movie) return res.status(404).json({ error: 'Not found' });
  res.json(movie);
});

module.exports = router;
