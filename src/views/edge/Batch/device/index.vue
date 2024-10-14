<template>
  <div class="type-select-warp">
    <template v-if="!type">
      <div class="tips"> <AIcon type="icon-bianyuanwangguan"/> 选择网关设备后，可点击右侧操作快速创建任务</div>
      <div class="card-warp">
        <div class="card-item" @click="() => typeSelect('device')">
            <div class="icon"></div>
            <div class="content">
              <div class="title">按设备选择</div>
              <div class="tip">按设备列表选择对应网关设备</div>
            </div>
        </div>
        <div class="card-item more">
          <div class="content">
            <div class="title">更多方式</div>
            <div class="tip">敬请期待！</div>
          </div>
        </div>
      </div>
    </template>
    <div v-if="type">
      <div class="header">
        <a-button @click="onBack">
          <template #icon><AIcon type="LeftOutlined" /></template>
          返回
        </a-button>
      </div>
      <DeviceSelect v-if="type === 'device'"/>
    </div>
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
  padding: 16px;

  .tips {
    margin-bottom: 16px;
  }

  .card-warp {
    display: grid;
    padding: 12px 0;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;

    .card-item {
      border: 1px solid @border-base-color;
      display: flex;
      cursor: pointer;
      padding: 36px 24px;
      gap: 16px;
      align-items: center;
      border-radius: 6px;

      > .icon {
        width: 40px;
        height: 40px;
        border-radius: 6px;
        background-color: #E6F4FF;
      }

      .content {
        .title {
          color: @font-gray-900;
          font-size: 20px;
        }

        .tip {
          color: @font-gray-600;
          font-size: 16px;
        }
      }

      &.more {
        justify-content: center;
        background-color: #F5F5F5;
        border-color: #F5F5F5;
      }
    }
  }

  .header {
    margin-bottom: 12px;
  }
}
</style>
