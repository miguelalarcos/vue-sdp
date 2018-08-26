import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueNativeSock from 'vue-native-websocket'
import { SDP } from './sdp'

Vue.use(VueNativeSock, 'ws://localhost:8888/ws')
Vue.use(SDP)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
