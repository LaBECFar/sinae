<template>
	<div>
		<loading :active.sync="isLoading" :is-full-page="true"></loading>
		<b-row>
			<b-col>
				<h2>
					<v-icon style="width: 32px;" name="grid"></v-icon>
					Placas
				</h2>
			</b-col>
			<b-col class="text-right">
				<b-button to="/placa/novo" variant="success" class="mr-2">
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

			<template v-slot:cell(experimentoCodigo)="data">
				{{ data.item.experimentoCodigo || "-" }}
			</template>

			<template v-slot:cell(actions)="row">
				<b-button
					variant="success"
					size="sm"
					v-on:click="metadadosPlaca(row.item)"
					class="mr-2"
				>
					<v-icon name="tag"></v-icon>
					Metadados
				</b-button>

				<b-button
					variant="primary"
					size="sm"
					@click="editarPlaca(row.item)"
					class="mr-2"
					title="Editar"
				>
					<v-icon name="edit-2"></v-icon>
				</b-button>

				<b-button
					variant="danger"
					size="sm"
					@click="removerPlaca(row.item)"
					class="mr-2"
					title="Remover"
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
			Ainda não existem placas cadastradas
		</b-alert>

		<b-row>
			<b-col class="text-right">
				<strong>Total: {{ items.length }}</strong>
			</b-col>
		</b-row>
	</div>
</template>

<script>
import {apiPlaca} from "./api"
import Loading from "vue-loading-overlay"
import "vue-loading-overlay/dist/vue-loading.css"
import moment from 'moment'

export default {
	name: "PlacaIndex",
	components: {Loading},
	data() {
		return {
			isBusy: true,
			isLoading: false,
			fields: [
				{
					key: "label",
					label: "Placa",
				},
				{
					key: "experimento.text",
					label: "Experimento",
				},
				{
					key: "actions",
					label: "Ações",
					class: "placaIndexActions",
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
		metadadosPlaca(placa) {
			this.$router.push(`/placa/${placa._id}/metadados`)
		},

		editarPlaca(placa) {
			this.$router.push(`/placa/${placa._id}/editar`)
		},

		removerPlaca(placa) {
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
						apiPlaca
							.removerPlaca(placa._id)
							.then(() => {
								this.refresh()
							})
							.catch(() => {
								//console.log(e)
							})
					}
				})
		},

		refresh() {
			this.isBusy = true
			this.isLoading = false
			apiPlaca
				.listarPlacas()
				.then((data) => {
					data.forEach(placa => {
						if(!placa.experimentoCodigo) {
							placa.experimento = {
								text: 'Não informado'
							}
						} else {
							if(!placa.experimento || !placa.experimento._id){
								placa.experimento = {
									text: `${placa.experimentoCodigo} (Não encontrado)`
								}
							} else {
								placa.experimento.text = `${placa.experimento.label} - ${placa.experimento.codigo} - Data: ${moment(placa.experimento.createdAt).format("DD/MM/YYYY")}`
							}
						}
					})
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
.placaIndexActions {
	width: 300px;
	text-align: center;
}
</style>
