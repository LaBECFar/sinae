<template>
    <header id="header" style="min-height:75px">
        <div class="float-left logo-container"><em>SINAE</em></div>        
        <b-button style="margin-right:10px" class="float-right" @click="logout()" variant="light">
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
    border-bottom: 15px solid #e5e5e5;
    padding-top: 5px;
    padding-left: 10px;
    color: #fff;
}
</style>
