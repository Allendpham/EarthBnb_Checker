// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('email')
    .isLength({max: 255})
    .withMessage('Email has a character limit of 255.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('username')
    .isLength({max: 255})
    .withMessage('Username has a character limit of 255.'),
  check('firstName')
    .exists({ checkFalsy: true})
    .withMessage('Please provide a first name.'),
  check('firstName')
    .isLength({max: 255})
    .withMessage('First name has a character limit of 255.'),
  check('lastName')
    .exists({ checkFalsy: true})
    .withMessage('Please provide a last name.'),
  check('lastName')
    .isLength({max: 255})
    .withMessage('Last name has a character limit of 255.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('password')
    .isLength({max: 255})
    .withMessage('Password has a character limit of 255.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const user = await User.signup({ firstName, lastName, email, username, password });

    user.dataValues.token = await setTokenCookie(res, user);
    return res.json(user);
  }
);

module.exports = router;
