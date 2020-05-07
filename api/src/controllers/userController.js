const userModel = require("../models/userModel")
const { mailer, resetPasswordTemplate } = require("../util/mailer")
const jwt = require("jsonwebtoken")

const userController = {
	login: (req, res, next) => {
		const { email, password } = req.body

		if (!email || !password) {
			return res.status(401).json({
				error: true,
				message: "O e-mail e/ou senha não foram informados",
			})
		}

		userModel.findOne({ email: email }, (err, user) => {
			if (err) {
				return res.status(401).json({
					error: true,
					message: "Não foi possível fazer login",
				})
			}

			if (!user) {
				return res
					.status(404)
					.json({ error: true, message: "Usuário não encontrado" })
			}

			if (user.password == userModel.cryptoPass(password)) {
				const token = user.generateAuthToken()

				return res.status(201).json({
					success: true,
					message: "Authentication successful!",
					token: token,
					isAdmin: user.isAdmin ? user.isAdmin : false,
					userid: user._id,
				})
			} else {
				return res
					.status(422)
					.json({ error: true, message: "Senha inválida" })
			}
		})
	},

	tokenUserInfo: (req, res, next) => {
		return res.status(201).json(req.user)
	},

	list: (req, res, next) => {
		userModel
			.find()
			.then((users) => {
				return res.status(201).json(users)
			})
			.catch((err) => {
				return res.status(422).send(err.errors)
			})
	},

	get: (req, res, next) => {
		let id = req.params.id

		userModel
			.findById(id)
			.then((user) => {
				return res.status(201).json(user)
			})
			.catch((err) => {
				return res.status(422).send(err.errors)
			})
	},

	getByEmail: (req, res, next) => {
		let email = req.params.email

		userModel.findOne({ email: email }, (err, user) => {
			if (!user) {
				return res
					.status(404)
					.json({ error: true, message: "Usuário não encontrado" })
			}

			if (err) {
				return res.status(422).send(err.errors)
			}

			return res.status(201).json(user)
		})
	},

	post: (req, res, next) => {
		const { name, email, password } = req.body

		const user = new userModel({
			name: name,
			email: email,
			password: userModel.cryptoPass(password),
		})

		user.save((err, user) => {
			if (err) {
				return res.status(500).json({
					message: "Erro ao criar usuário",
					error: err,
					success: false,
				})
			}
			return res.status(201).json(user)
		})
	},

	put: (req, res, next) => {
		var id = req.params.id

		userModel
			.findById(id)
			//.populate('users')
			//.exec()
			.then((user) => {
				if (!user) {
					return res.status(404).send()
				}

				const {
					name,
					email,
					password,
					isAdmin,
					pocosPosition,
				} = req.body

				if (name) {
					user.name = name
				}

				if (email) {
					user.email = email
				}

				if (isAdmin) {
					if (req.user.isAdmin) {
						// only admins can change any user isAdmin attribute
						user.isAdmin = isAdmin
					}
				}

				if (password) {
					user.password = userModel.cryptoPass(password)
				}

				if (pocosPosition) {
					const { q1, q2, q3, q4, radius } = pocosPosition

					if (q1) {
						user.pocosPosition.q1 = q1
					}
					if (q2) {
						user.pocosPosition.q2 = q2
					}
					if (q3) {
						user.pocosPosition.q3 = q3
					}
					if (q4) {
						user.pocosPosition.q4 = q4
					}
					if (radius) {
						user.pocosPosition.radius = radius
					}
				}

				user.save(function (err, user) {
					if (err) {
						return res.status(500).json({
							message: "Erro ao atualizar usuário.",
							error: err,
							success: false,
						})
					}
					return res.status(201).json(user)
				})
			})
	},

	delete: (req, res, next) => {
		let id = req.params.id
		userModel.deleteOne({ _id: id }, function (err, user) {
			if (err) {
				return res.status(500).json({
					message: "Erro ao deletar usuário.",
					error: err,
					success: false,
				})
			}
			return res.status(201).json(user)
		})
	},

	getPasswordResetURL(user, token) {
		const url = `${process.env.SITE_URL}:${process.env.SITE_PORT}`
		const path = `/#/change-password/${user._id}/${token}`
		return url + path
	},

	forgotPassword: async (req, res, next) => {
		const { email } = req.body

		userModel.findOne({ email }, (err, user) => {
			if (!user) {
				return res
					.status(404)
					.json({ error: true, message: "Usuário não encontrado" })
			}

			if (err) {
				return res.status(422).send(err.errors)
			}

			const token = user.resetPasswordToken()
			const url = userController.getPasswordResetURL(user, token)
			const emailTemplate = resetPasswordTemplate(user, url)

			mailer.sendMail(emailTemplate, function (error, info) {
				if (error) {
					return res.status(500).json({
						message:
							"Erro ao enviar e-mail, por favor tente novamente ou entre em contato",
						error: err,
						success: false,
					})
				} else {
					console.log(
						"Email de recuperação de senha enviado: " + user.email
					)
					return res.status(201).json({
						success: true,
						message: "E-mail de verificação enviado!",
					})
				}
			})
		})
	},

	changePassword: async (req, res, next) => {
		const { userid, token, password } = req.body

		userModel.findOne({ _id: userid }, (err, user) => {
			if (!user) {
				let message = "Usuário não encontrado"
				return res.status(404).json({ error: true, message })
			}

			if (err) {
				return res.status(422).send(err.errors)
			}

			const secret = user.password + "-" + user.createdAt

			let payload
			try {
				payload = jwt.verify(token, secret)
			} catch (error) {
				let message = "Token inválido"
				return res.status(404).json({ message, error })
			}

			if (user._id == payload.userid) {
				user.password = userModel.cryptoPass(password)

				user.save(function (err, user) {
					if (err) {
						return res.status(500).json({
							message: "Erro ao atualizar usuário.",
							error: err,
							success: false,
						})
					}
					return res.status(201).json({
						success: true,
						message: "Senha alterada com sucesso!",
					})
				})
			} else {
				let message =
					"Token inválido, tente solicitar uma nova verificação"
				return res.status(500).json({ message, error: true })
			}
		})
	},
}

module.exports = userController
