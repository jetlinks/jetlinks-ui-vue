<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane
      v-for="item in branches"
      :tab="item.branchName"
      :key="item.branchId"
    >
      <template v-if="item.serial?.length">
        <div class="branches-tabs-title">
          串行
        </div>
        <div v-for="actionItem in item.serial" class="branches-tabs-alarm">
          <span>
            满足条件后将{{ actionItem.alarm.mode === 'trigger' ? '触发' : '解除'}}当前告警
          </span>
          <a-button type="link" @click="onBind(actionItem)">
            <template #icon>
              <AIcon type="icon-bangding" />
            </template>
            关联
          </a-button>
        </div>
      </template>
      <template v-if="item.parallel?.length">
        <div class="branches-tabs-title">
          并行
        </div>
        <div v-for="actionItem in item.parallel" class="branches-tabs-alarm">
          <span>
            满足条件后将{{ actionItem.alarm.mode === 'trigger' ? '触发' : '解除'}}当前告警
          </span>
          <a-button type="link" @click="onBind(actionItem)">
            <template #icon>
              <AIcon type="icon-bangding" />
            </template>
            关联
          </a-button>
        </div>
      </template>
    </a-tab-pane>
  </a-tabs>
</template>

<script setup name="BranchesTabs">

const props = defineProps({
  branches: {
    type: Array,
    default: () => ([])
  },
  alarmId: {
    type: String,
    default: undefined
  },
  sceneId: {
    type: String,
    default: undefined
  },
  selectedKeys: {
    type: Array,
    default: () => ([])
  }
})

const activeKey = ref(props.branches?.length ? props.branches[0].branchId : '')

const onBind = (record) => {
  // emit('check')
}

</script>

<style scoped lang="less">
.branches-tabs-title {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.branches-tabs-alarm {
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid #a9a9a9;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 8px;
  }
}
</style>
