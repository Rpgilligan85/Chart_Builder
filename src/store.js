import Vue from 'vue'
import Vuex from 'vuex'
const d3 = require("d3");
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    csvData: null,
    headers: null,
    selectedHeader: null,
    chartOptions: {},
    chartData: null,
    chartType: null,
    chartCategories: null
    
  },
  getters: {
    getheaders: state => state.headers
  },
  mutations: {
    setCsvData(state,data) {
      state.csvData = data
    },
    setHeaders(state,data) {
      state.headers = data
    },
    setSelectedHeader(state,data) {
      state.selectedHeader = data
    },
    setChartOptions(state,obj) {
      state.chartOptions = obj
    },
    setChartData(state,data) {
      state.chartData = data
    },
    setChartType(state,data) {
      state.chartType = data
    },
    setChartCategories(state,data) {
      state.chartCategories = data
    },
    
  },
  actions: {
    loadCsv: function(context,files) {
      const reader = new FileReader();
      const file = files[0];
      reader.onload = (e) => {
        const data = e.target.result
        let lines = data.split("\n");
        let result = [];
        let headers = lines[0].split(",");
        for(let i=1;i<lines.length;i++){
          let obj = {};
          let currentline=lines[i].split(",");
          for(let j=0;j<=headers.length;j++){
            obj[headers[j]] = currentline[j];
          }
          result.push(obj);
        }
        let final = JSON.stringify(result)
        this.commit('setCsvData',JSON.parse(final))
        this.commit('setHeaders',headers)
        console.log(JSON.parse(final))
      };
      reader.readAsText(file)
  },
  parseData: function(context, obj) {
    console.log('obj',obj);
    if(obj.val.length <= 1) {
      this.dispatch('parseSingleData', obj)
    } else {
      this.dispatch('parseDoubleData', obj)
    }
  },
  parseSingleData: function(context,obj) {
    let data = d3
      .nest()
      .key(function(d) {
        return d[obj.val[0]];
      })
      .rollup(function(v) {
        return v.length;
      })
      .entries(obj.data);
    let arr = [];
    
    for (let i = 0; i < data.length; i++) {
      obj.type === 'pie' ? arr.push({ name: data[i].key, y: data[i].value }) : arr.push({ name: data[i].key, data: [data[i].value] })
    }
    console.log(arr);
    this.chartReady = true;
    this.commit('setChartData', arr)
  },
  parseDoubleData: function(context,obj) {
    console.log('obj',obj);
    let data = d3
      .nest()
      .key(function(d) {
        return d[obj.val[0]];
      })
      .key(function(d) {
        return d[obj.val[1]];
      })
      .rollup(function(v) {
        return v.length;
      })
      .entries(obj.data);
      console.log('DATA',data);
      let arr = [];
      let cat = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({ name: data[i].key, data: [] })
        for (let k = 0; k < data[i].values.length; k++) {
          if(i === 0) {
            cat.push(data[0].values[k].key)
          }
          arr[i].data.push(data[i].values[k].value)
        }
      }
    console.log('arr',arr);
    console.log('cat',cat);

    this.chartReady = true;
    this.commit('setChartData', arr)
    this.commit('setChartCategories', cat)
  },
  addHeader: function(context, data) {
    this.commit('setSelectedHeader', data)
  },
  addChartOptions: function(context, obj) {
    this.commit('setChartOptions', obj)
  },
  addChartType: function(context, data) {
    this.commit('setChartType', data)
  }
}
})
