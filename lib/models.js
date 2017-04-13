var mongoose = require('mongoose');

var wineSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    year: Number,
    country: String,
    type: String,
    description: String
});

module.exports = {
    Wine: mongoose.model('Wine', wineSchema)
};