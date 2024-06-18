<template>
  <a-tabs v-model:activeKey="activeKey">
    <template #rightExtra>
      <a-button @click="show = !show">
        {{ show ? '隐藏条件' : '显示条件'}}
      </a-button>
    </template>
    <a-tab-pane
      v-for="group in branchesGroup"
      :tab="group.branchName"
      :key="group.key"
    >
      <div v-for="(branch, index) in group.children">
        <div style="display: flex;align-items: center" v-if="show">
          <span v-if="branch.when" style="padding-right: 12px;font-weight: bold;font-size: 16px;width: 46px; display: inline-block;">{{ index === 0 ? '当' : '否则' }}</span>
          <Terms :when="branch.when" />
        </div>
      <template v-if="branch.serial?.length">
        <div class="branches-tabs-title">
          串行
        </div>
        <Actions :actions="branch.serial" :activeKeys="activeKeys" :selectedKeys="selectedKeys" :show="show" :serial="true" @change="change" />
      </template>
      <template v-if="branch.parallel?.length">
        <div class="branches-tabs-title">
          并行
        </div>
        <Actions :actions="branch.parallel" :activeKeys="activeKeys" :selectedKeys="selectedKeys" :show="show" @change="change" />
      </template>

      </div>
    </a-tab-pane>
  </a-tabs>
</template>

<script setup name="BranchesTabs">
import Terms from './Terms/Terms.vue'
import Actions from './Actions.vue'

const props = defineProps({
  branchesGroup: {
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
  activeKeys: { // 后端返回已关联的执行动作
    type: Array,
    default: () => ([])
  },
  selectedKeys: { // 当前modal中选中的执行动作
    type: Array,
    default: () => ([])
  }
})

const emit = defineEmits(['change'])

const activeKey = ref(props.branchesGroup?.length ? props.branchesGroup[0].key : '')
const show = ref(false)

const change = (id, selected) => {
  emit('change', id, selected)
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
