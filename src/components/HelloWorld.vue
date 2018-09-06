<template>
  <div v-if="$subsReady">
    <h1>{{ msg }}</h1>
    <button @click="color=color==='red'?'blue':'red'">red/blue</button>
    <div class="pointer" @click="changeColor(c.id, c.color==='red'?'blue':'red')" v-bind:key="c.id" v-for="c in myCars">
      {{ c.matricula }}
    </div>  
    <button @click="suma">2 + 3 = </button>
    <span>{{valor}}</span>
    <button @click="doAction">reserva el Quijote</button>
    <div v-bind:key="c.id" v-for="c in myItems">
      {{ c.name }} : {{ c.free }}
    </div>  
  </div>
</template>

<script>
import { SDP_Mixin, filter } from '../sdp'
let unsub = null
let items_unsub = null

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
    },
    async doAction(){
      await this.$rpc('reserve_item', {class_id: 'bab23d6e-5a6b-40ff-bc43-e4af2d8d36a2', quantity: 2})
    }
  },
  created(){
    unsub = this.$sub('cars_of_color', {color: this.color}, null)
    items_unsub = this.$sub('items', {}, null)
  },
  computed: {
    colorChange(){
      return this.color
    },
    ready(){
      return this.$subsReady()
    },
    myCars(){
      return filter(this.$store.state.sdp.collections.cars, (car) => car.color == this.color)
    },
    myItems(){
      return this.$store.state.sdp.collections.items
    }
  },
  watch: {
    colorChange(color){
      unsub = this.$sub('cars_of_color', {color}, unsub)
    }
  }
} //TODO unsub when compenent destroy
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.pointer{
  cursor: pointer;
}
</style>
