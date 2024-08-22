<template>
  <div >
    <Calendar @change="onChange" v-model:value="_value"/>
  </div>
</template>

<script setup lang="ts" name="Rule">

import { ref, watch } from 'vue';
import Calendar from '../../../components/Calendar/index.vue'
const _value = ref([])

const onChange = (arr)=>{
  console.log('============',arr);
}

watch(
  () => _value.value,
  ()=>{
    console.log('value.value====',_value.value);
  },
  {deep:true}
)

</script>

<style lang="less" >
</style>
