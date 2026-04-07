<template>
  <j-page-container>
    <pro-search
      :columns="columns"
      target="alarm-log-detail"
      @search="handleSearch"
    />
    <FullPage>
      <JProTable
        :columns="columns"
        mode="TABLE"
        ref="tableRef"
        :request="queryList"
        :params="params"
        :defaultParams="{
          terms,
          sorts: [{ name: 'alarmTime', order: 'desc' }],
        }"
      >
        <template #alarmTime="slotProps">{{
          dayjs(slotProps.alarmTime).format("YYYY-MM-DD HH:mm:ss")
        }}</template>
        <template #sourceName="slotProps"
          >{{ sourceName(slotProps.sourceType) }}：<a
            type="link"
            @click="() => gotoDevice(slotProps.sourceType, slotProps.sourceId)"
            >{{ slotProps.sourceName }}</a
          ></template
        >
        <template #action="slotProps">
          <a-space :size="16"
            ><template v-for="i in getActions(slotProps, 'table')" :key="i.key">
              <j-permission-button
                :disabled="i.disabled"
                :popConfirm="i.popConfirm"
                :tooltip="{
                  ...i.tooltip,
                }"
                @click="i.onClick"
                type="link"
                style="padding: 0px"
              >
                <template #icon><AIcon :type="i.icon" /></template>
              </j-permission-button>
            </template>
          </a-space>
        </template>
      </JProTable>
    </FullPage>
    <Info
      v-if="visible && alarmType !== 'device'"
      :data="current"
      @close="close"
    />
    <LogDetail
      v-if="visible && alarmType === 'device'"
      :data="current"
      @close="close"
    />
  </j-page-container>
</template>

<script lang="ts" setup>
import { queryAlarmRecordNoPaging, queryLogList } from "@rule-engine-manager-ui/api/log";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { useAlarmStore } from "@rule-engine-manager-ui/store/alarm";
import Info from "./info.vue";
import { useRouterParams } from "@jetlinks-web/hooks";
import { useMenuStore } from "@jetlinks-web-core/store/menu";
import LogDetail from "../TabComponent/components/LogDetail.vue";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const route = useRoute();
const id = route.params?.id;
const menuStory = useMenuStore();
const { params: routerParams } = useRouterParams();
const visible = ref(false);
const tableRef = ref();
const params = ref({});
const alarmStore = useAlarmStore();
const { data } = alarmStore;
const current = ref(); // 当前告警记录信息
const details = ref(); // 告警记录的详情
const alarmType = ref();
const alarmTriggerType = inject('alarmTriggerType', 'iot')
const columns = ref(
    [
      {
        title: $t('Detail.index.165158-1'),
        dataIndex: "alarmTime",
        key: "alarmTime",
        scopedSlots: true,
        search: {
          type: "date",
        },
      },
      {
        title: $t('Detail.index.165158-6'),
        dataIndex: "triggerDesc",
        key: "triggerDesc",
      },
      {
        title: $t('Detail.index.165158-7'),
        dataIndex: "sourceName",
        key: "sourceName",
        scopedSlots: true,
        search: {
          type: "string",
        },
      },
      {
        title: $t('Detail.index.165158-8'),
        dataIndex: "actualDesc",
        key: "actualDesc",
        scopedSlots: true,
        search: {
          type: "string",
        },
      },
      {
        title: $t('Detail.index.165158-4'),
        dataIndex: "action",
        key: "action",
        width: 100,
        scopedSlots: true,
      },
    ]
//     [
//   {
//     title: $t('Detail.index.165158-1'),
//     dataIndex: "alarmTime",
//     key: "alarmTime",
//     scopedSlots: true,
//     search: {
//       type: "date",
//     },
//   },
//   {
//     title: $t('Detail.index.165158-2'),
//     dataIndex: "alarmConfigName",
//     key: "alarmConfigName",
//   },
//   {
//     title: $t('Detail.index.165158-3'),
//     dataIndex: "description",
//     key: "description",
//   },
//   {
//     title: $t('Detail.index.165158-4'),
//     dataIndex: "action",
//     key: "action",
//     width: 100,
//     scopedSlots: true,
//   },
// ]
);
const getActions = (
  data: Partial<Record<string, any>>,
  type?: "table"
): any[] => {
  if (!data) {
    return [];
  }
  const actions = [
    {
      key: "view",
      text: $t('Detail.index.165158-5'),
      tooltip: {
        title: $t('Detail.index.165158-5'),
      },
      icon: "EyeOutlined",
      onClick: () => {
        current.value = data;
        visible.value = true;
      },
    },
  ];
  return actions;
};
const terms = [
  {
    column: "alarmRecordId",
    termType: "eq$not",
    value: id,
    type: "and",
  },
];

const sourceName = computed(() => {
  return (type: string) => {
    let name = '';
    switch(type) {
      case 'scene':
        name = $t('Detail.index.165158-9')
        break;
      case 'device':
        name = $t('Detail.index.165158-0')
        break;
      case 'networkCardPool':
        name = $t('Detail.index.165158-10')
        break;
      case 'collector':
        name = $t('Detail.index.165158-11')
        break;
      default:
        name = ''
    }
    return name
  }
})
/**
 * 获取详情列表
 */
const queryList = (params: any) => {
  if (id) {
    return queryLogList(id, {
      ...params,
    })
  }
};
const gotoDevice = (type: string, id: string) => {
  switch(type) {
    case 'device':
      menuStory.jumpPage("device/Instance/Detail", {
        params: { id, tab: "Running" },
      });
      break;
    case 'networkCardPool':
      menuStory.jumpPage("iot-card/TrafficPoolManagement/Detail", {
        params: {
          id
        }
      })
      break
    case 'scene':
      menuStory.jumpPage('rule-engine/Scene/Save', {
        query: {
          id,
        }
      })
      break
    case 'collector':
      if(alarmTriggerType === 'edge') {
        menuStory.jumpPage('data-collect/collector', {
          query: {
            collectorId: id
          }
        })
      } else {
        menuStory.jumpPage('DataCollect/Collector', {
          query: {
            collectorId: id
          }
        })
      }
  }

};
/**
 * 根据id初始化数据
 */

watch(
  () => id,
  async () => {
    const res = await queryAlarmRecordNoPaging({
      "terms": [
          {
            "column": "id",
            "value": id,
            "termType": "eq"
          }
      ]
    });
    if (res.success) {
      data.current = res.result?.[0] || {};
      tableRef.value?.reload();
      alarmType.value = data.current?.targetType;
      // if (alarmType.value === "device") {
      //   columns.value =
      // }
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
const handleSearch = (_params: any) => {
  params.value = _params;
};

/**
 * 关闭模态弹窗
 */
const close = () => {
  visible.value = false;
};

watchEffect(() => {
  current.value = details.value;
  if (routerParams.value.detail && details.value) {
    visible.value = true;
  }
});
</script>
<style lang="less" scoped></style>
