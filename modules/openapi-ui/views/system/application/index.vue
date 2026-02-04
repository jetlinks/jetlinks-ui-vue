<template>
  <j-page-container>
    <div class="apply-container">
      <pro-search
          :columns="columns"
          target="system-apply"
          @search="(params:any)=>queryParams = {...params}"
      />
      <FullPage>
        <j-pro-table
            ref="tableRef"
            :columns="columns"
            modeValue="CARD"
            :request="getApplyList_api"
            :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                        terms: [
                            {
                                column: 'provider',
                                termType: 'eq',
                                value: 'third-party'
                            }
                        ]
                    }"
            :params="queryParams"
            :gridColumn="3"
        >
          <template #headerLeftRender>
            <div style="display: flex; align-items: center">
              <j-permission-button
                  :hasPermission="`${permission}:add`"
                  type="primary"
                  @click="() => table.toAdd()"
              >
                <AIcon type="PlusOutlined"/>
                {{ $t('Apply.index.483342-0') }}
              </j-permission-button>
              <p style="margin: 0 0 0 30px; color: #0000008c">
                <j-ellipsis>
                  <AIcon
                      type="ExclamationCircleOutlined"
                      style="margin-right: 12px"
                  />
                  {{ $t('Apply.index.483342-1') }}
                </j-ellipsis>
              </p>
            </div>
          </template>
          <template #card="slotProps">
            <CardBox
                :value="slotProps"
                :actions="table.getActions(slotProps, 'card')"
                v-bind="slotProps"
                :status="slotProps.state?.value"
                :statusText="slotProps.state?.text"
                :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
            >
              <template #img>
                <slot name="img">
                  <Image class="card-list-img-80" :src="slotProps.logoUrl || systemImg.applyImg" />
                </slot>
              </template>
              <template #content>
                <j-ellipsis
                    style="
                                        width: calc(100% - 100px);
                                        font-size: 16px;
                                        color: rgb(49, 94, 251);
                                        font-weight: 700;
                                        margin-bottom: 8px;
                                    "
                >
                  {{ slotProps.name }}
                </j-ellipsis>
                <a-row>
                  <a-col :span="12">
                    <div class="card-item-content-text">
                      {{ $t('Apply.index.483342-2') }}
                    </div>
                    <div>
                      {{
                        table.getTypeLabel(
                            slotProps.provider,
                        )
                      }}
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="card-item-content-text">
                      {{ $t('Apply.index.483342-3') }}
                    </div>
                    <j-ellipsis>
                      {{ slotProps.description }}
                    </j-ellipsis>
                  </a-col>
                </a-row>
              </template>
              <template #actions="item">
                <a-tooltip
                    v-bind="item.tooltip"
                    :title="item.disabled && item.tooltip?.title"
                >
                  <j-permission-button
                      :hasPermission="item.permission"
                      :tooltip="item.tooltip"
                      :pop-confirm="item.popConfirm"
                      @click="item.onClick"
                      :disabled="item.disabled"
                  >
                    <AIcon :type="item.icon"/>
                    <span v-if="item.key !== 'delete'">{{
                        item.text
                      }}</span>
                  </j-permission-button>
                </a-tooltip>
              </template>

              <!-- <template #mark>
                  <AIcon
                      type="EyeOutlined"
                      style="font-size: 24px"
                      @click="
                          () => table.toSave(slotProps.id, true)
                      "
                  />
              </template> -->
            </CardBox>
          </template>

          <template #provider="slotProps">
            {{ table.getTypeLabel(slotProps.provider) }}
          </template>
          <template #status="slotProps">
            <JBadgeStatus
                :status="slotProps.state.value"
                :text="slotProps.state.text"
                :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
            ></JBadgeStatus>
          </template>
          <template #action="slotProps">
            <a-space :size="16">
              <j-permission-button
                  v-for="i in table.getActions(
                                    slotProps,
                                    'table',
                                )"
                  :hasPermission="i.permission"
                  type="link"
                  :key="i.key"
                  :tooltip="i.tooltip"
                  :pop-confirm="i.popConfirm"
                  @click="i.onClick"
                  :disabled="i.disabled"
              >
                <AIcon :type="i.icon"/>
              </j-permission-button>
            </a-space>
          </template>
        </j-pro-table>
      </FullPage>
    </div>
  </j-page-container>
</template>

<script setup lang="ts" name="Apply">
import {
  getApplyList_api,
  changeApplyStatus_api,
  delApply_api,
  queryType,
} from '@authentication-manager-ui/api/system/apply';
import {onlyMessage} from '@jetlinks-web/utils';
import {useMenuStore} from '@jetlinks-web-core/store/menu';
import {systemImg} from "@authentication-manager-ui/assets";
import {useI18n} from 'vue-i18n';

const {t: $t} = useI18n();
const menuStory = useMenuStore();
const permission = 'system/application';

const typeOptions = ref<any[]>([]);

const columns = [
  {
    title: $t('Apply.index.483342-4'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },

  {
    title: $t('Apply.index.483342-5'),
    dataIndex: 'status',
    key: 'status',
    ellipsis: true,
    search: {
      rename: 'state',
      type: 'select',
      options: [
        {
          label: $t('Apply.index.483342-6'),
          value: 'enabled',
        },
        {
          label: $t('Apply.index.483342-7'),
          value: 'disabled',
        },
      ],
    },
    scopedSlots: true,
  },
  {
    title: $t('Apply.index.483342-3'),
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Apply.index.483342-8'),
    dataIndex: 'action',
    key: 'action',
    scopedSlots: true,
    width: '200px',
    fixed: 'right',
  },
];
const queryParams = ref({});

const tableRef = ref();
const current = ref<any>({});
const table = {
  refresh: () => {
    tableRef.value.reload(queryParams.value);
    // window.location.reload();
  },
  toAdd: () => {
    // 直接跳转到创建页面，不再显示应用类型选择弹窗
    menuStory.jumpPage('system/application/Save', {});
  },
  toSave: (id?: string, view = false) => {
    if (id) menuStory.jumpPage('system/application/Save', {
      query: {
        id,
        view
      }
    },);
    else menuStory.jumpPage('system/application/Save', {});
  },
  changeStatus: (row: any) => {
    const state = row.state.value === 'enabled' ? 'disabled' : 'enabled';
    const response = changeApplyStatus_api(row.id, {state});
    response.then((resp: any) => {
      if (resp.status === 200) {
        onlyMessage($t('Apply.index.483342-9'));
        table.refresh();
      }
    });
    return response;
  },
  clickDel: (row: any) => {
    const response = delApply_api(row.id);
    response.then((resp: any) => {
      if (resp.status === 200) {
        onlyMessage($t('Apply.index.483342-9'));
        table.refresh();
      }
    });
    return response;
  },
  getActions: (
      data: Partial<Record<string, any>>,
      type: 'card' | 'table',
  ) => {
    if (!data) return [];
    const disabled = data.state.value === 'enabled';

    const result = [
      {
        permission: `${permission}:update`,
        key: 'edit',
        text: $t('Apply.index.483342-10'),
        tooltip: {
          title: $t('Apply.index.483342-10'),
        },
        icon: 'EditOutlined',
        onClick: () => table.toSave(data.id),
      },
      // 将"其他"下拉菜单中的按钮平铺出来
      {
        permission: `${permission}:view`,
        key: 'grant',
        text: '赋权',
        icon: 'SafetyOutlined',
        tooltip: {
          title: '赋权',
        },
        onClick: () => {
          menuStory.jumpPage('system/application/Grant', {
            params: { id: data.id },
            query: {
              mode: 'appManger',
              code: data.id
            }
          });
        },
      },
      {
        permission: `${permission}:view`,
        key: 'viewApi',
        text: '查看API',
        icon: 'ApiOutlined',
        tooltip: {
          title: '查看API',
        },
        onClick: () => {
          menuStory.jumpPage('system/application/Detail', {
            params: { id: data.id }
          });
        },
      },
      {
        permission: `${permission}:update`,
        key: 'action',
        text: disabled ? $t('Apply.index.483342-7') : $t('Apply.index.483342-11'),
        tooltip: {
          title: disabled ? $t('Apply.index.483342-7') : $t('Apply.index.483342-11'),
        },
        popConfirm: {
          title: `确认${disabled ? $t('Apply.index.483342-7') : $t('Apply.index.483342-11')}`,
          onConfirm: () => table.changeStatus(data),
        },
        icon: disabled ? 'StopOutlined' : 'PlayCircleOutlined',
      },
      {
        permission: `${permission}:delete`,
        key: 'delete',
        text: $t('Apply.index.483342-13'),
        tooltip: {
          title: disabled ? $t('Apply.index.483342-14') : $t('Apply.index.483342-13'),
        },
        popConfirm: {
          title: $t('Apply.index.483342-15'),
          onConfirm: () => table.clickDel(data),
        },
        disabled,
        icon: 'DeleteOutlined',
      },
    ] as any[];

    return result;
  },
  getTypeLabel: (val: string) => {
    if (!val) return '';
    return typeOptions.value?.find((item) => item?.value === val)?.label;
  },
};
onMounted(() => {
  queryType().then((resp: any) => {
    if (resp.status === 200) {
      const arr = resp.result.map((item: any) => ({
        label: item.name,
        value: item.provider,
      }));
      typeOptions.value = arr;
    }
  });
});
</script>

<style lang="less" scoped>
.apply-container {
  :deep(.ant-table-cell) {
    .ant-btn-link {
      padding: 0;
    }
  }
}
</style>
