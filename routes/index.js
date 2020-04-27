var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");
const session = require("express-session");
const csrf = require("csurf");
const flash = require("connect-flash");
const passport = require('passport')

const csrfProtection = csrf();
router.use(csrfProtection);

//const Cart = require('../models/cart');
//const Product = require('../models/userCart');



// if not loggedin then we can access all down routes
// router.use('/', notLoggedIn, (req, res, next) => {
//     next();
// })

/* GET home page. */
router.get("/", (req, res, next) => {
    res.render("index");
});
router.get("/index", function (req, res, next) {
    res.render("index");
});

router.get("/signup", notLoggedIn, (req, res, next) => {
    //console.log(req.session);
    var messages = req.flash("error");
    res.render("signup", {
        csrfToken: req.csrfToken(),
        messages: messages,
        hashErrors: messages.length > 0
    });
});
router.get("/login", notLoggedIn, (req, res, next) => {
    //console.log(req.session);
    var messages = req.flash("error");
    res.render("login", {
        csrfToken: req.csrfToken(),
        messages: messages,
        hashErrors: messages.length > 0
    });
});
router.get("/success", function (req, res, next) {
    res.render("success");
});
router.get("/products", function (req, res, next) {
    res.render("products");
});

// GET /logout
router.get("/logout", isLoggedIn, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

// cart
router.get("/add-to-cart/:id", (req, res) => {
    var productId = req.params.id;
    var cart = new cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, (err, product) => {
        if (err) {
            return res.redirect("/");
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console, log(req.session.cart);
        res.redirect("/");
    });
});

router.get("/cart", isLoggedIn, function (req, res, next) {
    if (req.session.userId) {
        return res.render("cart");
    } else {
        res.render("login");
    }
});
router.get("/settings", isLoggedIn, function (req, res, next) {
    res.render("settings");
});
router.get("/profile", isLoggedIn, (req, res) => {
    res.render("profile");
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}