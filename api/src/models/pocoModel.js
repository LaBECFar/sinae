var mongoose = require('mongoose');

var Schema   = mongoose.Schema;

const pocoSchema = new Schema({
    'nome' : {
        type: String,
        required: true
    },

    'url' : {
		type: String,
		required: true
    },

},{
    timestamps: true
});

module.exports = mongoose.model('poco', pocoSchema);
