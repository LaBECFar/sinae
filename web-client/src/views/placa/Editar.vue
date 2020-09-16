<template>
	<div>
		<h2>Editar Placa</h2>

		<b-alert show v-show="msg.text" :variant="msg.type">
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
					<b-button type="submit" variant="primary">Salvar</b-button>
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
	name: "editarPlaca",
	data() {
		return {
			form: {
				_id: "",
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
				.atualizarPlaca(this.form)
				.then(() => {
					this.msg.text = "Placa atualizada";
					this.msg.type = "success";
				})
				.catch(e => {
					this.msg.text = `Erro ao atualizar placa ${e}`;
					this.msg.type = "danger";
				});
		},
		refresh() {
			apiPlaca.getPlaca(this.$route.params.id).then(ret => {
				this.form = ret;
			});
		}
	},
	created() {
		this.refresh();
	}
};
</script>
