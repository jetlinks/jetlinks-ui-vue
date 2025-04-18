<template>
  <a-modal
    visible
    :title="title"
    :maskClosable="false"
    width="520px"
    @cancel="emits('close')"
    @ok="confirm"
    class="edit-dialog-container"
    :confirmLoading="loading"
  >
    <a-form ref="formRef" :model="formModel.data" layout="vertical">
      <a-form-item name="parentId" :label="$t('components.Save.069696-0')">
        <a-tree-select
          v-model:value="formModel.data.parentId"
          style="width: 100%"
          :allow-clear="true"
          :placeholder="$t('components.Save.069696-1')"
          :tree-data="treeData"
          :field-names="{ value: 'id' }"
          @change="handleTreeSelectChange"
        >
          <template #title="{ name }"> {{ name }} </template>
        </a-tree-select>
      </a-form-item>
      <a-form-item
        name="name"
        :label="$t('components.Save.069696-2')"
        :rules="[
          { required: true, message: $t('components.Save.069696-3') },
          { max: 64, message: $t('components.Save.069696-4') },
        ]"
      >
        <a-input v-model:value="formModel.data.name" :placeholder="$t('components.Save.069696-3')" />
      </a-form-item>

      <a-form-item
        name="sortIndex"
        :label="$t('components.Save.069696-5')"
        :rules="[{ required: true, message: $t('components.Save.069696-6') }]"
      >
        <a-input
          v-model:value="formModel.data.sortIndex"
          :placeholder="$t('components.Save.069696-6')"
          :maxlength="64"
          @blur="checkSort"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { addDepartment_api, updateDepartment_api } from '@/api/system/department'
import { onlyMessage } from '@jetlinks-web/utils'
import { useRequest } from '@jetlinks-web/hooks'
import { FormType, TreeType } from '../typings';
import { filterTree, findItemById } from '../util';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emits = defineEmits(['save', 'close'])
const props = defineProps({
  treeData: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Object,
    default: () => {},
  },
})
// 弹窗相关
const title = ref<string>('')
// 表单相关
const formRef = ref<any>()
const formModel = reactive({
  data: {} as FormType,
  beforeSortIndex: '' as string | number,
})

// 保存数据
const { loading, run } = useRequest(
  props.data.id ? updateDepartment_api : addDepartment_api,
  {
    immediate: false,
    onSuccess(res) {
      if (res.success) {
        onlyMessage($t('components.Save.069696-7'))
        emits('save', res.result.id)
      }
    },
  },
)
// 确认保存
const confirm = () => {
  formRef.value
    ?.validate()
    .then((_data: any) => {
      // if(!_data.parentId){
      //   _data.parentId = undefined
      // }
      run(props.data.id ? { ...props.data, ..._data } : _data)
    })
}

// 顺序选择
const treeData = computed(() => {
  if (!props.data.id) return props.treeData
  const result = cloneDeep(props.treeData) as TreeType[]
  const me = findItemById(result, props.data.id) as TreeType
  me.disabled = true
  me.children && me.children.length > 0 && filterTree(me.children)
  return result
})

const checkSort = (e: any) => {
  const value = e.target.value.match(/^[1-9]*/)[0]
  if (value) {
    formModel.data.sortIndex = value
    formModel.beforeSortIndex = value
  } else formModel.data.sortIndex = formModel.beforeSortIndex
}

/**
 * 上级组织选择改变
 */
 const handleTreeSelectChange = () => {
  // 上级组织
  const parent: any = treeData.value.find((f: any) => f.id === formModel.data.parentId)
  // 当前编辑的组织排序, 为选择上级组织的最大排序+1, 如上级组织没有自组织, 则默认为1
  formModel.data.sortIndex = parent?.children
    ? parent.children[parent.children.length - 1].sortIndex + 1
    : 1
}

//初始化
const init = () => {
  if (props.data.id) {
    title.value = $t('components.Save.069696-8')
    Object.assign(formModel.data, props.data)
  } else if (props.data.parentId) {
    title.value = $t('components.Save.069696-9')
    formModel.data = {
      name: '',
      sortIndex: props.data.sortIndex,
      parentId: props.data.parentId,
    }
  } else {
    title.value = $t('components.Save.069696-10')
    formModel.data = {
      name: '',
      sortIndex: props.data.sortIndex,
    }
  }
  formModel.beforeSortIndex = formModel.data.sortIndex
}

watch(
  () => props.data.id,
  () => {
    init()
  },
  {
    immediate: true,
  },
)
</script>
