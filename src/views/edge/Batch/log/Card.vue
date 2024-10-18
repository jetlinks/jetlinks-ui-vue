<template>
  <div class="log-card-item-warp">

    <div class="content">
      <div class="item-body">
        <div class="body-header">
            <div class="header-title">
              {{ detail.name || '测试内容' }}
            </div>
          <div>
            {{ detail.state.text }}
          </div>
          <div class="header-action">

          </div>
        </div>
        <div class="body-detail">
          <div class="detail-desc">
            <div class="detail-title">说明</div>
            <div class="detail-value">{{ detail.description}}</div>
          </div>
          <div class="detail-time">
            <div class="detail-title">时间</div>
            <div class="detail-value">{{ dayjs(detail.createTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </div>
        </div>
        <div class="body-count">
          <div>
            <label>网关数量</label>
            <span>{{ detail.thingTotal }}</span>
          </div>
          <div>
            <label>插件数量</label>
            <span>{{ detail.thingTotal }}</span>
          </div>
        </div>
        <div class="body-progress">
          <div class="progress--warp" :style="progressStyles"></div>
        </div>
        <div class="body-status">
          <div v-for="item in options" class="status-item">
            <label>
              {{ item.label}}
            </label>
            <span>
              {{ item.value }}%
            </span>
          </div>
          <div class="status-item last-item">
            <label>
              任务总数
            </label>
            <span>
              88
            </span>
          </div>
        </div>
      </div>
<!--      <div class="item-action">-->
<!--        <a-tooltip title="详情">-->
<!--          <a-button type="text" @click="visible = true" >-->
<!--            <template #icon>-->
<!--              <AIcon type="EyeOutlined" />-->
<!--            </template>-->
<!--          </a-button>-->
<!--        </a-tooltip>-->
<!--        <a-tooltip title="从相同设备创建任务">-->
<!--          <a-button type="text" @click="onCopy">-->
<!--            <template #icon>-->
<!--              <AIcon type="CopyOutlined" />-->
<!--            </template>-->
<!--          </a-button>-->
<!--        </a-tooltip>-->
<!--      </div>-->
    </div>
  </div>
  <Detail
    v-if="visible"
    @cancel="visible = false"
    @showTaskDetail="showTaskDetail"
    @copy="onCopy"
  />
  <TaskDetail
    v-if="taskDetail.visible"
    @closeDetail="taskDetailClose"
  />
</template>

<script setup name="LogCard">
import Detail from './Detail.vue'
import TaskDetail from "./TaskDetail.vue";
import {getContext} from "../util";
import dayjs from 'dayjs'

const props = defineProps({
  detail: {
    type: Object,
    default: () => ({})
  }
})

const visible = ref(false)
const context = getContext()

const taskDetail = reactive({
  visible: false,
  detail: undefined
})

const options = computed(() => {
  return [
    { label: '已完成', value: 0 },
    { label: '已失败', value: 0 },
    { label: '进行中', value: 0 },
    { label: '排队中', value: 0 },
  ]
})

const progressStyles = computed(() => {
    const value = {
      'success': 10,
      'warning': 10,
      'error': 10,
    }

    const bgi = Object.keys(value).reduce((prev, key, index) => {
      const v = Object.values(value).splice(0, index + 1).reduce((a, b) => a + b, 0)
      prev += `var(--ant-${key}-color) 0, var(--ant-${key}-color) ${v}%,`
      return prev
    }, '')

  return {
    'background-image': 'linear-gradient(90deg,' + bgi + '#EFF0F1 0, #EFF0F1 100%)'
  }
})

const showTaskDetail = (record) => {
  taskDetail.detail = record
  taskDetail.visible = true
}

const taskDetailClose = () => {
  taskDetail.detail = undefined
  taskDetail.visible = false
}

const onCopy = () => {
  context.openTask({
    gateway: []
  })
}
</script>

<style scoped lang="less">
.log-card-item-warp {
  background-color: @font-gray-50;
  border: 1px solid @font-gray-200;
  border-radius: 6px;
  width: 100%;

  .content {
    padding: 16px;

    .body-header {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;

      .header-title {
        font-size: 16px;
        color: @font-gray-900;
        font-weight: 500;
      }
    }

    .body-detail {
      display: flex;
      gap: 32px;
      margin-bottom: 16px;

      .detail-desc {
        display: flex;
        width: 66.66%;
      }

      .detail-time {
        display: flex;
        width: 33.33%;
      }

      .detail-title {
        width: 40px;
        color: @font-gray-500;
      }

      .detail-value {
        flex: 1 1 0;
        min-width: 0;
        color: @font-gray-600;
      }
    }

    .body-count {
      margin-bottom: 16px;
    }

    .body-progress {
      margin-bottom: 12px;
    }

    .body-status {
      display: flex;
      .status-item {
        width: 134px;
      }

      .last-item {
        margin-left: auto;
      }
    }

    .progress--warp {
      height: 4px;
      position: relative;
    }
  }
}
</style>
