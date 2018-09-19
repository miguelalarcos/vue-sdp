import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { connect } from './sdp'

import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)

connect('ws://localhost:8888', store)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
