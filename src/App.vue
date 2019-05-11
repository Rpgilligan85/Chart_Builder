<template>
  <v-app>
    <v-container>
    <v-layout row wrap>
      <v-flex sm2>
        <v-btn @click="onClick">Upload CSV</v-btn>
        <input id="hideInput" type="file" @change="loadFile($event.target.files)">
      </v-flex>
      <v-flex sm4>
        <v-select
          v-if="headers"
          :items="headers"
          label="Select Header"
          solo
          v-model="selectedHeader"
        ></v-select>
      </v-flex>
    </v-layout>

    <!-- <v-layout row>
      <v-flex>
        <ul v-if="selectedValues">
          <li 
            v-for="(item, key) in selectedValues"
            :key="key"
          >
          {{ item }}
          </li>
        </ul>
      </v-flex>
    </v-layout> -->

    <v-layout row>
      <v-flex v-if="chartReady">
        <Chart :key="selectedHeader" :title="selectedHeader" :data="chartData" :categories="headers" />
      </v-flex>
    </v-layout>
    </v-container>
  </v-app>
</template>

<script>
const d3 = require("d3");
import { mapActions, mapState } from 'vuex'
import dayjs from 'dayjs'
import Chart from './components/Chart'

export default {
  name: 'App',
  components: {
    Chart
  },
  data () {
    return {
      selectedHeader: null,
      selectedValues: null,
      chartData: null,
      chartReady: false
    }
  },
  methods: {
    loadFile: function(file) {
      this.$store.dispatch('loadCsv', file)
    },
    onClick: function() {
      document.getElementById('hideInput').click()
    },
    sortArr: function(arr) {
      arr.sort((a,b) => b-a)
    },
    parseData: function(val) {
        let data = d3.nest()
        .key(function(d) { return d[val]; })
        .rollup(function(v) { return v.length; })
        .entries(this.csvData);
        let arr = []
        for (let i = 0; i < data.length; i++) {
            arr.push({ name: data[i].key, data: [data[i].value] })
        }
        console.log(arr)
        this.chartReady = true
        this.chartData = arr
    },
    getKeys: function(val) {
      if(val === 'Date') {
        let values = [...new Set(this.csvData.map(item => new Date(item[val]).getTime()))].sort()
        for (let i = 0; i < values.length; i++) {
          values[i] = dayjs(values[i]).format('MM/DD/YYYY')
        }
        this.selectedValues = values
      } else {
        this.selectedValues  = [...new Set(this.csvData.map(item => item[val]))].sort()
      } 
    }
    
  },
  computed: {
    ...mapActions(['loadCsv', 'addHeader']),
    ...mapState(['headers','csvData']),
    
    
  },
  watch: {
    selectedHeader: function(val) {
      this.$store.dispatch('addHeader', val)
      this.parseData(val)
      //this.getKeys(val)
      
    }
  }
}
</script>
<style>

#hideInput {
  display: none;
}


</style>