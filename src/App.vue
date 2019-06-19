<template>
  <v-app dark>
    <v-toolbar>
      <v-toolbar-title>ATC Dynamic Chart Builder</v-toolbar-title>
    </v-toolbar>
    <v-container fluid class="fullWidthContainer" fill-height>
    <v-layout column class="chartMenu" >
      
      <v-layout class="csvBtn" row>
        <v-card height="100px" flat width="100%">
          <v-container>
            <v-layout row align-center>
                <span class="uploadText">Choose a CSV file to start generating your chart!</span>
                <v-btn @click="onClick">Upload CSV</v-btn>
                <input id="hideInput" type="file" @change="loadFile($event.target.files)">
            </v-layout>
          </v-container>
        </v-card>
      </v-layout>

       <v-layout justify-center class="chartSelector" v-if="chooseChart" row>
        <v-img @click="updateChart('column')" class="chart-image" contain src="images/bar-chart.svg" width="100px"></v-img>
        <v-img @click="updateChart('pie')" class="chart-image" contain src="images/pie-chart.svg" width="100px"></v-img>
        <v-img @click="updateChart('line')" class="chart-image" contain src="images/line-chart.svg" width="100px"></v-img>
      </v-layout>

      <v-layout row class="chartGroupings">
        <v-flex d-flex xs12 class="chartGroupings">
            <SelectMenu :text="'Primary Grouping'" v-if="loadChart" v-model="selectedHeader[0]"/>
            <SelectMenu :text="'Secondary Grouping'" v-if="loadChart && chartType != 'pie'" v-model="selectedHeader[1]"/> 
        </v-flex>
      </v-layout>

      <v-layout justify-center align-end class="mb-5">
        <v-btn v-if="chartData" @click.stop="drawer = !drawer">View Data</v-btn>
        <v-btn v-if="chartData" @click.stop="chartDrawer = !chartDrawer">View Chart JSON</v-btn>
      </v-layout>

    </v-layout>

        <v-layout row wrap class="rightContainer">
          <v-flex xs12 class="chartContainer">
            <component :key="selectedHeader[1]" v-if="chartData" :is="chartComp" ref="chartComp"/>
          </v-flex>
          <v-flex xs12 v-if="chartData">
            <v-card class="colorOptions">
                <swatches v-if="updateColor" v-model="colors" />
              <p v-for="(item, key) in colorObj" :key="key">
                {{item.name}}: <span @click="openPicker(item.color,key)" :style="{color: item.color}">{{item.color }}</span>
              </p>
            </v-card>
          </v-flex>
        </v-layout>


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
import Highcharts from 'highcharts'
import {Swatches} from 'vue-color'

export default {
  name: "App",
  components: {
    BarChart,
    PieChart,
    ChartType,
    SelectMenu,
    LineChart,
    VueJsonPretty,
    Swatches
  },
  data() {
    return {
      drawer: false,
      chartDrawer: false,
      loadChart: false,
      chartComp: null,
      chooseChart: false,
      selectedHeader: [],
      chart: null,
      colors: '#333',
      updateColor: false,
      updatedColor: null,
      updatedColorKey: null,
      colorObj: null
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
    },
    updateChart(chart) {
      this.$store.dispatch('addChartType', chart)
    },
    colorList() {
      let chartCheck = Highcharts.charts.length > 0;
      let chart;
      if (chartCheck) {
        if(this.chartType === 'pie') {
          chart = this.$refs.chartComp.$refs.highcharts.chart.series[0].data
        } else {
          chart = this.$refs.chartComp.$refs.highcharts.chart.series
        }
        this.colorObj = chart;
      }
    },
    openPicker(color,key) {
      console.log('color',color,key);
      this.updateColor = true
      this.updatedColorKey = key
    },
    changeColor() {
      let chart = this.$refs.chartComp.$refs.highcharts.chart;
      let series;
      if(this.chartType === 'pie') {
        series = this.$refs.chartComp.$refs.highcharts.chart.series[0].data
      } else {
        series = this.$refs.chartComp.$refs.highcharts.chart.series
      }
      console.log('chart',chart);
      series[this.updatedColorKey].options.color = this.updatedColor;
      series[this.updatedColorKey].update(series[this.updatedColorKey].options, true);
    }
    
  },
  computed: {
    ...mapActions(["loadCsv", 'addHeader', 'parseData', 'addChartType']),
    ...mapState(["chartData","chartOptions","chartType",'csvData']),
  },
  watch: {
    chartType: function(val) {
      if(this.selectedHeader.length > 0) {
       this.$store.dispatch("parseData",  {val:this.selectedHeader, type:val, data:this.csvData});
      }
      this.getChartType()
    },
    selectedHeader: function(val) {
      this.colorList()
      this.$store.dispatch("addHeader", val);
      this.$store.dispatch("parseData",  {val:val, type:this.chartType, data:this.csvData});
    },

    colors: function(val) {
      console.log('COLORS',val);
      this.updatedColor = val.hex
      this.updateColor = false
      this.changeColor()
    }
    
  }
};
</script>
<style lang="scss">

html {
  overflow: hidden;
}

#hideInput {
  display: none;
}

.csvBtn {
  height: 100px;
  max-height: 100px;
}

.chartSelector {
  height: 200px;
  max-height: 200px;
}

.chartContainer {
  height: 50vh;
  max-height: 50vh;
  padding: 20px;
  width: 100%
}

#chart_height {
  height: 50vh;
}

.chartGroupings {
  height: 100px;
  max-height: 100px;
}

.chartMenu {
  width: 400px;
  max-width: 400px;
  background: #222;
}


.fullWidthContainer {
  width: 100%;
  max-width: 100%;
  padding: 0;
}

.chart-image {
  margin: 20px;
  max-width: 150px;
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
}

.charts-container {
  background: rgb(83, 83, 83);
  padding: 40px 0;
}

.colorOptions {
  width: 50%;
}

.uploadContainer {
  height: 100px;
}
.uploadText {
  font-size: 14px;
  padding-right: 20px;
}

.rightContainer {
  width: calc(100vw - 400px)
}

</style>