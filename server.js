const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const moviesRouter = require('./routes/movies');
const reviewsRouter = require('./routes/reviews');
const usersRouter = require('./routes/users');

app.use('/movies', moviesRouter);
app.use('/reviews', reviewsRouter);
app.use('/api/users', usersRouter);

app.get(/.*/, (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
