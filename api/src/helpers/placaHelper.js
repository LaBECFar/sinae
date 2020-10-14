const placaHelper = {
    getWellsMetadata: (placa) => {
        let metadados = []
		placa.pocos.forEach(poco => {
			metadados[poco.nome] = []

			poco.metadados.forEach(metadado => {
				metadados[poco.nome].push({
					nome: metadado.nome, 
					valor: metadado.valor
				})
			})
        })
        
        return metadados
    }
}

module.exports = placaHelper