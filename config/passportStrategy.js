const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(
    "local-signup",
    new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        (req, email, password, done) => {
            //   req.checkBody("email", "Invalid Email").notEmpty().isEmail();
            //   req
            //     .checkBody("Password", "Invalid password")
            //     .notEmpty()
            //     .isLength({ min: 4 });
            //   var error = req.validationErrors();
            //   if (error) {
            //     var messages = [];
            //     error.forEach((error) => {
            //       messages.push(error.msg);
            //     });
            //     return done(null, false, req.flash("error", messages));
            //   }
            User.findOne({
                    email: email,
                },
                (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, {
                            message: "Email is already in use.",
                        });
                    }
                    var newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        contact: req.body.contact,
                        city: req.body.city,
                        address: req.body.address,
                    });
                    newUser.password = newUser.encryptPassword(password);
                    newUser.save((err) => {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            );
        }
    )
);

passport.use(
    "local-signin",
    new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        (req, email, password, done) => {
            req.checkBody("email", "Invalid Email").notEmpty().isEmail();
            req
                .checkBody("Password", "Invalid password")
                .notEmpty();
            var error = req.validationErrors();
            if (error) {
                var messages = [];
                error.forEach((error) => {
                    messages.push(error.msg);
                });
                return done(null, false, req.flash("error", messages));
            }
        }
    )
);