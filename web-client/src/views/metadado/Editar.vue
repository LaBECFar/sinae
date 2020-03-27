<template>
	<div>
		<h2>Editar Metadado</h2>

		<b-alert :show="msg.text" :v-show="msg.text" :variant="msg.type">
			{{ msg.text }}
		</b-alert>

		<b-form @submit="onSubmit">
			<b-form-group id="input-group-1" label="Nome:" label-for="nome">
				<b-form-input
					id="nome"
					v-model="form.nome"
					type="text"
					required
				/>
			</b-form-group>

			<b-form-group
				id="input-group-1"
				label="Descrição:"
				label-for="descricao"
			>
				<b-form-input
					id="descricao"
					v-model="form.descricao"
					type="text"
					required
				/>
			</b-form-group>
			<b-row>
				<b-col>
					<b-button type="submit" variant="primary">Salvar</b-button>
				</b-col>
				<b-col class="text-right">
					<b-button to="/metadado" variant="secondary">
						Voltar
					</b-button>
				</b-col>
			</b-row>
		</b-form>
	</div>
</template>

<script>
import { apiMetadado } from "./api";

export default {
	name: "editarMetadado",
	data() {
		return {
			form: {
				_id: "",
				nome: "",
				descricao: ""
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
			apiMetadado
				.atualizarMetadado(this.form)
				.then(() => {
					this.msg.text = "Metadado atualizado";
					this.msg.type = "success";
				})
				.catch(e => {
					this.msg.text = `Erro ao atualizar o metadado ${e}`;
					this.msg.type = "danger";
				});
		},
		refresh() {
			apiMetadado.getMetadado(this.$route.params.id).then(ret => {
				this.form = ret;
			});
		}
	},
	created() {
		this.refresh();
	}
};
</script>
