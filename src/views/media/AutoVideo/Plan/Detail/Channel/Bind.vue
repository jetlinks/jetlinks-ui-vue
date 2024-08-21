<template>
  <a-modal visible title="绑定通道" @cancel="emit(closeBind)" :width="1000">
    <div class="bindControl">
        <div class="bind_left">
            <div>选择设备及目录查看已绑定的通道：</div>
            <ChannelTree />
        </div>
        <div class="bind_right"></div>
    </div>
  </a-modal>
</template>

<script setup>
import ChannelTree from '@/views/media/AutoVideo/components/ChannelTree/index.vue'
const emit = defineEmits(['closeBind'])
</script>
<style lang="less" scoped>
.bindControl{
    display: flex;
}
</style>