<template>
	<div class="quadrantes component-content">
		<div class="content-head">
			<h1>Quadrantes</h1>
			<b-button @click="back()" variant="secondary">Voltar</b-button>
		</div>

		<b-alert show v-show="msg.text" :variant="msg.type">
			{{ msg.text }}
		</b-alert>

		<div class="extracao-quadrantes">
			<div class="quadrante">
				<DetalhesFrame
					quadrante="1"
					v-on:alerta="alerta"
				></DetalhesFrame>
			</div>
			<div class="quadrante">
				<DetalhesFrame
					quadrante="2"
					v-on:alerta="alerta"
				></DetalhesFrame>
			</div>
			<div class="quadrante">
				<DetalhesFrame
					quadrante="3"
					v-on:alerta="alerta"
				></DetalhesFrame>
			</div>
			<div class="quadrante">
				<DetalhesFrame
					quadrante="4"
					v-on:alerta="alerta"
				></DetalhesFrame>
			</div>
		</div>
	</div>
</template>

<script>
import DetalhesFrame from "./DetalhesQuadrante";

export default {
	name: "AnaliseDetalhes",
	components: { DetalhesFrame },

	methods: {
		alerta(msg) {
			this.msg = msg;
		},

		back() {
			this.$router.push(`/analise/${this.analiseCodigo}/`);
		}
	},

	data() {
		return {
			msg: {
				text: false,
				type: ""
			}
		};
	},

	created() {
		this.analiseCodigo = this.$route.params.analiseCodigo;
	}
};
</script>

<style scoped>
.extracao-quadrantes {
	display: flex;
}
.extracao-quadrantes > div {
	flex: 1;
}
.extracao-quadrantes > div > div {
	display: inline-block;
	text-align: left;
}
.component-content {
	margin-bottom: 50px;
}
.content-head {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 20px;
}
</style>
