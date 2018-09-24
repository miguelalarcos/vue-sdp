<template>
  <div v-if="$subsReady()">
    <h1>{{ msg }}</h1>
    <div class="pointer" @click="inc(c.id, c.x+1)" v-bind:key="c.id" v-for="c in myCounters">
      {{ c.x }}
    </div>  
    <button @click="suma">2 + 3 = </button>
    <span>{{valor}}</span>
    <date-picker v-model="date"></date-picker>
    <float-input v-model="x" v-validate="{ regex: /^[-+]?[0-9]*\.?[0-9]*$/ }" name="myinput"></float-input>
    <span>{{ errors.first('myinput') }}</span>
    <button @click="create_X()" :disabled="errors.any()">create_X</button>
    <md-datepicker v-model="selectedDate" />
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { SDP_Mixin } from 'msdp'
import DatePicker from './DatePicker.vue'
import FloatInput from './FloatInput.vue'

export default {
  name: 'HelloWorld',
  mixins: [SDP_Mixin],
  components: {
    DatePicker,
    FloatInput
  },
  data(){
    return {
      valor: 0,
      max: 5
    }
  },
  props: {
    msg: String
  },
  methods: {
    async create_X(){
      await this.$rpc('create_X', {x: this.$store.state.x})
    },
    async suma(){
      this.valor = await this.$rpc('add', {a: 2, b: 3})
    },
    async inc(id, value){
      this.$rpc('set_x', {id, value})
    }
  },
  created(){
    this.$sub('x_less_than', {max: this.max})
  },
  computed: {
    ...mapFields([
      'form.x',
      'form.date',
      'form.selectedDate'
    ]),
    maxChange(){
      return this.max
    },
    myCounters(){
      return this.$store.state.sdp.subs.x_less_than
    }
  },
  watch: {
    maxChange(max){
      this.$sub('x_less_than', {max})
    }
  }
} 
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.pointer{
  cursor: pointer;
}
</style>
