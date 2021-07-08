<template>
	<div>
		<loading :active.sync="isLoading" :is-full-page="true"></loading>
		<b-row>
			<b-col>
				<h2>
					<v-icon style="width: 32px;" name="grid"></v-icon>
					Detalhes da Análise
				</h2>
			</b-col>
			<b-col class="text-right">
				<b-button
					:to="
						'/experimento/' +
							analise.experimentoCodigo +
							'/analises'
					"
					variant="secondary"
				>
					Voltar
				</b-button>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-alert show v-show="msg.text" :variant="msg.type">
					{{ msg.text }}
				</b-alert>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<strong>Experimento:</strong>
				<span>
					{{ analise.experimentoCodigo }} - {{analise.experimento.label || ''}}
				</span>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<strong>Data Coleta:</strong>
				<span>
					{{ analise.dataColeta | moment("utc", "DD/MM/YYYY") }}
				</span>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<strong>Tempo:</strong>
				<span>{{ analise.tempo }}</span>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<strong>Placa:</strong>
				<span>{{ analise.placa }}</span>
			</b-col>
		</b-row>
		<b-row v-if="analise.interval">
			<b-col>
				<strong>Intervalo: </strong>
				<span>{{ analise.interval }} ms</span>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<strong>Total de Frames:</strong>
				<span>{{ analise.framesTotal }}</span>
				<a
					v-show="analise.framesTotal > 0"
					:href="framesDownloadLink"
					class="link-download"
				>
					[ Download de Frames ]
				</a>
			</b-col>
		</b-row>

		<b-row>
			<b-col>
				<strong>Frames já Processados:</strong>
				<span>{{ analise.framesProcessados }}</span>
				<a
					v-show="analise.framesProcessados > 0"
					:href="pocosDownloadLink"
					class="link-download"
				>
					[ Download de Poços ]
				</a>
			</b-col>
		</b-row>

		<br />

		<b-row align-content="stretch">
			<b-col md="3" v-show="analise.video && analise.framesTotal <= 0">
				<b-card title="Extrair Frames do vídeo">
					<b-card-text>
						<div>
							Você já pode extrair os frames do vídeos clicando no
							botão abaixo
						</div>
					</b-card-text>

					<b-button variant="primary" @click="extractVideoFrames()">
						Extrair Frames
					</b-button>
				</b-card>
			</b-col>

			<b-col md="3">
				<b-card title="Quadrantes">
					<b-card-text>
						<div>
							<strong>Q1:</strong>
							<span>{{ analise.frameQuadrante[1].qtd }}</span>
							/
							<span
								v-bind:class="{
									'q-processados': true,
									'yellow-fade': yellowFade[1],
								}"
							>
								{{ analise.frameQuadrante[1].processados }}
							</span>
						</div>
						<div>
							<strong>Q2:</strong>
							<span>{{ analise.frameQuadrante[2].qtd }}</span>
							/
							<span
								v-bind:class="{
									'q-processados': true,
									'yellow-fade': yellowFade[2],
								}"
							>
								{{ analise.frameQuadrante[2].processados }}
							</span>
						</div>
						<div>
							<strong>Q3:</strong>
							<span>{{ analise.frameQuadrante[3].qtd }}</span>
							/
							<span
								v-bind:class="{
									'q-processados': true,
									'yellow-fade': yellowFade[3],
								}"
							>
								{{ analise.frameQuadrante[3].processados }}
							</span>
						</div>
						<div>
							<strong>Q4:</strong>
							<span>{{ analise.frameQuadrante[4].qtd }}</span>
							/
							<span
								v-bind:class="{
									'q-processados': true,
									'yellow-fade': yellowFade[4],
								}"
							>
								{{ analise.frameQuadrante[4].processados }}
							</span>
						</div>
					</b-card-text>

					<b-button
						@click="detalhesQuadrante()"
						variant="secondary"
						:disabled="analise.framesTotal < 1"
					>
						Extrair Poços
					</b-button>
				</b-card>
			</b-col>

			<b-col md="3">
				<b-card title="Exportação">
					<b-card-text>
						<b-alert
							show
							variant="warning"
							v-show="
								analise.framesProcessados !=
									analise.framesTotal ||
									analise.framesTotal < 1
							"
						>
							O botão de exportação o arquivo para o cellprofiler
							só será habilitado após a extração de todos os poços
						</b-alert>
						<div
							v-show="
								analise.framesProcessados ==
									analise.framesTotal &&
									analise.framesTotal > 0
							"
						>
							Você já pode exportar os dados dos poços clicando no
							botão abaixo
						</div>
					</b-card-text>

					<b-button
						variant="primary"
						@click="exportCsv()"
						:disabled="
							analise.framesProcessados != analise.framesTotal ||
								analise.framesTotal < 1
						"
					>
						Exportar CSV
					</b-button>
				</b-card>
			</b-col>

			<b-col md="3">
				<b-card title="Extração de parâmetros fenotípicos">
					<b-card-text>
						<b-alert
							variant="warning"
							show
							v-show="
								analise.framesProcessados !=
									analise.framesTotal ||
									analise.framesTotal < 1
							"
						>
							O botão para iniciar a extração só será habilitado após a extração de todos os poços
						</b-alert>
						<div
							v-show="
								analise.framesProcessados ==
									analise.framesTotal &&
									analise.framesTotal > 0 &&
									!processingMotility &&
									analise.pocosProcessados.length <= 0
							"
						>
							Você já pode iniciar a extração clicando no botão abaixo
						</div>

						<div
							v-show="processingMotility || 
								(analise.pocosProcessados.length > 0 && analise.pocosProcessados.length < 60)
							"
						>
							Processando poços...
							<h2>
								<span>
									{{ analise.pocosProcessados.length }}
								</span> / 60
							</h2>
						</div>

						<div v-show="analise.pocosProcessados.length >= 60">
							Você pode baixar os resultados da extração clicando no botão abaixo
						</div>
					</b-card-text>

					<b-button
						variant="primary"
						@click="startMotilityProcessor()"
						v-show="analise.pocosProcessados.length < 60"
						:disabled="
							analise.framesProcessados != analise.framesTotal ||
								analise.framesTotal < 1 || processingMotility
						"
					>
						Iniciar extração
					</b-button>

					<div
						class="flex"
						v-show="analise.pocosProcessados.length >= 60"
					>
						<b-button
							variant="primary"
							@click="downloadMotilityResults()"
						>
							Baixar resultados
						</b-button>

						<b-button variant="light" @click="resetMotility()">
							<b-icon-arrow-counterclockwise></b-icon-arrow-counterclockwise>
						</b-button>
					</div>
				</b-card>
			</b-col>
		</b-row>
	</div>
</template>

<script>
import {apiAnalise} from "./api"
import Loading from "vue-loading-overlay"
import "vue-loading-overlay/dist/vue-loading.css"
import {BIconArrowCounterclockwise} from "bootstrap-vue"

export default {
	name: "AnaliseDetalhes",
	components: {Loading, BIconArrowCounterclockwise},
	data() {
		return {
			isBusy: true,
			isLoading: false,
			analiseCodigo: "",
			analise: {
				frameQuadrante: [[], [], [], [], []],
				pocosProcessados: [],
			},
			msg: {
				text: false,
				type: "",
			},
			framesDownloadLink: "",
			pocosDownloadLink: "",
			csvExportLink: "",
			apiInterval: null,
			yellowFade: [false, false, false, false, false],
			processingMotility: false,
			loadingComponent: true
		}
	},

	watch: {
		"analise.frameQuadrante": function(newVal, oldVal) {
			if (newVal && oldVal) {
				for (let i = 1; i < oldVal.length; i++) {
					if (oldVal[i] && newVal[i]) {
						if (oldVal[i].processados != newVal[i].processados) {
							this.yellowFade[i] = false
							this.yellowFade[i] = true
							setTimeout(() => {
								this.yellowFade[i] = false
							}, 1500)
						}
					}
				}
			}
		},
	},

	methods: {
		detalhesQuadrante(quadrante) {
			if (quadrante) {
				this.$router.push(
					`/analise/${this.analise._id}/quadrante/${quadrante}`
				)
			} else {
				this.$router.push(`/analise/${this.analise._id}/quadrantes`)
			}
		},
		refresh() {
			this.isBusy = true
			this.isLoading = false
			apiAnalise
				.getAnalise(this.analiseCodigo)
				.then((data) => {
					this.analise = data
					this.isBusy = false
					this.processingMotility = this.analise.isProcessingMotility || false
				})
				.catch(() => {
					this.isBusy = false
				})
		},

		extractVideoFrames() {
			this.$router.push(`/analise/${this.analise._id}/extrair-video`)
		},

		exportCsv() {
			let inputvalue = "/usr/uploads/experimentos"

			this.$swal
				.fire({
					title: "Diretório dos experimentos",
					text:
						"Digite o caminho para o diretório dos experimentos, onde os poços baixados estão localizados",
					input: "text",
					inputValue: inputvalue,
					showCancelButton: true,
					confirmButtonText: "Baixar",
					cancelButtonText: "Cancelar",
				})
				.then((result) => {
					let url = this.csvExportLink + "?dir="

					if (result.value) {
						url += result.value
					}

					window.open(url, "_blank")
				})
		},

		startMotilityProcessor() {
			apiAnalise
				.startMotilityProcessor(this.analiseCodigo)
				.then(() => {
					this.msg.text =
						"Inciada a extração de parâmetros fenotípicos, isso pode demorar um tempo"
					this.msg.type = "info"
					this.processingMotility = true
				})
				.catch(() => {
					this.msg.text =
						"Não foi posível iniciar a extração de parâmetros fenotípicos"
					this.msg.type = "danger"
					this.processingMotility = false
				})
		},

		downloadMotilityResults() {
			let url = apiAnalise.getMotilityResultsLink(this.analiseCodigo)
			window.open(url, "_blank")
		},

		autoRefresh() {
			if (this.analise) {
				this.refresh()
			}
		},

		metadados() {
			this.$router.push(`/analise/${this.analise._id}/metadados`)
		},

		checkConfigFiles: async function() {
			const result = await apiAnalise.checkConfigFilesExist()
			if(result.inexistent && result.inexistent.length > 0) {
				this.msg.type = "danger"
				this.msg.text = `Arquivo: "${result.inexistent[0]}" não encontrado, faça o upload em Configurações`;
			}
		},

		resetMotility() {
			this.$swal
				.fire({
					title: "Resetar extração",
					text: "Tem certeza que deseja resetar a extração de parâmetros fenotípicos dos poços? Sera necessário reprocessar após o reset.",
					type: "warning",
					showCancelButton: true,
					confirmButtonText: "Sim, resetar!",
					cancelButtonText: "Cancelar",
					focusCancel: true
				})
				.then((result) => {
					if (result.value) {
						apiAnalise
							.resetMotility(this.analiseCodigo)
							.then(() => {
								this.msg.text = "Extração de parâmetros fenotípicos resetada"
								this.msg.type = "info"
								this.refresh()
							})
							.catch(() => {
								this.msg.text =
									"Não foi posível resetar a extração de parâmetros fenotípicos da analise"
								this.msg.type = "danger"
							})
					}
				})
		},
	},

	created() {
		if(this.loadingComponent){
			this.loadingComponent = false
			this.analiseCodigo = this.$route.params.analiseCodigo
			this.framesDownloadLink = apiAnalise.getFramesDownloadLink(
				this.analiseCodigo
			)
			this.pocosDownloadLink = apiAnalise.getPocosDownloadLink(
				this.analiseCodigo
			)
			this.csvExportLink = apiAnalise.getCsvExportLink(this.analiseCodigo)

			if (!this.apiInterval) {
				this.apiInterval = setInterval(this.autoRefresh, 5000)
			}

			this.refresh()
			this.checkConfigFiles()
		}
	},

	beforeDestroy() {
		if (this.apiInterval != null) {
			clearInterval(this.apiInterval)
			this.apiInterval = null
		}
	},
}
</script>

<style>
.link-download {
	margin-left: 10px;
}

.card {
	min-height: 100%;
}

.flex {
	display: flex;
}
.flex .btn-primary {
	flex: 1;
}

@keyframes yellowfade {
	from {
		background: yellow;
		box-shadow: -1px -1px 3px 6px yellow;
	}
	to {
		background: transparent;
		box-shadow: -1px -1px 3px 6px transparent;
	}
}
.yellow-fade {
	animation-name: yellowfade;
	animation-duration: 1.5s;
	border-radius: 2px;
}

.row.align-content-stretch > .col > div {
	height: 100%;
}
.card-body {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.card-body .card-text {
	flex: 1;
	flex-direction: column;
	justify-content: center;
}

.card-body .card-text h2 {
	font-weight: bold;
}

.card-body .btn {
	font-size: 18px;
}
.card-text .alert {
	font-size: 17px;
	padding: 10px;
	margin: 0;
}
</style>
