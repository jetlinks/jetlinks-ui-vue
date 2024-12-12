<template>
  <a-modal
    visible
    :title="dialogTitle"
    width="1000px"
    @ok="confirm"
    @cancel="emits('close')"
    :confirmLoading="loading"
    class="edit-dialog-container"
  >
    <a-form ref="formRef" :model="modelRef" layout="vertical">
      <a-form-item
        name="id"
        :rules="[
          { required: true, message: $t('components.EditDialog.859823-0') },
          { validator: idCheck, trigger: 'blur' },
        ]"
      >
        <template #label>
          <span style="margin-right: 5px">{{ $t('components.EditDialog.859823-1') }}</span>
          <a-tooltip :title="$t('components.EditDialog.859823-2')">
            <AIcon type="QuestionCircleOutlined" />
          </a-tooltip>
        </template>
        <a-input
          v-model:value="modelRef.id"
          :placeholder="$t('components.EditDialog.859823-0') + '(ID)'"
          :disabled="props.data.id"
        />
      </a-form-item>
      <a-form-item
        name="name"
        :label="$t('components.EditDialog.859823-3')"
        :rules="[
          { required: true, message: $t('components.EditDialog.859823-4') },
          {
            max: 64,
            message: $t('components.EditDialog.859823-5'),
          },
        ]"
      >
        <a-input v-model:value="modelRef.name" :placeholder="$t('components.EditDialog.859823-4')" />
      </a-form-item>
      <!-- 操作权限列表 -->
      <a-table
        :columns="editColumns"
        :data-source="modelRef.actions"
        :pagination="false"
        class="m-table"
        :scroll="{ y: 300 }"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{ `#${index + 1}.` }}
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-button
              style="padding: 0"
              type="link"
              danger
              @click="clickRemove(index)"
            >
              <AIcon type="DeleteOutlined" />
            </a-button>
          </template>
          <template v-else>
            <a-form-item
              :name="['actions', index, column.key]"
              :rules="[
                {
                  required: column.key !== 'describe',
                  message: $t('components.EditDialog.859823-6', [column.title]),
                },
                {
                  max: 64,
                  message: $t('components.EditDialog.859823-5'),
                },
              ]"
            >
              <a-input v-model:value="record[column.key]" />
            </a-form-item>
          </template>
        </template>
      </a-table>
    </a-form>
    <a-button
      type="dashed"
      style="width: 100%; margin-top: 5px"
      @click="clickAdd"
    >
      <AIcon type="PlusOutlined" /> {{ $t('components.EditDialog.859823-7') }}
    </a-button>
  </a-modal>
</template>

<script setup lang="ts" name="EditDialog">
import {
  checkId_api,
  editPermission_api,
  addPermission_api,
} from '@/api/system/permission'
import { useRequest } from '@jetlinks-web/hooks'
import { onlyMessage } from '@jetlinks-web/utils'
import { editColumns, defaultAction } from '../util'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emits = defineEmits(['save', 'close'])

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => {},
  },
})

const dialogTitle = computed(() => (props.data.id ? $t('components.EditDialog.859823-8') : $t('components.EditDialog.859823-9')))

// 表单相关
const formRef = ref<any>()

const modelRef = reactive({
  name: '',
  id: '',
  actions: [...defaultAction],
})

// 校验标识是否可用
const idCheck = async (_rule: any, id: string): Promise<any> => {
  if (!id) return Promise.resolve()
  else if (id.length > 64) return Promise.reject($t('components.EditDialog.859823-5'))
  else if (props.data.id && props.data.id === modelRef.id)
    return Promise.resolve()
  else {
    const resp: any = await checkId_api({ id })
    if (resp.result.passed) return Promise.resolve()
    else return Promise.reject(resp.result.reason)
  }
}

// 删除actions
const clickRemove = (index: number) => {
  modelRef.actions.splice(index, 1)
}

// 新增actions
const clickAdd = () => {
  modelRef.actions.push({
    action: '',
    name: '',
    describe: '',
  })
}

// 保存数据
const { loading, run } = useRequest(
  props.data?.id ? editPermission_api : addPermission_api,
  {
    immediate: false,
    onSuccess(res) {
      if (res.success) {
        onlyMessage($t('components.EditDialog.859823-10'))
        emits('save')
      }
    },
  },
)

const confirm = () => {
  formRef.value?.validate().then(() => {
    const params = {
      ...props.data,
      ...modelRef,
      actions: modelRef.actions.filter((item: any) => item.action && item.name),
    }
    run(params)
  })
}

// 初始化
watchEffect(() => {
  Object.assign(modelRef, props.data)
  modelRef.actions = props.data?.id
    ? [...props.data.actions]
    : [...defaultAction]
})
</script>

<style lang="less" scoped>
.m-table {
  :deep(.ant-form-item) {
    margin-bottom: 0;
  }
}
</style>
