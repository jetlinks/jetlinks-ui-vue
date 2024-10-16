<template>
  <div class="operate-warp">
    <div :class="{'operate-item': true, 'disabled': disabled }" v-for="item in batchOperateOptions" @click="showTask(item)">
      <div class="img"></div>
      <div class="content">
        <div class="content-title">
          <span>
            {{ item.label }}
          </span>
          <a-button type="text" style="padding: 4px;margin-left: auto;" @click.stop="() => showHistoryTask(item)">
            <AIcon type="ExceptionOutlined" />
          </a-button>
        </div>
        <div class="content-tip">
          {{item.tip}}
        </div>
      </div>
      <div class="icon">
        <AIcon type="ArrowRightOutlined"/>
      </div>
    </div>
  </div>
  <a-drawer
    v-model:visible="visible"
    :width="1000"
    :footer="null"
    :closable="false"
    :keyboard="false"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template #title>
      <div class="drawer-header-title">
        <span>{{operateActive.title}}历史任务</span>
        <a-button type="text" style="padding: 6px;margin-left: auto" @click="closeHistoryTask">
          <template #icon>
            <AIcon type="CloseOutlined" style="font-size: 22px;" />
          </template>
        </a-button>
      </div>
    </template>
    <Log
      :type="operateActive.type"
      :deviceList="deviceKeys"
    />
  </a-drawer>
</template>

<script setup name="BatchOperate">
import { useBatchOperateOptions } from '../util'
import Log from '../log/index.vue'

const props = defineProps({
  deviceList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['selected'])

const { batchOperateOptions } = useBatchOperateOptions()
const visible = ref(false)
const disabled = computed(() => !props.deviceList.length)
const deviceKeys = computed(() => props.deviceList.map(item => item.id))

const operateActive = reactive({
  title: undefined,
  icon: undefined,
  type: undefined
})

const showTask = (item) => {
  if (!props.disabled) {
    emit('selected', { type: item.value })
  }
}

const showHistoryTask = (item) => {
  operateActive.title = item.label
  operateActive.icon = item.icon
  operateActive.type = item.value
  visible.value = true
}

const closeHistoryTask = () => {
  visible.value = false
}

</script>

<style scoped lang="less">
.operate-warp {
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  height: 100%;

  .operate-item {
    display: flex;
    padding: 22px 14px;
    border-radius: 6px;
    background-color: @font-gray-50;
    align-items: center;
    cursor: pointer;

    .content-title {
      color: @font-gray-900;
      font-weight: 500;
      display: flex;
    }

    .content-tip {
      color: @font-gray-500;
    }

    .icon {
      color: @font-gray-600;
      font-size: 22px;
      margin-left: auto;
    }

    &.disabled {
      cursor: not-allowed;
    }
  }
}

.drawer-header-title {
  display: flex;
  gap: 12px;
}
</style>
