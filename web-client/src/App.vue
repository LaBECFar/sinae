<template>
	<div id="app" class="h-100">
		<router-view />
	</div>
</template>

<style>
html,
body {
	height: 100%;
	font-size: 100%;
}

body.modal-open {
	padding: 0 !important;
}

#content {
	padding-top: 15px;
}

.subMenu {
	padding-left: 50px !important;
}

#head {
	background-color: #2c3e50;
	border-bottom: 15px solid #e5e5e5;
	padding-top: 5px;
	padding-left: 10px;
	color: #fff;
}

#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	width: 100%;
	min-height: 100%;
}

#menu {
	background-color: #e5e5e5;
	min-height: 1024px;
	height: 100%;
	min-width: 280px;
	max-width: 280px;
}

#app #menu ul {
	width: 100%;
	list-style-type: none;
	text-align: left;
	margin: 0px;
	padding: 0px;
}

#app #menu li {
	width: 100%;
	padding: 5px;
}

#app #menu li a {
	padding: 0px;
}

#app #menu li a:hover {
	text-decoration: none;
	font-weight: bold;
}

#app #menu li:hover {
	background-color: #ccc;
}

#app #menu svg {
	margin-right: 10px;
}

.v-icon,
.custom-icon {
	width: 20px;
}

label {
	font-weight: bold;
}
</style>
