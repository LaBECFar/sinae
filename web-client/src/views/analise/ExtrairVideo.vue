<template>
	<div>
		<b-row>
			<b-col>
				<h2>Extração de Frames da Análise</h2>
			</b-col>
			<b-col class="text-right">
				<b-button @click="back()" variant="secondary">
					Voltar
				</b-button>
			</b-col>
		</b-row>

		<b-alert show v-show="msg.text" :variant="msg.type">
			{{ msg.text }}
		</b-alert><br>

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

					<br />
					<br />

					<b-form-group>
						<b-row
							align-v="center"
							class="btns"
							v-if="$refs.videoPlayer"
						>
							<b-col md="auto">
								<b-button @click="copyCurrentTime()">
									Copiar tempo atual
								</b-button>

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
									ref="q1start"
									v-model="quadrantes.q1[0]"
									type="text"
									placeholder="Início"
									v-mask="'##:##'"
									required
									:state="inputFeedback(quadrantes.q1) == '' ? null : false"
								/>
								<b-form-invalid-feedback>
									{{ inputFeedback(quadrantes.q1) }}
								</b-form-invalid-feedback>
							</b-col>
							<b-col>
								<b-form-input
									ref="q1end"
									v-model="quadrantes.q1[1]"
									type="text"
									placeholder="Fim"
									v-mask="'##:##'"
									required
									:state="inputFeedback(quadrantes.q1) == '' ? null : false"
								/>
								<b-form-invalid-feedback>
									{{ inputFeedback(quadrantes.q1) }}
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
									ref="q2start"
									v-model="quadrantes.q2[0]"
									type="text"
									placeholder="Início"
									v-mask="'##:##'"
									required
									:state="inputFeedback(quadrantes.q2) == '' ? null : false"
								/>
								<b-form-invalid-feedback>
									{{ inputFeedback(quadrantes.q2) }}
								</b-form-invalid-feedback>
							</b-col>
							<b-col>
								<b-form-input
									ref="q2end"
									v-model="quadrantes.q2[1]"
									type="text"
									placeholder="Fim"
									v-mask="'##:##'"
									required
									:state="inputFeedback(quadrantes.q2) == '' ? null : false"
								/>
								<b-form-invalid-feedback >
									{{ inputFeedback(quadrantes.q2) }}
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
									ref="q3start"
									v-model="quadrantes.q3[0]"
									type="text"
									placeholder="Início"
									v-mask="'##:##'"
									required
									:state="inputFeedback(quadrantes.q3) == '' ? null : false"
								/>
								<b-form-invalid-feedback>
									{{ inputFeedback(quadrantes.q3) }}
								</b-form-invalid-feedback>
							</b-col>
							<b-col>
								<b-form-input
									ref="q3end"
									v-model="quadrantes.q3[1]"
									type="text"
									placeholder="Fim"
									v-mask="'##:##'"
									required
									:state="inputFeedback(quadrantes.q3) == '' ? null : false"
								/>
								<b-form-invalid-feedback>
									{{ inputFeedback(quadrantes.q3) }}
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
									ref="q4start"
									v-model="quadrantes.q4[0]"
									type="text"
									placeholder="Início"
									v-mask="'##:##'"
									required
									:state="inputFeedback(quadrantes.q4) == '' ? null : false"
								/>
								<b-form-invalid-feedback>
									{{ inputFeedback(quadrantes.q4) }}
								</b-form-invalid-feedback>
							</b-col>
							<b-col>
								<b-form-input
									ref="q4end"
									v-model="quadrantes.q4[1]"
									type="text"
									placeholder="Fim"
									v-mask="'##:##'"
									required
									:state="inputFeedback(quadrantes.q4) == '' ? null : false"
								/>
								<b-form-invalid-feedback v-text="inputFeedback(quadrantes.q4)"/>
								
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

			<b-row class="justify-content-md-center">
				<b-col class="text-center" md="3">
					<b-button
						type="submit"
						variant="primary"
						size="lg"
						block 
						:disabled="isExtracting || !this.form.video || getNextEmptyQuadrant() != null"
					>
						Extrair frames
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
				duration: 0,
			},
		}
	},

	methods: {

		inputFeedback(quadrante) {
			const init = quadrante[0]
			const end = quadrante[1]

			if(init > end) {
				return 'O tempo inicial do quadrante não pode ser maior que o final'
			}

			if(this.$refs.videoPlayer && this.$refs.videoPlayer.duration) {
				const videoDuration = this.$refs.videoPlayer.duration
				const maxDuration = this.secondsToTime(Math.floor(videoDuration))

				if(init > maxDuration || end > maxDuration){
					return 'O tempo especificado não pode exceder a duração do vídeo'
				}
			}
			
			return ''
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

		timeToSeconds(time) {
			time = time.split(':')
			const min = parseInt(time[0]) * 60
			const sec = parseInt(time[1])
			return min + sec
		},

		copyToClipboard(text, infoText) {
			let dummy = document.createElement("input")
			document.body.appendChild(dummy)
			dummy.value = text
			dummy.select()
			document.execCommand("copy")
			document.body.removeChild(dummy)

			this.$bvToast.toast(text, {
				title: infoText,
				variant: "info",
				solid: true,
				autoHideDelay: 3000,
			})
		},

		copyCurrentTime() {
			let currentTime = this.$refs.videoPlayer.currentTime
			currentTime = this.secondsToTime(currentTime)

			const nextEmptyQuadrant = this.getNextEmptyQuadrant()

			if (nextEmptyQuadrant) {
				const q = nextEmptyQuadrant
					.replace("start", "")
					.replace("end", "")
				const index = nextEmptyQuadrant.indexOf("start") > -1 ? 0 : 1

				let newQuadrant = [...this.quadrantes[q]]
				newQuadrant[index] = currentTime
				this.quadrantes[q] = newQuadrant

				this.getQuadrantInput(nextEmptyQuadrant).focus()
			} else {
				this.copyToClipboard(
					"Campos já estão preenchidos! O valor " +
						currentTime +
						" foi copiado para área de transferência.",
					"Área de Transferência"
				)
			}
		},

		getNextEmptyQuadrant() {
			for (let k in this.quadrantes) {
				const quadrante = this.quadrantes[k]

				if (!quadrante[0]) {
					return k + "start"
				}

				if (!quadrante[1]) {
					return k + "end"
				}
			}
			return null
		},

		getQuadrantInput(ref) {
			return this.$refs[ref]
		},
	},

	created() {
		this.refresh()
		this.video.url = apiAnalise.videoUrl(this.$route.params.id)
	},
}
</script>

<style scoped>
.btns button + button {
	margin-left: 10px;
}
</style>
