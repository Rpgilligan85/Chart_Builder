<template >
  <v-flex sm4>
    <v-select :items="chartTypes" label="Select Chart Type" solo v-model="selectedChart"></v-select>
  </v-flex>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
    name: 'ChartType',
    data () {
      return {
        chartTypes: ['column', 'pie'],
        selectedChart: null
      }
  },
  computed: {
    ...mapActions(["addChartType", "parseData"]),
    ...mapState(["selectedHeader", "csvData"])
  },
  watch: {
    selectedChart: function(val) {
      this.$store.dispatch('addChartType', val)
      if (this.selectedHeader) {
        this.$store.dispatch("parseData",  {val:this.selectedHeader, type:val, data:this.csvData});
      }
    }
  }
}
</script>

<style lang="scss">

</style>
