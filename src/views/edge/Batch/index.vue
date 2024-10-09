<template>
  <page-container>
    <FullPage>
      <div class="batch-warp">
        <div class="top">
          <Device
            v-model:value="deviceList"
          />
          <Operate @selected="operateSelect" />
        </div>
        <div class="bottom">
          <Log />
        </div>
      </div>
      <Task
        v-if="visible"
        :value="taskData"
        :list="deviceList"
        @cancel="onCancel"
      />
    </FullPage>
  </page-container>
</template>

<script setup name="Batch">
import Device from './device/index.vue'
import Operate from './operate/index.vue'
import Log from './log/index.vue'
import Task from './task'
import { ContextName} from "./util";

const visible = ref(false)
const deviceList = ref([])
const taskData = ref()

const onCancel = () => {
  visible.value = false
}

const onOk = () => {
  visible.value = false
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

  .top {
    display: flex;
    gap: 24px;
    height: 460px;
  }
}
</style>
