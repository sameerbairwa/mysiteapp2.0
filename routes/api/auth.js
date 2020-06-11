const express = require("express");
const router = express.Router();
const csrf = require('csurf');
const session = require("express-session");
const passport = require('passport');


const csrfProtection = csrf();
router.use(csrfProtection);

//@type     post
//@route    /api/auth/user/signup
//@desc     router for signup for users
//@access   PUBLIC

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.post('/login_submit', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));


module.exports = router;

