<template>
	<div class="quadrante">
		<h3>Quadrante {{ quadrante }}</h3>
		<div
			v-bind:class="{
				poco: true,
				selected: selected.indexOf(poco) >= 0
			}"
			v-for="(poco, index) in pocos"
			v-on:click="toggle(poco)"
			:key="index"
		>
			{{ poco }}
		</div>
	</div>
</template>

<script>
export default {
	props: ["quadrante", "pocos", "selected"],

	methods: {
		toggle: function(poco) {
			let index = this.selected.indexOf(poco);
			if (index < 0) {
				this.selected.push(poco);
			} else {
				this.selected.splice(index, 1);
			}
		}
    }
};
</script>

<style scoped>
.quadrante {
	display: flex;
	flex-wrap: wrap;
	width: 250px;
	padding: 10px;
	border: 1px solid #ddd;
	margin: 0 2% 20px;
	justify-content: center;
}

.quadrante h3 {
	width: 100%;
	font-size: 16px;
	font-weight: bold;
	opacity: 0.9;
	text-align: center;
}
.poco {
	border: 1px solid #ddd;
	border-radius: 50%;
	text-align: center;
	width: 60px;
	height: 60px;
	line-height: 60px;
	font-size: 16px;
	margin: 5px;
	background: #fff;
	cursor: pointer;
	transition: color 0.3s, background-color 0.3s, border-color 0.3s;
}

.poco.selected {
	background: #52b1d6;
	border-color: #52b1d6;
	color: #fff;
}

.poco:hover {
	border-color: #aaa;
}
</style>