<template v-if="chartReady">
  <v-flex xs12>
    {{text}}
    <v-select v-if="headers" :items="headers" label="Select Header" solo v-on:change="updateValue"></v-select>
  </v-flex>
</template>

<script>

import { mapState, mapActions } from "vuex";


export default {
  name: "SelectMenu",
  props: ['value','text'],
  data() {
    return {
      selectedHeader: null,
      selectedValues: null,
      chartData: null,
      chartReady: false,
    };
  },
  methods: {
    updateValue: function(value) {
      console.log(value)
      this.$emit('input', value)
    },
  },
  computed: {
    ...mapActions(["addChartData", "addHeader", "parseData"]),
    ...mapState(["headers", "csvData","chartType"])
  }
};
</script>

<style lang="scss">
</style>
