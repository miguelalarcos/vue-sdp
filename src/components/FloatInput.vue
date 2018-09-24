<template>
  <div class="float-input">
    <input type="text" ref="floatInput" :value="value" @input="update()"/>
  </div>
</template>

<script>
export default {
  props: ['value'],

  methods: {
    update() {
        const txt = this.$refs.floatInput.value
        if(txt === '' || txt === null || txt === undefined){
          this.$emit('input', '')
        }else{
          if(/^[-+]?[0-9]*\.?[0-9]*$/.test(txt))
              this.$emit('input', parseFloat(txt))
          else
              this.$emit('input', txt)
        }
    }
  }
};
</script>