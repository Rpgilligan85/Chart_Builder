<template v-if="chartReady">
  <v-flex sm4>
    <v-select v-if="headers" :items="headers" label="Select Header" solo v-model="selectedHeader"></v-select>
  </v-flex>
</template>

<script>
const d3 = require("d3");
import { mapState, mapActions } from "vuex";


export default {
  name: "SelectMenu",

  data() {
    return {
      selectedHeader: null,
      selectedValues: null,
      chartData: null,
      chartReady: false,
    };
  },
  methods: {
    sortArr: function(arr) {
      arr.sort((a, b) => b - a);
    },
    parseData: function(val) {
      let data = d3
        .nest()
        .key(function(d) {
          return d[val];
        })
        .rollup(function(v) {
          return v.length;
        })
        .entries(this.csvData);
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({ name: data[i].key, data: [data[i].value] });
      }
      console.log(arr);
      this.chartReady = true;
      this.$store.dispatch("addChartData", arr);
    },
    getKeys: function(val) {
      if (val === "Date") {
        let values = [
          ...new Set(this.csvData.map(item => new Date(item[val]).getTime()))
        ].sort();
        for (let i = 0; i < values.length; i++) {
          values[i] = dayjs(values[i]).format("MM/DD/YYYY");
        }
        this.selectedValues = values;
      } else {
        this.selectedValues = [
          ...new Set(this.csvData.map(item => item[val]))
        ].sort();
      }
    }
  },
  computed: {
    ...mapActions(["addChartData", "addHeader"]),
    ...mapState(["headers", "csvData",])
  },
  watch: {
    selectedHeader: function(val) {
      this.$store.dispatch("addHeader", val);
      this.parseData(val);
    }
  }
};
</script>

<style lang="scss">
</style>
