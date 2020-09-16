<template>
	<div class="placa-metadados">
		<div class="content-head">
			<div>
				<h1>Metadados da Placa</h1>
				<div class="detalhes">
					<div class="dado">
						<strong>Placa:</strong>
						{{ placa.label }}
					</div>

					<div class="dado" v-show="placa.experimentoCodigo">
						<strong>Experimento:</strong>
						{{ placa.experimentoCodigo }}
					</div>
				</div>
			</div>

			<div class="head-actions">
				<b-button class="btn-import" variant="info" v-on:click="btnImport">
					<v-icon name="arrow-down-circle"></v-icon>
					Importar
				</b-button>
				<b-button variant="primary" v-on:click="save">
					Salvar
				</b-button>
				<b-button variant="secondary" v-on:click="back">
					Voltar
				</b-button>
			</div>
		</div>

		<b-alert show v-show="msg.text" :variant="msg.type">
			{{ msg.text }}
		</b-alert>

		<b-row>
			<b-col md="auto">
	
				<PocosPlaca
					v-bind:selected="selectedPocos"
					v-bind:pocos="placa.pocos"
				/>
				<b-button
					size="sm"
					:disabled="selectedPocos.length <= 0"
					v-on:click="selectedPocos = []"
					variant="info"
					class="btn-unselect"
				>
					Remover seleção
				</b-button>
			</b-col>

			<b-col>
				<div class="selected-actions">
					<b-button
						v-on:click="btnAdicionar()"
						variant="primary"
						:disabled="selectedPocos.length == 0"
						size="sm"
						title="Adiciona um metadado desejado em todos os poços selecionados"
					>
						<v-icon name="plus"></v-icon>
						Adicionar
					</b-button>

					<div class="clipboard">
						<b-button
							v-on:click="btnCopiar()"
							variant="secondary"
							title="Copia os metadados do poço selecionado"
							:disabled="
								selectedPocos.length != 1 ||
									selectedPocos[0].metadados.length < 1
							"
							size="sm"
							:class="{ copied: clipboard.action == 'copy' }"
						>
							<v-icon name="clipboard"></v-icon>
							{{
								clipboard.action == "copy"
									? "Copiado"
									: "Copiar"
							}}
						</b-button>

						<b-button
							v-on:click="btnColar()"
							variant="secondary"
							title="Adiciona os metadados copiados em todos os poços selecionados"
							:disabled="
								selectedPocos.length <= 0 ||
									clipboard.metadados.length <= 0
							"
							size="sm"
							:class="{ pasted: clipboard.action == 'paste' }"
						>
							<v-icon name="file-text"></v-icon>
							{{
								clipboard.action == "paste" ? "Colado" : "Colar"
							}}
						</b-button>
					</div>
				</div>

				<hr />
				<div class="info-selecionados">
					<div>
						<strong>Selecionados:</strong>
						{{ selectedPocos.length }}
					</div>
				</div>

				<div class="selecionados">
					<div
						class="poco-selecionado"
						v-for="(poco, i) in selectedPocos"
						:key="i"
					>
						<h5>
							{{ poco.nome }}
							<button
								v-on:click="unselectPoco(poco.nome)"
								class="btn"
								title="Remover seleção"
							>
								<v-icon name="x"></v-icon>
							</button>
						</h5>
						<PocoMetadados
							v-bind:poco="poco"
							v-on:remove="removeMetadado"
						/>
					</div>
				</div>
			</b-col>
		</b-row>
		<hr />
		<b-row>
			<b-col>
				<b-card title="Exportação">
					<b-card-text v-show="isSaved">
						Você pode exportar os metadados dos poços em formato CSV
					</b-card-text>

					<b-card-text v-show="!isSaved" class="alert alert-warning">
						Foram feitas modificações nos metadados, salve antes de
						continuar
					</b-card-text>

					<b-button
						variant="info"
						@click="exportarMetadadosCsv()"
						class="width-auto"
						:disabled="!isSaved"
					>
						<v-icon name="download"></v-icon>
						Exportar Metadados
					</b-button>
				</b-card>
			</b-col>
			<b-col></b-col>
			<b-col></b-col>
		</b-row>

		<br />

		<b-modal
			id="modal-lista"
			:title="listSelector.title"
			v-model="listSelector.show"
			body-class="p-0"
			header-bg-variant="dark"
			header-text-variant="light"
			hide-footer
			no-enforce-focus
			centered
			static
		>
			<ListSelector
				v-bind:model="listSelector"
				v-on:select="listSelector.onSelect"
			/>
		</b-modal>
	</div>
</template>

<script>
import { apiPlaca } from "./api"
import { apiTipoMetadado } from "../tipo-metadado/api"
import PocoMetadados from "../../components/metadado/PocoMetadados"
import PocosPlaca from "../../components/metadado/PocosPlaca"
import ListSelector from "../../components/ListSelector"

export default {
	name: "PlacaMetadados",

	components: {
		PocoMetadados: PocoMetadados,
		PocosPlaca: PocosPlaca,
		ListSelector: ListSelector,
	},

	data() {
		return {
			selectedPocos: [],
			tiposMetadados: [],
			placa: {
				pocos: [],
			},
			clipboard: {
				action: null,
				metadados: [],
			},
			msg: {
				text: false,
				type: "",
			},
			listSelector: {
				title: "",
				itemTitle: "",
				show: false,
				items: [],
				empty: "",
				emptyAction: null,
				emptyActionText: "Concluir",
				onSelect: () => {},
			},
			isSaved: true,
		}
	},

	created() {
		this.placaId = this.$route.params.id
		this.initPlaca()
		this.loadMetadados()
	},

	methods: {
		exportarMetadadosCsv() {
			let url = apiPlaca.getCsvMetadadosLink(this.placaId)
			window.open(url, "_blank")
		},

		btnAdicionar() {
			this.listSelector = {
				title: "Selecione um tipo de metadado",
				itemTitle: "nome",
				show: true,
				items: this.tiposMetadados,
				empty: "Nenhum tipo de metadado cadastrado no sistema",
				emptyAction: this.newMetadadoType,
				emptyActionText: "Cadastrar",
				onSelect: this.addMetadado,
			}
		},

		btnCopiar() {
			let metadados = []
			this.selectedPocos.forEach((poco) => {
				metadados.push(...poco.metadados)
			})

			this.clipboard.metadados = metadados
			this.clipboard.action = "copy"
			setTimeout(() => {
				this.clipboard.action = null
			}, 1000)
		},

		btnColar() {
			this.clipboard.metadados.forEach((metadado) => {
				this.addMetadadoPocos(this.selectedPocos, metadado)
			})

			this.clipboard.action = "paste"
			setTimeout(() => {
				this.clipboard.action = null
			}, 1000)

			this.isSaved = false
		},

		unselectPoco(pocoNome) {
			const index = this.selectedPocos.findIndex(
				(item) => item.nome == pocoNome
			)
			if (index > -1) {
				this.selectedPocos.splice(index, 1)
			}
		},

		addMetadado(metadado) {
			this.$swal
				.fire({
					title: metadado.nome,
					text: metadado.descricao,
					input: "text",
					showCancelButton: true,
					confirmButtonText: "Adicionar",
					cancelButtonText: "Cancelar",
				})
				.then((result) => {
					this.listSelector.show = false
					if (result.value) {
						this.addMetadadoPocos(this.selectedPocos, {
							nome: metadado.nome,
							valor: result.value,
						})
					}
				})
		},

		removeMetadado: function(params) {
			let { pocoNome, metadadoNome } = params

			let poco = this.placa.pocos.find((item) => item.nome == pocoNome)
			if (poco) {
				let metadadoIndex = poco.metadados.findIndex(
					(item) => item.nome == metadadoNome
				)

				if (metadadoIndex > -1) {
					poco.metadados.splice(metadadoIndex, 1)
					this.isSaved = false
				}
			}
		},

		addMetadadoPocos: function(pocos, metadado) {
			pocos.forEach((poco) => {
				let existingPoco = this.placa.pocos.find(
					(existingPoco) => existingPoco.nome == poco.nome
				)

				if (!existingPoco) {
					// novo poço
					this.placa.pocos.push({
						nome: poco,
						metadados: [metadado],
					})
				} else {
					let tipoIndex = existingPoco.metadados.findIndex(
						(existingTipo) => existingTipo.nome == metadado.nome
					)

					if (tipoIndex < 0) {
						existingPoco.metadados.push(metadado)
					} else {
						existingPoco.metadados.splice(tipoIndex, 1)
						existingPoco.metadados.push(metadado)
					}
				}
			})
			this.isSaved = false
		},

		loadMetadados() {
			apiTipoMetadado
				.listarTiposMetadado()
				.then((data) => {
					this.tiposMetadados = data
				})
				.catch((e) => {
					console.log(e)
				})
		},

		initPlaca() {
			apiPlaca
				.getPlaca(this.placaId)
				.then((data) => {
					this.placa = data
					this.initEsquema()
				})
				.catch(() => {
					this.isBusy = false
				})
		},

		initEsquema() {
			let columns = ["A", "B", "C", "D", "E", "F", "G", "H"]
			let all = []

			columns.forEach((elem) => {
				for (let i = 1; i <= 12; i++) {
					let name = elem + i

					let exists = this.placa.pocos.find(
						(item) => item.nome == name
					)

					if (exists) {
						all.push(exists)
					} else {
						all.push({
							nome: name,
							metadados: [],
						})
					}
				}
			})

			this.placa.pocos = all
		},

		importPocos(placa) {
			this.$swal
				.fire({
					icon: "warning",
					title: "Importar de " + placa.label,
					text:
						"As informações atuais serão sobrescritas, tem certeza que deseja continuar?",
					showCancelButton: true,
					confirmButtonText: "Confirmar",
					cancelButtonText: "Cancelar",
				})
				.then((result) => {
					if (result.value) {
						this.placa.pocos = placa.pocos

						this.$swal
							.fire(
								"Importado!",
								"Os metadados foram importados com sucesso.",
								"success"
							)
							.then(() => {
								this.listSelector.show = false
							})

						this.isSaved = false
					}
				})
		},

		btnImport() {
			apiPlaca
				.listarPlacas()
				.then((data) => {
					let placas = data.filter((placa) => {
						placa.titulo =
							placa.label +
							(placa.experimentoCodigo
								? " (" + placa.experimentoCodigo + ")"
								: "")
						return placa._id != this.placaId
					})

					this.listSelector = {
						items: placas,
						title: "Selecione uma placa para copiar",
						itemTitle: "titulo",
						show: true,
						empty: "Nenhuma placa cadastrada no sistema",
						emptyAction: this.newPlaca,
						emptyActionText: "Cadastrar",
						onSelect: this.importPocos,
					}
				})
				.catch((e) => {
					console.log(e)
				})
		},

		save() {
			apiPlaca
				.atualizarPlaca({
					_id: this.placa._id,
					pocos: this.placa.pocos,
				})
				.then(() => {
					this.msg.text = "Placa atualizada"
					this.msg.type = "success"
					this.isSaved = true
				})
				.catch((e) => {
					this.msg.text = `Erro ao atualizar a placa ${e}`
					this.msg.type = "danger"
				})
		},

		back() {
			this.$router.push(`/placa`)
		},

		newMetadadoType() {
			this.$router.push(`/tipo-metadado/novo`)
		},

		newPlaca() {
			this.$router.push(`/placa/novo`)
		},
	},
}
</script>

<style scoped>
.detalhes {
	display: flex;
	margin-bottom: 30px;
}

.detalhes .dado {
	line-height: 1;
	margin-right: 50px;
}

.info-selecionados {
	display: flex;
	justify-content: space-between;
}
.info-selecionados > .btn {
	font-size: 14px;
}
.selecionados {
	margin-top: 10px;
}

.poco-selecionado {
	margin-bottom: 10px;
	border-radius: 4px;
	box-shadow: 0 2px 5px #ccc;
	overflow: hidden;
}

.poco-selecionado h5 {
	font-size: 18px;
	font-weight: bold;
	background: #52b1d6;
	margin: 0px;
	padding: 10px;
	letter-spacing: 1px;
	color: #fff;
	position: relative;
}

.poco-selecionado h5 .btn {
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	line-height: 1;
	padding: 0 10px;
	color: #fff;
	outline: none;
	box-shadow: none;
}
.poco-selecionado h5 .btn:hover {
	background-color: #0001;
}
.content-head {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.head-actions .btn {
	margin-left: 10px;
}
.selected-actions {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.selected-actions .btn {
	margin-right: 8px;
	position: relative;
	outline: none;
	box-shadow: none;
}
.clipboard .btn {
	font-size: 14px;
	line-height: 27px;
	min-width: 80px;
}
.clipboard .btn.copied,
.clipboard .btn.pasted {
	border-color: #54a668;
	background: #54a668;
	color: #fff;
}
.btn-unselect {
	margin-top: 20px;
	float: right;
	background-color: #52b1d6;
	font-size: 16px;
	color: #fff;
	border: none;
	padding: 8px 15px;
}
.btn .v-icon {
	vertical-align: top;
	margin-top: 2px;
}
</style>
