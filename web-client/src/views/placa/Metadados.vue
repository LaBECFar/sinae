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
				<b-button variant="primary" v-on:click="save">
					Salvar Metadados
				</b-button>
				<b-button variant="secondary" v-on:click="back">
					Voltar
				</b-button>
			</div>
		</div>

		<b-alert :show="msg.text" :variant="msg.type">
			{{ msg.text }}
		</b-alert>

		<b-row>
			<b-col md="auto">
				<PocosPlaca
					v-bind:pocos="pocos"
					v-bind:selected="selectedPocos"
				/>
			</b-col>

			<b-col>
				<div class="selected-actions">
					<b-button
						v-on:click="btnAdicionar()"
						variant="primary"
						:disabled="selectedPocos.length == 0"
						size="sm"
					>
						Adicionar
					</b-button>

					<div class="clipboard float-right">

						<b-button
							v-on:click="btnCopiar()"
							variant="secondary"
							:disabled="selectedPocos.length != 1"
							size="sm"
							:class="{ copied: clipboard.action == 'copy' }"
						>
							{{ clipboard.action == "copy" ? "Copiado" : "Copiar" }}
						</b-button>

						<b-button
							v-on:click="btnColar()"
							variant="secondary"
							:disabled="selectedPocos.length <= 0 || clipboard.metadados.length <= 0"
							size="sm"
							:class="{ pasted: clipboard.action == 'paste' }"
						>
							{{ clipboard.action == "paste" ? "Colado" : "Colar" }}
						</b-button>
					</div>
				</div>

				<hr />
				<div class="info-selecionados">
					<div>
						<strong>Selecionados:</strong>
						{{ selectedPocos.length }}
					</div>

					<b-button
						size="sm"
						v-show="selectedPocos.length > 0"
						v-on:click="selectedPocos = []"
						variant="link"
					>
						Remover seleção
					</b-button>
				</div>

				<div class="selecionados">
					<div
						class="poco-selecionado"
						v-for="(selectedPoco, i) in selectedPocos"
						:key="i"
					>
						<h5>{{ selectedPoco }}</h5>
						<PocoMetadados
							v-bind:poco="selectedPoco"
							v-bind:metadados="getMetadados(selectedPoco)"
						/>
					</div>
				</div>
			</b-col>
		</b-row>
		<hr>
		<b-row>
			<b-col>
				<b-card title="Exportação">
					<b-card-text>
						Você pode exportar os metadados dos poços em formato CSV
					</b-card-text>

					<b-button variant="primary" @click="exportarMetadadosCsv()">
						Exportar Metadados
					</b-button>
				</b-card>
			</b-col>
		</b-row>

		<br>

		<div class="selector-modal" v-show="showListSelector">
			<div class="selector-wrapper">
				<h3>
					Selecione um Metadado
					<button v-on:click="showListSelector = false">X</button>
				</h3>
				<ListSelector
					item-title="nome"
					v-bind:items="this.tiposMetadados"
					v-on:select="addMetadado"
					empty="Nenhum tipo de metadado cadastrado no sistema"
					v-bind:emptyAction="newMetadadoType"
					emptyActionText="Cadastrar"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { apiPlaca } from "./api";
import { apiTipoMetadado } from "../tipo-metadado/api";
import PocoMetadados from "../../components/metadado/PocoMetadados";
import PocosPlaca from "../../components/metadado/PocosPlaca";
import ListSelector from "../../components/ListSelector";

export default {
	name: "PlacaMetadados",

	components: {
		PocoMetadados: PocoMetadados,
		PocosPlaca: PocosPlaca,
		ListSelector: ListSelector
	},

	data() {
		return {
			pocos: [],
			selectedPocos: [],
			tiposMetadados: [],
			placa: {
				pocos: []
			},
			showListSelector: false,
			clipboard: {
				action: null,
				metadados: []
			},
			msg: {
				text: false,
				type: ""
			}
		};
	},

	created() {
		this.placaId = this.$route.params.id;
		this.initPlaca();
		this.initPocos();
		this.loadMetadados();
	},

	methods: {
		exportarMetadadosCsv() {
			let url = apiPlaca.getCsvMetadadosLink(this.placaId)
			window.open(url, "_blank");
		},
		btnAdicionar() {
			this.showListSelector = true;
		},

		btnCopiar() {
			let pocosSelecionados = this.placa.pocos.filter(obj => {
				return this.selectedPocos.indexOf(obj.nome) > -1;
			});

			let metadados = [];
			pocosSelecionados.forEach(p => {
				metadados.push(...p.metadados);
			});

			this.clipboard.metadados = metadados;
			this.clipboard.action = "copy";
			setTimeout(() => {
				this.clipboard.action = null;
			}, 1000);
		},

		btnColar() {
			this.clipboard.metadados.forEach(metadado => {
				this.addMetadadoPocos(this.selectedPocos, metadado);
			});

			this.clipboard.action = "paste";
			setTimeout(() => {
				this.clipboard.action = null;
			}, 1000);
		},

		addMetadado(metadado) {
			this.$swal
				.fire({
					title: metadado.nome,
					text: metadado.descricao,
					input: "text",
					showCancelButton: true,
					confirmButtonText: "Adicionar",
					cancelButtonText: "Cancelar"
				})
				.then(result => {
					if (result.value) {
						this.addMetadadoPocos(this.selectedPocos, {
							nome: metadado.nome,
							valor: result.value
						});
					}
					this.showListSelector = false;
				});
		},

		getMetadados: function(pocoNome) {
			let pocos = this.placa.pocos.find(poco => {
				return poco.nome == pocoNome;
			});

			return pocos ? pocos.metadados : [];
		},

		addMetadadoPocos: function(pocos, metadado) {
			pocos.forEach(poco => {
				let existingPoco = this.placa.pocos.find(existingPoco => {
					return existingPoco.nome == poco;
				});

				if (!existingPoco) {
					let novoPoco = {
						nome: poco,
						metadados: [metadado]
					};

					this.placa.pocos.push(novoPoco);
				} else {
					let tipoIndex = existingPoco.metadados.findIndex(
						existingTipo => {
							return existingTipo.nome == metadado.nome;
						}
					);

					if (tipoIndex < 0) {
						existingPoco.metadados.push(metadado);
					} else {
						existingPoco.metadados.splice(tipoIndex, 1);
						existingPoco.metadados.push(metadado);
					}
				}
			});
		},

		loadMetadados() {
			apiTipoMetadado
				.listarTiposMetadado()
				.then(data => {
					this.tiposMetadados = data;
				})
				.catch(e => {
					console.log(e);
				});
		},

		initPlaca() {
			apiPlaca
				.getPlaca(this.placaId)
				.then(data => {
					this.placa = data;
				})
				.catch(() => {
					this.isBusy = false;
				});
		},

		initPocos() {
			let columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
			let all = [];

			columns.forEach(elem => {
				for (let i = 1; i <= 12; i++) {
					all.push(elem + i);
				}
			});

			this.pocos = all;
		},

		save() {
			apiPlaca
				.atualizarPlaca({
					_id: this.placa._id,
					pocos: this.placa.pocos
				})
				.then(() => {
					this.msg.text = "Placa atualizada";
					this.msg.type = "success";
				})
				.catch(e => {
					this.msg.text = `Erro ao atualizar a placa ${e}`;
					this.msg.type = "danger";
				});
		},

		back() {
			this.$router.push(`/placa`);
		},

		newMetadadoType() {
			this.$router.push(`/tipo-metadado/novo`);
		}
	}
};
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
}
.selector-modal {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 10;
}
.selector-wrapper {
	max-width: 500px;
	background: #fff;
	top: 50%;
	left: 50%;
	position: relative;
	transform: translate(-50%, -50%);
	max-height: 80vh;
	box-shadow: 0 0px 15px rgba(0, 0, 0, 0.3);
	border-radius: 3px;
	overflow-y: auto;
}
.selector-wrapper h3 {
	background: #52b1d6;
	color: #fff;
	padding: 16px;
	font-size: 20px;
	margin: 0;
	text-align: center;
	font-weight: bold;
	letter-spacing: 1px;
}
.selector-wrapper h3 button {
	float: right;
	background: none;
	color: #fff;
	border: none;
	position: absolute;
	right: 10px;
	top: 16px;
	font-size: 25px;
	line-height: 1;
	font-family: monospace;
	outline: none;
	box-shadow: none;
}

.content-head {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.head-actions .btn {
	margin-left: 10px;
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
.clipboard .btn.copied, .clipboard .btn.pasted {
	border-color: #54a668;
	background: #54a668;
	color: #fff;
}
</style>
