<template>
  <j-page-container>
    <div class="user-container">
      <pro-search
          :columns="columns"
          target="system-user"
          @search="handleParams"
      />
      <FullPage>
        <j-pro-table
            ref="tableRef"
            :columns="columns"
            :request="getUserList_api"
            mode="TABLE"
            :params="queryParams"
            :defaultParams="{
                        sorts: [
                            { name: 'createTime', order: 'desc' },
                            { name: 'username', order: 'asc', value: 'admin' },
                        ],
                    }"
            :scroll="{ y: 'calc(100% - 60px)' }"
        >
          <template #headerLeftRender>
            <j-permission-button
                :hasPermission="`${permission}:add`"
                type="primary"
                @click="table.openDialog('add')"
            >
              <AIcon type="PlusOutlined"/>
              {{ $t('User.index.673867-0') }}
            </j-permission-button>
          </template>
          <template #type="slotProps">
            {{ typeOptions.find(i => i.value === slotProps?.typeId)?.label || slotProps.typeId }}
          </template>
          <template #roleList="slotProps">
            <j-ellipsis>
              {{
                slotProps?.roleList
                    ?.map((item) => {
                      return item.name;
                    })
                    .join(',') || '--'
              }}
            </j-ellipsis>
          </template>
          <template #username="slotProps">
            <span class="user-tag">
              <j-ellipsis>{{ slotProps.username}}</j-ellipsis>
            </span>
          </template>
          <template #positions="slotProps">
            <j-ellipsis>
              {{
                slotProps?.positions
                    ?.map((item) => item.name)
                    .join(',') || '--'
              }}
            </j-ellipsis>
          </template>
          <template #status="slotProps">
            <j-badge-status
                :status="slotProps.status"
                :text="slotProps.status ? $t('User.index.673867-1') : $t('User.index.673867-2')"
                :statusNames="{
                                1: 'success',
                                0: 'error',
                            }"
            ></j-badge-status>
          </template>
          <template #action="slotProps">
            <a-space :size="16">
              <j-permission-button
                  :hasPermission="`${permission}:update`"
                  type="link"
                  :tooltip="{
                                    title: $t('User.index.673867-3'),
                                }"
                  @click="table.openDialog('edit', slotProps)"
              >
                <AIcon type="EditOutlined"/>
              </j-permission-button>
              <j-permission-button
                  :hasPermission="`${permission}:action`"
                  type="link"
                  :tooltip="{
                                    title: `${
                                        slotProps.status ? $t('User.index.673867-2') : $t('User.index.673867-4')
                                    }`,
                                }"
                  :popConfirm="{
                                    title: $t('User.index.673867-5', [slotProps.status ? $t('User.index.673867-2') : $t('User.index.673867-4')]),
                                    onConfirm: () =>
                                        table.changeStatus(slotProps),
                                }"
              >
                <AIcon
                    :type="
                                        slotProps.status
                                            ? 'StopOutlined'
                                            : 'PlayCircleOutlined'
                                    "
                />
              </j-permission-button>
              <j-permission-button
                  :hasPermission="`${permission}:update`"
                  type="link"
                  :tooltip="{
                                    title: $t('User.index.673867-6'),
                                }"
                  @click="table.openDialog('reset', slotProps)"
              >
                <AIcon type="icon-zhongzhimima"/>
              </j-permission-button>
              <j-permission-button
                  type="link"
                  :hasPermission="`${permission}:delete`"
                  danger
                  :tooltip="{
                                    title: slotProps.status
                                        ? $t('User.index.673867-7')
                                        : $t('User.index.673867-8'),
                                }"
                  :popConfirm="{
                                    title: $t('User.index.673867-9'),
                                    onConfirm: () =>
                                        table.clickDel(slotProps.id),
                                }"
                  :disabled="!!slotProps.status"
              >
                <AIcon type="DeleteOutlined"/>
              </j-permission-button>
            </a-space>
          </template>
        </j-pro-table>
      </FullPage>

      <EditUserDialog
          v-if="dialog.visible"
          :type="dialog.type"
          v-model:visible="dialog.visible"
          :data="dialog.selectItem"
          @confirm="table.refresh"
      />
    </div>
  </j-page-container>
</template>

<script setup lang="ts" name="UserMange">
import EditUserDialog from './components/EditUserDialog.vue';
import {
  getUserType_api,
  getUserList_api,
  changeUserStatus_api,
  deleteUser_api,
  queryRole_api,
} from '@/api/system/user';
import {onlyMessage} from '@jetlinks-web/utils';
import {useI18n} from 'vue-i18n';
import i18n from "@/locales";
import {queryPageNoPage} from "@/api/system/positions";
import {isNoCommunity} from '@/utils/utils';

const {t: $t} = useI18n();
const permission = 'system/User';

const typeOptions = ref([])

const columns = [
  {
    title: $t('User.index.673867-10'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('User.index.673867-11'),
    dataIndex: 'username',
    key: 'username',
    width: 150,
    scopedSlots: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('User.index.673867-12'),
    dataIndex: 'type',
    key: 'type',
    ellipsis: true,
    search: {
      type: 'select',
      options: () =>
          new Promise((resolve) => {
            resolve(typeOptions.value);
          }),
    },
    scopedSlots: true,
  },
  {
    title: $t('User.index.673867-13'),
    dataIndex: 'roleList',
    key: 'roleList',
    search: {
      type: 'select',
      // rename:'id$in-dimension$role',
      options: () =>
          new Promise((resolve) => {
            queryRole_api({
              paging: false,
              sorts: [
                {name: 'createTime', order: 'desc'},
                {name: 'id', order: 'desc'},
              ],
            }).then((resp: any) => {
              resolve(
                  resp.result.map((item: dictType) => ({
                    label: item.name,
                    value: item.id,
                  })),
              );
            });
          }),
    },
    scopedSlots: true,
  },
  {
    title: $t('User.index.673867-14'),
    dataIndex: 'status',
    key: 'status',
    ellipsis: true,
    search: {
      rename: 'status',
      type: 'select',
      options: [
        {
          label: $t('User.index.673867-1'),
          value: 1,
        },
        {
          label: $t('User.index.673867-2'),
          value: 0,
        },
      ],
    },
    scopedSlots: true,
  },
  {
    title: $t('User.index.673867-15'),
    dataIndex: 'telephone',
    key: 'telephone',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('User.index.673867-16'),
    dataIndex: 'email',
    key: 'email',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('User.index.673867-17'),
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 180,
    scopedSlots: true,
  },
];

if(isNoCommunity) {
  columns.splice(4, 0, {
    title: i18n.global.t('Department.util.780026-9'),
    dataIndex: 'positions',
    key: 'positions',
    width: 150,
    search: {
      type: 'select',
      // componentProps: {
      //   placeholder: i18n.global.t('Department.util.780026-3'),
      // },
      options() {
        return queryPageNoPage().then(resp => {
          if (resp.success) {
            return resp.result.map(item => {
              return {
                label: item.name,
                value: item.id
              }
            })
          }
          return []
        })
      }
    },
    scopedSlots: true,
  } as any)
}
const queryParams = ref({});

const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = {
  // 打开编辑弹窗
  openDialog: (type: modalType, row?: any) => {
    dialog.selectItem = {...(row || {})};
    dialog.type = type;
    dialog.visible = true;
  },
  changeStatus: ({id, status}: any) => {
    const params = {
      status: status === 0 ? 1 : 0,
      id,
    };
    changeUserStatus_api(params).then(() => {
      onlyMessage($t('User.index.673867-18'));
      table.refresh();
    });
  },
  // 删除
  clickDel: (id: string) => {
    deleteUser_api(id).then(() => {
      onlyMessage($t('User.index.673867-18'));
      table.refresh();
    });
  },
  // 刷新列表
  refresh: () => {
    tableRef.value.reload();
  },
};

const dialog = reactive({
  selectItem: {},
  visible: false,
  type: '' as modalType,
});

type dictType = {
  id: string;
  name: string;
};
type modalType = '' | 'add' | 'edit' | 'reset';

const handleParams = (params: any) => {
  const newParams = (params?.terms as any[])?.map((termsGroupA) => {
    let arr: any[] = [];
    termsGroupA.terms = termsGroupA.terms.map((termsItem: any) => {
      if (termsItem.column === 'id$in-dimension$role') {
        let _termType =
            termsItem.termType === 'nin'
                ? 'not$in'
                : termsItem.termType;
        termsItem.column = `${termsItem.column}$${_termType}`;
        delete termsItem.termType;
      }
      if (['telephone', 'email'].includes(termsItem.column)) {
        return {
          column: 'id$user-detail',
          value: [termsItem],
        };
      }
      if (
          ['type'].includes(termsItem.column) &&
          termsItem.value === 'other'
      ) {
        arr = [
          {
            ...termsItem,
            type: 'or',
            termType: 'isnull',
            value: 1,
          },
          {
            ...termsItem,
            type: 'or',
            termType: 'empty',
            value: 1,
          },
        ];
      }
      if (termsItem.column === 'roleList') {
        const isIncludeTermType = ['eq', 'in'].includes(termsItem.termType);
        return {
          column: `id$in-dimension$role${!isIncludeTermType ? '$not' : ''}`,
          type: termsItem.type,
          value: termsItem.value,
        };
      }
      if (termsItem.column === 'positions') {
        const isIncludeTermType = ['eq', 'in'].includes(termsItem.termType);
        return {
          column: `id$in-dimension$position${!isIncludeTermType ? '$not' : ''}`,
          type: termsItem.type,
          value: termsItem.value,
        };
      }
      return termsItem;
    });

    if (arr.length) {
      termsGroupA.terms = [...termsGroupA.terms, ...arr];
    }

    return termsGroupA;
  });
  queryParams.value = {terms: newParams || []};
};

onMounted(() => {
  getUserType_api().then(resp => {
    if(resp.success){
      typeOptions.value = (resp.result || []).map((item: dictType) => ({
        label: item.name,
        value: item.id,
      }))
    }
  })
})
</script>

<style lang="less" scoped>
.user-container {
  :deep(.ant-table-tbody) {
    .ant-table-cell {
      .ant-space-item {
        .ant-btn-link {
          padding: 0;
        }
      }
    }
  }
}

.user-tag {
  border: 1px solid var(--ant-info-color-deprecated-border);
  color: var(--ant-info-color);
  background-color: var(--ant-info-color-deprecated-bg);
  border-radius: 2px;
  padding: 0 7px;
  font-size: 12px;
  display: inline-block;
}
</style>
