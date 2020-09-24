<template>
	<div>
		<b-row>
			<b-col>
				<h2>Extração de Frames da Análise</h2>
			</b-col>
		</b-row>

		<b-alert show v-show="msg.text" :variant="msg.type">
			{{ msg.text }}
		</b-alert>

		<b-form @submit="onSubmit">
			<b-row align-content="between">
				<b-col md="auto">
					<video width="270" height="480" controls ref="videoPlayer">
						<source :src="video.url" />
						Your browser does not support the video tag.
					</video>
				</b-col>

				<b-col>
					<b-row>
						<b-col>
							<strong>Experimento:</strong>
							{{ form.experimentoCodigo }}
						</b-col>
					</b-row>

					<b-row>
						<b-col>
							<strong>Placa:</strong>
							{{ form.placa }}
						</b-col>
					</b-row>

					<b-row>
						<b-col>
							<strong>Tempo:</strong>
							{{ form.tempo }}
						</b-col>
					</b-row>

					<br><br>

					<b-form-group>
						<b-row
							align-v="center"
							class="video-control"
							v-if="$refs.videoPlayer"
						>
							<b-col md="auto">
								<b-button>Copiar tempo atual</b-button>
							</b-col>
							<b-col md="auto">
								<b-button variant="info" @click="saveConfig()">
									Salvar configurações
								</b-button>
							</b-col>
						</b-row>
					</b-form-group>

					<b-form-group>
						<b-row align-v="center">
							<b-col md="auto">
								<strong>Quadrante 1</strong>
							</b-col>
							<b-col>
								<b-form-input
									id="q1start"
									v-model="quadrantes.q1[0]"
									type="text"
									placeholder="Início"
									v-mask="'##:##'"
									required
									:state="quadranteState(quadrantes.q1)"
								/>
								<b-form-invalid-feedback>
									O tempo inicial do quadrante não pode ser
									maior que o final
								</b-form-invalid-feedback>
							</b-col>
							<b-col>
								<b-form-input
									id="q1end"
									v-model="quadrantes.q1[1]"
									type="text"
									placeholder="Fim"
									v-mask="'##:##'"
									required
									:state="quadranteState(quadrantes.q1)"
								/>
								<b-form-invalid-feedback>
									O tempo inicial do quadrante não pode ser
									maior que o final
								</b-form-invalid-feedback>
							</b-col>
						</b-row>
					</b-form-group>

					<b-form-group>
						<b-row align-v="center">
							<b-col md="auto">
								<strong>Quadrante 2</strong>
							</b-col>
							<b-col>
								<b-form-input
									id="q2start"
									v-model="quadrantes.q2[0]"
									type="text"
									placeholder="Início"
									v-mask="'##:##'"
									required
									:state="quadranteState(quadrantes.q2)"
								/>
								<b-form-invalid-feedback>
									O tempo inicial do quadrante não pode ser
									maior que o final
								</b-form-invalid-feedback>
							</b-col>
							<b-col>
								<b-form-input
									id="q2end"
									v-model="quadrantes.q2[1]"
									type="text"
									placeholder="Fim"
									v-mask="'##:##'"
									required
									:state="quadranteState(quadrantes.q2)"
								/>
								<b-form-invalid-feedback>
									O tempo inicial do quadrante não pode ser
									maior que o final
								</b-form-invalid-feedback>
							</b-col>
						</b-row>
					</b-form-group>

					<b-form-group>
						<b-row align-v="center">
							<b-col md="auto">
								<strong>Quadrante 3</strong>
							</b-col>
							<b-col>
								<b-form-input
									id="q1start"
									v-model="quadrantes.q3[0]"
									type="text"
									placeholder="Início"
									v-mask="'##:##'"
									required
									:state="quadranteState(quadrantes.q3)"
								/>
								<b-form-invalid-feedback>
									O tempo inicial do quadrante não pode ser
									maior que o final
								</b-form-invalid-feedback>
							</b-col>
							<b-col>
								<b-form-input
									id="q1end"
									v-model="quadrantes.q3[1]"
									type="text"
									placeholder="Fim"
									v-mask="'##:##'"
									required
									:state="quadranteState(quadrantes.q3)"
								/>
								<b-form-invalid-feedback>
									O tempo inicial do quadrante não pode ser
									maior que o final
								</b-form-invalid-feedback>
							</b-col>
						</b-row>
					</b-form-group>

					<b-form-group>
						<b-row align-v="center">
							<b-col md="auto">
								<strong>Quadrante 4</strong>
							</b-col>
							<b-col>
								<b-form-input
									id="q4start"
									v-model="quadrantes.q4[0]"
									type="text"
									placeholder="Início"
									v-mask="'##:##'"
									required
									:state="quadranteState(quadrantes.q4)"
								/>
								<b-form-invalid-feedback>
									O tempo inicial do quadrante não pode ser
									maior que o final
								</b-form-invalid-feedback>
							</b-col>
							<b-col>
								<b-form-input
									id="q4end"
									v-model="quadrantes.q4[1]"
									type="text"
									placeholder="Fim"
									v-mask="'##:##'"
									required
									:state="quadranteState(quadrantes.q4)"
								/>
								<b-form-invalid-feedback>
									O tempo inicial do quadrante não pode ser
									maior que o final
								</b-form-invalid-feedback>
							</b-col>
						</b-row>
					</b-form-group>

					<b-form-group id="fps">
						<b-row align-v="center">
							<b-col md="auto">
								<strong>FPS</strong>
							</b-col>
							<b-col>
								<b-form-input
									id="fps"
									v-model="form.fps"
									type="text"
									required
								/>
							</b-col>
						</b-row>
					</b-form-group>
				</b-col>
			</b-row>

			<hr />

			<b-row>
				<b-col>
					<b-button
						type="submit"
						variant="primary"
						:disabled="isExtracting || !this.form.video"
					>
						Extrair frames
					</b-button>
				</b-col>
				<b-col class="text-right">
					<b-button @click="back()" variant="secondary">
						Voltar
					</b-button>
				</b-col>
			</b-row>
		</b-form>
	</div>
</template>

<script>
import {apiAnalise} from "./api"

export default {
	name: "analiseExtrairVideo",
	data() {
		return {
			form: {
				_id: "",
				fps: "",
			},

			isExtracting: false,

			quadrantes: {
				q1: ["", ""],
				q2: ["", ""],
				q3: ["", ""],
				q4: ["", ""],
			},

			msg: {
				text: false,
				type: "",
			},

			video: {
				url: "",
				player: null,
			},
		}
	},

	mounted() {
		console.log("$refs.videoPlayer in mounted", this.$refs.videoPlayer)
	},

	watch: {
		"$refs.videoPlayer": {
			immediate: true,
			handler(value) {
				console.log("$refs.videoPlayer watcher", value)
			},
		},
	},

	methods: {
		quadranteState(q) {
			return q[0] > q[1] ? false : null
		},

		back() {
			this.$router.push(
				`/experimento/${this.form.experimentoCodigo}/analises/`
			)
		},

		onSubmit(evt) {
			evt.preventDefault()

			apiAnalise
				.extractFrames({
					_id: this.form._id,
					fps: this.form.fps,
					quadrantes: this.quadrantes,
				})
				.then(() => {
					this.isExtracting = true
					this.msg.text =
						"Extração de frames inicializada, esse processo acontece de forma assíncrona"
					this.msg.type = "success"
				})
				.catch((e) => {
					this.msg.text = `Erro ao iniciar a extração de frames ${e}`
					this.msg.type = "danger"
				})
		},

		refresh() {
			apiAnalise.getAnalise(this.$route.params.id).then((ret) => {
				//ret.dataColeta = moment.utc(ret.dataColeta).format("DD/MM/YYYY")
				this.form = ret

				if (!this.form.video) {
					this.msg.text =
						"Essa análise não possúi vídeo ou os frames ja foram extraídos"
					this.msg.type = "danger"
				}

				this.loadConfig()
			})
		},

		saveConfig() {
			this.$swal
				.fire({
					title: "Configurações padrões",
					text:
						"Deseja salvar as configurações atuais como padrão para o seu dispositivo?",
					type: "info",
					showCancelButton: true,
					confirmButtonText: "Sim, salvar!",
					cancelButtonText: "Cancelar",
				})
				.then((result) => {
					if (result.value) {
						let config = {
							fps: this.form.fps,
							quadrantes: this.quadrantes,
						}
						config = JSON.stringify(config)
						localStorage.setItem("extraction-config", config)
					}
				})
		},

		loadConfig() {
			let config = localStorage.getItem("extraction-config")
			if (config) {
				config = JSON.parse(config)
				this.form.fps = config.fps
				this.quadrantes = config.quadrantes
			}
		},

		secondsToTime(seconds) {
			const min = Math.floor((seconds / 60) % 60)
			const sec = Math.floor(seconds % 60)
			return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`
		},
	},

	created() {
		this.refresh()
		this.video.url = apiAnalise.videoUrl(this.$route.params.id)
	},
}
</script>
