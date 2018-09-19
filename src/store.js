import Vue from 'vue'
import Vuex from 'vuex'
import { moduleSocket } from './socketModule'
import { getField, updateField } from 'vuex-map-fields'
Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    sdp: moduleSocket,
  },
  state: {
    form: {
      x: ''
    }
  },
  getters: {
    getField,
  },
  mutations: {
    updateField,
  }
})

