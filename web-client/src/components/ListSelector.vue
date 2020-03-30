<template>
	<ul class="list-selector">
		<li
			v-for="(item, index) in items"
			:key="index"
			v-on:click="select(item)"
		>
			{{ item[itemTitle] }}
		</li>
	</ul>
</template>

<script>
export default {
	props: ["items", "itemTitle"],

	methods: {
		select(item) {
			this.$emit("select", item);
		}
	}
};
</script>

<style scoped>
ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

li {
	padding: 10px 20px;
	transition: background-color 0.3s;
	cursor: pointer;
}

li + li {
	border-top: 1px solid #ddd;
}

li:nth-child(even) {
	background: #f1f1f1;
}

li:hover {
	background: #ccc;
	border-color: #ccc;
}
</style>
