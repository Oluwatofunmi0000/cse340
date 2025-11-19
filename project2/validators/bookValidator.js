const Joi = require('joi');

const bookSchema = Joi.object({
  title: Joi.string().min(1).required(),
  isbn: Joi.string().min(10).required(),
  author: Joi.string().required(),
  publisher: Joi.string().allow(''),
  publishedDate: Joi.date().optional(),
  pages: Joi.number().integer().min(1).optional(),
  price: Joi.number().precision(2).min(0).optional(),
  language: Joi.string().optional(),
  summary: Joi.string().optional()
});

exports.validateBook = (req, res, next) => {
  const { error } = bookSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};
