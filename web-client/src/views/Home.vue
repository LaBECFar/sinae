<template>
    <div class="home">
        <h1>
            <v-icon style="width: 48px;" name="bar-chart"></v-icon>
            Dashboard
        </h1>

        <div class="ctas">
            <a class="card cta" href="/#/experimento">
                <v-icon style="width: 32px;" name="layers"></v-icon>
                <h2>Experimentos</h2>
            </a>

            <a class="card cta" href="/#/tipo-metadado">
                <v-icon style="width: 32px;" name="tag"></v-icon>
                <h2>Métadados</h2>
            </a>

            <a class="card cta" href="/#/placa">
                <v-icon style="width: 32px;" name="grid"></v-icon>
                <h2>Placas</h2>
            </a>

            <a v-if="isAdmin" class="card cta" href="/#/user">
                <v-icon style="width: 32px;" name="users"></v-icon>
                <h2>Usuários</h2>
            </a>

            
            <router-link class="card cta" :to="{ path: '/user/' + userId + '/Editar' }">
                <v-icon style="width: 32px;" name="users"></v-icon>
                <h2>Meu Perfil</h2>
            </router-link>

            <a v-if="isAdmin" class="card cta" href="/#/settings">
                <v-icon style="width: 32px;" name="globe"></v-icon>
                <h2>Configurações</h2>
            </a>
        </div>
        
        

        <div class="realizacao">
     
            <h4>Realização:</h4>
            <div class="creditos">
                <img src="../assets/labecfar.png" width="auto" height="200" />
                <img src="../assets/logo_rpt.svg"  width="auto" height="160"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "home",
    data() {
		return {
			isAdmin: localStorage.getItem("isAdmin"),
			userId: localStorage.getItem("userid")
		};
	}
};
</script>

<style scoped>
.ctas {
    display: flex; 
    flex-wrap: wrap;
    margin:20px -1% 0;
}
.cta {
    padding: 20px;
    margin: 0 1% 20px;
    text-align:center;
    display: block; 
    width: 23%;
    text-decoration: none;
    transition: background-color 0.5s;
}
.cta:hover {
    background-color: #eee;
    }
.cta h2 {padding: 0;
    margin: 10px 0 0;
    font-size: 18px;
    font-weight: normal;
}
.realizacao {
    margin-top: 10px;
    bottom: 20px;
    margin-bottom:20px;
    
}
.creditos { 
    display: flex;
    
}
.creditos img {
       margin-right: 20px;
    display: inline-block;
    object-fit: contain;
    width: 300px;
    height: 200px;
    border: 1px solid #ddd;
    padding: 10px 20px;
    border-radius: 2px;
} 
.realizacao h4 {margin-bottom: 10px; font-size: 20px;}
</style>