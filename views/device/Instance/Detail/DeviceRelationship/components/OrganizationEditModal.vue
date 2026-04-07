<template>
  <a-modal
      :open="true"
      :title="t('DeviceRelationship.OrganizationEditModal.532167-0')"
      width="1200px"
      @cancel="handleCancel"
      @ok="handleOk"
      :confirm-loading="loading"
      class="organization-modal"
  >
    <div class="modal-content">
      <div class="info-section">
        <div class="info-item">
          <AIcon type="InfoCircleOutlined" class="anticon"/>
          <span>{{ t('DeviceRelationship.OrganizationEditModal.532167-1') }}</span>
        </div>
        <div class="batch-actions">
          <span>{{ t('DeviceRelationship.OrganizationEditModal.532167-2') }}</span>
          <a-checkbox-group v-model:value="batchActions" :options="actionOptions" @change="handleBatchActionsChange"/>
          <a-switch
              v-model:checked="enableBatchActions"
              size="small"
              @change="handleEnableBatchActionsChange"
          />
        </div>
      </div>

      <div class="content-sections">
        <div class="left-section">
          <div class="section-header">
            <a-input
                v-model:value="searchText"
                :placeholder="t('DeviceRelationship.OrganizationEditModal.532167-3')"
            >
              <template #suffix>
                <AIcon type="SearchOutlined"/>
              </template>
            </a-input>
          </div>
          <div class="tree-container">
            <a-tree
              v-if='organizationTree?.length > 0'
                v-model:checkedKeys="checkedKeys"
                :tree-data="organizationTree"
                :field-names="{ children: 'children', title: 'name', key: 'id' }"
                checkable
                :checkStrictly="true"
                :show-icon="false"
                @check="handleCheckedKeysChange"
                :height='420'
            >
              <template #title="{ name }">
                <span>{{ name }}</span>
              </template>
            </a-tree>
            <div v-else style='margin-top: 100px'>
              <j-empty />
            </div>
          </div>
        </div>

        <div class="right-section">
          <div class="section-title">{{ t('DeviceRelationship.OrganizationEditModal.532167-4') }}</div>
          <div class="selected-items" v-if="checkedMaps.length > 0">
            <div
                v-for="item in checkedMaps"
                :key="item.id"
                class="selected-item"
            >
              <div>
                <div style="margin-bottom: 10px">{{ item.name }}</div>
                <a-checkbox-group
                    v-model:value="item.actions"
                    :disabled="enableBatchActions"
                    :options="actionOptions"
                />
              </div>
              <div class="item-actions">
                <a-button
                    type="text"
                    size="small"
                    @click="removeItem(item.id)"
                >
                  <template #icon>
                    <AIcon type="CloseOutlined"/>
                  </template>
                </a-button>
              </div>
            </div>
          </div>
          <div v-else style="height: 200px; margin-top: 20px">
            <j-empty />
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import {bindDeviceToOrgAll} from '@device-manager-ui/api/instance'
import { useRequest } from '@jetlinks-web/hooks'
import { omit } from 'lodash-es'
import { useInstanceStore } from '@device-manager-ui/store/instance'
import { onlyMessage } from '@jetlinks-web/utils'
import { moduleRegistry } from '@jetlinks-web-core/utils/module-registry'

const { t } = useI18n()
const getTreeData_api = moduleRegistry.getResourceItem('authentication-manager-ui', 'apis', 'getTreeData_api')

const props = defineProps({
  bindOrgList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])
const instanceStore = useInstanceStore()

const { data: organizationTree, loading: loadingOrganization } = useRequest(getTreeData_api, {
  defaultParams: {
    paging: false,
    sorts: [
      {
        name: "sortIndex",
        order: "asc"
      },
      {
        name: "name",
        order: "asc"
      }
    ]
  }
})
const loading = ref(false)
const searchText = ref('')
const checkedKeys = ref<{checked: string[], halfChecked: string[]}>({
  checked: props.bindOrgList.map(item => item.id),
  halfChecked: []
})
const checkedMaps = ref<Record<string, any>[]>(props.bindOrgList.map(item => ({...item})))
const batchActions = ref<string[]>(['read'])
const enableBatchActions = ref(false)

const actionOptions = computed(() => [
  {label: t('DeviceRelationship.index.710824-8'), value: 'read', disabled: true},
  {label: t('DeviceRelationship.index.710824-9'), value: 'save'},
  {label: t('DeviceRelationship.index.710824-10'), value: 'delete'},
  {label: t('DeviceRelationship.index.710824-11'), value: 'share'}
])


const selectedGroups = ref([])

const handleCancel = () => {
  emit('close')
}

const handleOk = async () => {
  // if (checkedMaps.value.length === 0) {
  //   onlyMessage('请选择组织', 'error')
  //   return
  // }
  loading.value = true
  try {
    // 模拟保存请求
    const res = await bindDeviceToOrgAll('device', instanceStore.current.id, 'org', checkedMaps.value.map(item => {
      return {
        assetType: 'device',
        targetId: item.id,
        assetIdList: [instanceStore.current.id],
        targetType: 'org',
        permission: item.actions
      }
    }))
    if(res.success) {
      onlyMessage('操作成功')
    }
    emit('save', {
      checkedKeys: checkedKeys.value,
      selectedGroups: selectedGroups.value,
      batchActions: batchActions.value
    })
  } finally {
    loading.value = false
  }
}

const removeItem = (id: string) => {
  const index = checkedMaps.value.findIndex(item => item.id === id)
  if (index > -1) {
    checkedMaps.value.splice(index, 1)
    checkedKeys.value.checked = checkedKeys.value.checked.filter(item => item !== id)
  }
}

const handleBatchActionsChange = (val: string[]) => {
  if(enableBatchActions.value) {
    checkedMaps.value.forEach(item => {
      item.actions = val
    })
  }
}

const handleCheckedKeysChange = (selectedKeys, e) => {
  if(e.checked) {
    checkedMaps.value.push({
      ...omit(e.node.dataRef, ['children']),
      actions: enableBatchActions.value ? batchActions.value : ['read']
    })
  } else {
    checkedMaps.value = checkedMaps.value.filter(item => item.id !== e.node.dataRef.id)
  }
}

const handleEnableBatchActionsChange = (val: boolean) => {
  enableBatchActions.value = val
  if(val) {
    checkedMaps.value.forEach(item => {
      item.actions = batchActions.value
    })
  } else {
    checkedMaps.value.forEach(item => {
      item.actions = ['read']
    })
  }
}



// 监听树选择变化，更新已选分组
watch(checkedKeys, (newKeys) => {
  // 这里可以根据选中的节点更新右侧已选分组
  // 实际项目中需要根据具体业务逻辑处理
}, {deep: true})
</script>

<style lang="less" scoped>
.organization-modal {
  .modal-content {
    .info-section {
      margin-bottom: 16px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;

      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding: 6px 12px;
        background-color: #F5F5F5;
        border-radius: 6px;
        border: 1px solid #cccccc;
        color: #1A1A1A;

        .anticon {
          color: @primary-color;
        }
      }

      .batch-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;

        span {
          color: #000;
          font-weight: 500;
        }
      }
    }

    .content-sections {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      height: 500px;

      .left-section {
        .section-header {
          margin-bottom: 16px;
        }

        .tree-container {
          height: 480px;
          overflow-y: auto;
        }
      }

      .right-section {

        .section-title {
          margin-bottom: 16px
        }

        .selected-items {
          height: calc(100% - 50px);
          overflow-y: auto;

          .selected-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
            margin-bottom: 8px;
            background: #f8f9fa;
            border-radius: 4px;
            border: 1px solid #e8e9ea;

            .item-actions {
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }
        }
      }
    }
  }
}

:deep(.ant-checkbox-group) {
  display: flex;
  gap: 8px;

  .ant-checkbox-wrapper {
    font-size: 12px;

    &.ant-checkbox-wrapper-checked {
      .ant-checkbox-wrapper span:last-child {
        color: #1890ff;
      }
    }
  }
}
</style>
