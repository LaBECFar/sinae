<template>
	<div>
		<loading :active.sync="isLoading" :is-full-page="true"></loading>
		<b-row>
			<b-col>
				<h2>
					<v-icon style="width: 32px;" name="tag"></v-icon>
					Metadados
				</h2>
			</b-col>
			<b-col class="text-right">
				<b-button to="/metadado/novo" variant="success" class="mr-2">
					<v-icon name="plus"></v-icon>
					Novo
				</b-button>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-alert
					:show="msg.text"
					:v-show="msg.text"
					:variant="msg.type"
				>
					{{ msg.text }}
				</b-alert>
			</b-col>
		</b-row>
		<b-table
			:busy="isBusy"
			:items="items"
			:fields="fields"
			striped
			responsive="sm"
		>
			<template v-slot:cell(createdAt)="data">
				<span>
					{{ data.item.createdAt | moment("utc", "DD/MM/YYYY") }}
				</span>
			</template>

			<template v-slot:cell(actions)="row">
				<b-button
					variant="primary"
					size="sm"
					@click="editarMetadado(row.item)"
					class="mr-2"
				>
					<v-icon name="edit-2"></v-icon>
				</b-button>

				<b-button
					variant="danger"
					size="sm"
					@click="removerMetadado(row.item)"
					class="mr-2"
				>
					<v-icon name="trash"></v-icon>
				</b-button>
			</template>

			<div slot="table-busy" class="text-center text-danger my-2">
				<b-spinner class="align-middle"></b-spinner>
				<strong>Loading...</strong>
			</div>
		</b-table>

		<b-alert variant="secondary" class="text-center" :show="!items.length">
			Ainda não existem metadados cadastrados
		</b-alert>

		<b-row>
			<b-col class="text-right">
				<strong>Total: {{ items.length }}</strong>
			</b-col>
		</b-row>
	</div>
</template>

<script>
import { apiMetadado } from "./api";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
	name: "MetadadoIndex",
	components: { Loading },
	data() {
		return {
			isBusy: true,
			isLoading: false,
			fields: [
				{
					key: "nome",
					label: "Nome"
				},
				{
					key: "descricao",
					label: "Descrição"
				},
				{
					key: "actions",
					label: "Ações",
					class: "metadadoIndexActions"
				}
			],
			items: [],
			msg: {
				text: false,
				type: ""
			}
		};
	},
	methods: {
		editarMetadado(metadado) {
			this.$router.push(`/metadado/${metadado._id}/editar`);
		},

		removerMetadado(metadado) {
			this.$swal
				.fire({
					title: "Tem certeza?",
					text: "Você não poderá desfazer isso ok!",
					type: "warning",
					showCancelButton: true,
					confirmButtonText: "Sim, remover metadado!",
					cancelButtonText: "Cancelar"
				})
				.then(result => {
					if (result.value) {
						apiMetadado
							.removerMetadado(metadado._id)
							.then(() => {
								this.refresh();
							})
							.catch(e => {
								console.log(e);
							});
					}
				});
		},

		refresh() {
			this.isBusy = true;
			this.isLoading = false;
			apiMetadado
				.listarMetadados()
				.then(data => {
					this.items = data;
					this.isBusy = false;
				})
				.catch(e => {
					console.log(e);
					this.isBusy = false;
				});
		}
	},
	created() {
		this.refresh();
	}
};
</script>

<style>
.metadadoIndexActions {
	width: 300px;
	text-align: center;
}
</style>
