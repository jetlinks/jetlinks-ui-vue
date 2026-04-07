<template>
  <div class="alarm-log-card">
    <pro-search
        :columns="newColumns"
        :target="`alarm-log-${props.type}`"
        @search="search"
    />

    <FullPage>
      <JProTable
          :columns="columns"
          :request="handleSearch"
          :params="params"
          :gridColumns="[1, 1, 1]"
          :gridColumn="1"
          mode="CARD"
          ref="tableRef"
      >
        <template #card="slotProps">
          <CardBox
              :value="slotProps"
              v-bind="slotProps"
              :actions="getActions(slotProps, 'card')"
              :status="slotProps.state.value"
              :statusNames="{
              warning: 'error',
              normal: 'default',
            }"
              :statusText="slotProps.state.text"
              @click="() => showDrawer(slotProps)"
          >
            <template #img>
              <img :src="imgMap.get(slotProps.targetType)" alt=""/>
            </template>
            <template #content>
              <div class="alarmTitle">
                <div class="alarmName">
                  <j-ellipsis style="width: 100%">
                    <span style="font-weight: 500; font-size: 16px">
                      {{ slotProps.alarmName }}
                    </span>
                  </j-ellipsis>
                </div>
                <!-- <div
                                    class="alarmLevel"
                                    :style="{
                                        backgroundColor: levelColorMap.get(
                                            'level' + slotProps.level,
                                        ),
                                    }"
                                >
                                    <j-ellipsis>
                                        <span>
                                            {{
                                                levelMap?.[slotProps.level] ||
                                                slotProps.level
                                            }}
                                        </span>
                                    </j-ellipsis>
                                </div> -->
                <div style="display: flex; max-width: 50%; height: 22px">
                  <LevelIcon :level="slotProps.level"></LevelIcon>
                  <j-ellipsis>
                    {{ levelMap[slotProps.level] }}
                  </j-ellipsis>
                </div>
              </div>
              <a-row :gutter="24">
                <a-col :span="6" class="content-left">
                  <div class="content-title">
                    {{ $t("TabComponent.index.165152-0") }}
                  </div>
                  <j-ellipsis
                  >
                    <div>
                      {{ slotProps?.targetName }}
                    </div>
                  </j-ellipsis
                  >
                </a-col>
                <a-col :span="6">
                  <div class="content-title">
                    {{ $t("TabComponent.index.165152-1") }}
                  </div>
                  <j-ellipsis>
                    <div>
                      {{
                        dayjs(
                            slotProps?.lastAlarmTime || slotProps?.alarmTime
                        ).format("YYYY-MM-DD HH:mm:ss")
                      }}
                    </div>
                  </j-ellipsis>
                </a-col>
                <a-col :span="6">
                  <div class="content-title">
                    {{ $t("TabComponent.index.165152-4") }}
                  </div>
                  <j-ellipsis
                  >
                    <Duration :data="slotProps"></Duration
                    >
                  </j-ellipsis>
                </a-col>
                <a-col :span="6">
                  <div class="content-title">
                    {{ $t("TabComponent.index.165152-5") }}
                  </div>
                  <j-ellipsis
                  >
                    <div>
                      {{ slotProps?.actualDesc || "--" }}
                    </div>
                  </j-ellipsis
                  >
                </a-col>
              </a-row>
            </template>
          </CardBox>
        </template>
      </JProTable>
    </FullPage>
    <SolveComponent
        :data="data.current"
        v-if="data.solveVisible"
        @closeSolve="closeSolve"
        @refresh="refresh"
    />
    <LogDrawer
        v-if="visibleDrawer"
        :logData="drawerData"
        :typeMap="titleMap"
        :levelMap="levelMap"
        @closeDrawer="visibleDrawer = false"
        @refreshTable="refreshTable"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  query,
  getAlarmProduct,
  queryAlarmRecordByType,
  queryAlarmRecordNoPaging,
} from "@rule-engine-manager-ui/api/log";
import {useAlarmStore} from "@rule-engine-manager-ui/store/alarm";
import {storeToRefs} from "pinia";
import dayjs from "dayjs";
import SolveComponent from "../SolveComponent/index.vue";
import {useMenuStore} from "@jetlinks-web-core/store/menu";
import LogDrawer from "./components/DetailDrawer.vue";
import Duration from "../components/Duration.vue";
import {useAlarmLevel} from "@rule-engine-manager-ui/hook";
import {logImages} from "@rule-engine-manager-ui/assets";
import LevelIcon from '@rule-engine-manager-ui/components/AlarmLevelIcon/index.vue'
import {useI18n} from "vue-i18n";
import {useAlarmConfigType} from "@rule-engine-manager-ui/hook/useAlarmConfigType";
import {getTreeData_api} from "@rule-engine-manager-ui/api/others";

const {t: $t} = useI18n();
const {supports} = useAlarmConfigType();
const menuStory = useMenuStore();
const tableRef = ref();
const {levelMap, getLevelList} = useAlarmLevel();
const alarmStore = useAlarmStore();
const {data} = storeToRefs(alarmStore);
const drawerData = ref();
const visibleDrawer = ref(false);

const permissionKey = inject('alarmLogPermissionKey', 'rule-engine/Alarm/Log')

const props = defineProps<{
  type: string;
  id?: string;
}>();

const imgMap = new Map();
imgMap.set("product", logImages.product);
imgMap.set("device", logImages.device);
imgMap.set("collector", logImages.device);
imgMap.set("scene", logImages.other);
imgMap.set("organization", logImages.org);
imgMap.set("networkCardPool", logImages.networkCardPool);

const titleMap = computed(() => {
  const map = new Map();
  supports.value.forEach((item) => {
    map.set(item.value, item.label);
  })
  return map
})

const columns = ref([
  {
    title: $t('components.Log.165155-6'),
    dataIndex: 'sourceId',
    key: 'sourceId',
    search: {
      type: 'select',
      options: async () => {
        const res = props.type !== 'all' ? await queryAlarmRecordNoPaging({
          terms: [{
            column: 'targetType',
            value: props.type
          }]
        }) : await queryAlarmRecordNoPaging({})
        return res.result.map((item: any) => {
          return {
            label: item.sourceName,
            value: item.sourceId
          }
        }).reduce((prev: any, next: any) => {
          if (!prev.find((item: any) => item.value === next.value)) {
            prev.push(next)
          }
          return prev
        }, []);
      }
    },
  },
  {
    title: $t("TabComponent.index.165152-10"),
    dataIndex: "alarmName",
    key: "alarmName",
  },
  {
    title: $t("TabComponent.index.165152-11"),
    dataIndex: "targetType",
    key: "targetType",
    scopedSlots: true,
  },
  {
    title: $t("TabComponent.index.165152-13"),
    dataIndex: "level",
    key: "level",
    width: 200,
    search: {
      type: "select",
      options: async () => {
        return getLevelList();
      },
    },
    scopedSlots: true,
  },
  {
    title: $t("TabComponent.index.165152-1"),
    dataIndex: "lastAlarmTime",
    key: "lastAlarmTime",
    search: {
      type: "date",
    },
    scopedSlots: true,
  },
  {
    title: $t("TabComponent.index.165152-14"),
    dataIndex: "state",
    key: "state",
    search: {
      type: "select",
      options: [
        {
          label: $t("TabComponent.index.165152-15"),
          value: "warning",
        },
        {
          label: $t("TabComponent.index.165152-16"),
          value: "normal",
        },
      ],
    },
    scopedSlots: true,
  },
  {
    title: $t("TabComponent.index.165152-17"),
    dateIndex: "actions",
    key: "actions",
    scopedSlots: true,
    width: 200,
  },
]);


const newColumns = computed(() => {
  const otherColumns = {
    title: $t("TabComponent.index.165152-18"),
    dataIndex: "targetName",
    key: "targetName",
    search: {
      type: "string",
    },
  };

  switch (props.type) {
    case "device":
      otherColumns.title = $t("TabComponent.index.165152-19");
      break;
    case "organization":
      otherColumns.title = $t("TabComponent.index.165152-20");
      Object.assign(otherColumns, {
        title: $t("TabComponent.index.165152-20"),
        dataIndex: "targetId",
        key: "targetId",
        search: {
          type: "treeSelect",
          options: () => {
            return new Promise((resolve) => {
              getTreeData_api({paging: false}).then((resp: any) => {
                const formatValue = (list: any[]) => {
                  const _list: any[] = [];
                  list.forEach((item) => {
                    if (item.children) {
                      item.children = formatValue(
                          item.children,
                      );
                    }
                    _list.push({
                      ...item,
                    });
                  });
                  return _list;
                };
                resolve(formatValue(resp.result));
              });
            })
          }
        },
      })
      break;
    case "scene":
      otherColumns.title = $t("TabComponent.index.165152-21");
      break;
    case "collector":
      otherColumns.title = $t("TabComponent.index.165152-26");
      break;
    case "networkCardPool":
      otherColumns.title = $t("Detail.index.165158-12");
      break;
    case "aiModel":
      otherColumns.title = $t("TabComponent.index.172503-1");
      break;
    case "aiTask":
      otherColumns.title = $t("TabComponent.index.172503-2")
      break;
  }
  if (props.type === "device") {
    const productColumns = {
      title: $t("TabComponent.index.165152-18"),
      dataIndex: "product_id",
      key: "product_id",
      search: {
        type: "select",
        options: async () => {
          const termType = [
            {
              column: "id$alarm-record",
              value: [
                {
                  column: "targetType",
                  termType: "eq",
                  value: "device",
                },
              ],
            },
          ];
          const resp: any = await getAlarmProduct({
            paging: false,
            sorts: [{name: "alarmTime", order: "desc"}],
            terms: termType,
          });
          const listMap: Map<string, any> = new Map();

          if (resp.status === 200) {
            resp.result.forEach((item) => {
              if (item.productId) {
                listMap.set(item.productId, {
                  label: item.productName,
                  value: item.productId,
                });
              }
            });
            return [...listMap.values()];
          }
          return [];
        },
      },
    };
    return [otherColumns, productColumns, ...columns.value];
  }
  return ["all", "detail"].includes(props.type)
      ? columns.value
      : [otherColumns, ...columns.value];
});

let params: any = ref({
  sorts: [{name: "lastAlarmTime", order: "desc"}],
  terms: [],
});
const handleSearch = async (params: any) => {
  const resp: any =
      props.type !== "all"
          ? await queryAlarmRecordByType(props.type, params)
          : await query(params);
  if (resp.success) {
    return resp;
    // const res: any = await getOrgList();
    // if (res.success) {
    //   resp.result.data.map((item: any) => {
    //     if (item.targetType === "org") {
    //       res.result.forEach((item2: any) => {
    //         if (item2.id === item.targetId) {
    //           item.targetName = item2.name;
    //         }
    //         //targetName处理之后的
    //         if (item.targetId === item.targetName) {
    //           item.targetName = $t("TabComponent.index.165152-22");
    //         }
    //       });
    //     }
    //   });
    //   return resp;
    // }
  }
};

const search = (data: any) => {
  params.value.terms = [...data?.terms];
  if (props.type === "device") {
    data?.terms.forEach((i: any, _index: number) => {
      i.terms.forEach((item: any, index: number) => {
        if (item.column === "product_id") {
          params.value.terms[_index].terms[index] = {
            column: "targetId$dev-instance",
            value: [data?.terms[0]?.terms[0]],
          };
        }
      });
    });
  }
  if (props.id) {
    params.value.terms.push({
      termType: "eq",
      column: "alarmConfigId",
      value: props.id,
      type: "and",
    });
  }
};

const getActions = (
    currentData: Partial<Record<string, any>>,
    type: "card" | "table"
): any[] => {
  if (!currentData) return [];
  const actions = [
    {
      key: "solve",
      text: $t("TabComponent.index.165152-23"),
      tooltip: {
        title:
            currentData.state?.value === "normal"
                ? $t("TabComponent.index.165152-16")
                : $t("TabComponent.index.165152-23"),
      },
      disabled: currentData.state?.value === "normal",
      icon: "ToolOutlined",
      onClick: () => {
        data.value.current = currentData;
        data.value.solveVisible = true;
      },
    },
    {
      key: "log",
      text: $t("TabComponent.index.165152-24"),
      tooltip: {
        title: $t("TabComponent.index.165152-24"),
      },
      icon: "FileOutlined",
      onClick: () => {
        menuStory.jumpPage(`${permissionKey}/Detail`, {
          params: {id: currentData.id},
        });
      },
    },
    {
      key: "detail",
      text: $t("TabComponent.index.165152-25"),
      tooltip: {
        title: $t("TabComponent.index.165152-25"),
      },
      icon: "FileTextOutlined",
      onClick: () => {
        menuStory.jumpPage(`${permissionKey}/Record`, {
          query: {id: currentData.id},
        });
      },
    },
  ];
  return actions;
};
/**
 * 关闭告警日志
 */
const closeSolve = () => {
  data.value.solveVisible = false;
};
const refresh = () => {
  data.value.solveVisible = false;
  tableRef.value.reload(params.value);
};

const refreshTable = () => {
  tableRef.value.reload(params.value);
};
const showDrawer = (data: any) => {
  drawerData.value = data;
  visibleDrawer.value = true;
};
onMounted(() => {
  if (props.id) {
    params.value.terms = [
      {
        termType: "eq",
        column: "alarmConfigId",
        value: props.id,
        type: "and",
      },
    ];
  }
  if (props.type === "all") {
    params.value.terms = [];
  }
});

</script>
<style lang="less" scoped>
.content-title {
  color: #666;
  font-size: 12px;
}

.alarmTitle {
  display: flex;
  width: 60%;

  .alarmLevel {
    width: 30%;
    text-align: center;
    padding: 5px;
  }

  .alarmName {
    max-width: 30%;
    color: #1a1a1a;
    margin-right: 10px;
  }
}
</style>
