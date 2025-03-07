<template>
  <page-container>
    <FullPage>
      <div class="batch-warp">
        <div class="top">
          <div class="top-item" style=" flex: 1 1 0;">
            <Device />
          </div>
          <div class="top-item" style="width: 340px;">
            <Operate ref="operateRef" :deviceList="deviceList" @selected="operateSelect" />
          </div>
        </div>
      </div>
    </FullPage>
  </page-container>
  <Task
      v-if="visible"
      :value="taskData"
      :list="deviceList"
      @cancel="onCancel"
      @ok="onOk"
  />
</template>

<script setup name="Batch">
import Device from './device/index.vue'
import Operate from './operate/index.vue'
import Task from './task'
import { ContextName} from "./util";

const visible = ref(false)
const deviceList = ref([])
const taskData = ref()
const operateRef = ref()

const onCancel = () => {
  visible.value = false
}

const onOk = () => {
  visible.value = false
  operateRef.value?.updateLog()
}

const openTask = (data) => {
  taskData.value = data
  visible.value = true
}

const operateSelect = (data) => {
  openTask({
    ...data,
  })
}

provide(ContextName, {
  openTask: openTask,
  addGateWay: (data) => {
    deviceList.value = data
  }
})

</script>

<style scoped lang="less">
.batch-warp {
  padding: 24px;
  height: 100%;
  overflow: hidden;

  .top {
    display: flex;
    gap: 24px;
    height: 100%;

    .top-item {
      height: 100%;
    }
  }
}
</style>
