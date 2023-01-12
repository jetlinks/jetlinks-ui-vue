<template>
  <div style="margin-top: 10px">
111
  </div>
</template>

<script lang="ts" setup name="AccessMedia">


const props = defineProps({
    provider: {
        type: Object,
        default: () => {},
    },
    data: {
        type: Object,
        default: () => {},
    },
});

const channel = ref(props.provider.channel)

console.log(211,props);


</script>

<style lang="less" scoped>

</style>
