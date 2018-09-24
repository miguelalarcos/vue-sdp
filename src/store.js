import Vue from 'vue'
import Vuex from 'vuex'
import { moduleSocket } from 'msdp'
import { getField, updateField } from 'vuex-map-fields'
Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    sdp: moduleSocket,
  },
  state: {
    form: {
      x: '',
      selectedDate: null,
      date: {
        month: 1,
        year: 2017
      }
    }
  },
  getters: {
    getField,
  },
  mutations: {
    updateField,
  }
})

