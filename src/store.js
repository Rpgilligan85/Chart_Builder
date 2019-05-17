import Vue from 'vue'
import Vuex from 'vuex'
import dayjs from 'dayjs'
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
      };
      reader.readAsText(file)
  },
  parseData: function(context, obj) {
    if(obj.val.length <= 1 && this.chartType === 'column') {
      this.dispatch('parseSingleData', obj)
    } else if (obj.val.length >=2 && dayjs(obj.data[0][obj.val[1]]).$D) {
      this.dispatch('parseDoubleDateData', obj)
    } else if (obj.val.length >=2) {
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
    this.chartReady = true;
    this.commit('setChartData', arr)
  },
  parseDoubleDateData: function(context,obj) {
    let data = d3
      .nest()
      .key(function(d) {
        return d[obj.val[0]];
      })
      .key(function(d) {
        return new Date(d[obj.val[1]]).getTime();
      })
      .rollup(function(v) {
        return v.length;
      })
      .entries(obj.data);
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({ name: data[i].key, data: [], date:true })
        for (let k = 0; k < data[i].values.length; k++) {
          arr[i].data.push([Number(data[i].values[k].key),data[i].values[k].value])
        }
      }
      for (let j = 0; j < arr.length; j++) {        
        arr[j].data.sort(function(a,b){
          return a[0] - b[0]
        })
      }
      console.log('ARR',arr);
    this.commit('setChartData', arr)
  },
  parseDoubleData: function(context,obj) {
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
