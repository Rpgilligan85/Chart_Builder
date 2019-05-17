<template>
  <v-layout row>
    <v-flex>
      <highcharts :options="chartOptions()" ref="highcharts"></highcharts>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
const d3 = require("d3");

export default {
  name: "PieChart",
  data() {
    return {
      chartReady: false
    };
  },
  computed: {
    ...mapState(["chartType", "chartData", "headers", "selectedHeader"]),
    ...mapActions(["addChartOptions"])
  },
  methods: {
    chartOptions: function() {
      return {
        chart: {
          type: this.chartType
        },
        title: {
          text: 'Pie Chart'
        },
        plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              }
          }
        },
        series: [{
          data: this.chartData
        }]
      };
    }
  },
  watch: {},
  mounted() {
    console.log(this.chartOptions());
    this.$store.dispatch("addChartOptions", this.chartOptions());
  }
};
</script>

<style lang="scss">
</style>
