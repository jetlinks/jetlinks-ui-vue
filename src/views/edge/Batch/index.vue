<template>
  <page-container>
    <FullPage>
      <div class="batch-warp">
        <div class="top">
          <Device />
          <Operate ref="operateRef" :deviceList="deviceList" @selected="operateSelect" />
        </div>
      </div>
      <Task
        v-if="visible"
        :value="taskData"
        :list="deviceList"
        @cancel="onCancel"
        @ok="onOk"
      />
    </FullPage>
  </page-container>
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

  .top {
    display: flex;
    gap: 24px;
    height: 100%;
  }
}
</style>
