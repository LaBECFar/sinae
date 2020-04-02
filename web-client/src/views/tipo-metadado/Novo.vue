<template>
	<div>
		<h2>Novo tipo de metadado</h2>

		<b-alert :show="msg.text" :v-show="msg.text" :variant="msg.type">
			{{ msg.text }}
		</b-alert>

		<b-form @submit="onSubmit">
			<b-form-group id="input-group-1" label="Nome:" label-for="nome">
				<b-form-input
					id="nome"
					v-model="form.nome"
					type="text"
                    placeholder="Ex: Gênero"
					required
				/>
			</b-form-group>

			<b-form-group id="input-group-1" label="Descricao:" label-for="descricao">
				<b-form-textarea
					id="descricao"
					v-model="form.descricao"
					type="text"
                    placeholder="Ex: Usado para saber se o parasita é macho ou fêmea"
					required
				/>
			</b-form-group>
			<b-row>
				<b-col>
					<b-button type="submit" variant="primary">Salvar</b-button>
				</b-col>
				<b-col class="text-right">
					<b-button to="/tipo-metadado" variant="secondary">
						Voltar
					</b-button>
				</b-col>
			</b-row>
		</b-form>
	</div>
</template>

<script>
import { apiTipoMetadado } from "./api";

export default {
	name: "novoTipoMetadado",
	data() {
		return {
			form: {
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
			apiTipoMetadado
				.novoTipoMetadado(this.form)
				.then(() => {
					this.msg.text = "Tipo de Metadado salvo";
					this.msg.type = "success";
				})
				.catch(e => {
					this.msg.text = `Erro ao salvar o tipo de metadado ${e}`;
					this.msg.type = "danger";
				});
		}
	}
};
</script>
