<template>
	<div>
		<h2><v-icon style="width: 32px;" name="globe"></v-icon> Configurações</h2>

		<b-alert :show="msg.text" :v-show="msg.text" :variant="msg.type">
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
				label-for="cleaning_parasite_model_location"
			>
				<b-form-input
					id="cleaning_parasite_model_location"
					v-model="form.cleaning_parasite_model_location"
					type="text"
					required
				/>
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
import { apiSettings } from "./api"

export default {
	name: "settings",
	data() {
		return {
			form: {
				title: "",
				cleaning_parasite_model_location: "",
			},
			msg: {
				text: false,
				type: "",
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
	},
	created() {
		this.isAdmin = localStorage.getItem("isAdmin")
		this.refresh()
	},
}
</script>
