<template>
  <div>
    <a-form
      ref="formRef"
      :model="formModel"
      layout="vertical"
      class="basic-form permission-form"
    >
      <a-form-item v-if="isNoCommunity" name="accessSupport" required>
        <template #label>
          <span style="margin-right: 3px">{{ $t('BasicInfo.Permission.040830-0') }}</span>
          <a-tooltip :title="$t('BasicInfo.Permission.040830-1')">
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
          <a-radio value="unsupported">{{ $t('BasicInfo.Permission.040830-2') }}</a-radio>
          <a-radio value="support">{{ $t('BasicInfo.Permission.040830-3') }}</a-radio>
          <a-radio value="indirect">
            <span style="margin-right: 3px">{{ $t('BasicInfo.Permission.040830-4') }}</span>
            <a-tooltip :title="$t('BasicInfo.Permission.040830-5')">
              <AIcon type="QuestionCircleFilled" class="img-style" />
            </a-tooltip>
          </a-radio>
        </a-radio-group>

        <a-form-item
          name="assetType"
          v-if="formModel.accessSupport === 'support'"
          :rules="[{ required: true, message: $t('BasicInfo.Permission.040830-6') }]"
          style="margin-top: 24px; margin-bottom: 0"
        >
          <a-select
            v-model:value="formModel.assetType"
            style="width: 500px"
            :placeholder="$t('BasicInfo.Permission.040830-6')"
            show-search
            :options="assetsType"
          >
          </a-select>
        </a-form-item>

        <a-form-item
          name="indirectMenus"
          v-if="formModel.accessSupport === 'indirect'"
          :rules="[{ required: true, message: $t('BasicInfo.Permission.040830-7') }]"
          style="margin-top: 24px; margin-bottom: 0"
        >
          <a-tree-select
            v-model:value="formModel.indirectMenus"
            style="width: 400px"
            :dropdown-style="{
              maxHeight: '400px',
              overflow: 'auto',
            }"
            :placeholder="$t('BasicInfo.Permission.040830-7')"
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
      <a-form-item :label="$t('BasicInfo.Permission.040830-8')" name="permissions">
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
import { isNoCommunity } from '@/utils';

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
      label: item.i18nName || item.name,
      value: item.id,
    }))
  })
}

onMounted(() => {
  queryMenuTree()
  if(isNoCommunity) {
    queryAssetsType()
  }
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