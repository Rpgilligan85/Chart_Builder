<template>
  <v-app>
    <v-container>
      <v-layout row wrap>
        <v-flex sm2>
          <v-btn @click="onClick">Upload CSV</v-btn>
          <input id="hideInput" type="file" @change="loadFile($event.target.files)">
        </v-flex>
        <ChartType v-if="chooseChart"/>
        <SelectMenu v-if="loadChart" v-model="selectedHeader[0]"/>
        <SelectMenu v-if="loadChart" v-model="selectedHeader[1]"/>
        <v-checkbox
          v-model="stacked"
          v-if="selectedHeader[1]"
          :label="`Stacked = ${stacked.toString()}`"
        ></v-checkbox>
      </v-layout>
        <component :key="selectedHeader[0]" v-if="chartData" :is="chartComp" :stacked="toggleStack" />
        <v-flex sm2>
          <v-btn v-if="chartData" @click.stop="drawer = !drawer">View Data</v-btn>
        </v-flex>
        <v-flex sm2>
          <v-btn v-if="chartData" @click.stop="chartDrawer = !chartDrawer">View Chart JSON</v-btn>
        </v-flex>
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
import ChartType from "./components/ChartType";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import SelectMenu from "./components/SelectMenu";

export default {
  name: "App",
  components: {
    BarChart,
    PieChart,
    ChartType,
    SelectMenu,
    VueJsonPretty
  },
  data() {
    return {
      drawer: false,
      chartDrawer: false,
      loadChart: false,
      chartComp: null,
      chooseChart: false,
      selectedHeader: [],
      stacked: false,
      toggleStack: ''
    };
  },
  methods: {
    loadFile: function(file) {
      this.$store.dispatch("loadCsv", file);
      this.chooseChart = true
    },
    onClick: function() {
      document.getElementById("hideInput").click();
    },
    getChartType: function() {
      if(this.chartType === 'column' || this.chartType === 'line') {
        console.log('BarChart')
        this.chartComp = 'BarChart'
      } else if (this.chartType === 'pie') {
        console.log('PieChart')
        this.chartComp = 'PieChart'
      }
      this.loadChart = true
    }
  },
  computed: {
    ...mapActions(["loadCsv", 'addHeader', 'parseData']),
    ...mapState(["chartData","chartOptions","chartType",'csvData']),

    
  },
  watch: {
    chartType: function() {
      this.getChartType()
    },
    selectedHeader: function(val) {
      this.$store.dispatch("addHeader", val);
      this.$store.dispatch("parseData",  {val:val, type:this.chartType, data:this.csvData});
    },
    stacked: function(val) {
      val ? this.toggleStack = 'normal' : this.toggleStack = '';
    }
  }
};
</script>
<style>
#hideInput {
  display: none;
}
</style>