<template v-if="chartReady">
    <highcharts :options="chartOptions" ref="highcharts"></highcharts>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
const d3 = require("d3");

export default {
    name: 'Chart',
    props:['title', 'data'],
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
        ...mapGetters(['getheaders'])
    },
    methods: {
        addSeries: function(index) {
            console.log('add')
            let chart = this.$refs.highcharts.chart;
            for (let i = 0; i < this.data.length; i++) {
                chart.addSeries(this.data[i]);
            }
        },
        removeSeries: function() {
            console.log('remove')
            let chart = this.$refs.highcharts.chart;
            console.log(chart.series)
            for (let i = chart.series.length -1; i > -1; i--) {
                chart.series[i].remove(true)
            }
        },
        updateSeries: function() {
            this.removeSeries()
            this.addSeries()
        }
    },
    watch: {
        selectedHeader: function(){
            this.updateSeries()
        }
    }
}
</script>

<style lang="scss">

</style>
