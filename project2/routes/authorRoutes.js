const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const { validateAuthor } = require('../validators/authorValidator');

router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthor);
router.post('/', validateAuthor, authorController.createAuthor);
router.put('/:id', validateAuthor, authorController.updateAuthor);
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;
