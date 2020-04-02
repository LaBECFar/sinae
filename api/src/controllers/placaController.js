const placaModel = require("../models/placaModel");

const placaController = {
	list: (req, res, next) => {
		placaModel
			.find()
			.then(placas => {
				return res.status(201).json(placas);
			})
			.catch(err => {
				return res.status(422).send(err.errors);
			});
	},

	get: (req, res, next) => {
		let id = req.params.id;

		placaModel
			.findById(id)
			.then(placa => {
				return res.status(201).json(placa);
			})
			.catch(err => {
				return res.status(422).send(err.errors);
			});
	},

	post: (req, res, next) => {
		const placa = new placaModel({
			label: req.body.label,
			experimentoCodigo: req.body.experimentoCodigo,
			pocos: req.body.pocos
		});

		placa.save((err, placa) => {
			if (err) {
				return res.status(500).json({
					message: "Erro ao criar placa",
					error: err,
					success: false
				});
			}
			return res.status(201).json(placa);
		});
	},

	put: (req, res, next) => {
		var id = req.params.id;

		placaModel
			.findById(id)
			.populate("placas")
			.exec()
			.then(placa => {
				if (!placa) {
					return res.status(404).send();
				}

				if (typeof req.body.label != "undefined") {
					placa.label = req.body.label
				}

				if (typeof req.body.experimentoCodigo != "undefined"){
                    placa.experimentoCodigo = req.body.experimentoCodigo
                }

                if (typeof req.body.pocos != "undefined"){
                    placa.pocos = req.body.pocos
                }

				placa.save(function(err, placa) {
					if (err) {
						return res.status(500).json({
							message: "Erro ao atualizar placa.",
							error: err,
							success: false
						});
					}
					return res.status(201).json(placa);
				});
			});
	},

	delete: (req, res, next) => {
		let id = req.params.id;

		placaModel.findOneAndDelete({ _id: id }, function(err, placa) {
			if (err) {
				return res.status(500).json({
					message: "Erro ao deletar placa.",
					error: err,
					success: false
				});
			}

			placa.deleted = true;

			return res.status(201).json(placa);
		});
	},


	
};

module.exports = placaController;
