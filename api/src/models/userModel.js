const mongoose = require('mongoose');
const validator = require('validator')
//const crypto = require('crypto');
//const jwt = require('jsonwebtoken');
const {Schema} = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        minlength: 10,
        trim: true,
        required: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value)
            },
            message: 'E-mail inválido'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

userSchema.statics.cryptoPass = function (pass) {
    return SHA256(JSON.stringify(pass) + process.env.CRYPTO_SECRET).toString()
}

module.exports = mongoose.model('user', userSchema);