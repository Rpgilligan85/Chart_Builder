<template>
  <v-app dark>
    <v-toolbar>
      <v-toolbar-title>ATC Dynamic Chart Builder</v-toolbar-title>
    </v-toolbar>
    <v-container fluid class="fullWidthContainer">

      <v-layout row wrap>
        <v-flex class="uploadContainer">
          <v-card flat height="100px">
            <v-container>
              <v-layout row align-center justify-center>
                  <span class="uploadText">Choose a CSV file to start generating your chart!</span>
                  <v-btn @click="onClick">Upload CSV</v-btn>
                  <input id="hideInput" type="file" @change="loadFile($event.target.files)">
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex>
          <v-container fluid class="fullWidthContainer">
            <v-layout class="charts-container" align-center justify-center>
              <v-img class="chart-image" contain src="images/bar-chart.svg" width="100px"></v-img>
              <v-img class="chart-image" contain src="images/pie-chart.svg" width="100px"></v-img>
              <v-img class="chart-image" contain src="images/line-chart.svg" width="100px"></v-img>
            </v-layout>
          </v-container>
        <v-card>
        <!-- <ChartType v-if="chooseChart" /> 
        <SelectMenu v-if="loadChart" v-model="selectedHeader[0]"/>
        <SelectMenu v-if="loadChart && chartType != 'pie'" v-model="selectedHeader[1]"/> -->
        </v-card>
        </v-flex>
      </v-layout>
        
        <component :key="selectedHeader[1]" v-if="chartData" :is="chartComp" />
        <v-flex sm2>
          <v-btn v-if="chartData" @click.stop="drawer = !drawer">View Data</v-btn>
        </v-flex>
        <v-flex sm2>
          <v-btn v-if="chartData" @click.stop="chartDrawer = !chartDrawer">View Chart JSON</v-btn>
        </v-flex>

    <v-navigation-drawer v-model="drawer" absolute temporary right>
      <vue-json-pretty :data="chartData" :deep="4"/>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="chartDrawer" absolute temporary right>
      <vue-json-pretty :data="chartOptions" :deep="4"/>
    </v-navigation-drawer>
    </v-container>

  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VueJsonPretty from 'vue-json-pretty'
import ChartType from "./components/ChartType";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import SelectMenu from "./components/SelectMenu";
import LineChart from "./components/LineChart";

export default {
  name: "App",
  components: {
    BarChart,
    PieChart,
    ChartType,
    SelectMenu,
    LineChart,
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
      if(this.chartType === 'column') {
        this.chartComp = 'BarChart'
      } else if (this.chartType === 'pie') {
        this.chartComp = 'PieChart'
      } else if (this.chartType === 'line') {
        this.chartComp = 'LineChart'
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
      console.log('FALSE',val);
      this.$store.dispatch("addHeader", val);
      this.$store.dispatch("parseData",  {val:val, type:this.chartType, data:this.csvData});
    },
    
  }
};
</script>
<style lang="scss">

#hideInput {
  display: none;
}

.fullWidthContainer {
  width: 100%;
  max-width: 100%;
  padding: 0;
}

.chart-image {
  margin: 20px;
  max-width: 200px;
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
}

.charts-container {
  background: rgb(83, 83, 83);
  padding: 40px 0;
}

.uploadContainer {
  height: 100px;
}
.uploadText {
  font-size: 18px;
  padding-right: 20px;
}
</style>