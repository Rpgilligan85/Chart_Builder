<template v-if="chartReady">
  <v-flex sm4>
    <v-select v-if="headers" :items="headers" label="Select Header" solo v-on:change="updateValue"></v-select>
  </v-flex>
</template>

<script>

import { mapState, mapActions } from "vuex";


export default {
  name: "SelectMenu",
  props: ['value'],
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
    updateValue: function(value) {
      console.log(value)
      this.$emit('input', value)
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
    ...mapActions(["addChartData", "addHeader", "parseData"]),
    ...mapState(["headers", "csvData","chartType"])
  }
};
</script>

<style lang="scss">
</style>
