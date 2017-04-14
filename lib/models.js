var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var wineSchema = mongoose.Schema({
    name:    { type: String, required: true },
    year:    { type: Number, required: true },
    country: { type: String, required: true },
    type:    { type: String, required: true, enum: [ 'red', 'white', 'rose' ] },
    description: String
});

autoIncrement.initialize(mongoose.connection);
wineSchema.plugin(autoIncrement.plugin, { model: 'Book', field: 'id' });

module.exports = {
    Wine: mongoose.model('Wine', wineSchema)
};