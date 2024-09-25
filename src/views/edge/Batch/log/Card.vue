<template>
  <div class="log-card-item-warp">
    <div class="progress--warp">

    </div>
    <div class="content">
      <div class="img"></div>
      <div class="item-body">
        <div class="body-title">
            {{ detail.name }}
        </div>
        <div class="body-detail">
          <div class="detail-item">
            <label>已完成</label>
            <div></div>
          </div>
          <div class="detail-item">
            <label>已失败</label>
            <div></div>
          </div>
          <div class="detail-item">
            <label>进行中</label>
            <div></div>
          </div>
          <div class="detail-item">
            <label>排队中</label>
            <div></div>
          </div>
          <div class="detail-item">
            <label>创建时间</label>
            <div></div>
          </div>
        </div>
      </div>
      <div class="item-action">
        <a-space>
          <a-tooltip title="详情">
            <a-button @click="visible = true" >
              <AIcon type="EyeOutlined" />
            </a-button>
          </a-tooltip>
          <a-tooltip title="从相同设备创建任务">
            <a-button @click="onCopy">
              <AIcon type="CopyOutlined" />
            </a-button>
          </a-tooltip>
        </a-space>
      </div>
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

defineProps({
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
  border: 1px solid #f1f1f1;
  border-radius: 6px;

  .content {
    padding: 12px 24px;
    display: flex;

    .body-detail {
      display: flex;

      .detail-item {
        display: flex;
        gap: 12px;
      }
    }
  }
}
</style>
