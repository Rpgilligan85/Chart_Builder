<template >
<div>
    <v-layout row>
      <v-flex v-if="chartData">
        <Chart :key="selectedHeader" :title="selectedHeader" :data="chartData" :categories="headers" />
      </v-flex>
    </v-layout>

</div>
</template>

<script>
import { mapState } from 'vuex'
import Chart from './Chart'

export default {
    name: 'BarChart',
    components: {
      Chart
    },
    data () {
      return {
      }
  },
  computed: {
    ...mapState(['chartData', 'selectedHeader', 'headers']),
  }
}
</script>

<style lang="scss">

</style>
