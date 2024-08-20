<template>
    <div>
        <div v-if="type === 'auto'"></div>
        <div v-else></div>
    </div>
</template>

<script setup lang="ts" name="Time">
import { onMounted, reactive, ref, watch } from 'vue';

const props = defineProps({
    value: {
        type: Array,
        default: [],
    },
    type: {
        type: String,
        default: 'auto',
    },
});

const mod = ref('period');
const dataSource = ref([])

onMounted(()=>{
  if(props.value.length){

  }else{
    
  }
})

</script>

<style lang="less" scoped></style>
