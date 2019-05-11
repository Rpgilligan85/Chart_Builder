import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    csvData: null,
    headers: null
  },
  mutations: {
    setCsvData(state,data) {
      state.csvData = data
    },
    setHeaders(state,data) {
      state.headers = data
    }
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
  }
  }
})
