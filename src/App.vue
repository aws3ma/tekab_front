<template>
  <div>
    <PersonsList/>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import PersonsList from "./components/PersonsList.vue";

@Options({
  components: {PersonsList},
})
export default class App extends Vue {}
</script>

<style></style>
