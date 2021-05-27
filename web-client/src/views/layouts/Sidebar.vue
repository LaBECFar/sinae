<template>
	<aside class="main-sidebar">
		<section class="sidebar">
			<ul class="menu">
				<li>
					<router-link to="/">
						<v-icon name="home"></v-icon>
						Painel
					</router-link>
				</li>
				<li>
					<v-icon name="layers"></v-icon>
					Experimentos
					<ul class="sub-menu">
						<li>
							<router-link to="/experimento">
								- Listar
							</router-link>
						</li>
						<li>
							<router-link to="/experimento/Novo">
								- Novo
							</router-link>
						</li>
					</ul>
				</li>
				<li>
					<v-icon name="tag"></v-icon>
					Metadados
					<ul class="sub-menu">
						<li>
							<router-link to="/tipo-metadado">
								- Tipos
							</router-link>
						</li>
						<li>
							<router-link to="/placa">
								- Placas
							</router-link>
						</li>
					</ul>
				</li>

				<li v-if="isAdmin">
					<v-icon name="users"></v-icon>
					Usuários
					<ul class="sub-menu">
						<li>
							<router-link to="/user">- Listar</router-link>
						</li>
						<li>
							<router-link to="/user/Novo">- Novo</router-link>
						</li>
					</ul>
				</li>
				<li>
					<router-link :to="{ path: '/user/' + userId + '/Editar' }">
						<v-icon name="user"></v-icon>
						Meu Perfil
					</router-link>
				</li>
				<li v-if="isAdmin">
					<router-link :to="{ path: '/settings/' }">
						<v-icon name="globe"></v-icon>
						Configurações
					</router-link>
				</li>
				<hr />
				
				<li>
					<a
						target="_blank"
						href="https://github.com/LaBECFar/sinae"
					>
						<v-icon name="github"></v-icon>
						Github
					</a>
				</li>
			</ul>
		</section>
	</aside>
</template>

<script>
export default {
	name: "Sidebar",
	data() {
		return {
			isAdmin: localStorage.getItem("isAdmin"),
			userId: localStorage.getItem("userid")
		};
	}
};
</script>

<style scoped>
.creditos {
	display: flex;
	justify-content: space-between;
}
.main-sidebar {
	background-color: #f5f5f5;
	min-height: 100vh;
	height: 100%;
	min-width: 200px;
	padding: 20px;
}

ul {
	width: 100%;
	list-style-type: none;
	text-align: left;
	margin: 0px;
	padding: 0px;
	list-style: none;
}

.sub-menu {
	padding-left: 40px;
}

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
