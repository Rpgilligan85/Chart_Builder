<template>
<div>
  <v-checkbox
      v-model="stacked"
      v-if="selectedHeader[1]"
      :label="`Stacked = ${stacked.toString()}`"
    ></v-checkbox>
        <highcharts id="chart_height" :options="chartOptions()" ref="highcharts"></highcharts>
</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
const d3 = require("d3");

export default {
  name: "BarChart",
  data() {
    return {
      chartReady: false,
      stacked: false
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
          type: this.chartType,
          isDirtyBox: true
        },
        title: {
          text: 'Bar Chart'
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
    },
    stacked: function(val) {
      val ? this.stacked = 'normal' : this.stacked = '';
    }
  },
  mounted() {
    this.$store.dispatch("addChartOptions", this.chartOptions());
  }
};
</script>

<style lang="scss">

</style>
