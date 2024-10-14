<template>
  <div class="type-select-warp">
      <div class="tips"> <AIcon type="icon-bianyuanwangguan"/> 选择网关设备后，可点击右侧操作快速创建任务</div>
      <div class="card-warp">
        <div
          v-for="item in options"
          :class="{
            'card-item': true,
            'active': selectKey === item.value
          }"
          @click="() => typeSelect(item.value)"
        >
            <div class="icon"></div>
            <div class="content">
              <div class="title">{{ item.label }}</div>
              <div class="tip">{{ item.tip }}</div>
            </div>
        </div>
        <div class="card-item more">
          <div class="content">
            <div class="title">更多方式</div>
            <div class="tip">敬请期待！</div>
          </div>
        </div>
      </div>
    <div>
      <DeviceSelect v-if="selectKey === 'device'"/>
    </div>
  </div>
</template>

<script setup name="BatchDevice">
import DeviceSelect from './device.vue'

const options = [
  {
    label: '按设备选择',
    tip: '按设备列表选择对应网关设备',
    icon: '',
    value: 'device'
  }
]

const selectKey = ref(options[0].value)

const typeSelect = (e) => {
  selectKey.value = e
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

      &.active {
        border-color: @primary-color-active;
      }
    }
  }

  .header {
    margin-bottom: 12px;
  }
}
</style>
