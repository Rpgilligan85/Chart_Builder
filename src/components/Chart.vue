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
    },
    watch: {
    }
}
</script>

<style lang="scss">

</style>
