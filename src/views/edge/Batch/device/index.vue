<template>
  <div class="type-select-warp">
    <template v-if="!type">
      <div> 选择网关设备后，可点击右侧操作快速创建任务</div>
      <div class="card-warp">
        <div class="card-item" @click="() => typeSelect('device')">
            <div class="icon"></div>
            <div class="content">
              <div class="title">按设备选择</div>
              <div class="tip">按设备列表选择对应网关设备</div>
            </div>
        </div>
        <div class="card-item">
          <div>
            <div>更多方式</div>
            <div>敬请期待！</div>
          </div>
        </div>
      </div>
    </template>
    <DeviceSelect v-if="type === 'device'" @back="onBack"/>
  </div>
</template>

<script setup name="BatchDevice">
import DeviceSelect from './device.vue'

const type = ref()

const onBack = () => {
  type.value = null
}

const typeSelect = (e) => {
  type.value = e
}

</script>

<style scoped lang="less">
.type-select-warp {
  flex: 1 1 0;
  border: 1px solid #f1f1f1;
  display: flex;
  flex-direction: column;
  padding: 0 12px;

  .card-warp {
    display: grid;
    padding: 12px 0;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;

    .card-item {
      border: 1px solid #f1f1f1;
      display: flex;
      border-radius: 4px;
      cursor: pointer;
      padding: 36px 24px;
    }
  }
}
</style>
