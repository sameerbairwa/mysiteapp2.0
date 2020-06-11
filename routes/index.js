var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");
const session = require("express-session");
const csrf = require("csurf");
const flash = require("connect-flash");
const passport = require("passport");

const csrfProtection = csrf();
router.use(csrfProtection);

const Cart = require("../models/cart");
const Product = require("../models/product");

// if not loggedin then we can access all down routes
// router.use('/', notLoggedIn, (req, res, next) => {
//     next();
// })

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/index", function (req, res, next) {
  var successMsg = req.flash("success")[0];
  res.render("index", {
    successMsg: successMsg,
    noMessage: !successMsg,
  });
});

router.get("/signup", notLoggedIn, (req, res, next) => {
  //console.log(req.session);
  var messages = req.flash("error");
  res.render("signup", {
    csrfToken: req.csrfToken(),
    messages: messages,
    hashErrors: messages.length > 0,
  });
});
router.get("/login", notLoggedIn, (req, res, next) => {
  //console.log(req.session);
  var messages = req.flash("error");
  res.render("login", {
    csrfToken: req.csrfToken(),
    messages: messages,
    hashErrors: messages.length > 0,
  });
});

router.get("/products", function (req, res, next) {
  Product.find()
    .then((docs) => {
      var productChuncks = [];
      var chunkSize = 4;
      // console.log(docs);
      for (var i = 0; i < docs.length; i += chunkSize) {
        productChuncks.push(docs.slice(i, i + chunkSize));
      }
      //console.log(productChuncks);
      res.render("products", {
        title: "Shoping Cart",
        products: productChuncks,
      });
    })
    .catch((err) => console.log(err));
});

// GET /logout
router.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect("/");
});

// cart router
router.get("/add-to-cart/:id", isLoggedIn, (req, res) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId)
    .then((product) => {
      if (product) {
        cart.add(product, productId);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/products");
      }
    })
    .catch((err) => console.log(err));
});

router.get("/cart", isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    res.render("products", {
      products: null,
    });
  }
  var cart = new Cart(req.session.cart);
  console.log(cart.generateArray());
  res.render("cart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});
router.get("/success", isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    res.render("products", {
      products: null,
    });
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash("error")[0];
  res.render("success", {
    total: cart.totalPrice,
    errMsg: errMsg,
    noError: !errMsg,
  });
});
router.post("/checkout", (req, res) => {
  if (!req.session.cart) {
    res.redirect("/cart");
  }
  var cart = new Cart(req.session.cart);
  var stripe = require("stripe")("sk_test_T6QUJMgbLVBp32vB03Cj1mgP00jovG43By");

  // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
  stripe.charges.create(
    {
      amount: 1000,
      currency: "inr",
      source: req.body.stripeToken,
      description: "My First Test Charge (created for API docs)",
    },
    function (err, charge) {
      // asynchronously called
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/success");
      }
      req.flash("sucess", "successfully bought products");
      req.session.cart = null;
      res.redirect("/");
    }
  );
});

router.get("/settings", isLoggedIn, function (req, res, next) {
  res.render("settings");
});
router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});

module.exports = router;

//created two function isLoggedIn and notLoggedIn for handel user access the pages if user loggedin then he can access the logout, profile, cart and settings, and not logged in then can access login and signup
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
