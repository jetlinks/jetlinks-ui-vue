<template>
  <div>
    <div v-if="triggerType ==='device'">
      <a-tabs v-if="branchesGroup.length" v-model:activeKey="activeKey">
        <template v-if="showDetailBtn" #rightExtra>
          <a-button @click.stop="show = !show">
            {{ show ? '收起' : '点击查看详情'}}
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
            <div class="branches-shakeLimit" v-if="show">
              <span class="branches-shakeLimit-action">执行</span>
              <template v-if="branch.shakeLimit?.enabled">
                <span>开启防抖</span>
                <span class="branches-shakeLimit-time">{{ branch.shakeLimit.time }}</span>
                <span>秒内发送</span>
                <span class="branches-shakeLimit-time">{{ branch.shakeLimit.threshold }}</span>
                <span>次及以上时，处理</span>
                <span>{{ branch.shakeLimit.alarmFirst ? '第一次' : '最后一次' }}</span>
              </template>
              <span v-else>
                关闭防抖
              </span>
            </div>
          <template v-if="branch.serial?.length">
            <div v-if="show" class="branches-tabs-title">
              串行
            </div>
            <Actions :actions="branch.serial" :activeKeys="activeKeys" :selectedKeys="selectedKeys" :show="show" :serial="true" :showUnbindBtn="showUnbindBtn" @change="change" @select="select" />
          </template>
          <template v-if="branch.parallel?.length">
            <div v-if="show" class="branches-tabs-title">
              并行
            </div>
            <Actions :actions="branch.parallel" :activeKeys="activeKeys" :selectedKeys="selectedKeys" :show="show" :showUnbindBtn="showUnbindBtn" @change="change" @select="select" />
          </template>

          </div>
        </a-tab-pane>
      </a-tabs>

    </div>
    <div v-else>
      <div style="margin: 8px 0; text-align: right" v-if="showDetailBtn">
        <a-button @click.stop="show = !show">
          {{ show ? '收起' : '点击查看详情'}}
        </a-button>
      </div>
      <div  v-for="group in branchesGroup">
        <div v-for="(branch, index) in group.children">
          <template v-if="branch.serial?.length">
            <div v-if="show" class="branches-tabs-title">
              串行
            </div>
            <Actions :actions="branch.serial" :activeKeys="activeKeys" :selectedKeys="selectedKeys" :show="show" :serial="true" :showUnbindBtn="showUnbindBtn" @change="change" @select="select" />
          </template>
          <template v-if="branch.parallel?.length">
            <div v-if="show" class="branches-tabs-title">
              并行
            </div>
            <Actions :actions="branch.parallel" :activeKeys="activeKeys" :selectedKeys="selectedKeys" :show="show" :showUnbindBtn="showUnbindBtn" @change="change" @select="select" />
          </template>
        </div>
      </div>
    </div>
  </div>
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
  },
  show: {
    type: Boolean,
    default: false
  },
  showDetailBtn: {
    type: Boolean,
    default: true
  },
  showUnbindBtn: {
    type: Boolean,
    default: false
  },
  triggerType: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['change', 'select'])

const activeKey = ref(props.branchesGroup?.length ? props.branchesGroup[0].key : '')
const show = ref(props.show)

const change = (id, selected) => {
  emit('change', id, selected)
}

const select = (id, selected) => {
  emit('select', id, selected)
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

.branches-shakeLimit {
  .branches-shakeLimit-action {
    font-weight: bold;
    padding-right: 8px;
  }

  .branches-shakeLimit-time {
    padding: 0 8px;
    font-weight: bold;
  }
}
</style>
