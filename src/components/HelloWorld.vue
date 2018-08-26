<template>
  <div v-if="ready">
    <h1>{{ msg }}</h1>
    <button @click="color='red'">red</button>
    <div v-bind:key="c.id" v-for="c in myCars()">
      {{ c.matricula }}
    </div>  
  </div>
  <div v-else>
    <span>loading...</span>
  </div>
</template>

<script>
import { SDP_Mixin } from '../sdp'
let unsub = null

export default {
  name: 'HelloWorld',
  mixins: [SDP_Mixin],
  data(){
    return {
      color: 'blue'
    }
  },
  props: {
    msg: String
  },
  methods: {
    myCars(){
      return this.$store.state.sdp.collections.cars
    }
  },
  computed: {
    colorChange(){
      console.log('computed color change')
      return this.color
    },
    ready(){
      return this.$subsReady()
    }
  },
  watch: {
    colorChange(color){
      console.log('watch', color)
      unsub = this.$sub('cars_of_color', {color}, unsub)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
