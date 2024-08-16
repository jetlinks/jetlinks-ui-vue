<template>
  <j-popconfirm-modal @confirm="confirm" bodyStyle="width: 450px;height: 300px">
    <template #content>
      <j-scrollbar>
        <j-form ref="formRef" layout="vertical" :model="formData">
          <ReadType v-model:value="formData.type" :disabled="true" />
          <j-form-item name="promi">
            <template #label>
              {{ $t('Rule.Rule.4348440-0') }}
              <j-popover>
                <template #title>
                  <div>{{ $t('Rule.Rule.4348440-1') }}</div>
                  <div>{{ $t('Rule.Rule.4348440-2') }}</div>
                </template>
                <AIcon style="padding-left: 4px" type="icon-bangzhu" />
              </j-popover>
            </template>
            <j-select />
          </j-form-item>
          <j-form-item :label="$t('Rule.Rule.4348440-3')">
            <div class="rule-add" @click="showRuleWindow">
              {{ $t('Rule.Rule.4348440-4') }}
            </div>
          </j-form-item>
          <j-form-item :label="$t('Rule.Rule.4348440-5')" :name="['virtualRule', 'windowType']" required>
            <j-select
                v-model:value="formData.virtualRule.windowType"
                :options="[
                  { label: $t('Rule.Rule.4348440-6'), value: 'undefined' },
                  { label: $t('Rule.Rule.4348440-7'), value: 'time' },
                  { label: $t('Rule.Rule.4348440-8'), value: 'num' },
              ]"
            />
          </j-form-item>
          <template v-if="showWindow">
            <j-form-item :label="$t('Rule.Rule.4348440-9')" :name="['virtualRule', 'aggType']">
              <j-select
                  v-model:value="formData.virtualRule.aggType"
                  :options="[
                  { label: $t('Rule.Rule.4348440-7'), value: 'time' },
                  { label: $t('Rule.Rule.4348440-8'), value: 'num' },
                ]"
                  :placeholder="$t('Rule.Rule.4348440-10')"
              />
            </j-form-item>
            <j-form-item :name="['virtualRule', 'window', 'span']">
              <template #label>
                {{ $t('Rule.Rule.4348440-11') }}{{ formData.virtualRule.aggType === 'num' ? $t('Rule.Rule.4348440-12') : '(s)' }}
              </template>
              <j-input-number v-model:value="formData.virtualRule.window.span" style="width: 100%" />
            </j-form-item>
            <j-form-item :name="['virtualRule', 'window', 'every']">
              <template #label>
                {{ $t('Rule.Rule.4348440-13') }}{{ formData.virtualRule.aggType === 'num' ? $t('Rule.Rule.4348440-12') : '(s)'  }}
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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