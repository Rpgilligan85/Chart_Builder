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
  name: "BarChart",
  props:['stacked'],
  data() {
    return {
      chartReady: false
    };
  },
  computed: {
    ...mapState(["chartType", "chartData", "chartCategories", "selectedHeader"]),
    ...mapActions(["addChartOptions"])
  },
  methods: {
    chartOptions: function() {
      return {
        chart: {
          type: this.chartType
        },
        title: {
          text: this.selectedHeader[0]
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
