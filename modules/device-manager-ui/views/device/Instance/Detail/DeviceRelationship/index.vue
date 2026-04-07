<template>
  <div class="device-relationship">
    <div class="sections-container">
      <!-- 正向关系部分 -->
      <template v-if='isRelation'>
        <div class="section-card">
          <div class="section-header">
            <div class="header-left">
              <div class="section-title">
                <TitleComponent :data="$t('DeviceRelationship.index.710824-0')">
                  <template #extra>
                    <a-tooltip :title="$t('DeviceRelationship.index.710824-12')">
                      <AIcon type="QuestionCircleOutlined" class="help-icon"/>
                    </a-tooltip>
                  </template>
                </TitleComponent>
              </div>
            </div>
            <j-permission-button
              hasPermission="device/Instance:update"
              type="text"
              @click="handleEditRelationship"
              class="edit-icon"
            >
              <AIcon type="FormOutlined"/>
            </j-permission-button>
          </div>
          <div class="section-content">
            <div class="relation-count">
              <div>{{ $t('DeviceRelationship.index.710824-1') }}</div>
              <div class="count-num">{{ relationCount }}</div>
            </div>
            <div class="relation-list" v-if='relationshipData.length > 0'>
              <div
                v-for="item in relationshipData"
                :key="item.objectId"
                :class="{'relation-item': true, 'relation-item-unrelated': !item.related}"
              >
                <div class="relation-label">{{ item.relationName }}</div>
                <div class="relation-value">{{ item.related?.map(it => it.name).join('、') }}</div>
              </div>
            </div>
            <div v-else style='margin-top: 50px'>
              <j-empty />
            </div>
          </div>
        </div>
      </template>

      <!-- 组织部分 -->
      <div class="section-card">
        <div class="section-header">
          <div class="header-left">
            <div class="section-title">
              <TitleComponent :data="$t('DeviceRelationship.index.710824-2')" />
            </div>
          </div>
          <j-permission-button
            hasPermission="device/Instance:update"
            type="text"
            @click="handleEditOrganization"
            class="edit-icon"
          >
            <AIcon type="FormOutlined"/>
          </j-permission-button>
        </div>
        <div class="section-content">
          <TreeList
            :data="organizationTreeData"
            :loading="loadingOrganization"
            :bindOrgList="bindOrgList"
            @view-change="handleOrganizationViewChange"
          >
            <template #extra-controls>
              <AIcon type="UnorderedListOutlined" class="list-icon"/>
            </template>
            <template #header-extra>
              <div class="organization-count">
                {{ $t('DeviceRelationship.index.710824-3') }}
                <span class="count-num">{{ bindOrgList?.length }}</span>
              </div>
            </template>
            <template #actions="{ item, level }">
              <a-tag
                v-for="permission in bindOrgAuthList?.find(it => it.targetId === item.id || item.key)?.grantedPermissions || []"
                :key="permission"
              >
                {{ permissionMap[permission] }}
              </a-tag>
            </template>
            <template #empty>
              <div class="empty-text">{{ $t('DeviceRelationship.index.710824-4') }}</div>
            </template>
          </TreeList>
        </div>
      </div>

      <!-- 分组部分（暂未启用，如需启用请同步补全国际化文案）-->
      <!-- <div class="section-card">
        <div class="section-header">
          <div class="header-left">
            <div class="section-title">
              <TitleComponent :data="$t('DeviceRelationship.index.710824-5')">
                <template #extra>
                  <AIcon type="QuestionCircleOutlined" class="help-icon"/>
                </template>
              </TitleComponent>
            </div>
          </div>
          <AIcon type="FormOutlined" class="edit-icon" @click="handleEditGroup"/>
        </div>
        <div class="section-content">
          <TreeList
            :data="groupTreeData"
            :loading="loading.groups"
            @view-change="handleGroupViewChange"
          >
            <template #header-extra>
              <div class="group-count">
                {{ $t('DeviceRelationship.index.710824-6') }}
                <span class="count-num">{{ groupCount }}</span>
              </div>
            </template>
            <template #actions="{ item, level }">
              <a-button type="text" size="small" class="action-view">
                {{ $t('DeviceRelationship.index.710824-8') }}
              </a-button>
            </template>
            <template #empty>
              <div class="empty-text">{{ $t('DeviceRelationship.index.710824-7') }}</div>
            </template>
          </TreeList>
        </div>
      </div> -->
    </div>
  </div>

  <RelationshipEditModal
      v-if="showRelationshipModal"
      @close="showRelationshipModal = false"
      @save="handleSaveRelationship"
  />

  <OrganizationEditModal
      v-if="showOrganizationModal"
      :bindOrgList="bindOrgListWithAuth"
      @close="showOrganizationModal = false"
      @save="handleSaveOrganization"
  />

  <GroupEditModal
      v-if="showGroupModal"
      @close="showGroupModal = false"
      @save="handleSaveGroup"
  />

</template>

<script lang="ts" setup>
import RelationshipEditModal from './components/RelationshipEditModal.vue'
import OrganizationEditModal from './components/OrganizationEditModal.vue'
import GroupEditModal from './components/GroupEditModal.vue'
import TreeList from './components/TreeList.vue'
import { useInstanceStore } from '@device-manager-ui/store/instance';
import { getOrgList, getBindOrgAuthList } from '@device-manager-ui/api/instance'
import { useRequest } from '@jetlinks-web/hooks'
import { moduleRegistry } from '@jetlinks-web-core/utils/module-registry'
import { useI18n } from 'vue-i18n'
import { useMenuStore } from '@jetlinks-web-core/store'

const { t: $t } = useI18n()

const getTreeData_api = moduleRegistry.getResourceItem('authentication-manager-ui', 'apis', 'getTreeData_api')
const instanceStore = useInstanceStore();
const treeView = ref('tree')
const groupTreeView = ref(true)
const showRelationshipModal = ref(false)
const showOrganizationModal = ref(false)
const showGroupModal = ref(false)

// 数据状态
const loading = reactive({
  relations: false,
  organizations: false,
  groups: false
})

const permissionMap = {
  read: $t('DeviceRelationship.index.710824-8'),
  save: $t('DeviceRelationship.index.710824-9'),
  delete: $t('DeviceRelationship.index.710824-10'),
  share: $t('DeviceRelationship.index.710824-11'),
}
const menuStore = useMenuStore();

const organizationData = ref<any[]>([])
const groupData = ref<any[]>([])

const isRelation = computed(() => {
  return menuStore.hasMenu('system/Relationship')
})

const { data: organizationList, loading: loadingOrganization, reload: reloadOrganizationList } = useRequest(getTreeData_api, {
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

const { data: bindOrgAuthList, reload: reloadBindOrgAuthList } = useRequest(getBindOrgAuthList, {
  defaultParams: ['device', instanceStore.current?.id || '', 'org']
})

const { data: bindOrgList, reload: reloadBindOrgList } = useRequest(getOrgList, {
  defaultParams: {
    terms: [
      {
        column: 'id',
        termType: 'assets-dim',
        value: {
          assetType: 'device',
          assetIds: [
            instanceStore.current?.id
          ],
          dimensionType: 'org'
        }
      }
    ]
  }
})

const bindOrgListWithAuth = computed(() => {
  return bindOrgList.value?.map(it => ({
    ...it,
    actions: bindOrgAuthList.value?.find(auth => auth.targetId === it.id)?.grantedPermissions || []
  })) || []
})
// 树形数据结构
const organizationTreeData = computed(() => {
  return organizationList.value || []
})

// const groupTreeData = computed(() => [
//   {
//     id: '1',
//     name: '智慧工厂',
//     children: [
//       {
//         id: '2',
//         name: '重庆/月亮湾项目'
//       },
//       {
//         id: '3',
//         name: '重庆月亮湾项目'
//       }
//     ]
//   },
//   {
//     id: '4',
//     name: '物联网产品基地/A栋/5楼'
//   }
// ])

// 统计数据
const relationshipData = computed(() => instanceStore.current?.relations || [])
const relationCount = computed(() => {
  return relationshipData.value?.reduce((acc, cur) => {
    if(cur.related) {
      acc++
    }
    return acc
  }, 0)
})

// 视图切换事件
const handleOrganizationViewChange = (view: 'tree' | 'flat') => {
  treeView.value = view
}

const handleGroupViewChange = (view: 'tree' | 'flat') => {
  groupTreeView.value = view === 'tree'
}

// 默认操作按钮
const getDefaultActions = () => [
  { type: 'view', label: $t('DeviceRelationship.index.710824-8') },
  { type: 'edit', label: $t('DeviceRelationship.index.710824-9') },
  { type: 'delete', label: $t('DeviceRelationship.index.710824-10') },
  { type: 'share', label: $t('DeviceRelationship.index.710824-11') }
]

const handleEditRelationship = () => {
  showRelationshipModal.value = true
}

const handleEditOrganization = () => {
  showOrganizationModal.value = true
}

const handleEditGroup = () => {
  showGroupModal.value = true
}

const handleSaveRelationship = () => {
  showRelationshipModal.value = false
  instanceStore.refresh(instanceStore.current?.id || '')
}

const handleSaveOrganization = () => {
  showOrganizationModal.value = false
  reloadOrganizationList()
  reloadBindOrgList()
  reloadBindOrgAuthList()
}

const handleSaveGroup = () => {
  showGroupModal.value = false
}

// 数据获取方法
const fetchDeviceInfo = async () => {
  // try {
  //   loading.relations = true
  //   const response = await detail(props.deviceId)
  //   if (response.success) {
  //     deviceInfo.value = response.result
  //     // 处理设备关系数据
  //     parseRelationshipData(response.result)
  //   }
  // } catch (error) {
  //   console.error('获取设备信息失败:', error)
  // } finally {
  //   loading.relations = false
  // }
}

const fetchOrganizationData = async () => {
  // try {
  //   loading.organizations = true
  //   // 获取设备组织绑定信息
  //   const response = await getBindingsPermission('device', [props.deviceId])
  //   if (response.success && response.result) {
  //     organizationData.value = response.result.map((item: any) => ({
  //       id: item.targetId,
  //       name: item.targetName || item.target,
  //       type: item.targetType,
  //       actions: parseActions(item.permissions || [])
  //     }))
  //   }
  // } catch (error) {
  //   console.error('获取组织数据失败:', error)
  // } finally {
  //   loading.organizations = false
  // }
}

const fetchGroupData = async () => {
  try {
    loading.groups = true
    // 模拟获取分组数据，实际应根据API调整
    // 这里可以调用具体的分组API
    groupData.value = [
      { id: '1', name: '智慧工厂-重庆/月亮湾项目' },
      { id: '2', name: '智慧工厂-重庆月亮湾项目' },
      { id: '3', name: '物联网产品基地/A栋/5楼' }
    ]
  } catch (error) {
    console.error('获取分组数据失败:', error)
  } finally {
    loading.groups = false
  }
}

// 初始化数据
onMounted(() => {
  if (instanceStore.current?.id) {
    fetchDeviceInfo()
    fetchOrganizationData()
    fetchGroupData()
  }
})
</script>

<style lang="less" scoped>
.device-relationship {
  background: #fff;
  height: 100%;

  .sections-container {
    display: flex;
    gap: 16px;
    height: 100%;

    .section-card {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;

        .header-left {
          display: flex;
          align-items: center;
          gap: 6px;

          .section-title {
            color: #1890ff;

            :deep(.title) {
              margin-bottom: 0;
            }
          }

          .help-icon {
            color: #999;
            margin-left: 8px;
          }
        }

        .edit-icon {
          color: #999;
          font-size: 14px;
          cursor: pointer;

          &:hover {
            color: #1890ff;
          }
        }
      }

      .section-content {
        padding: 12px 16px;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        background-color: #F7F8FA;
        display: flex;
        flex-direction: column;
      }
    }

    // 正向关系样式
    .section-card:first-child {
      .relation-count {
        margin-bottom: 12px;
        color: #191C27;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .count-num {
          background-color: #EFF0F1;
          color: #1F2429;
          margin-left: 10px;
          padding: 4px;
        }
      }

      .relation-list {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        .relation-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: #F1F7FF;
          border: 1px solid #BAE0FF;
          &.relation-item-unrelated {
            background-color: #F0F0F0;
            border-color: #F0F0F0;
          }
          &:not(:last-child) {
            margin-bottom: 10px;
          }

          .relation-label {
            color: #777777;
            max-width: 50%;
          }

          .relation-value {
            color: #1A1A1A;
            text-align: right;
            flex: 1;
          }
        }
      }
    }

    // 组织部分样式
    .section-card:nth-child(2) {
      .view-controls {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;

        .ant-btn-sm {
          height: 24px;
          padding: 0 8px;
          border-radius: 2px;
        }

        .list-icon {
          color: #999;
          font-size: 14px;
          margin-left: 4px;
        }
      }

      .organization-count {
        margin-bottom: 12px;
        color: #191C27;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .count-num {
          background-color: #EFF0F1;
          color: #1F2429;
          margin-left: 10px;
          padding: 4px;
        }
      }

      .organization-content {
        .org-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 0;
          line-height: 20px;

          &.sub-item {
            padding-left: 16px;
          }

          &.sub-sub-item {
            padding-left: 32px;
            background: #f0f8ff;
            border-left: 3px solid #1890ff;
            margin: 2px 0;
            padding-right: 8px;
            border-radius: 0 4px 4px 0;
          }

          .expand-icon {
            width: 12px;
            height: 12px;
            margin-right: 4px;
            color: #999;
            font-size: 10px;
            transform: translateY(0);

            &.expanded {
              color: #1890ff;
            }
          }

          .org-name {
            flex: 1;
            color: #333;
          }

          .org-actions {
            display: flex;
            gap: 2px;

            .ant-btn {
              height: 20px;
              padding: 0 4px;
              border: none;
              border-radius: 2px;

              &.action-view {
                color: #1890ff;
                background: #f0f8ff;
              }

              &.action-edit {
                color: #52c41a;
                background: #f6ffed;
              }

              &.action-delete {
                color: #ff4d4f;
                background: #fff2f0;
              }

              &.action-share {
                color: #722ed1;
                background: #f9f0ff;
              }

              &:hover {
                opacity: 0.8;
              }
            }
          }
        }
      }
    }

    // 分组部分样式
    .section-card:last-child {
      .view-controls {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;

        .ant-btn-sm {
          height: 24px;
          padding: 0 8px;
          border-radius: 2px;
        }
      }

      .group-count {
        margin-bottom: 8px;
        color: #666;

        .count-num {
          color: #1890ff;
          font-weight: 500;
        }
      }

      .group-list {
        .group-item {
          padding: 6px 8px;
          margin-bottom: 4px;
          background: #f8f9fa;
          border-radius: 4px;
          color: #333;
        }
      }
    }

    // 通用样式
    .list-icon {
      color: #999;
      font-size: 14px;
      margin-left: 4px;
    }

    .organization-count,
    .group-count {
      color: #191C27;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .count-num {
        background-color: #EFF0F1;
        color: #1F2429;
        margin-left: 10px;
        padding: 4px;
        border-radius: 2px;
      }
    }

    .empty-text {
      color: #999;
      font-size: 14px;
      text-align: center;
      padding: 20px;
    }

    // 操作按钮样式
    :deep(.ant-btn) {
      &.action-view {
        color: #1890ff;
        background: #f0f8ff;
        border: none;
        height: 20px;
        padding: 0 4px;
        border-radius: 2px;
      }

      &.action-edit {
        color: #52c41a;
        background: #f6ffed;
        border: none;
        height: 20px;
        padding: 0 4px;
        border-radius: 2px;
      }

      &.action-delete {
        color: #ff4d4f;
        background: #fff2f0;
        border: none;
        height: 20px;
        padding: 0 4px;
        border-radius: 2px;
      }

      &.action-share {
        color: #722ed1;
        background: #f9f0ff;
        border: none;
        height: 20px;
        padding: 0 4px;
        border-radius: 2px;
      }

      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
