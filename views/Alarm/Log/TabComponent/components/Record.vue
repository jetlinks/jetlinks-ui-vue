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
    :scroll="{ y: 'calc(100vh - 260px)' }"
  >
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'alarmTime'">
        <j-ellipsis>
          {{ dayjs(text).format("YYYY-MM-DD HH:mm:ss") }}
        </j-ellipsis>
      </template>
      <template v-if="column.dataIndex === 'handleTime'">
        <j-ellipsis>
          {{ text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "--" }}
        </j-ellipsis>
      </template>
      <template v-if="column.dataIndex === 'duration'">
        <Duration :data="record" />
      </template>
      <template v-if="column.dataIndex === 'state'">
        {{ text?.text || "--" }}
      </template>
      <template v-if="column.dataIndex === 'handleType'">
        {{ text?.text || "--" }}
      </template>
      <template v-if="column.dataIndex === 'description'">
        <j-ellipsis>
          {{ text || "--" }}
        </j-ellipsis>
      </template>
    </template>
  </a-table>
  <div class="tableBottom">
    <a-button v-if="exceed" class="moreBtn" type="link" @click="gotoAlarmRecord"
      >{{ $t("components.Record.165159-0") }} ></a-button
    ><span v-else-if="dataSource.length">{{
      $t("components.Record.165159-1")
    }}</span>
  </div>
</template>

<script setup>
import { queryHandleHistory } from "../../../../../api/log";
import dayjs from "dayjs";
import { useMenuStore } from "@jetlinks-web-core/store/menu";
import { defineExpose } from "vue";
import Duration from "../../components/Duration.vue";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();
const props = defineProps({
  currentId: {
    type: String,
    default: "",
  },
});
const exceed = ref();
const dataSource = ref([]);
const menuStory = useMenuStore();
// const params = ref({})
const columns = [
  {
    title: $t("components.Record.165159-2"),
    dataIndex: "alarmTime",
    key: "alarmTime",
    search: {
      type: 'date',
    },
    width: 180,
  },
  {
    title: $t("components.Record.165159-3"),
    dataIndex: "handleTime",
    key: "handleTime",
    search: {
      type: 'date',
    },
    width: 180,
  },
  {
    title: $t("components.Record.165159-4"),
    dataIndex: "duration",
    key: "duration",
  },
  {
    title: $t('components.Record.165159-7'),
    dataIndex: "state",
    key: "state",
    search: {
      type: 'select',
      options: [
        {
          label: $t('components.Record.165159-8'),
          value: 'processed',
        },
        {
          label: $t('components.Record.165159-9'),
          value: 'unprocessed',
        },
      ],
    },
  },
  {
    title: $t("components.Record.165159-5"),
    dataIndex: "handleType",
    key: "handleType",
    search: {
      type: 'select',
      options: [
        {
          label: $t('Record.index.165150-3'),
          value: 'system',
        },
        {
          label: $t('Record.index.165150-4'),
          value: 'user',
        },
      ],
    },
  },
  {
    title: $t("components.Record.165159-6"),
    dataIndex: "description",
    key: "description",
    search: {
      type: 'string',
    },
  },
];

const queryList = async (params = {}) => {
  const res = await queryHandleHistory(props.currentId, {
    sorts: [{ name: "createTime", order: "desc" }],
    ...params,
    pageIndex: 0,
    pageSize: 50,
  });
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
  // params.value = e
  queryList(e)
}
const gotoAlarmRecord = () => {
  menuStory.jumpPage("rule-engine/Alarm/Log/Record", {
    query: { id: props.currentId },
  });
};
const refreshRecord = () => {
  queryList();
};
defineExpose({
  refreshRecord,
});
onMounted(() => {
  queryList({});
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
</style>
