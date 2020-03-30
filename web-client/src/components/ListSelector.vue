<template>
	<div>
		<ul class="list-selector" v-show="items.length > 0">
			<li
				v-for="(item, index) in items"
				:key="index"
				v-on:click="select(item)"
			>
				{{ item[itemTitle] }}
			</li>
		</ul>
		<p class="empty-list" v-show="items.length <= 0">
			{{ emptyText }}
			<b-button
				size="sm"
				variant="secondary"
				v-on:click="emptyAction"
				v-show="emptyAction"
			>
				{{ emptyActionText || "Adicionar" }}
			</b-button>
		</p>
	</div>
</template>

<script>
export default {
	props: ["items", "itemTitle", "empty", "emptyAction", "emptyActionText"],

	methods: {
		select(item) {
			this.$emit("select", item);
		}
	},

	data() {
		return {
			emptyText: this.empty || "Nenhum item na lista"
		};
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
.empty-list {
	color: #888;
	text-align: center;
	margin: 0;
	padding: 30px 20px;
	font-size: 18px;
}
.empty-list .btn {
	margin-top: 15px;
}
</style>
