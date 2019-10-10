<template>
  <div id="app">
    <router-link :to="{name:'select-name'}">筛选器</router-link>
     <router-view/>
  </div>
</template>

<script>
import dataList from "@/mock/brands";
export default {
  name: "App",
};

</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}

</style>
