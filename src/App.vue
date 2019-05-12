<template>
  <v-app>
    <v-container>
      <v-layout row wrap>
        <v-flex sm2>
          <v-btn @click="onClick">Upload CSV</v-btn>
          <input id="hideInput" type="file" @change="loadFile($event.target.files)">
        </v-flex>
        <SelectMenu/>
        <v-flex sm2>
          <v-btn v-if="chartData" @click.stop="drawer = !drawer">View Data</v-btn>
        </v-flex>
        <v-flex sm2>
          <v-btn v-if="chartData" @click.stop="chartDrawer = !chartDrawer">View Chart JSON</v-btn>
        </v-flex>
      </v-layout>
        <BarChart/>
    </v-container>

    <v-navigation-drawer v-model="drawer" absolute temporary right>
      <vue-json-pretty :data="chartData" :deep="2"/>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="chartDrawer" absolute temporary right>
      <vue-json-pretty :data="chartOptions" :deep="2"/>
    </v-navigation-drawer>

  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VueJsonPretty from 'vue-json-pretty'
import BarChart from "./components/BarChart";
import SelectMenu from "./components/SelectMenu";

export default {
  name: "App",
  components: {
    BarChart,
    SelectMenu,
    VueJsonPretty
  },
  data() {
    return {
      drawer: false,
      chartDrawer: false
    };
  },
  methods: {
    loadFile: function(file) {
      this.$store.dispatch("loadCsv", file);
    },
    onClick: function() {
      document.getElementById("hideInput").click();
    }
  },
  computed: {
    ...mapActions(["loadCsv"]),
    ...mapState(["chartData","chartOptions"])
  }
};
</script>
<style>
#hideInput {
  display: none;
}
</style>