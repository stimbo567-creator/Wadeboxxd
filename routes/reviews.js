
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Movie = require('../models/movie');

router.get('/', (req, res) => {
  const rows = Review.getAll();
  res.json(rows);
});

router.get('/movie/:id', (req, res) => {
  const movieId = Number(req.params.id);
  const rows = Review.getByMovie(movieId);
  res.json(rows);
});

router.get('/user/:username', (req, res) => {
  const rows = Review.getByUser(req.params.username);
  res.json(rows);
});

router.post('/', (req, res) => {
  const { username, movieId, rating, comment } = req.body || {};
  if (!username || !movieId || !rating) return res.status(400).json({ error: 'Missing fields' });

  const movie = Movie.getById(movieId);
  const review = {
    userId: null,
    username,
    movieId: movie ? movie.id : movieId,
    movieTitle: movie ? movie.title : 'Unknown',
    rating: Number(rating),
    comment: comment ? String(comment) : '',
    createdAt: new Date().toISOString()
  };

  const id = Review.add(review);
  review.id = id;
  res.status(201).json(review);
});

module.exports = router;
