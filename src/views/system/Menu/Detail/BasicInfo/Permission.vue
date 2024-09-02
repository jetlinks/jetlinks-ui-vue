<template>
  <div>
    <a-form
      ref="formRef"
      :model="formModel"
      layout="vertical"
      class="basic-form permission-form"
    >
      <a-form-item name="accessSupport" required>
        <template #label>
          <span style="margin-right: 3px">数据权限控制</span>
          <a-tooltip title="此菜单页面数据所对应的资产类型">
            <AIcon
              type="QuestionCircleOutlined"
              class="img-style"
              style="color: #a6a6a6"
            />
          </a-tooltip>
        </template>
        <a-radio-group
          v-model:value="formModel.accessSupport"
          name="radioGroup"
        >
          <a-radio value="unsupported">不支持</a-radio>
          <a-radio value="support">支持</a-radio>
          <a-radio value="indirect">
            <span style="margin-right: 3px">间接控制</span>
            <a-tooltip title="此菜单内的数据基于其他菜单的数据权限控制">
              <AIcon type="QuestionCircleFilled" class="img-style" />
            </a-tooltip>
          </a-radio>
        </a-radio-group>

        <a-form-item
          name="assetType"
          v-if="formModel.accessSupport === 'support'"
          :rules="[{ required: true, message: '请选择资产类型' }]"
          style="margin-top: 24px; margin-bottom: 0"
        >
          <a-select
            v-model:value="formModel.assetType"
            style="width: 500px"
            placeholder="请选择资产类型"
            show-search
            :options="assetsType"
          >
          </a-select>
        </a-form-item>

        <a-form-item
          name="indirectMenus"
          v-if="formModel.accessSupport === 'indirect'"
          :rules="[{ required: true, message: '请选择关联菜单' }]"
          style="margin-top: 24px; margin-bottom: 0"
        >
          <a-tree-select
            v-model:value="formModel.indirectMenus"
            style="width: 400px"
            :dropdown-style="{
              maxHeight: '400px',
              overflow: 'auto',
            }"
            placeholder="请选择关联菜单"
            multiple
            show-search
            :tree-data="treeData"
            :field-names="{
              children: 'children',
              label: 'name',
              value: 'id',
            }"
          >
          </a-tree-select>
        </a-form-item>
      </a-form-item>
      <a-form-item label="权限" name="permissions">
        <PermissionChoose
          :first-width="3"
          max-height="350px"
          v-model:value="formModel.permissions"
          :key="formModel.id || ''"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import PermissionChoose from '../../components/PermissionChoose.vue'
import { getAssetsType, getMenuTree } from '@/api/system/menu'

const props = defineProps({
  value: {
    type: Object,
    default: () => {},
  },
})

const formModel = reactive({
  id: '',
  permissions: [],
  accessSupport: 'unsupported',
  assetType: undefined,
  indirectMenus: [],
})
const formRef = ref<any>()
const assetsType = ref<any[]>([])
const treeData = ref<any[]>([])

watch(
  () => props.value,
  () => {
    Object.assign(formModel, props.value)
    formModel.accessSupport = props.value?.accessSupport?.value || 'unsupported'
  },
  {
    deep: true,
    immediate: true,
  },
)

// 获取关联菜单
const queryMenuTree = () => {
  getMenuTree({ paging: false }).then((resp: any) => {
    treeData.value = resp.result
  })
}

// 获取资产类型
const queryAssetsType = () => {
  getAssetsType().then((resp: any) => {
    assetsType.value = resp.result.map((item: any) => ({
      label: item.name,
      value: item.id,
    }))
  })
}

onMounted(() => {
  queryMenuTree()
  queryAssetsType()
})

const onSave = () =>
  new Promise((resolve, reject) => {
    formRef.value
      .validate()
      .then((_data) => {
        resolve(_data)
      })
      .catch(() => {
        reject(false)
      })
  })

defineExpose({ onSave })
</script>