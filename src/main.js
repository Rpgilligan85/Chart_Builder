import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'

stockInit(Highcharts)
Vue.config.productionTip = false
Vue.use(HighchartsVue)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
