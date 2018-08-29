# example of use

```html
<template>
  <div v-if="ready">
    <h1>{{ msg }}</h1>
    <button @click="color=color==='red'?'blue':'red'">red/blue</button>
    <div class="pointer" @click="changeColor(c.id, c.color==='red'?'blue':'red')" v-bind:key="c.id" v-for="c in myCars">
      {{ c.matricula }}
    </div>  
    <button @click="suma">2 + 3 = </button>
    <span>{{valor}}</span>
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
      color: 'red',
      valor: 0
    }
  },
  props: {
    msg: String
  },
  methods: {
    async suma(){
      this.valor = await this.$rpc('add', {a: 2, b: 3})
    },
    changeColor(id, color){
      this.$rpc('change_color', {id, color})
    }
  },
  created(){
    unsub = this.$sub('cars_of_color', {color: this.color}, null)
  },
  computed: {
    colorChange(){
      console.log('computed color change')
      return this.color
    },
    ready(){
      return this.$subsReady()
    },
    myCars(){
      return this.$store.state.sdp.collections.cars.filter((car) => car.color == this.color)
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
.pointer{
  cursor: pointer;
}
</style>
```