<template>
    <header id="header" style="min-height:70px">
        <div class="logo-container">
            <img src="../../assets/logo-white.png" width="auto" height="50" />
        </div>
        <b-button @click="logout()" variant="light">
            <v-icon style="font-weight: bolder" name="x"></v-icon>
        </b-button>
    </header>
</template>

<script>
import { apiUsuario } from "../user/api";

export default {
    name: "DashboardHeader",
    methods: {
        logout() {
            apiUsuario.logout();
            this.$router.push("/#/login");
        }
    }
};
</script>

<style scoped>
.logo-container {
    font-size: 40px;
}
#header {
    background-color: #2c3e50;
    border-bottom: 5px solid #e5e5e5;
    padding: 0 20px;
    color: #fff;
    display:flex;
    align-items: center;
    justify-content: space-between;
}

#header img { display:block;}
</style>
