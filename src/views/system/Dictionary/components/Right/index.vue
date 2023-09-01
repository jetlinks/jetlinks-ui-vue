<template>
  <div>
    <div class="des_head">
        <div>字典ID：<span>{{ data.id }}</span></div>
        <div>说明：<span>{{ data.describe }}</span></div>
        <div>创建日期：<span>{{ data.name }}</span></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    data:{
        type:Object,
        default:{}
    }
})
</script>
<style lang="less" scoped>
.des_head{
    padding: 10px 20px;
    background-color: rgb(242, 242, 242);
    span{
        color:rgb(127, 127, 127)
    }
}
</style>