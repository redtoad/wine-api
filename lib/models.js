var mongoose = require('mongoose');

var wineSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    year: Number,
    country: String,
    type: String,
    description: String
});

var connection = mongoose.connect('mongodb://localhost/test');

module.exports = {
    Wine: mongoose.model('Wine', wineSchema)
};