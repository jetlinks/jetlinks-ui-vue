<template>
  <j-page-container>
    <div>
      <pro-search
        :columns="columns"
        target="search-configuration"
        @search="handleSearch"
      />
      <j-ellipsis>
        <JProTable
          :columns="columns"
          :request="queryList"
          :gridColumn="3"
          :gridColumns="[1, 2, 3]"
          modeValue="CARD"
          ref="tableRef"
          :defaultParams="{
            sorts: [{ name: 'createTime', order: 'desc' }],
          }"
          :params="params"
        >
          <template #headerLeftRender>
            <a-space>
              <j-permission-button
                type="primary"
                @click="add"
                :hasPermission="permissionKey + ':add'"
              >
                <template #icon><AIcon type="PlusOutlined" /></template>
                {{ $t('Configuration.index.021440-0') }}
              </j-permission-button>
            </a-space>
          </template>
          <template #card="slotProps">
            <CardBox
              :value="slotProps"
              :actions="getActions(slotProps, 'card')"
              v-bind="slotProps"
              :status="slotProps.state?.value"
              :statusText="slotProps.state?.text"
              :statusNames="{
                enabled: 'processing',
                disabled: 'error',
              }"
              @click="
                () => {
                  menuStory.jumpPage(
                    `${permissionKey}/Save`,
                    { query: { id: slotProps.id } }
                  );
                }
              "
            >
              <template #img>
                <slot name="img">
                  <img :src="ConfigurationImages.alarmConfig" />
                </slot>
              </template>
              <template #content>
                <a-row>
                  <j-ellipsis style="max-width: calc(100% - 120px)">
                    <span style="font-weight: 600; font-size: 16px">
                      {{ slotProps.name }}
                    </span>
                  </j-ellipsis>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <div class="card-item-content-text">{{ $t('Configuration.index.021440-1') }}</div>
                    <div style="height: 22px; width: 100%">
                      <j-ellipsis style="max-width: 100%">
                        {{ slotProps.description }}
                      </j-ellipsis>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="card-item-content-text">{{ $t('Configuration.index.021440-2') }}</div>
                    <div style="display: flex">
                      <LevelIcon :level="slotProps.level"></LevelIcon>
                      <j-ellipsis>
                        {{ levelMap[slotProps.level] }}
                      </j-ellipsis>
                    </div>
                  </a-col>
                </a-row>
              </template>
              <template #actions="item">
                <j-permission-button
                  :disabled="item.disabled"
                  :popConfirm="item.popConfirm"
                  :tooltip="{ ...item.tooltip }"
                  @click="item.onClick"
                  :hasPermission="`${permissionKey}:${item.key}`"
                >
                  <AIcon type="DeleteOutlined" v-if="item.key === 'delete'" />
                  <template v-else>
                    <AIcon :type="item.icon" />
                    <span>{{ item?.text }}</span>
                  </template>
                </j-permission-button>
              </template>
            </CardBox>
          </template>
          <template #targetType="slotProps">
            <span>{{ supports.find(item => slotProps.targetType === item.value)?.label }}</span>
          </template>

          <template #state="slotProps">
            <j-badgeStatus
              :text="slotProps.state?.text"
              :status="slotProps.state?.value"
              :statusNames="{
                enabled: 'processing',
                disabled: 'error',
              }"
            />
          </template>
          <template #level="slotProps">
            <div style="display: flex">
              <LevelIcon :level="slotProps.level"></LevelIcon>
              <j-ellipsis>
                {{ levelMap[slotProps.level] }}
              </j-ellipsis>
            </div>
          </template>
          <template #action="slotProps">
            <a-space :size="16">
              <template
                v-for="i in getActions(slotProps, 'table')"
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
                  style="padding: 0px"
                  :hasPermission="`${permissionKey}:${i.key}`"
                  :danger="i.key === 'delete'"
                >
                  <template #icon><AIcon :type="i.icon" /></template>
                </j-permission-button>
              </template>
            </a-space>
          </template>
        </JProTable>
      </j-ellipsis>
    </div>
  </j-page-container>
  <HandTrigger
    @save="onSave"
    @close="visible = false"
    v-if="visible"
    :data="current"
  />
</template>

<script lang="ts" setup>
import {
  queryList,
  _enable,
  _disable,
  remove,
} from "@rule-engine-manager-ui/api/configuration";
import { query } from "@rule-engine-manager-ui/api/log";
import { queryLevel } from "@rule-engine-manager-ui/api/config";
import { onlyMessage } from "@jetlinks-web/utils";
import { useMenuStore } from "@jetlinks-web-core/store/menu";
import HandTrigger from "./HandTrigger/index.vue";
import { Modal } from "ant-design-vue";
import { useAlarmLevel } from "@rule-engine-manager-ui/hook";
import { ConfigurationImages } from "@rule-engine-manager-ui/assets";
import { useI18n } from 'vue-i18n'
import {useAlarmConfigType} from "@rule-engine-manager-ui/hook/useAlarmConfigType";
import { useTermOptions } from '@jetlinks-web/components/es/Search/hooks/useTermOptions'

const { t: $t } = useI18n()
const params = ref<Record<string, any>>({});
const tableRef = ref<Record<string, any>>({});
const menuStory = useMenuStore();
const { levelMap } = useAlarmLevel();
const visibleDelete = ref(false);
const configId = ref();
const deleteState = ref(false);
const alarmRecordNumber = ref(0);
const { supports } = useAlarmConfigType(['networkCardPool']);
const { termOptions } = useTermOptions({ pick: ['in']})

const permissionKey = inject('alarmConfigurationPermissionKey', 'rule-engine/Alarm/Configuration')

const columns = [
  {
    title: $t('Configuration.index.021440-5'),
    dataIndex: "name",
    key: "name",
    search: {
      type: "string",
    },
    width: 300,
    ellipsis: true,
  },
  {
    title: $t('Configuration.index.021440-6'),
    dataIndex: "targetType",
    key: "targetType",
    scopedSlots: true,
    search: {
      type: "select",
      options: () => {
        return supports.value
      },
    },
    width: 150,
  },
  {
    title: $t('Configuration.index.021440-11'),
    dataIndex: "id",
    hideInTable: true,
    key: "id",
    search: {
      type: "select",
      termOptions: termOptions,
      defaultTermType: 'in',
      options: async () => {
        const allData = await queryList({
          paging: false,
          sorts: [{ name: "createTime", order: "desc" }],
        });
        const result = allData.result?.data as any[];
        if (allData.success && result && result.length) {
          const sceneDataMap = new Map(); // 用于去重
          result.forEach((item) => {
            item.scene.forEach((a: any) => {
              sceneDataMap.set(a.id, {
                label: a.name,
                value: a.id,
              });
            });
          });
          return [...sceneDataMap.values()];
        }
        return [];
      },
    },
    width: 220,
    ellipsis: true,
  },
  {
    title: $t('Configuration.index.021440-2'),
    dataIndex: "level",
    key: "level",
    scopedSlots: true,
    search: {
      type: "select",
      options: async () => {
        const res = await queryLevel();
        if (res.status === 200) {
          return (res?.result?.levels || [])
            .filter((i: any) => i?.level && i?.title)
            .map((item: any) => ({
              label: item.title,
              value: item.level,
            }));
        }
        return [];
      },
    },
    width: 150,
  },
  {
    title: $t('Configuration.index.021440-12'),
    dataIndex: "state",
    key: "state",
    scopedSlots: true,
    search: {
      type: "select",
      options: [
        {
          label: $t('Configuration.index.021440-3'),
          value: "enabled",
        },
        {
          label: $t('Configuration.index.021440-4'),
          value: "disabled",
        },
      ],
    },
    width: 120,
  },
  {
    title: $t('Configuration.index.021440-1'),
    dataIndex: "description",
    key: "description",
    search: {
      type: "string",
    },
    ellipsis: true,
  },
  {
    title: $t('Configuration.index.021440-13'),
    key: "action",
    fixed: "right",
    width: 200,
    scopedSlots: true,
  },
];
const visible = ref<boolean>(false);
const current = ref<any>({});

const handleSearch = (e: any) => {
  e.terms.map((i: any) => {
    i.terms.forEach((item: any) => {
      if (item.column === "id") {
        item.termType = "rule-bind-alarm";
      }
    });
  });
  console.log(e, "e");
  params.value = e;
};

const getActions = (
  data: Partial<Record<string, any>>,
  type?: "card" | "table"
): any[] => {
  if (!data) {
    return [];
  }
  const actions = [
    {
      key: "tigger",
      text: $t('Configuration.index.021440-14'),
      disabled: data?.state?.value === "disabled",
      tooltip: {
        title:
          data?.state?.value === "disabled"
            ? $t('Configuration.index.021440-15')
            : $t('Configuration.index.021440-14'),
      },
      onClick: () => {
        visible.value = true;
        current.value = data;
      },
      icon: "icon-shoudongchufa",
    },
    {
      key: "update",
      text: $t('Configuration.index.021440-16'),
      tooltip: {
        title: $t('Configuration.index.021440-16'),
      },

      icon: "EditOutlined",
      onClick: () => {
        menuStory.jumpPage(`${permissionKey}/Save`, {
          query: { id: data.id },
        });
      },
    },
    {
      key: "action",
      text: data.state?.value !== "disabled" ? $t('Configuration.index.021440-4') : $t('Configuration.index.021440-17'),
      tooltip: {
        title: data.state?.value !== "disabled" ? $t('Configuration.index.021440-4') : $t('Configuration.index.021440-17'),
      },
      icon:
        data.state?.value !== "disabled"
          ? "StopOutlined"
          : "CheckCircleOutlined",
      popConfirm: {
        title: `${
          data.state?.value !== "disabled"
            ? $t('Configuration.index.021440-18')
            : $t('Configuration.index.021440-19')
        }?`,
        onConfirm: async () => {
          let response = undefined;
          if (data.state?.value === "disabled") {
            response = await _enable(data.id);
          } else {
            response = await _disable(data.id);
          }
          if (response && response.status === 200) {
            onlyMessage($t('Configuration.index.021440-20'));
            tableRef.value?.reload();
          } else {
            onlyMessage($t('Configuration.index.021440-21'), "error");
          }
          return;
        },
      },
    },
    {
      key: "delete",
      text: $t('Configuration.index.021440-22'),
      disabled: data?.state?.value !== "disabled",
      tooltip: {
        title:
          data?.state?.value !== "disabled" ? $t('Configuration.index.021440-23') : $t('Configuration.index.021440-22'),
        placement: "topLeft",
      },
      onClick: async () => {
        if (deleteState.value) {
          return;
        }
        deleteState.value = true;
        const params = {
          paging: false,
          terms: [
            {
              termType: "eq",
              column: "alarmConfigId",
              value: data.id,
              type: "and",
            },
          ],
        };
        const res = await query(params);
        if (res.success) {
          alarmRecordNumber.value = res.result?.total || 0;
        }
        Modal.confirm({
          title: alarmRecordNumber.value
            ? $t('Configuration.index.021440-24', [alarmRecordNumber.value])
            : $t('Configuration.index.021440-25'),
          onOk() {
            return deleteConfig(data.id);
          },
          onCancel() {
            deleteState.value = false;
          },
        });

        visibleDelete.value = true;
        configId.value = data.id;
      },
      icon: "DeleteOutlined",
    },
  ];
  return actions.filter(
    (item) => item.key != "tigger" || data.sceneTriggerType == "manual"
  );
};
const onSave = () => {
  visible.value = false;
  tableRef.value?.reload();
};
const add = () => {
  menuStory.jumpPage(`${permissionKey}/Save`, {});
};

const deleteConfig = async (id: any) => {
  const resp = await remove(id);
  if (resp.success) {
    onlyMessage($t('Configuration.index.021440-20'));
    refreshTable();
  } else {
    onlyMessage($t('Configuration.index.021440-21'), "error");
  }
  deleteState.value = false;
};

const refreshTable = () => {
  visibleDelete.value = false;
  tableRef.value.reload();
};
</script>
<style lang="less" scoped>
.content-des-title {
  font-size: 12px;
}

.card-item-content-text {
  width: 100%;
  margin-top: 16px;
  margin-bottom: 8px;
}
</style>
