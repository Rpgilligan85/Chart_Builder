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

Highcharts.setOptions({
  colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
});

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
