<template>
	<div class="analise-metadados">
		<div class="content-head">
			<div>
				<h1>Metadados da Análise</h1>
				<div class="detalhes">
					<div class="dado">
						<strong>Experimento:</strong>
						{{ analise.experimentoCodigo }}
					</div>

					<div class="dado">
						<strong>Placa:</strong>
						{{ analise.placa }}
					</div>

					<div class="dado">
						<strong>Tempo:</strong>
						{{ analise.tempo }}
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

		<b-alert :show="msg.text" :v-show="msg.text" :variant="msg.type">
			{{ msg.text }}
		</b-alert>

		<b-row>
			<b-col md="auto">
				<div class="pocos">
					<PocosQuadrante
						v-for="(quadrante, index) in quadrantes"
						:key="index"
						v-bind:quadrante="index + 1"
						v-bind:pocos="quadrante"
						v-bind:selected="selectedPocos"
					/>
				</div>
			</b-col>

			<b-col>
				<b-button
					v-on:click="btnAdicionar()"
					variant="primary"
					:disabled="selectedPocos.length == 0"
					size="sm"
				>
					Adicionar Metadado
				</b-button>
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
		<div class="selector-modal" v-show="showListSelector">
			<div class="selector-wrapper">
				<h3>
					Selecione um Metadado
					<button v-on:click="showListSelector = false">X</button>
				</h3>
				<ListSelector
					item-title="nome"
					v-bind:items="this.metadados"
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
import { apiAnalise } from "./api";
import { apiMetadado } from "../metadado/api";
import PocoMetadados from "../../components/metadado/PocoMetadados";
import PocosQuadrante from "../../components/metadado/PocosQuadrante";
import ListSelector from "../../components/ListSelector";

export default {
	name: "AnaliseMetadados",

	components: {
		PocoMetadados: PocoMetadados,
		PocosQuadrante: PocosQuadrante,
		ListSelector: ListSelector
	},

	data() {
		return {
			quadrantes: [],
			selectedPocos: [],
			metadados: [],
			analise: {
				metadados: []
			},
			showListSelector: false,
			msg: {
				text: false,
				type: ""
			}
		};
	},

	created() {
		this.analiseCodigo = this.$route.params.analiseCodigo;
		this.initAnalise();
		this.initQuadrantes();
		this.loadMetadados();
	},

	methods: {
		btnAdicionar() {
			this.showListSelector = true;
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
			let metadados = this.analise.metadados.find(item => {
				return item.pocoNome == pocoNome;
			});

			return metadados ? metadados.campos : [];
		},

		addMetadadoPocos: function(pocos, metadado) {
			pocos.forEach(poco => {
				let existingMetadado = this.analise.metadados.find(item => {
					return item.pocoNome == poco;
				});

				if (!existingMetadado) {
					let metadados = {
						pocoNome: poco,
						campos: [metadado]
					};

					this.analise.metadados.push(metadados);
				} else {
					let campoIndex = existingMetadado.campos.findIndex(
						campo => {
							return campo.nome == metadado.nome;
						}
					);

					if (campoIndex < 0) {
						existingMetadado.campos.push(metadado);
					} else {
						existingMetadado.campos.splice(campoIndex, 1);
						existingMetadado.campos.push(metadado);
					}
				}
			});
		},

		loadMetadados() {
			apiMetadado
				.listarMetadados()
				.then(data => {
					this.metadados = data;
				})
				.catch(e => {
					console.log(e);
				});
		},

		initAnalise() {
			apiAnalise
				.getAnalise(this.analiseCodigo)
				.then(data => {
					this.analise = data;
				})
				.catch(() => {
					this.isBusy = false;
				});
		},

		initQuadrantes() {
			let q1 = [
				"D02",
				"C02",
				"B02",
				"D03",
				"C03",
				"B03",
				"D04",
				"C04",
				"B04",
				"D05",
				"C05",
				"B05",
				"D06",
				"C06",
				"B06"
			];
			let q2 = [
				"D07",
				"C07",
				"B07",
				"D08",
				"C08",
				"B08",
				"D09",
				"C09",
				"B09",
				"D10",
				"C10",
				"B10",
				"D11",
				"C11",
				"B11"
			];
			let q3 = [
				"F07",
				"G07",
				"E07",
				"G08",
				"F08",
				"E08",
				"G09",
				"F09",
				"E09",
				"G10",
				"F10",
				"E10",
				"G11",
				"F11",
				"E11"
			];
			let q4 = [
				"G02",
				"F02",
				"E02",
				"G03",
				"F03",
				"E03",
				"G04",
				"F04",
				"E04",
				"G05",
				"F05",
				"E05",
				"G06",
				"F06",
				"E06"
			];

			this.quadrantes = [q1, q2, q3, q4];
		},

		save() {
			apiAnalise
				.atualizarAnalise({
					_id: this.analise._id,
					metadados: this.analise.metadados
				})
				.then(() => {
					this.msg.text = "Análise atualizada";
					this.msg.type = "success";
				})
				.catch(e => {
					this.msg.text = `Erro ao atualizar a análise ${e}`;
					this.msg.type = "danger";
				});
		},

		back() {
			this.$router.push(`/analise/${this.analiseCodigo}/`);
		},

		newMetadadoType() {
			this.$router.push(`/metadado/novo`);
		}
	}
};
</script>

<style scoped>
.pocos {
	margin: 0 -2%;
	max-width: 550px;
	display: flex;
	flex-wrap: wrap;
}

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
</style>
