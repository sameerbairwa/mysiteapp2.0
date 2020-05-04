var Product = require("../models/product");
var express = require("express");
// var router = express.Router();
const mongoose = require('mongoose');
const mongodbURL = require("../setup/myurl").mongoURL;

mongoose
    .connect(mongodbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Mongodb is connected");
    })
    .catch((err) => {
        console.log("mongodb not connected");
        console.log(err);
    });

// router.get('/body')
// const $ = require("cheerio");
// const axios = require("axios");
// const url = "http://localhost:3000/products";

var products = [
    new Product({
        title: 'Cannon EOS',
        imagePath: "img/5.jpg",
        price: 36000
    }),
    new Product({
        title: 'Nikon EOS',
        imagePath: "img/2.jpg",
        price: 40000
    }),
    new Product({
        title: 'Sony DSLR',
        imagePath: "img/3.jpg",
        price: 50000
    }),
    new Product({
        title: 'Olympus DSLR',
        imagePath: "img/4.jpg",
        price: 50000
    }),
    new Product({
        title: 'Titan Model #301',
        imagePath: "img/18.jpg",
        price: 13000
    }),
    new Product({
        title: 'Titan Model #201',
        imagePath: "img/19.jpg",
        price: 3000
    }),
    new Product({
        title: 'HMT Milan',
        imagePath: "img/20.jpg",
        price: 8000
    }),
    new Product({
        title: 'Faber Luba #111',
        imagePath: "img/21.jpg",
        price: 18000
    }),
    new Product({
        title: 'Luis Phil',
        imagePath: "img/22.jpg",
        price: 1000
    }),
    new Product({
        title: 'H&W',
        imagePath: "img/23.jpg",
        price: 800
    }),
    new Product({
        title: 'John Zok',
        imagePath: "img/24.jpg",
        price: 1500
    }),
    new Product({
        title: 'Jhalsani',
        imagePath: "img/25.jpg",
        price: 1300
    })
];
console.log(products[0]);
var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save((err, result) => {
        done++;
        if (done === products.length) {
            exit();
        }
    });
};

function exit() {
    mongoose.disconnect();
};