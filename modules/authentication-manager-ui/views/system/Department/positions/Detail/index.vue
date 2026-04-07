<script setup name="Detail">
import { useI18n } from 'vue-i18n';
import User from './User.vue'
import {onlyMessage} from "@jetlinks-web/utils";
import {detail, save, update} from '@authentication-manager-ui/api/system/positions'
import { useRequest } from '@jetlinks-web/hooks'
import {usePositionList} from "../data";
import {getDepartmentList_api} from "@jetlinks-web-core/api/system/user";
import {cloneDeep} from "lodash-es";
import {filterSelectNode} from "@jetlinks-web-core/utils";

const { t: $t } = useI18n();

const activeKey = ref('basic')
const formRef = ref()
const route = useRoute()
const router = useRouter()
const oldData = ref({})
const { loading, run } = useRequest(save, {
  onSuccess: (resp) => {
    onlyMessage($t('Detail.index.707691-33'))
    if (window.onTabSaveSuccess) {
      window.onTabSaveSuccess(resp.result.id);
      setTimeout(() => window.close(), 300);
    } else {
      router.replace({ name: 'system/Department/positions/Detail', params: { id: resp.result.id }, query: { ...route.query } })
    }
  },
  immediate: false
})

const { loading: updateLoading, run: updateRun } = useRequest(update, {
  onSuccess: () => {
    onlyMessage($t('Detail.index.707691-33'))
  },
  immediate: false
})

// 改成组织树，职位展示在子节点，只能选择职位，而且在编辑的时候不能选择当前已经选择的职位的下级职位
const { data: positionsList } = usePositionList(route.params.id !== ':id' ? { terms: [{
    column: 'id',
    termType: 'not',
    value: route.params.id
  }],
  sorts: [{name: 'createTime', order: 'desc'}]
} : { sorts: [{name: 'createTime', order: 'desc'}]}, (result) => {

  const _map = new Map()
  result.forEach(item => {
    const arr = _map.get(item.orgId) || [];
    arr.push(item);
    _map.set(item.orgId, arr);
  })
  return _map
})

const { data: treeData } = useRequest(getDepartmentList_api, {
  defaultParams: {
    paging: false,
    sorts: [
      { name: "sortIndex", order: "asc" },
      { name: "createTime", order: "asc" },
    ],
  },
  defaultValue: [],
});

const handleOrgData = (orgList, positionListMap, disabledIds = []) => {
  const _disabledIds = [...disabledIds]
  return orgList.map(item => {

    let _children = positionListMap.get(item.id) || []

    if (_children) {
      _children = _children.map(pos => {
        const flag = _disabledIds.includes(pos.parentId)
        if(flag && !_disabledIds.includes(pos.id)){
          _disabledIds.push(pos.id)
        }
        return {
          ...pos,
          disabled: flag
        }
      })
    }

    // const _children = positionList.filter(pos => pos.orgId === item.id).map(pos => {
    //   const flag = _disabledIds.includes(pos.parentId)
    //   if(flag && !_disabledIds.includes(pos.id)){
    //     _disabledIds.push(pos.id)
    //   }
    //   return {
    //     ...pos,
    //     disabled: flag
    //   }
    // })
    return {
      ...item,
      disabled: true,
      children: [...handleOrgData(item.children || [], positionsList.value, _disabledIds), ..._children]
    }
  })
}

const _treeData = computed(() => {
  const disabledIds = []
  if(oldData.value.id) {
    disabledIds.push(oldData.value.id)
  }

  return handleOrgData(treeData.value, positionsList.value, disabledIds)
})


const formModel = reactive({
  code: undefined,
  name: undefined,
  orgId: route.query.departmentId,
  roles: undefined,
  parentId: undefined,
  description: undefined,
})

const onTabClick = (v) => {
  if (route.params.id !== ':id') {
    activeKey.value = v
    return
  }
  onlyMessage($t('positions.index.223804-3'), 'warning')
}

const onSave = async () => {
  const result = await formRef.value.validateFields()
  if (result) {
    const obj = {
      ...formModel,
      roles: formModel.roles?.map(item => ({ id: item })),
    }

    if (formModel.id) {
      updateRun(formModel.orgId, [toRaw(obj)])
    } else {
      run(formModel.orgId, toRaw(obj))
    }
  }
}

const getDetail = (id) => {
  detail(id).then((resp) => {
    if (resp.success && resp.result.length) {
      const record = resp.result[0]
      oldData.value = cloneDeep(record)
      Object.keys(formModel).forEach(key => {
        if (key === 'roles') {
          formModel[key] = record.roles?.map(item => item.id)
        } else {
          formModel[key] = record[key]
        }
      })
      formModel.id = record.id
    }
  })
}

watch(() => route.params.id, (v) => {
  if (v && v !== ':id') {
    getDetail(v)
  }
}, { immediate: true })

watch(() => route.query.tab, (v) => {
  if(v && v === 'user') {
    activeKey.value = 'user'
  }
}, {immediate: true})
</script>

<template>
  <j-page-container>
    <full-page>
      <div class="menu-detail-container">
        <a-tabs :activeKey="activeKey" type="card" @tabClick="onTabClick">
          <a-tab-pane key="basic" :tab="$t('Detail.index.765389-0')">
            <a-form ref="formRef" :model="formModel" layout="vertical">
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item validate-first :label="$t('components.EditUserDialog.939453-37')" name="code" :rules="[
                    { required: true, message: $t('components.EditUserDialog.939453-36') },
                    { max: 64, message: $t('components.EditUserDialog.939453-5')},
                     {
                                    pattern: /^[a-zA-Z0-9_\-]+$/,
                                    message: $t('Save.index.902471-2'),
                                }
                  ]">
                    <a-input v-model:value="formModel.code" :placeholder="$t('components.EditUserDialog.939453-36')"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    :label="$t('components.EditUserDialog.939453-3-1')"
                    name="name"
                    :rules="[
                            { required: true, message: $t('positions.index.223804-4') },
                            {
                                max: 64,
                                message: $t('components.EditUserDialog.939453-5'),
                            },
                        ]"
                  >
                    <a-input v-model:value="formModel.name" :placeholder="$t('positions.index.223804-4')" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item name="orgId" :label="$t('components.EditUserDialog.939453-14-1')" :rules="[{ required : true, message: '请选择组织'}]">
                    <form-item-org v-model:value="formModel.orgId" :extraProps="{ multiple: false, disabled: true }" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    name="roles"
                    :label="$t('components.EditUserDialog.939453-12')"
                    :rules="[{ required: true, message: $t('components.EditUserDialog.939453-13') }]"
                  >
                    <form-item-role v-model:value="formModel.roles" :extraProps="{multiple: true}" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="$t('positions.index.223804-1')">
                    <a-tree-select :tree-line="{ showLeafIcon: false }" :filterTreeNode="(v, node) => filterSelectNode(v, node, 'name')" showSearch :fieldNames="{ label: 'name', value: 'id' }" allowClear v-model:value="formModel.parentId" :tree-data="_treeData" :placeholder="$t('positions.index.223804-2')" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item :label="$t('BasicInfo.Info.607342-15')" name="description">
                    <a-textarea
                      v-model:value="formModel.description"
                      :rows="4"
                      show-count
                      :maxlength="200"
                      :placeholder="$t('BasicInfo.Info.607342-16')"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <j-permission-button
              hasPermission="system/Department:bind-position"
              type="primary"
              :loading="loading || updateLoading"
              @click="onSave"
            >
              {{ $t('Setting.index.113436-2')}}
            </j-permission-button>
          </a-tab-pane>
          <a-tab-pane key="user" :tab="$t('Detail.index.386725-1')">
            <User :orgId="formModel.orgId" :roleIds="formModel.roles"/>
          </a-tab-pane>
        </a-tabs>
      </div>
    </full-page>
  </j-page-container>
</template>

<style scoped lang="less">
  .menu-detail-container {
    padding: 24px;
    height: 100%;

     :deep(.ant-tabs) {
      height: 100%;

      .ant-tabs-content-holder {
        flex: 1;
        min-height: 0;

        .ant-tabs-content-top {
          height: 100% !important;

          .ant-tabs-tabpane {
            height: 100%;
          }
        }
      }
    }
  }
</style>
