const placaModel = require("../models/placaModel");
const experimentoModel = require("../models/experimentoModel");
const { Parser } = require('json2csv');
const ObjectId = require('mongodb').ObjectID;

const placaController = {
	list: (req, res, next) => {

		let filtros = {}
		
        if(req.user){
            filtros.createdBy = req.user.userid
		}

		placaModel.find(filtros)
			.populate('experimento')
			.exec(function (err, results) {
                if(err) { 
					return res.status(422).send(err.errors);
				}
                return res.status(201).json(results);
            })
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

	post: async (req, res, next) => {
		const placa = new placaModel({
			label: req.body.label,
			experimentoCodigo: req.body.experimentoCodigo,
			pocos: req.body.pocos || []
		})

		if(placa.experimentoCodigo) {
			try {
				const experimento = await experimentoModel.findOne({ codigo: placa.experimentoCodigo })
				if(experimento){
					placa.experimento = new ObjectId(experimento._id)
				}
			} catch( e ) {
				console.log(e)
			}
		}

		if(req.user){
            placa.createdBy = req.user.userid
        }

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

	put: async (req, res, next) => {
		var id = req.params.id;

		try {
			const placa = await placaModel.findById(id).populate("placas").exec()

			if (!placa) {
				return res.status(404).send();
			}

			if (typeof req.body.label != "undefined") {
				placa.label = req.body.label
			}

			if (typeof req.body.experimentoCodigo != "undefined"){
				placa.experimentoCodigo = req.body.experimentoCodigo

				if(placa.experimentoCodigo) {
					try {
						const experimento = await experimentoModel.findOne({ codigo: placa.experimentoCodigo })
						if(experimento){
							placa.experimento = new ObjectId(experimento._id)
						}
					} catch( e ) {
						console.log(e)
					}
				}
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
		} catch(e) {
			return res.status(500).send();
		}
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


	exportCsvMetadados: (req, res, next) => {
		placaModel.findById(req.params.id)
			.then(placa => { 
				
				let fields = ['Experiment', 'Plate', 'Well']
				let items = []

				placa.pocos.forEach(poco => {
					if(poco.metadados.length > 0){
						let item = {}
						item['Experiment'] = placa.experimentoCodigo || 'EMPTY'
						item['Plate'] = placa.label
						item['Well'] = poco.nome

						poco.metadados.forEach(metadado => {
							if(fields.indexOf(metadado.nome) < 0){
								fields.push(metadado.nome)
							}
							item[metadado.nome] = metadado.valor
						})

						items.push(item)
					}
				})

				let fieldsCsv = []
				fields.forEach(field => {
					fieldsCsv.push({
						label: field,
						value: field
					})
				})

				const json2csvParser = new Parser({ fields, quote: '', delimiter: ',' })
				const csv = json2csvParser.parse(items)

				let filename = placa.label + '.csv'
				if(placa.experimentoCodigo){
					filename = placa.experimentoCodigo + '_' + filename
				}
				res.attachment(filename)
				return res.status(200).send(csv)

			}).catch(err => {
                return res.status(422).send(err.errors);
            })
    }
};

module.exports = placaController;
