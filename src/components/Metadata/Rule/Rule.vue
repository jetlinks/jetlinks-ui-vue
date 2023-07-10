<template>
  <j-popconfirm-modal @confirm="confirm" bodyStyle="width: 450px;height: 300px">
    <template #content>
      <j-scrollbar>
        <j-form ref="formRef" layout="vertical" :model="formData">
          <ReadType v-model:value="formData.type" :disabled="true" />
          <j-form-item name="promi">
            <template #label>
              触发属性
              <j-popover>
                <template #title>
                  <div>选择当前产品物模型下的属性作为触发属性</div>
                  <div>任意属性值更新时将触发下方计算规则</div>
                </template>
                <AIcon style="padding-left: 4px" type="icon-bangzhu" />
              </j-popover>
            </template>
            <j-select />
          </j-form-item>
          <j-form-item label="计算规则">
            <div class="rule-add" @click="showRuleWindow">
              编辑规则
            </div>
          </j-form-item>
          <j-form-item label="窗口" :name="['virtualRule', 'windowType']" required>
            <j-select
                v-model:value="formData.virtualRule.windowType"
                :options="[
                  { label: '无', value: 'undefined' },
                  { label: '时间窗口', value: 'time' },
                  { label: '频次窗口', value: 'num' },
              ]"
            />
          </j-form-item>
          <template v-if="showWindow">
            <j-form-item label="聚合函数" :name="['virtualRule', 'aggType']">
              <j-select
                  v-model:value="formData.virtualRule.aggType"
                  :options="[
                  { label: '时间窗口', value: 'time' },
                  { label: '频次窗口', value: 'num' },
                ]"
                  placeholder="请选择聚合函数"
              />
            </j-form-item>
            <j-form-item :name="['virtualRule', 'window', 'span']">
              <template #label>
                窗口长度({{ formData.virtualRule.aggType === 'num' ? '次' : 's' }})
              </template>
              <j-input-number v-model:value="formData.virtualRule.window.span" style="width: 100%" />
            </j-form-item>
            <j-form-item :name="['virtualRule', 'window', 'every']">
              <template #label>
                步长({{ formData.virtualRule.aggType === 'num' ? '次' : 's'  }})
              </template>
              <j-input-number v-model:value="formData.virtualRule.window.every" style="width: 100%" />
            </j-form-item>
          </template>
        </j-form>
      </j-scrollbar>
    </template>
    <j-button style="padding: 4px 8px;">
      <AIcon type="EditOutlined" />
    </j-button>
  </j-popconfirm-modal>
  <Modal
    v-if="visible"
    @ok="ruleOk"
    @cancel="ruleCancel"
  />
</template>

<script setup lang="ts" name="Rule">
import { ReadType } from '../components'
import Modal from './Modal.vue'

type Emit = {
  (e: 'update:value', data: Record<string, any>): void
}

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits<Emit>()
const formRef = ref<any>(null)
const visible = ref(false)

const formData = reactive<{
  type?: string[]
  virtualRule: Record<string, any>
}>({
  type: ['report'],
  virtualRule: {
    windowType: 'undefined',
    aggType: undefined,
    isVirtualRule: false,
    type: undefined,
    window: {
      every: undefined,
      span: undefined
    },
  }
})

const showWindow = computed(() => {
  const hasWindowType = formData.virtualRule.windowType !== 'undefined'

  if (!hasWindowType) {
    formData.virtualRule.window = {
      every: undefined,
      span: undefined
    }
    formData.virtualRule.aggType = undefined
  }
  formData.virtualRule.isVirtualRule = hasWindowType
  formData.virtualRule.type = hasWindowType ? 'window' : 'script'
  return hasWindowType
})

const confirm = () => {
  return new Promise(async (resolve, reject) => {
    const data = await formRef.value!.validate().catch(() => {
      reject()
    })
    if (data) {
      emit('update:value', formData)
      resolve(true)
    }
  })
}

const showRuleWindow = () => {
  visible.value = true
}

const ruleCancel = () => {
  visible.value = false
}

const ruleOk = () => {

}

watch(() => props.value, () => {
  Object.assign(formData, props.value)
}, { immediate: true })

</script>

<style scoped>
.rule-add {
  padding: 8px;
  width: 100%;
  text-align: center;
  border:1px solid rgba(0,0,0,.3);
}
</style>