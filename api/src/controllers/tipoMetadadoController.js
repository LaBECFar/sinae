const tipoMetadadoModel = require("../models/tipoMetadadoModel");

const tipoMetadadoController = {
	list: (req, res, next) => {

		let filtros = {}

        if(req.user){
            filtros.createdBy = req.user.userid
		}
		
		tipoMetadadoModel
			.find(filtros)
			.then(tiposMetadado => {
				return res.status(201).json(tiposMetadado);
			})
			.catch(err => {
				return res.status(422).send(err.errors);
			});
	},

	get: (req, res, next) => {
		let id = req.params.id;

		tipoMetadadoModel
			.findById(id)
			.then(tipoMetadado => {
				return res.status(201).json(tipoMetadado);
			})
			.catch(err => {
				return res.status(422).send(err.errors);
			});
	},

	post: (req, res, next) => {
		const tipoMetadado = new tipoMetadadoModel({
			nome: req.body.nome,
			descricao: req.body.descricao
		});

		if(req.user){
            tipoMetadado.createdBy = req.user.userid
        }

		tipoMetadado.save((err, tipoMetadado) => {
			if (err) {
				return res.status(500).json({
					message: "Erro ao criar tipo de metadado",
					error: err,
					success: false
				});
			}
			return res.status(201).json(tipoMetadado);
		});
	},

	put: (req, res, next) => {
		var id = req.params.id;

		tipoMetadadoModel
			.findById(id)
			.populate("tiposMetadado")
			.exec()
			.then(tipoMetadado => {
				if (!tipoMetadado) {
					return res.status(404).send();
				}

				tipoMetadado.nome = req.body.nome;
				tipoMetadado.descricao = req.body.descricao;

				tipoMetadado.save(function(err, tipoMetadado) {
					if (err) {
						return res.status(500).json({
							message: "Erro ao atualizar tipo de metadado.",
							error: err,
							success: false
						});
					}
					return res.status(201).json(tipoMetadado);
				});
			});
	},

	delete: (req, res, next) => {
		let id = req.params.id;

		tipoMetadadoModel.findOneAndDelete({ _id: id }, function(
			err,
			tipoMetadado
		) {
			if (err) {
				return res.status(500).json({
					message: "Erro ao deletar tipo de metadado.",
					error: err,
					success: false
				});
			}

			tipoMetadado.deleted = true;

			return res.status(201).json(tipoMetadado);
		});
	}
};

module.exports = tipoMetadadoController;
