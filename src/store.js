import Vue from 'vue'
import Vuex from 'vuex'
import { moduleSocket } from './socketModule'

Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    socket: moduleSocket,
  }
})

