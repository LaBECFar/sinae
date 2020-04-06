<template>
	<div
		class="metadados"
		:class="{ hasChild: poco.metadados && poco.metadados.length > 0 }"
	>
		<div
			v-for="(campo, index) in poco.metadados"
			:key="index"
			class="metadado"
			v-on:click="removeMetadado(poco.nome, campo.nome)"
			title="Remover Metadado"
		>
			<strong>{{ campo.nome }}:</strong>
			{{ campo.valor }}
		</div>
	</div>
</template>

<script>
export default {
	props: ["poco"],

	methods: {
		removeMetadado(pocoNome, metadadoNome) {
			this.$emit('remove', {pocoNome, metadadoNome})
		}
	}
};
</script>

<style scoped>
.metadados {
	display: flex;
	flex-wrap: wrap;
	padding: 0;
}

.metadados.hasChild {
	padding: 10px 10px 0;
}

.metadado {
	font-size: 13px;
	background: #fff;
	padding: 8px 11px;
	line-height: 1;
	background: #ddd;
	border-radius: 20px;
	color: #222;
	margin: 0 6px 10px 0px;
	position: relative;
}

.metadado:hover {
	background-color: #ffa3a3;
	color: #9c0606;
	cursor: pointer;
}

.metadado:hover:before {
	content: "x";
	position: absolute;
	right: 0;
	top: -5px;
	background: #ffa3a3;
	padding: 1px 4px;
	border-radius: 50%;
}
</style>
