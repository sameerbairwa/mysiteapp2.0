var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imagePath:
    {
        type:String,
        required:true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = Product = mongoose.model("Product", productSchema);