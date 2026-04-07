<template>
  <pro-search
    :columns="columns"
    target="link-plugin"
    @search="handleSearch"
  />
  <FullPage>
    <JProTable
      ref="instanceRef"
      :columns="columns"
      :request="queryPage"
      modeValue="CARD"
      :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
      :params="params"
    >
      <template #headerLeftRender>
        <a-space>

          <j-permission-button
            type="primary"
            @click="handleAdd"
            :hasPermission="`${permissionKey}:add`"
          >
            <template #icon>
              <AIcon type="PlusOutlined"/>
            </template>
            {{ $t('plugin.index.293829-0') }}
          </j-permission-button>
          <slot name="headerLeftRender" />
        </a-space>
      </template>

      <template #card="slotProps">
        <CardBox
          :value="slotProps"
          :actions="getActions(slotProps,'card')"
          :showStatus="false"
          @click="()=>viewDetail(slotProps)"
        >
          <template #img>
            <img
              :width="80"
              :height="80"
              :src="link.plug"
            />
          </template>
          <template #content>
            <div>
              <div>
                <a-tag class="plugin-version">{{
                    slotProps.version
                  }}
                </a-tag>
              </div>
              <j-ellipsis
                style="
                                        width: calc(100% - 100px);
                                        margin-bottom: 18px;
                                    "
              >
                                    <span
                                      style="
                                            font-size: 16px;
                                            font-weight: 600;
                                        "
                                    >
                                        {{ slotProps.name }}
                                    </span>
              </j-ellipsis>
            </div>
            <a-row>
              <a-col :span="12">
                <div class="card-item-content-text">
                  {{ $t('plugin.index.293829-1') }}
                </div>
                <j-ellipsis style="width: 100%">
                  {{ slotProps.id }}
                </j-ellipsis>
              </a-col>
              <a-col :span="12">
                <div class="card-item-content-text">
                  {{ $t('plugin.index.293829-2') }}
                </div>
                <j-ellipsis style="width: 100%">
                  {{ TypeMap[slotProps.type] || '--' }}
                </j-ellipsis>
              </a-col>
            </a-row>
          </template>

          <template #actions="item">
            <j-permission-button
              :disabled="item.disabled"
              :popConfirm="item.popConfirm"
              :tooltip="{
                                    ...item.tooltip,
                                }"
              @click="item.onClick"
              :hasPermission="permissionKey + ':' + item.key"
            >
              <AIcon
                type="DeleteOutlined"
                v-if="item.key === 'delete'"
              />
              <template v-else>
                <AIcon :type="item.icon"/>
                <span>{{ item?.text }}</span>
              </template>
            </j-permission-button>
          </template>
        </CardBox>
      </template>
      <template #type="slotProps">
        <span>{{ TypeMap[slotProps.type] || '--' }}</span>
      </template>
      <template #action="slotProps">
        <a-space :size="16">
          <template
            v-for="i in getActions(slotProps,'table')"
            :key="i.key"
          >
            <j-permission-button
              :disabled="i.disabled"
              :popConfirm="i.popConfirm"
              :tooltip="{
                                    ...i.tooltip,
                                }"
              @click="i.onClick"
              type="link"
              :danger="i.key === 'delete'"
              style="padding: 0 5px"
              :hasPermission="permissionKey + ':' + i.key"
            >
              <template #icon
              >
                <AIcon :type="i.icon"
                />
              </template>
            </j-permission-button>
          </template>
        </a-space>
      </template>
    </JProTable>
  </FullPage>
  <SaveModal v-if="visible" :data="editData" @cancel="cancel" @ok="save"/>
  <Detail v-if="visibleDetail" :data="editData" @close="visibleDetail = false"/>
</template>
<script setup lang="ts" name="PluginContent">
import SaveModal from './Save.vue';
import {onlyMessage} from '@jetlinks-web/utils';
import {queryPage, removeFn, getTypes} from '../../../api/link/plugin';
import {TypeMap} from './util';
import {link} from '../../../assets'
import {useI18n} from 'vue-i18n';
import Detail from './Detail.vue';
import { usePluginPermission } from '@device-manager-ui/hooks/usePermission'
import { mergeObjectArrays } from '@jetlinks-web-core/utils'

const {t: $t} = useI18n();
const route = useRoute();
const visible = ref(false);
const params = ref<any>();
const editData = ref();
const instanceRef = ref();
const visibleDetail = ref(false);
const permissionKey = usePluginPermission()

const columns = [
  {
    title: $t('plugin.index.293829-1'),
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('plugin.index.293829-3'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('plugin.index.293829-4'),
    dataIndex: 'version',
    key: 'version',
    ellipsis: true,
  },
  {
    title: $t('plugin.index.293829-2'),
    dataIndex: 'type',
    key: 'type',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'select',
      options: () => {
        return new Promise((resolve) => {
          getTypes().then((res) => {
            resolve(
              res.result?.map((item) => ({
                ...item,
                label: item.text,
              })),
            );
          });
        });
      },
    },
  },
  {
    title: $t('plugin.index.293829-5'),
    dataIndex: 'filename',
    key: 'filename',
    ellipsis: true,
  },
  {
    title: $t('plugin.index.293829-6'),
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('plugin.index.293829-7'),
    key: 'action',
    width: 160,
    scopedSlots: true,
  },
];

const handleAdd = () => {
  editData.value = {};
  visible.value = true;
};

const handleSearch = (p: any) => {
  params.value = p;
};

const save = () => {
  if (instanceRef.value) {
    instanceRef.value?.reload();
  }
  visible.value = false;
};

const cancel = () => {
  visible.value = false;
  editData.value = undefined;
};

const viewDetail = (data: any) => {
  visibleDetail.value = true;
  editData.value = data;
}

const getActions = (data: any,type :string) => {
  if (!data) {
    return [];
  }

  const parentGetActions = inject('getActions', {}).getActions;

  const parentActions = parentGetActions?.(data) || []

  let actions =  [
    {
      key: 'update',
      text: $t('plugin.index.293829-8'),
      tooltip: {
        title: (data?.configuration?.sourceId || data?.configuration?.autoCreate) ? $t('plugin.index.293829-14', [$t('plugin.index.293829-8')]) : $t('plugin.index.293829-8'),
      },
      disabled: data?.configuration?.sourceId || data?.configuration?.autoCreate,
      icon: 'EditOutlined',
      onClick: () => {
        visible.value = true;
        editData.value = data;
      },
    }, {
      key: 'view',
      text: $t('plugin.index.293829-13'),
      tooltip: {
        title: $t('plugin.index.293829-13'),
      },
      icon: 'EyeOutlined',
      onClick: () => {
        viewDetail(data);
      },
    },
    {
      key: 'delete',
      text: $t('plugin.index.293829-9'),
      tooltip: {
        title: (data?.configuration?.sourceId || data?.configuration?.autoCreate) ? $t('plugin.index.293829-14', [$t('plugin.index.293829-9')]) : $t('plugin.index.293829-9'),
      },
      disabled: data?.configuration?.sourceId || data?.configuration?.autoCreate,
      popConfirm: {
        title: $t('plugin.index.293829-10'),
        onConfirm: () => {
          const response = removeFn(data.id);
          response.then((resp) => {
            if (resp.status === 200) {
              onlyMessage($t('plugin.index.293829-11'));
              instanceRef.value?.reload();
            } else {
              onlyMessage(resp?.message || $t('plugin.index.293829-12'), 'error');
            }
          });
          return response;
        },
      },
      icon: 'DeleteOutlined',
    },
  ];

  if (parentActions && parentActions.length > 0) {
    actions = mergeObjectArrays(actions, parentActions);
  }

  if (type === 'card')
    return actions.filter((i: any) => i.key !== 'view');
  return actions;
};

onMounted(() => {
  if (route.query.save) {
    visible.value = true;
  }

  const parentTableRef = inject('tableRef')
  parentTableRef?.initTableRef?.(instanceRef.value)
});
</script>

<style scoped lang="less">
.plugin-version {
  border-radius: 4px;
}
</style>
