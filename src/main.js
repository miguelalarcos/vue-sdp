import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { connect } from './sdp'
connect('ws://localhost:8888/ws', store)
//import VueNativeSock from 'vue-native-websocket'
//import { SDP } from './sdp'

//Vue.use(VueNativeSock, 'ws://localhost:8888/ws', {store})
//Vue.use(SDP)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
