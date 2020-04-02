<template>
	<div>
		<div class="search-box" v-show="list.items.length > 10">
			<input
				type="text"
				placeholder="Pesquisar"
				class="search"
				v-model="search"
			/>
		</div>

		<ul class="list-selector" v-show="list.items.length > 0">
			<li
				v-for="(item, index) in list.items"
				:key="index"
				v-on:click="select(item)"
				v-show="item[list.itemTitle].toLowerCase().indexOf(search) > -1"
			>
				{{ item[list.itemTitle] }}
			</li>
		</ul>
		<p class="empty-list" v-show="list.items.length <= 0">
			{{ list.empty }}
			<b-button
				size="sm"
				variant="secondary"
				v-on:click="list.emptyAction"
				v-show="list.emptyAction"
			>
				{{ list.emptyActionText }}
			</b-button>
		</p>
	</div>
</template>

<script>
export default {
	props: [
		"items",
		"itemTitle",
		"empty",
		"emptyAction",
		"emptyActionText",
		"model"
	],

	methods: {
		select(item) {
			this.$emit("select", item);
		}
	},

	computed: {
		list() {
			return (
				this.model || {
					items: this.items || [],
					itemTitle: this.itemTitle || "",
					empty: this.empty || "Nenhum item na lista",
					emptyAction: this.emptyAction || null,
					emptyActionText: this.emptyActionText || "Adicionar"
				}
			);
		}
	},

	data() {
		return {
			search: ""
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
	padding: 15px 20px;
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
.search-box {
	padding:10px;
	border-bottom:1px solid #ddd;
}
.search {
	display: block;
    font-family: inherit;
    background: #eee;
    padding: 12px 20px;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid #ddd;
    outline: none;
    border-radius: 30px;
    line-height: 1;
}
</style>
