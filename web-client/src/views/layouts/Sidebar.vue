<template>
    <aside class="main-sidebar">
		<section class="sidebar">
			<ul class="menu">
				<li>
					<router-link to="/"><v-icon name="home"></v-icon>Home</router-link>
				</li>
				<li>
					<v-icon name="layers"></v-icon>Experimentos
					<ul class="sub-menu">
						<li>
							<router-link to="/experimento">- Listar</router-link>
						</li>
						<li>
							<router-link to="/experimento/Novo">- Novo</router-link>
						</li>
					</ul>
				</li>           
				<hr/>
				<li>
					<a target="_blank" href="https://github.com/anselmobattisti/sinae"><v-icon name="github"></v-icon> Github</a>
				</li>
			</ul>
		</section>
    </aside>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style scoped>
.main-sidebar {
	background-color: #f5f5f5;
    min-height: 100vh;
    height: 100%;
    min-width: 280px;
	padding:20px;
	
}


ul {
    width: 100%;
    list-style-type: none;
    text-align: left;
    margin: 0px;
    padding: 0px;
	list-style: none;
}

.sub-menu {padding-left: 40px;}

.menu li {
    width: 100%;
    padding: 5px;
}

.menu li a {
    padding: 0px;
}

.menu li a:hover {
    text-decoration: none;
    font-weight: bold;
}

.menu li:hover {
    background-color: #ccc;
}

.menu svg {
    margin-right: 10px;
}
</style>