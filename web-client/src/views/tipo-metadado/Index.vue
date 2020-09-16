<template>
	<div>
		<loading :active.sync="isLoading" :is-full-page="true"></loading>
		<b-row>
			<b-col>
				<h2>
					<v-icon style="width: 32px;" name="tag"></v-icon>
					Tipos de Metadado
				</h2>
			</b-col>
			<b-col class="text-right">
				<b-button
					to="/tipo-metadado/novo"
					variant="success"
					class="mr-2"
				>
					<v-icon name="plus"></v-icon>
					Novo
				</b-button>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-alert show v-show="msg.text" :variant="msg.type">
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
					@click="editarTipoMetadado(row.item)"
					class="mr-2"
				>
					<v-icon name="edit-2"></v-icon>
				</b-button>

				<b-button
					variant="danger"
					size="sm"
					@click="removerTipoMetadado(row.item)"
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
			Ainda não existem tipos de metadado cadastrados
		</b-alert>

		<b-row>
			<b-col class="text-right">
				<strong>Total: {{ items.length }}</strong>
			</b-col>
		</b-row>
	</div>
</template>

<script>
import {apiTipoMetadado} from "./api"
import Loading from "vue-loading-overlay"
import "vue-loading-overlay/dist/vue-loading.css"

export default {
	name: "TipoMetadadoIndex",
	components: {Loading},
	data() {
		return {
			isBusy: true,
			isLoading: false,
			fields: [
				{
					key: "nome",
					label: "Nome",
				},
				{
					key: "descricao",
					label: "Descrição",
				},
				{
					key: "actions",
					label: "Ações",
					class: "tipoMetadadoIndexActions",
				},
			],
			items: [],
			msg: {
				text: false,
				type: "",
			},
		}
	},
	methods: {
		editarTipoMetadado(tipo) {
			this.$router.push(`/tipo-metadado/${tipo._id}/editar`)
		},

		removerTipoMetadado(tipo) {
			this.$swal
				.fire({
					title: "Tem certeza?",
					text: "Você não poderá desfazer isso ok!",
					type: "warning",
					showCancelButton: true,
					confirmButtonText: "Sim, remover!",
					cancelButtonText: "Cancelar",
				})
				.then((result) => {
					if (result.value) {
						apiTipoMetadado
							.removerTipoMetadado(tipo._id)
							.then(() => {
								this.refresh()
							})
					}
				})
		},

		refresh() {
			this.isBusy = true
			this.isLoading = false
			apiTipoMetadado
				.listarTiposMetadado()
				.then((data) => {
					this.items = data
					this.isBusy = false
				})
				.catch(() => {
					this.isBusy = false
				})
		},
	},
	created() {
		this.refresh()
	},
}
</script>

<style>
.tipoMetadadoIndexActions {
	width: 300px;
	text-align: center;
}
</style>
