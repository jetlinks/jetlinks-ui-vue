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
                  <img style="width: 80px" :src="slotProps.logoUrl || systemImg.applyImg" alt=""/>
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
                    :title="item.disabled && item.tooltip.title"
                >
                  <a-dropdown
                      placement="bottomRight"
                      v-if="item.key === 'others'"
                  >
                    <a-button>
                      <AIcon :type="item.icon"/>
                      <span>{{ item.text }}</span>
                    </a-button>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item
                            v-for="(
                                                        o, i
                                                    ) in item.children"
                            :key="i"
                        >
                          <a-tooltip
                              :title="
                                                            o?.tooltip?.title
                                                        "
                          >
                            <a-button
                                type="link"
                                @click="o.onClick"
                                :disabled="
                                                                o.disabled
                                                            "
                            >
                              <AIcon
                                  :type="o.icon"
                              />
                              <span>{{
                                  o.text
                                }}</span>
                            </a-button>
                          </a-tooltip>
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                  <j-permission-button
                      v-else
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
    <div class="dialogs">
      <MenuDialog
          v-if="dialogVisible && current.provider !== 'third-party'"
          v-model:visible="dialogVisible"
          mode="edit"
          :data="current"
          @refresh="table.refresh"
      />
      <ThirdMenu
          v-if="dialogVisible && current.provider === 'third-party'"
          :data="current"
          mode="edit"
          @cancel="dialogVisible = false"
          @ok="
                    () => {
                        dialogVisible = false;
                        table.refresh;
                    }
                "
      />
    </div>
    <Add v-if="visible" @close="visible = false"/>
  </j-page-container>
</template>

<script setup lang="ts" name="Apply">
import MenuDialog from './componenets/MenuDialog.vue';
import ThirdMenu from './componenets/ThirdMenu.vue';
import {
  getApplyList_api,
  changeApplyStatus_api,
  delApply_api,
  queryType,
} from '@/api/system/apply';
import {onlyMessage} from '@/utils/comm';
import {useMenuStore} from '@/store/menu';
import Add from './Save/Add.vue';
import {systemImg} from "@/assets";
import {useI18n} from 'vue-i18n';

const {t: $t} = useI18n();
const menuStory = useMenuStore();
const permission = 'system/Apply';

const typeOptions = ref<any[]>([]);
const visible = ref<boolean>(false);
const addMenuVisible = ref<boolean>(false);

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
    title: $t('Apply.index.483342-2'),
    dataIndex: 'provider',
    key: 'provider',
    ellipsis: true,
    search: {
      type: 'select',
      options: () =>
          new Promise((resolve) => {
            queryType().then((resp: any) => {
              resolve(
                  resp.result.map((item: any) => ({
                    label: item.name,
                    value: item.provider,
                  })),
              );
            });
          }),
    },
    scopedSlots: true,
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
    visible.value = true;
  },
  toSave: (id?: string, view = false) => {
    if (id) menuStory.jumpPage('system/Apply/Save', {
      query: {
        id,
        view
      }
    },);
    else menuStory.jumpPage('system/Apply/Save', {});
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
      {
        permission: `${permission}:action`,
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
    const otherServers = data.integrationModes.map(
        (item: any) => item.value as string,
    );
    const others = {
      key: 'others',
      text: $t('Apply.index.483342-16'),
      icon: 'EllipsisOutlined',
      children: [] as any[],
    };
    // 有集成菜单权限
    if (otherServers.includes('page'))
      others.children?.push({
        permission: [`${permission}:add`, `${permission}:update`],
        key: 'page',
        text: $t('Apply.index.483342-17'),
        tooltip: {
          title: !disabled ? $t('Apply.index.483342-18') : $t('Apply.index.483342-17'),
        },
        icon: 'MenuUnfoldOutlined',
        disabled: !disabled,
        onClick: () => {
          selectId.value = data.id;
          selectProvider.value = data.provider;
          current.value = data;
          dialogVisible.value = true;
        },
      });
    // 有api操作权限
    if (otherServers.includes('apiServer'))
      others.children?.push(
          {
            permission: [`${permission}:add`, `${permission}:update`],
            key: 'empowerment',
            text: $t('Apply.index.483342-19'),
            tooltip: {
              title: $t('Apply.index.483342-19'),
            },
            icon: 'icon-fuquan',
            onClick: () => {
              menuStory.jumpPage(
                  'system/Apply/Api',
                  {
                    query: {code: data.id}
                  },
              );
            },
          },
          {
            permission: [`${permission}:add`, `${permission}:update`],
            key: 'viewApi',
            text: $t('Apply.index.483342-20'),
            tooltip: {
              title: $t('Apply.index.483342-20'),
            },
            icon: 'icon-chakanAPI',
            onClick: () => {
              menuStory.jumpPage(
                  'system/Apply/View',
                  {
                    query: {code: data.id}
                  },
              );
            },
          },
      );
    // 其他不为空
    if (others.children.length > 0) {
      if (type === 'card') {
        result.splice(result.length - 1, 0, others);
      } else {
        result.splice(result.length - 1, 0, ...others.children);
      }
    }

    return result;
  },
  getTypeLabel: (val: string) => {
    if (!val) return '';
    return typeOptions.value?.find((item) => item?.value === val)?.label;
  },
};
const dialogVisible = ref(false);
const selectId = ref<string>('');
const selectProvider = ref<any>('');
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
