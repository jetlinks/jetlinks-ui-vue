<template>
  <pro-search
      :columns="columns"
      @search="onSearch"
      type="simple"
      style="padding: 0"
  />
  <a-table
    :dataSource="dataSource"
    :columns="columns"
    :pagination="false"
    bordered
    :scroll="{ y: 'calc(100vh - 300px)' }"
  >
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'alarmTime'"
        ><span>{{ dayjs(text).format("YYYY-MM-DD HH:mm:ss") }}</span></template
      >
      <template v-if="column.dataIndex === 'sourceName'">
        <j-ellipsis
          v-if="['device','organization','product'].includes(record.sourceType)"
        >
          {{ $t('components.Log.165155-0') }}
          <span class="deviceId" @click="() => gotoDevice(record.sourceId)">{{
            text
          }}</span></j-ellipsis
        >
        <j-ellipsis
          v-else-if="['collector'].includes(record.sourceType)"
        >
          {{ $t('components.Log.165155-10') }}
          <span class="deviceId" @click="() => gotoCollector(record.sourceId)">{{
              text
            }}</span></j-ellipsis
        >
        <j-ellipsis v-else-if="['networkCardPool'].includes(record.sourceType)">
          {{ $t('components.Log.165155-11') }}
          <span class="deviceId" @click="() => gotoNetworkCardPool(record.sourceId)">{{text}}</span>
        </j-ellipsis>
        <j-ellipsis v-else>{{ $t('components.Log.165155-1') }}<span class="deviceId" @click="() => gotoRule(record)">{{text}}</span></j-ellipsis>
      </template>
      <template
        v-if="
          column.dataIndex === 'triggerDesc' ||
          column.dataIndex === 'actualDesc'
        "
        ><j-ellipsis>{{ text }}</j-ellipsis></template
      >
      <template v-if="column.dataIndex === 'action'">
        <a-button type="link" @click="() => showDetail(record)">
          <template #icon>
            <AIcon type="EyeOutlined"></AIcon>
          </template>
        </a-button>
      </template> </template
  ></a-table>
  <div class="tableBottom">
    <a-button v-if="exceed" class="moreBtn" type="link" @click="gotoAlarmLog"
      >{{ $t('components.Log.165155-2') }} ></a-button
    >
    <span v-else-if="dataSource.length">{{ $t('components.Log.165155-3') }}</span>
  </div>
  <LogDetail v-if="visibleDetail" :data="current" @close="close" />
</template>

<script setup>
import {
  queryLogList,
} from "@rule-engine-manager-ui/api/log";
import dayjs from "dayjs";
import { useMenuStore } from "@jetlinks-web-core/store/menu";
import LogDetail from "./LogDetail.vue";
import { useI18n } from 'vue-i18n'
import { queryCollectorById } from "@rule-engine-manager-ui/api/collector";

const { t: $t } = useI18n()
const props = defineProps({
  currentId: {
    type: String,
    default: "",
  },
  configId: {
    type: String,
    default: "",
  },
  goal: {
    type: String,
    default: "",
  },
});
const menuStory = useMenuStore();
const exceed = ref();
const visibleDetail = ref(false);
const dataSource = ref([]);
const current = ref();
const columns = [
  {
    title: $t('components.Log.165155-4'),
    dataIndex: "alarmTime",
    key: "alarmTime",
    search: {
      type: 'date',
    },
  },
  {
    title: $t('components.Log.165155-5'),
    dataIndex: "triggerDesc",
    key: "triggerDesc",
  },
  {
    title: $t('components.Log.165155-6'),
    dataIndex: "sourceName",
    key: "sourceName",
    search: {
      type: 'string',
    },
  },
  {
    title: $t('components.Log.165155-7'),
    dataIndex: "actualDesc",
    key: "actualDesc",
    search: {
      type: 'string',
    },
  },
  {
    title: $t('components.Log.165155-8'),
    dataIndex: "action",
    key: "action",
    width: 100,
  },
];
const queryData = async (e = {}) => {
  const params = {
    ...e,
    pageIndex: 0,
    pageSize: 50,
    sorts: [
      {
        name: "alarmTime",
        order: "desc",
      },
    ],
  };
  const res = await queryLogList(props.currentId, params);
  if (res.success) {
    if (res.result.total > 50) {
      exceed.value = true;
      dataSource.value = res.result.data.slice(0, 50);
    } else {
      exceed.value = false;
      dataSource.value = res.result.data;
    }
  }
};

const onSearch = (e) => {
  queryData(e)
}

const gotoDevice = (id) => {
  menuStory.jumpPage("device/Instance/Detail", {
    params: { id, tab: "Running" },
  });
};

const gotoCollector = async (id) => {
  const res = await queryCollectorById(id);
  menuStory.jumpPage("DataCollect/Collector", {
    query: { collectorId: id },
  });
};

const gotoNetworkCardPool = (id) => {
  menuStory.jumpPage("iot-card/TrafficPoolManagement/Detail", {
    params: {
      id
    }
  })
}

const gotoRule = (record) => {
  menuStory.jumpPage(
    'rule-engine/Scene/Save',
    {
      query: { triggerType:record.sourceName===$t('components.Log.165155-9')?'timer':'manual', id:record.sourceId, type: 'view' }
    },
  );
}

const showDetail = (data) => {
  visibleDetail.value = true;
  current.value = data;
};
const close = () => {
  visibleDetail.value = false;
};
const gotoAlarmLog = () => {
  menuStory.jumpPage(`rule-engine/Alarm/Log/Detail`, {
    params: {
      id: props.currentId,
    },
  });
};
onMounted(() => {
  queryData();
});
</script>
<style lang="less" scoped>
.tableBottom {
  text-align: center;
  position: relative;
  height: 50px;
  margin-top: 20px;
  .moreBtn {
    position: absolute;
    right: 50%;
    top: 10px;
  }
}
.deviceId {
  cursor: pointer;
  color: #4096ff;
}
</style>
