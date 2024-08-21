<template>
    <div>
        <div class="channelControl">
            <div class="bind">已绑定通道数：{{ bindCount }}</div>
            <a-space>
                <a-button @click="clearBind">清空通道</a-button>
                <a-button @click="showBind">绑定通道</a-button>
            </a-space>
        </div>
        <Bind v-if="bindVisible" @closeBind="bindVisible=false"></Bind>
    </div>
</template>

<script setup lang="ts" name="Channel">
import Bind from './Bind.vue'
const bindCount = ref(0);
const bindVisible = ref(false)
const showBind = () =>{
  bindVisible.value = true
}
const clearBind = () =>{

}
</script>

<style lang="less">
.channelControl{
  display: flex;
  .bind{
    margin-right: 20px;
  }
}</style>
