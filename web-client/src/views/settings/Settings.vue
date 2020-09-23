<template>
	<div>
		<h2>
			<v-icon style="width: 32px;" name="globe"></v-icon>
			Configurações
		</h2>

		<b-alert show v-show="msg.text" :variant="msg.type">
			{{ msg.text }}
		</b-alert>

		<b-form @submit="onSubmit">
			<b-form-group label="Título:" label-for="title">
				<b-form-input
					id="title"
					v-model="form.title"
					type="text"
					required
				/>
			</b-form-group>

			<b-form-group
				label="Modelo AI para separar o parasita:"
				label-for="upload"
			>
				<div class="upload-actions">
					<b-form-file
						v-model="trainedModel.file"
						:state="Boolean(trainedModel.file)"
						placeholder="Escolha um arquivo .pkl ou arraste aqui..."
						drop-placeholder="Arraste o arquivo aqui..."
						accept=".pkl"
						v-if="trainedModel.uploadPercentage <= 0"
					></b-form-file>
					<b-button
						type="button"
						variant="info"
						v-on:click="uploadModel"
						v-if="
							trainedModel.file &&
								trainedModel.uploadPercentage <= 0
						"
					>
						Enviar arquivo
					</b-button>
				</div>
				<b-progress
					:max="100"
					height="2rem"
					v-if="
						trainedModel.file && trainedModel.uploadPercentage > 0
					"
				>
					<b-progress-bar
						:value="trainedModel.uploadPercentage"
						variant="success"
					>
						<strong v-if="trainedModel.uploadPercentage < 100">
							{{ trainedModel.uploadPercentage }}%
						</strong>
						<strong v-if="trainedModel.uploadPercentage >= 100">
							Upload Completo!
						</strong>
					</b-progress-bar>
				</b-progress>
			</b-form-group>

			<b-form-group
				label="Configurações do CellProfiler:"
				label-for="upload"
			>
				<div class="upload-actions">
					<b-form-file
						v-model="cellprofilerConfig.file"
						:state="Boolean(cellprofilerConfig.file)"
						placeholder="Escolha um arquivo .cpproj ou arraste aqui..."
						drop-placeholder="Arraste o arquivo aqui..."
						accept=".cpproj"
						v-if="cellprofilerConfig.uploadPercentage <= 0"
					></b-form-file>
					<b-button
						type="button"
						variant="info"
						v-on:click="uploadCellprofilerConfig"
						v-if="
							cellprofilerConfig.file &&
								cellprofilerConfig.uploadPercentage <= 0
						"
					>
						Enviar arquivo
					</b-button>
				</div>
				<b-progress
					:max="100"
					height="2rem"
					v-if="
						cellprofilerConfig.file &&
							cellprofilerConfig.uploadPercentage > 0
					"
				>
					<b-progress-bar
						:value="cellprofilerConfig.uploadPercentage"
						variant="success"
					>
						<strong
							v-if="cellprofilerConfig.uploadPercentage < 100"
						>
							{{ cellprofilerConfig.uploadPercentage }}%
						</strong>
						<strong
							v-if="cellprofilerConfig.uploadPercentage >= 100"
						>
							Upload Completo!
						</strong>
					</b-progress-bar>
				</b-progress>
			</b-form-group>

			<hr />

			<b-row>
				<b-col>
					<b-button type="submit" variant="primary">Salvar</b-button>
				</b-col>
			</b-row>
		</b-form>
	</div>
</template>

<script>
import {apiSettings} from "./api"

export default {
	name: "settings",
	data() {
		return {
			form: {
				title: "",
			},

			msg: {
				text: false,
				type: "",
			},

			trainedModel: {
				file: null,
				uploadPercentage: 0,
			},

			cellprofilerConfig: {
				file: null,
				uploadPercentage: 0,
			},

			isAdmin: false,
		}
	},

	methods: {
		onSubmit(evt) {
			evt.preventDefault()

			apiSettings
				.update(this.form)
				.then(() => {
					this.msg.text = "Configurações atualizadas"
					this.msg.type = "success"
				})
				.catch((e) => {
					this.msg.text = `Erro ao atualizar configurações ${e}`
					this.msg.type = "danger"
				})
		},

		refresh() {
			apiSettings.get().then((res) => {
				this.form = res
			})
		},

		uploadModel() {
			const that = this

			this.uploadFile(
				this.trainedModel.file,
				"/settings/upload-model-pkl",
				function(progressEvent) {
					that.trainedModel.uploadPercentage = parseInt(
						Math.round(
							(progressEvent.loaded / progressEvent.total) * 100
						)
					)
				}
			)
		},

		uploadCellprofilerConfig() {
			const that = this

			this.uploadFile(
				this.cellprofilerConfig.file,
				"/settings/upload-cellprofiler-config",
				function(progressEvent) {
					that.cellprofilerConfig.uploadPercentage = parseInt(
						Math.round(
							(progressEvent.loaded / progressEvent.total) * 100
						)
					)
				}
			)
		},

		uploadFile(file, route, onFileUploadProgress) {
			let formData = new FormData()
			formData.append("file", file)

			apiSettings
				.getApi()
				.post(route, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
					onUploadProgress: function(progressEvent) {
						onFileUploadProgress(progressEvent)
					}.bind(this),
				})
				.catch((err) => {
					console.log(err)
					this.msg.text = "Erro no upload"
					this.msg.type = "danger"
				})
		},
	},

	created() {
		this.isAdmin = localStorage.getItem("isAdmin")
		this.refresh()
	},
}
</script>

<style>
.upload-actions .custom-file .custom-file-label:after {
	display: none !important;
}
.upload-actions {
	display: flex;
	align-items: center;
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
</style>
