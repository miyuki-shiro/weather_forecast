import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import VueRouter from 'vue-router'
import Dashboard from './components/Dashboard.vue';

Vue.config.productionTip = false

const routes = [ { path: '/', component: Dashboard }, ]
const router = new VueRouter({ mode: 'history', routes })

Vue.use(Buefy)
Vue.use(VueRouter)

new Vue({
  router,
  render: h => h(Dashboard),
}).$mount('#app')