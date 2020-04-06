<template>
	<div class="placa" v-if="pocos && pocos.length > 0">
		<div
			v-bind:class="{
				poco: true,
				selected:
					selected.findIndex((item) => poco.nome == item.nome) >= 0,
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
					<li v-for="(metadado, li) in poco.metadados" :key="li">
						{{ metadado.nome }}
					</li>
				</ul>
			</b-tooltip>
		</div>
	</div>
</template>

<script>
export default {
	props: ["pocos", "selected"],

	methods: {
		toggle: function (poco) {
			let index = this.selected.findIndex(
				(item) => item.nome == poco.nome
			)

			if (index < 0) {
				this.selected.push(poco)
			} else {
				this.selected.splice(index, 1)
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
}

.tooltip-inner li {
	padding: 6px 0;
	line-height: 1.2;
	font-size: 14px;
}

.tooltip-inner li + li {
	border-top: 1px solid #222;
}
</style>
