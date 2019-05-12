<template v-if="chartReady">
    <highcharts :options="chartOptions" ref="highcharts"></highcharts>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
const d3 = require("d3");

export default {
    name: 'Chart',
    props:['title', 'data', 'categories'],
    data() {
        return {
            chartReady: false,
            chartOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: this.title
                },
                xAxis: {
                    categories: this.categories
                },
                series: this.data
            },
        }
    },
    computed: {
        ...mapState(['csvData','selectedHeader']),
        ...mapGetters(['getheaders']),
        ...mapActions(['addChartOptions'])
    },
    methods: {
    },
    watch: {
    },
    mounted() {
        console.log(this.chartOptions)
        this.$store.dispatch('addChartOptions', this.chartOptions)
    }
}
</script>

<style lang="scss">

</style>
