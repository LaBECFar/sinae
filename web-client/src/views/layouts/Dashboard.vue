<template>
    <div class="h-100 dashboard">
        <DashboardHeader />
        <b-container fluid class="dash-container">
            <b-row>
                <b-col cols="2">
                    <Sidebar />
                </b-col>
                <b-col id="content">
                    <router-view />
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

export default {
    name: "Dashboard",
    components: {
        DashboardHeader,
        Sidebar
    }
};
</script>

<style>
html,
body {
    height: 100%;
    font-size: 130%;
}

#content {
    padding-top: 15px;
}

#app .dash-container {padding-left: 0;}

#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    min-height: 100%;
}

.v-icon,
.custom-icon {
    width: 20px;
}

label {
    font-weight: bold;
}
</style>
