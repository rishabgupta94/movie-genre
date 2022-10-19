const express = require('express');
const Joi = require('joi');

const app = express();

app.use(express.json());

const movies = [
	{ id: 1, name: 'Action' },
	{ id: 2, name: 'Horror' },
	{ id: 3, name: 'Romance' },
];

// GET all movies
app.get('/movies/genres', (req, res) => {
	res.send(movies);
});

// GET movie by id
app.get('/movies/genres/:id', (req, res) => {
	const movie = movies.find((mov) => mov.id === parseInt(req.params.id));
	if (!movie) res.status(404).send('Unable to find a movie with the given ID');
	res.send(movie);
});

// POST movie by name
app.post('/movies/genres', (req, res) => {
	const { error } = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	const movieObj = { id: movies.length + 1, name: req.body.name };
	movies.push(movieObj);
	res.send(movieObj);
});

// DELETE movie by id
app.delete('/movies/genres/:id', (req, res) => {
	const movie = movies.find((mov) => mov.id === parseInt(req.params.id));
	if (!movie)
		return res.status(404).send('Unable to find a movie with the given ID');

	const movieIndex = movies.indexOf(movie);
	movies.splice(movieIndex, 1);
	res.send(movies);
});

// UPDATE movie by id
app.put('/movies/genres/:id', (req, res) => {
	const movie = movies.find((mov) => mov.id === parseInt(req.params.id));
	if (!movie)
		return res.status(404).send('Unable to find a movie with the given ID');

	const { error } = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	movie.name = req.body.name;
	res.send(movie);
});

const validateGenre = (movie) => {
	const schema = Joi.object({ name: Joi.string().min(3).required() });
	return schema.validate(movie);
};

const port = process.env.port || 3000;

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
