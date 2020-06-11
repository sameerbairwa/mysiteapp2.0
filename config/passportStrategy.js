const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const {
    check,
    validationResult
} = require('express-validator');

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
            User.findOne({
                    email
                })
                .then((user) => {
                    if (!user) {
                        return done(null, false, {
                            message: "NO user found with this email"
                        });
                    }
                    bcrypt.compare(password, user.password)
                        .then(isCorrect => {
                            if (!isCorrect) {
                                return done(null, false, {
                                    message: "Wrong password."
                                });
                            } else {
                                return done(null, user);
                            }
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        }
    )
);
