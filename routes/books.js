const express = require('express');
const router = express.Router();
const { db } = require('../conf');

router.get('/', async (req, res) => {
  const [books] = await db.query(`
    SELECT id, title, summary
    FROM books
  `);
  res.json(books);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [book] = await db.query(
      `
      SELECT id, title, summary
      FROM books
      WHERE id=?
    `,
      [id]
    );
    if (book.length) res.json(book);
    else throw new Error('No book found!');
  } catch (err) {
    console.warn(err);
    res.status(404).send();
  }
});

router.post('/', async (req, res) => {
  const { title, genre, year, picture, artist, summary } = req.body;
  const resSql = await db.query(
    `
    INSERT INTO books (title, genre, picture, artist, summary, year)
    VALUES (?,?,?,?,?,?)
  `,
    [title, genre, picture, artist, summary, year]
  );
  res.status(201).send();
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query(
    `
    DELETE FROM books
    WHERE id=?
    `,
    [id]
  );
  res.status(204).send();
});

router.put('/:id', async (req, res) => {
  const { title, genre, year, picture, artist, summary } = req.body;
  const { id } = req.params;
  const resSql = await db.query(
    `
    UPDATE books
    SET title=?, genre=?, picture=?, artist=?, summary=?, year=?
    WHERE id=?
  `,
    [title, genre, picture, artist, summary, year, id]
  );
  res.status(204).send();
});

module.exports = router;
