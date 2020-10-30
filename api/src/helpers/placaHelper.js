const placaHelper = {
    getWellsMetadata: (placa) => {
        let metadados = []
		placa.pocos.forEach(poco => {
			let pocoMetadados = []
			poco.metadados.forEach(metadado => {
				pocoMetadados.push({
					nome: metadado.nome, 
					valor: metadado.valor
				})
			})
			metadados[poco.nome] = pocoMetadados
        })
        
        return metadados
    }
}

module.exports = placaHelper