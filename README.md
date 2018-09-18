# example of use

```html
<template>
  <div v-if="$subsReady">
    <h1>{{ msg }}</h1>
    <div class="pointer" @click="inc(c.id, c.x+1)" v-bind:key="c.id" v-for="c in myCounters">
      {{ c.x }}
    </div>  
    <button @click="suma">2 + 3 = </button>
    <span>{{valor}}</span> 
  </div>
</template>

<script>
import { SDP_Mixin } from '../sdp'

export default {
  name: 'HelloWorld',
  mixins: [SDP_Mixin],
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
    async suma(){
      this.valor = await this.$rpc('add', {a: 2, b: 3})
    },
    async inc(id, value){
      this.$rpc('increment', {id, value})
    }
  },
  created(){
    this.$sub('x_less_than', {max: this.max})
  },
  computed: {
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
```
