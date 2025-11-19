const Joi = require('joi');

const authorSchema = Joi.object({
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  bio: Joi.string().optional()
});

exports.validateAuthor = (req, res, next) => {
  const { error } = authorSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};
