const mongoose = require("mongoose")
const validator = require("validator")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const { Schema } = mongoose

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},

		email: {
			type: String,
			minlength: 10,
			trim: true,
			required: true,
			unique: true,
			validate: {
				validator: (value) => {
					return validator.isEmail(value)
				},
				message: "E-mail inválido",
			},
		},

		password: {
			type: String,
			required: true,
			minlength: 6,
		},

		isAdmin: {
			type: Boolean,
			default: false,
		},

		pocosPosition: {
			radius: {
				type: Number,
				default: 40,
			},

			q1: [
				{
					top: Number,
					left: Number,
					nome: String,
				},
			],

			q2: [
				{
					top: Number,
					left: Number,
					nome: String,
				},
			],

			q3: [
				{
					top: Number,
					left: Number,
					nome: String,
				},
			],

			q4: [
				{
					top: Number,
					left: Number,
					nome: String,
				},
			],
		},
	},
	{
		timestamps: true,
	}
)

userSchema.methods.toJSON = function () {
	var obj = this.toObject()
	delete obj.password
	return obj
}

userSchema.statics.cryptoPass = function (pass) {
	var hash = crypto
		.createHash("sha256")
		.update(pass + process.env.CRYPTO_SECRET)
		.digest("base64")
	return hash
}

userSchema.methods.generateAuthToken = function () {
	const data = {
		userid: this._id,
		isAdmin: this.isAdmin,
	}
	const token = jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: "30d" })
	return token
}

userSchema.methods.resetPasswordToken = function () {
	const secret = this.password + "-" + this.createdAt // guarantees the token only works once
	const token = jwt.sign({ userid }, secret, { expiresIn: 3600 }) // 1 hora
	return token
}

module.exports = mongoose.model("user", userSchema)
