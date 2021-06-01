<template>
	<div>
		<h2>Nova Análise</h2>

		<b-alert show v-show="msg.text" :variant="msg.type">
			{{ msg.text }}
		</b-alert>

		<b-overlay
			:show="video.uploadPercentage > 0 && video.isUploading"
			rounded="sm"
		>
			<b-form @submit="onSubmit">
				<b-form-group label="Código do Experimento" label-for="tempo">
					<b-form-input
						id="experimento"
						v-model="form.experimentoCodigo"
						type="text"
						readonly
					/>
				</b-form-group>

				<b-form-group label="Tempo do experimento" label-for="tempo">
					<b-form-input
						id="tempo"
						v-model="form.tempo"
						type="text"
						required
					/>
				</b-form-group>

				<b-form-group label="Placa" label-for="placa">
					<b-form-input
						id="placa"
						v-model="form.placa"
						type="text"
						required
					/>
				</b-form-group>

				<b-form-group label="Data de coleta" label-for="dataColeta">
					<b-form-datepicker
						id="dataColeta"
						v-model="form.dataColeta"
						placeholder="Selecione uma data"
						required
					></b-form-datepicker>
				</b-form-group>

				<b-form-group label="Vídeo" label-for="upload">
					<div class="tabs-video">
						<button :class="{'selected' : tab == 'enviar'}" @click="tab = 'enviar'">Enviar</button>
						<button :class="{'selected' : tab != 'enviar'}" @click="tab = 'copiar'">Copiar</button>
					</div>
					<div class="tabs-container" v-if="tab == 'enviar'">
						<p class="form-label-description">O tamanho do vídeo esta limitado a 5GB de dados</p>
						<div class="upload-actions">
							<b-form-file
								v-model="video.file"
								:state="Boolean(video.file)"
								placeholder="Escolha um arquivo ou arraste aqui..."
								drop-placeholder="Arraste o arquivo aqui..."
								accept=".avi,.mp4"
							></b-form-file>
						</div>
					</div>
					<div class="tabs-container" v-else>
						<p class="form-label-description">Selecione uma análise para copiar o vídeo</p>
						<b-form-select v-model="form.copyVideoFromAnalysis" :options="analysisWithVideo"></b-form-select>
					</div>
				</b-form-group>

				<b-row>
					<b-col>
						<b-button type="submit" variant="primary">
							Cadastrar e continuar
						</b-button>
					</b-col>
					<b-col class="text-right">
						<b-button to="/experimento" variant="secondary">
							Voltar
						</b-button>
					</b-col>
				</b-row>
			</b-form>

			<template v-slot:overlay>
				<div class="uploading-box">
					<b-spinner
						label="Spinning"
						v-if="video.uploadPercentage < 100"
					></b-spinner>

					<h3 v-if="video.uploadPercentage < 100">
						Enviando vídeo...
					</h3>
					<h3 v-if="video.uploadPercentage >= 100">
						Vídeo enviado e analise cadastrada
					</h3>
					<p v-if="video.uploadPercentage >= 100">
						Agora é necessário extrair os frames do vídeo
					</p>

					<br />

					<b-progress :max="100" height="2rem">
						<b-progress-bar
							:value="video.uploadPercentage"
							variant="success"
						>
							<strong v-if="video.uploadPercentage < 100">
								{{ video.uploadPercentage }}%
							</strong>
							<strong v-if="video.uploadPercentage >= 100">
								Upload Completo
							</strong>
						</b-progress-bar>
					</b-progress>

					<b-button
						class="btn-extract"
						v-if="analiseId && video.uploadPercentage >= 100"
						:to="'/analise/' + analiseId + '/extrair-video/'"
						variant="primary"
						size="lg"
					>
						Extrair Frames
					</b-button>
				</div>
			</template>
		</b-overlay>
	</div>
</template>

<script>
import {apiAnalise} from "./api"

export default {
	name: "novaAnalise",
	data() {
		return {
			form: {
				tempo: "",
				placa: "",
				dataColeta: new Date().toISOString().slice(0, 10),
				experimentoCodigo: "",
				copyVideoFromAnalysis: ""
			},
			analiseId: "",
			video: {
				file: null,
				uploadPercentage: 0,
				isUploading: false,
			},
			msg: {
				text: "",
				type: "",
			},
			tab: "enviar",
			analysisWithVideo: []
		}
	},
	methods: {
		back() {
			this.$router.push(
				`/experimento/${this.form.experimentoCodigo}/analises/`
			)
		},

		onSubmit(evt) {
			evt.preventDefault()

			if(!this.form.copyVideoFromAnalysis) {
				if (!this.video.file || this.video.uploadPercentage > 0) {
					return false
				}
			}

			apiAnalise
				.novoAnalise(this.form)
				.then((res) => {
					if(this.video.file){
						this.msg.text = "Enviando vídeo..."
						this.msg.type = "info"

						if (res._id) {
							this.analiseId = res._id
							this.uploadVideo()
						}
					} else {
						this.msg.text = "Análise cadastrada com sucesso"
						this.msg.type = "success"
						setTimeout(this.back, 1000)
					}
				})
				.catch((e) => {
					this.msg.text = `Erro ao salvar a análise ${e}`
					this.msg.type = "danger"
				})
		},

		uploadVideo() {
			this.video.isUploading = true

			let formData = new FormData()
			formData.append("file", this.video.file)

			apiAnalise
				.getApi()
				.post(
					"/analise/" + this.analiseId + "/upload-video",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
						onUploadProgress: function(progressEvent) {
							this.video.uploadPercentage = parseInt(
								Math.round(
									(progressEvent.loaded /
										progressEvent.total) *
										100
								)
							)
						}.bind(this),
					}
				)
				.then(() => {
					this.msg.text = "Análise cadastrada com sucesso"
					this.msg.type = "success"
					//this.video.isUploading = false
				})
				.catch(() => {
					this.msg.text = "Erro ao enviar o vídeo!"
					this.msg.type = "danger"
					this.video.isUploading = false
				})
		},
	},

	created() {
		this.form.experimentoCodigo = this.$route.params.experimentoCodigo

		apiAnalise.listAllWithVideo(this.form.experimentoCodigo)
                .then((data) => {
                    this.analysisWithVideo = data.map(analysis => { 
						return {
							value: analysis.video,
							text: 'Tempo: '+ analysis.tempo + ' - Placa: ' +  analysis.placa
						}
					})
					this.analysisWithVideo.unshift( {value: '', text: "Não copiar"})
                    this.isBusy = false
                })
                .catch(e => {
                    console.log(e)
                    this.isBusy = false
                })
	},
}
</script>
<style scoped>
.progress {
	width: 500px;
}
.uploading-box {
	text-align: center;
}
.btn-extract {
	margin-top: 20px;
}

.tabs-video {
    display: flex;
}

.tabs-video button {
    background: #fff;
    width: 100%;
    border: none;
    padding: 10px;
    font-weight: bold;
    font-size: 16px;
    color: #2c3e50;
}

.tabs-video button.selected {
	background: #eee;
    border: 1px solid #ccc;
    border-bottom: none;
    margin-bottom: -1px;
}

.tabs-container {
	background: #eee;
    padding: 20px;
	border: 1px solid #ccc;
}
</style>

<style>
.upload-actions .custom-file .custom-file-label:after {
	display: none !important;
}
.upload-actions {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
}

.upload-actions button {
	margin-right: 10px;
}

.upload-actions label {
	cursor: pointer;
}

.upload-actions .btn-info {
	height: 120px;
	margin-left: 10px;
	border-radius: 2px;
	padding: 0 30px;
	white-space: nowrap;
}

.upload-actions .custom-file-label {
	height: 120px;
	text-align: center;
	border: 1px solid #ddd !important;
	cursor: pointer;
	outline: none;
	box-shadow: none !important;
	border-radius: 3px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.upload-actions .custom-file {
	height: 120px;
}

.form-label-description {
	font-size:80%;
	line-height:1;
	color:#777;
}
</style>
