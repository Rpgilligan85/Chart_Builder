<template>
<div>
  <v-layout row>
    <v-flex>
      <highcharts v-if="chartData[0].date" :options="chartOptions()" :constructor-type="'stockChart'" ref="lineChart"></highcharts>
      <highcharts v-else :options="chartOptions()" ref="lineChart"></highcharts>
    </v-flex>
  </v-layout>
</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
const d3 = require("d3");

export default {
  name: "LineChart",
  data() {
    return {
      chartReady: false,
    };
  },
  computed: {
    ...mapState(["chartType", "chartData", "chartCategories", "selectedHeader", "csvData"]),
    ...mapActions(["addChartOptions"])
  },
  methods: {
    chartOptions: function() {
      return {
        chart: {
          type: this.chartType
        },
        title: {
          text: 'Line Chart'
        },
        xAxis: {
          categories: this.chartCategories
        },
        plotOptions: {
          column: {
              stacking: this.stacked,
              dataLabels: {
                  enabled: true,
                  color: 'white'
              }
          }
      },
        series: this.chartData
      };
    }
  },
  watch: {
    chartData: function() {
      console.log(this.chartOptions());
      this.$store.dispatch("addChartOptions", this.chartOptions());
    }
  },
  mounted() {
    this.$store.dispatch("addChartOptions", this.chartOptions());
  }
};
</script>

<style lang="scss">
</style>
