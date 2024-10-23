<template>
  <div class="operate-warp">
    <div :class="{'operate-item': true }" v-for="item in batchOperateOptions">
      <div class="img"></div>
      <div class="content">
        <div class="content-title">
          <div class="title-render">
            <Icon :type="item.icon" />
            <label>
              {{ item.label }}
            </label>
          </div>
          <a-button type="text" class="history-icon" @click.stop="() => showHistoryTask(item)">
            <AIcon type="ExceptionOutlined" />
          </a-button>
        </div>
        <div class="content-tip">
          {{item.tip}}
        </div>
        <div :class="{ 'operate-action': true, 'disabled': disabled}" @click="showTask(item)">
          <a-space>
            <span>开始</span>
            <AIcon type="ArrowRightOutlined"/>
          </a-space>
        </div>
      </div>
    </div>
  </div>
  <a-drawer
    v-model:visible="visible"
    :width="800"
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
      v-if="visible"
      ref="logRef"
      :type="operateActive.type"
    />
  </a-drawer>
</template>

<script setup name="BatchOperate">
import { useBatchOperateOptions } from '../util'
import Log from '../log/index.vue'
import Icon from '../components/Icon.vue'

const props = defineProps({
  deviceList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['selected'])

const { batchOperateOptions } = useBatchOperateOptions()
const visible = ref(false)
const logRef = ref()

const disabled = computed(() => !props.deviceList.length)

const operateActive = reactive({
  title: undefined,
  icon: undefined,
  type: undefined
})

const showTask = (item) => {
  if (!disabled.value) {
    emit('selected', { jobType: item.value })
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

const updateLog = () => {
  logRef.value?.reload()
}

defineExpose({
  updateLog
})

</script>

<style scoped lang="less">
.operate-warp {
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  height: 100%;
  border: 1px solid @font-gray-200;
  border-radius: 6px;
  padding: 16px;

  .operate-item {
    padding: 16px;
    border-radius: 6px;
    background-color: @font-gray-50;
    align-items: center;
    cursor: default;

    .content-title {
      color: @font-gray-900;
      font-weight: 500;
      display: flex;
      position: relative;

      .title-render {
        display: flex;
        gap: 8px;
        align-items: center;

        > span {
          font-size: 16px;
        }
      }
    }

    .content-tip {
      color: @font-gray-500;
      margin-bottom: 16px;
    }

    .history-icon {
      padding: 4px;
      margin-left: auto;
      font-size: 16px;
      position: absolute;
      right: 0;
      top: 0;
    }

    .operate-action {
      display: inline-block;
      padding: 8px 32px;
      border-radius: 32px;
      border: 1px solid @font-gray-300;
      cursor: pointer;
      color: @font-gray-600;

      &.disabled {
        cursor: not-allowed;
      }
    }
  }
}

.drawer-header-title {
  display: flex;
  gap: 12px;
}
</style>
