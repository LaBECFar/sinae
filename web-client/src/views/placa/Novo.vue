<template>
	<div>
		<h2>Nova placa</h2>

		<b-alert :show="msg.text" :v-show="msg.text" :variant="msg.type">
			{{ msg.text }}
		</b-alert>

		<b-form @submit="onSubmit">
			<b-form-group label="Label:" label-for="label">
				<b-form-input
					id="label"
					v-model="form.label"
					type="text"
					required
				/>
			</b-form-group>

			<b-form-group
				label="Código do experimento:"
				label-for="experimentoCodigo"
			>
				<b-form-input
					id="experimentoCodigo"
					v-model="form.experimentoCodigo"
					type="text"
				/>
			</b-form-group>
			<b-row>
				<b-col>
					<b-button type="submit" variant="primary">Salvar e Continuar</b-button>
				</b-col>
				<b-col class="text-right">
					<b-button to="/placa" variant="secondary">
						Voltar
					</b-button>
				</b-col>
			</b-row>
		</b-form>
	</div>
</template>

<script>
import { apiPlaca } from "./api";

export default {
	name: "novaPlaca",
	data() {
		return {
			form: {
				label: "",
				experimentoCodigo: ""
			},
			msg: {
				text: false,
				type: ""
			}
		};
	},
	methods: {
		onSubmit(evt) {
			evt.preventDefault();
			apiPlaca
				.novo(this.form)
				.then((placa) => {
					this.msg.text = "Placa salva";
					this.msg.type = "success";
					this.$router.push(`/placa/${placa._id}/metadados`);
				})
				.catch(e => {
					this.msg.text = `Erro ao salvar placa ${e}`;
					this.msg.type = "danger";
				});
		}
	}
};
</script>
