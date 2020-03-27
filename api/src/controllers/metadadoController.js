const metadadoModel = require("../models/metadadoModel");

const metadadoController = {
	list: (req, res, next) => {
		metadadoModel
			.find()
			.then(metadados => {
				return res.status(201).json(metadados);
			})
			.catch(err => {
				return res.status(422).send(err.errors);
			});
	},

	get: (req, res, next) => {
		let id = req.params.id;

		metadadoModel
			.findById(id)
			.then(metadado => {
				return res.status(201).json(metadado);
			})
			.catch(err => {
				return res.status(422).send(err.errors);
			});
	},

	post: (req, res, next) => {
		const metadado = new metadadoModel({
			nome: req.body.nome,
			descricao: req.body.descricao
		});

		metadado.save((err, metadado) => {
			if (err) {
				return res.status(500).json({
					message: "Erro ao criar metadado",
					error: err,
					success: false
				});
			}
			return res.status(201).json(metadado);
		});
	},

	put: (req, res, next) => {
		var id = req.params.id;

		metadadoModel
			.findById(id)
			.populate("metadados")
			.exec()
			.then(metadado => {
				if (!metadado) {
					return res.status(404).send();
				}

				metadado.nome = req.body.nome;
				metadado.descricao = req.body.descricao;

				metadado.save(function(err, metadado) {
					if (err) {
						return res.status(500).json({
							message: "Erro ao atualizar metadado.",
							error: err,
							success: false
						});
					}
					return res.status(201).json(metadado);
				});
			});
	},

	delete: (req, res, next) => {
		let id = req.params.id;

		metadadoModel.findOneAndDelete({ _id: id }, function(err, metadado) {
			if (err) {
				return res.status(500).json({
					message: "Erro ao deletar metadado.",
					error: err,
					success: false
				});
			}

			metadado.deleted = true;

			return res.status(201).json(metadado);
		});
	}
};

module.exports = metadadoController;
