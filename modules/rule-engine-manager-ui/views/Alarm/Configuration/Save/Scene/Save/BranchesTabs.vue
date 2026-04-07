<template>
  <div>
    <div v-if="showDevice">
      <a-tabs v-if="branchesGroup.length" v-model:activeKey="activeKey">
        <template v-if="showDetailBtn" #rightExtra>
          <a-button @click.stop="show = !show">
            {{ show ? $t('Save.BranchesTabs.0214510-0') : $t('Save.BranchesTabs.0214510-1')}}
          </a-button>
        </template>
        <a-tab-pane
          v-for="group in branchesGroup"
          :tab="group.branchName"
          :key="group.key"
        >
          <div v-for="(branch, index) in group.children" :key="branch.branchId">
            <div style="display: flex;align-items: center" v-if="show && branch.when?.length">
              <div style="padding-right: 12px;font-weight: bold;font-size: 16px;width: 46px; white-space: nowrap;">{{ index === 0 ? $t('Save.BranchesTabs.0214510-2') : $t('Save.BranchesTabs.0214510-3') }}</div>
              <Terms :when="branch.whenOptions" :data="branch.when" />
            </div>
            <div class="branches-shakeLimit" v-if="show && branch.shakeLimit?.enabled">
              <span class="branches-shakeLimit-action">{{ $t('Save.BranchesTabs.0214510-4') }}</span>
              <template v-if="branch.shakeLimit?.enabled">
                <span>{{ $t('Save.BranchesTabs.0214510-5') }}</span>
                <span class="branches-shakeLimit-time">{{ branch.shakeLimit.time }}</span>
                <span>{{ $t('ShakeLimit.index.9093426-7') }}</span>
                <span class="branches-shakeLimit-time">{{ branch.shakeLimit?.continuous ? $t('ShakeLimit.index.9093426-15') : $t('ShakeLimit.index.9093426-16') }}</span>
                <span>{{ $t('ShakeLimit.index.9093426-8') }}</span>
                <span class="branches-shakeLimit-time">{{ branch.shakeLimit.threshold }}</span>
                <span>{{ $t('ShakeLimit.index.9093426-9') }}</span>
                <span class="branches-shakeLimit-time">{{ branch.shakeLimit.alarmFirst ? $t('ShakeLimit.index.9093426-13') : $t('ShakeLimit.index.9093426-14') }}</span>
                <span>{{ $t('ShakeLimit.index.9093426-10') }}</span>
                <span class="branches-shakeLimit-time">{{ branch.shakeLimit.outputFirst ? $t('ShakeLimit.index.9093426-17'): $t('ShakeLimit.index.9093426-18') }}</span>
                <span>{{ $t('ShakeLimit.index.9093426-11') }}</span>
                <span class="branches-shakeLimit-time">{{ branch.shakeLimit.rolling ? $t('ShakeLimit.index.9093426-19') : $t('ShakeLimit.index.9093426-20')}}</span>
                <span>{{ $t('ShakeLimit.index.9093426-12') }}</span>
              </template>
              <span v-else>
                {{ $t('Save.BranchesTabs.0214510-10') }}
              </span>
            </div>
          <template v-if="branch.serial?.length">
            <div v-if="show" class="branches-tabs-title">
              {{ $t('Save.BranchesTabs.0214510-11') }}
            </div>
            <Actions :actions="branch.serial" :activeKeys="activeKeys" :selectedKeys="selectedKeys" :show="show" :serial="true" :showUnbindBtn="showUnbindBtn" @change="change" @select="select" />
          </template>
          <template v-if="branch.parallel?.length">
            <div v-if="show" class="branches-tabs-title">
              {{ $t('Save.BranchesTabs.0214510-12') }}
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
          {{ show ? $t('Save.BranchesTabs.0214510-0') : $t('Save.BranchesTabs.0214510-1')}}
        </a-button>
      </div>
      <div  v-for="group in branchesGroup">
        <div v-for="(branch, index) in group.children">
          <template v-if="branch.serial?.length">
            <div v-if="show" class="branches-tabs-title">
              {{ $t('Save.BranchesTabs.0214510-11') }}
            </div>
            <Actions :actions="branch.serial" :activeKeys="activeKeys" :selectedKeys="selectedKeys" :show="show" :serial="true" :showUnbindBtn="showUnbindBtn" @change="change" @select="select" />
          </template>
          <template v-if="branch.parallel?.length">
            <div v-if="show" class="branches-tabs-title">
              {{ $t('Save.BranchesTabs.0214510-12') }}
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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

const showDevice = computed(() => ['device', 'collector'].includes(props.triggerType))

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
