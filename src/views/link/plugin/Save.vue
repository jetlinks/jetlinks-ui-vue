<template>
  <j-modal
    :maskClosable='false'
    :visible='true'
    :title="!!data?.id ? '编辑' : '新增'"
    :confirmLoading='loading'
    @ok='handleSave'
    @cancel='handleCancel'
    width='650px'
  >
    <div>
      <j-form :layout="'vertical'" ref='formRef' :model='modelRef'>
        <j-form-item
          name='id'
          :rules='IdRules'
        >
          <template #label>
            <span>
                插件ID
                <j-tooltip
                  title='若不填写，系统将自动生成唯一ID'
                >
                    <AIcon
                      type='QuestionCircleOutlined'
                      style='margin-left: 2px'
                    />
                </j-tooltip>
            </span>
          </template>
          <j-input placeholder="请输入插件ID" v-model:value='modelRef.id' :disabled='!!data.id' />
        </j-form-item>
        <j-form-item
          label='插件名称'
          name='name'
          :rules="nameRules"
        >
          <j-input placeholder="请输入插件名称" v-model:value='modelRef.name' />
        </j-form-item>
        <j-form-item
          label='文件'
          name='version'
          :rules='versionRule'
        >
          <UploadFile v-model:modelValue='modelRef.version' @change='uploadChange' :fileName='data.filename' />
        </j-form-item>
        <div v-if='modelRef.version' class='file-detail'>
          <div>
            <span>插件类型：</span>
            <span class='file-detail-item'>{{ TypeMap[modelRef.type] }}</span>
          </div>
          <div>
            <span>版本：</span>
            <span class='file-detail-item'>{{ modelRef.version }}</span>
          </div>
        </div>
        <j-form-item
          label='描述'
          name='describe'
          :rules='Max_Length_200'
        >
          <j-textarea
            v-model:value='modelRef.description'
            placeholder='请输入说明'
            showCount
            :maxlength='200'
          />
        </j-form-item>
      </j-form>
    </div>
  </j-modal>
</template>

<script setup lang='ts' name='PluginSave'>
import { ID_Rule, Max_Length_64, Max_Length_200, RequiredStringFn } from '@/components/Form/rules'
import UploadFile from './UploadFile.vue'
import { FileUploadResult } from '@/views/link/plugin/typings'
import { add, update, vailIdFn } from '@/api/link/plugin'
import { TypeMap } from './util'
import { onlyMessage } from '@/utils/comm'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['cancel', 'ok'])
const route = useRoute()
const formRef = ref()
const fileType = ref(props.data.type)
const loading = ref(false)

const vailId = async (_: any, value: string) => {
  if (!props.data.id && value) { // 新增校验
    const resp = await vailIdFn(value)
    if (resp.success && resp.result && !resp.result.passed) {
      return Promise.reject('ID重复');
    }
  }
  return Promise.resolve();
}

const nameRules = [
  RequiredStringFn('插件名称'),
  ...Max_Length_64
]

const IdRules = [
  ...ID_Rule,
  {
    validator: vailId,
    trigger: 'blur',
  },
]

const versionRule = [
  { required: true, message: "请上传文件" },
  // {
  //   validator(_: any, value: any) {
  //     if (value) {
  //       if (value?.err) {
  //         return Promise.reject('文件上传失败，请重新上传')
  //       }
  //       return Promise.resolve()
  //     }
  //     return Promise.reject('请上传文件')
  //   }
  // }
]

const modelRef = reactive<any>({
  id: props.data.id,
  name: props.data.name,
  description: props.data.description,
  type: props.data.type,
  provider: props.data.provider || 'jar',
  version: props.data.version,
  filename: props.data.filename,
  configuration: props.data.configuration || {}
})

const uploadChange = (data: FileUploadResult) => {
  modelRef.type = data.type.value
  modelRef.filename = data.filename
  modelRef.configuration.location = data.accessUrl
}

const handleSave = async () => {
  const data = await formRef.value.validate()
  if (data) {
    loading.value = true
    modelRef.id = modelRef.id ? modelRef.id : null;
    const resp = props.data.id ? await update(modelRef).catch(() => { success: false }) : await add(modelRef).catch(() => { success: false })
    loading.value = false
    if (resp.success) {
      onlyMessage('操作成功！');
      if (route.query.save && (window as any).onTabSaveSuccess) {
        (window as any).onTabSaveSuccess(resp);
        setTimeout(() => window.close(), 300);
        return
      }
      emit('ok');
      formRef.value.resetFields();
    }
  }
}

const handleCancel = () => {
  emit('cancel')
}

</script>

<style scoped lang='less'>
.file-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;

  .file-detail-item {
    color: #4F4F4F;
  }

}
</style>