<template>
  <a-popover
    title='搜索名称'
    trigger='click'
    v-model:visible='visible'
    @visibleChange='visibleChange'
  >
    <template #content>
      <div style='width: 240px'>
        <a-form ref='formRef' :model='modelRef'>
          <a-form-item
            name='name'
            :rules='[
              { required: true, message: "请输入名称"}
            ]'
          >
            <a-textarea
              v-model:value='modelRef.name'
              :rows='3'
              :maxlength='200'
            />
          </a-form-item>
        </a-form>
        <a-button
          :loading='saveHistoryLoading'
          type='primary'
          class='save-btn'
          @click='saveHistory'
        >
          保存
        </a-button>
      </div>
    </template>
    <a-button>
      <template #icon>
        <SaveOutlined />
      </template>
      保存
    </a-button>
  </a-popover>
</template>

<script setup lang='ts' name='SaveHistory'>
import type { Terms } from './types'
import { PropType } from 'vue'
import { saveSearchHistory } from '@/api/comm'
import { SaveOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  terms: {
    type: Object as PropType<Terms>,
    default: () => ({})
  },
  target: {
    type: String,
    default: '',
    required: true
  }
})

const searchName = ref('')

const saveHistoryLoading = ref(false)

const visible = ref(false)

const formRef = ref()

const modelRef = reactive({
  name: undefined
})

/**
 * 保存当前查询条件
 */
const saveHistory = async () => {
  // 获取当前查询条件并转化为字符串
  const formData = await formRef.value.validate()
  if (formData) {
    formData.content = JSON.stringify(props.terms)
    saveHistoryLoading.value = true
    const resp = await saveSearchHistory(formData, props.target)
    saveHistoryLoading.value = false
    if (resp.success) {
      visible.value = false
    }
  }
}

const visibleChange = (e: boolean) => {
  visible.value = e
}

</script>

<style scoped lang='less'>
.save-btn {
  width: 100%
}
</style>