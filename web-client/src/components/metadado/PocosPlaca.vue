<template>
	<div class="placa-wrapper" v-if="pocos && pocos.length > 0">
		<div class="placa-rows placa-actions">
			<button
				v-for="(letter, i) in rows"
				:key="i"
				v-on:click="toggleRow(letter)"
				:class="{ selected: selectedRows.indexOf(letter) > -1 }"
			>
				{{ letter }}
			</button>
		</div>

		<div class="content">
			<div class="placa-columns placa-actions">
				<button
					v-for="n in 12"
					:key="n"
					v-on:click="toggleColumn(n)"
					:class="{ selected: selectedColumns.indexOf(n) > -1 }"
				>
					{{ n }}
				</button>
			</div>

			<div class="placa">
				<div
					v-bind:class="{
						poco: true,
						selected:
							selected.findIndex(
								(item) => poco.nome == item.nome
							) >= 0,
						hasMetadado: poco.metadados.length > 0,
					}"
					v-for="(poco, index) in pocos"
					v-on:click="toggle(poco)"
					:key="index"
					:id="'poco-index-' + index"
				>
					{{ poco.nome }}

					<b-tooltip
						v-if="poco.metadados.length > 0"
						:target="'poco-index-' + index"
						triggers="hover"
						placement="bottom"
						container="html"
						variant="dark"
						noninteractive
					>
						<ul>
							<li
								v-for="(metadado, li) in poco.metadados"
								:key="li"
							>
								{{ metadado.nome }}:
								<span class="valor">{{ metadado.valor }}</span>
							</li>
						</ul>
					</b-tooltip>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ["pocos", "selected"],
	data() {
		return {
			rows: ["A", "B", "C", "D", "E", "F", "G", "H"],
			selectedRows: [],
			selectedColumns: [],
		}
	},

	watch: {
		selected: function(newVal) {
			if (newVal.length <= 0) {
				this.selectedRows = []
				this.selectedColumns = []
			} else {
				this.selectedRows.forEach(letter => {
					this.checkRow(letter)
				})

				this.selectedColumns.forEach(number => {
					this.checkColumn(number)
				})
			}
		},
	},

	methods: {
		toggle: function(poco) {
			let index = this.selected.findIndex(
				(item) => item.nome == poco.nome
			)

			if (index < 0) {
				this.selected.push(poco)
			} else {
				this.selected.splice(index, 1)
			}
		},

		select: function(poco) {
			let index = this.selected.findIndex(
				(item) => item.nome == poco.nome
			)
			if (index < 0) {
				this.selected.push(poco)
			}
		},

		unselect: function(poco) {
			let index = this.selected.findIndex(
				(item) => item.nome == poco.nome
			)
			if (index > -1) {
				this.selected.splice(index, 1)
			}
		},

		checkRow(letter) {
			let pocosRow = this.selected.filter(
				(poco) => poco.nome.indexOf(letter) == 0
			)
			if (pocosRow.length < 12) {
				const index = this.selectedRows.indexOf(letter)
				this.selectedRows.splice(index, 1)
			}
		},

		checkColumn(number) {
			let pocosColumn = this.selected.filter(
				(poco) => poco.nome == poco.nome[0] + number
			)

			if (pocosColumn.length < this.rows.length) {
				let index = this.selectedColumns.findIndex(item => item == number)
				this.selectedColumns.splice(index, 1)
			}
		},

		toggleRow: function(letter) {
			const pocosLine = this.pocos.filter(
				(item) => item.nome.indexOf(letter) == 0
			)

			const selectedRowIndex = this.selectedRows.indexOf(letter)

			if (selectedRowIndex > -1) {
				pocosLine.forEach((poco) => {
					this.unselect(poco)
				})
				this.selectedRows.splice(selectedRowIndex, 1)
			} else {
				pocosLine.forEach((poco) => {
					this.select(poco)
				})
				this.selectedRows.push(letter)
			}
		},

		toggleColumn: function(number) {
			const pocosColumn = this.pocos.filter(
				(item) => item.nome == item.nome[0] + number
			)

			const selectedColumnIndex = this.selectedColumns.indexOf(number)

			if (selectedColumnIndex > -1) {
				pocosColumn.forEach((poco) => {
					this.unselect(poco)
				})
				this.selectedColumns.splice(selectedColumnIndex, 1)
			} else {
				pocosColumn.forEach((poco) => {
					this.select(poco)
				})
				this.selectedColumns.push(number)
			}
		},
	},
}
</script>

<style scoped>
.placa {
	display: flex;
	flex-wrap: wrap;
	width: 795px;
	margin: -3px -3px 0;
}
.poco {
	border: 1px solid #ddd;
	border-radius: 50%;
	text-align: center;
	width: 60px;
	height: 60px;
	line-height: 60px;
	font-size: 16px;
	margin: 3px;
	background: #fff;
	cursor: pointer;
	transition: color 0.3s, background-color 0.3s, border-color 0.3s;
}

.poco.hasMetadado {
	background: #ddd;
}

.poco.selected {
	background: #52b1d6;
	border-color: #52b1d6;
	color: #fff;
}

.poco:hover {
	border-color: #aaa;
}
.tooltip-inner ul {
	padding: 0;
	margin: 0;
	list-style: none;
	text-align: left;
}

.tooltip-inner li {
	padding: 6px 0;
	line-height: 1.2;
	font-size: 14px;
}

.tooltip-inner li .valor {
	color: #9cfeff;
}

.tooltip-inner li + li {
	border-top: 1px solid #222;
}

.placa-actions button {
	flex: 1;
	background: #f5f5f5;
	border: none;
	font-size: 13px;
	color: #aaa;
	border-radius: 3px;
	text-decoration: none;
	outline: none;
	font-weight: bold;
	position: relative;
}

.placa-actions button::after {
	width: 0;
	height: 0;
	content: "";
	position: absolute;
	opacity: 0;
}

.placa-actions button:hover::after {
	opacity: 1;
}

.placa-actions button:hover {
	background: #ccc;
	color: #555;
}
.placa-actions button.selected {
	background: #52b1d6;
	color: #fff;
}

.placa-columns {
	display: flex;
	width: 100%;
	margin-bottom: 10px;
}
.placa-columns button {
	padding: 8px;
	margin: 0 1px;
}

.placa-columns button::after {
	border-left: 10px solid transparent;
	border-right: 10px solid transparent;
	border-top: 10px solid #ccc;
	left: 50%;
	top: 100%;
	margin-left: -10px;
	margin-top: -2px;
}
.placa-columns button.selected::after {
	border-top-color: #52b1d6;
}

.placa-rows {
	display: flex;
	flex-direction: column;
	margin-top: 43px;
	margin-right: 10px;
}

.placa-rows button.selected::after {
	border-right-color: #52b1d6;
}

.placa-rows button::after {
	border-top: 10px solid transparent;
	border-bottom: 10px solid transparent;
	border-left: 10px solid #ccc;
	top: 50%;
	left: 100%;
	margin-left: -2px;
	margin-top: -10px;
}

.placa-rows button {
	padding: 10px;
	margin: 1px 0px;
}

.placa-rows button.selected::after {
	border-left-color: #52b1d6;
}

.placa-actions button:hover::before {
	position: absolute;
	content: "";
	background: #f1f1f1;
	z-index: -1;
}

.placa-rows button:hover::before {
	left: 100%;
	width: 800px;
	top: 0;
	bottom: 0;
}

.placa-columns button:hover::before {
	top: 100%;
	height: 540px;
	left: 0;
	right: 0;
}

.placa-wrapper {
	display: flex;
	flex-direction: row;
	overflow: hidden;
}
</style>
