<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
let unsub = null

export default {
  name: 'HelloWorld',
  data(){
    return {
      color: 'red'
    }
  },
  props: {
    msg: String
  },
  computed: {
    colorChange(){
      return this.color
    }
  },
  watch: {
    colorChange(color){
      unsub = this.$sub('cars_of_color', {color}, unsub)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
