import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { connect } from 'msdp'

import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css' // This line here

Vue.use(VueMaterial)

connect('ws://localhost:8888', store)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
