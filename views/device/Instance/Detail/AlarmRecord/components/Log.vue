<template>
  <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="false"
      bordered
      :scroll="{ y: 'calc(100vh - 300px)' }"
  >
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'alarmTime'"
      ><span
      >{{
          dayjs(text).format('YYYY-MM-DD HH:mm:ss')
        }}</span
      ></template>
      <template v-if="column.dataIndex === 'sourceName'">
          <div class="sourceName">
            <div class="name">{{ $t('components.Log.809848-0') }}</div>
            <div @click="() => gotoDevice(record.sourceId)" class="deviceId">
              <j-ellipsis>{{ text }}</j-ellipsis>
            </div>
          </div>
      </template>
      <template
          v-if="
                    column.dataIndex === 'triggerDesc' ||
                    column.dataIndex === 'actualDesc'
                "
      >
        <j-ellipsis>{{ text }}</j-ellipsis>
      </template
      >
      <template v-if="column.dataIndex === 'action'">
        <a-button type="link" @click="() => showDetail(record)">
          <template #icon>
            <AIcon type="EyeOutlined"></AIcon>
          </template>
        </a-button>
      </template>
    </template>
  </a-table
  >
  <div class="tableBottom">
    <a-button
        v-if="exceed"
        class="moreBtn"
        type="link"
        @click="gotoAlarmLog"
    >{{ $t('components.Log.809848-1') }} >
    </a-button
    >
    <span v-else-if="dataSource.length">{{ $t('components.Log.809848-2') }}</span>
  </div>
  <LogDetail v-if="visibleDetail" :data="current" @close="close"/>
</template>

<script setup>
import {queryLogList} from '@device-manager-ui/api/rule-engine/log';
import dayjs from 'dayjs';
import {useMenuStore} from '@jetlinks-web-core/store';
import LogDetail from './LogDetail.vue';
import {useI18n} from 'vue-i18n';

const {t: $t} = useI18n();
const props = defineProps({
  currentId: {
    type: String,
    default: '',
  },
  configId: {
    type: String,
    default: '',
  },
  goal: {
    type: String,
    default: ''
  }
});
const menuStory = useMenuStore();
const exceed = ref();
const visibleDetail = ref(false);
const dataSource = ref([]);
const current = ref();
const columns = computed(() => {
  const arr = [
    {
      title: $t('components.Log.809848-3'),
      dataIndex: 'alarmTime',
      key: 'alarmTime',
    },
    {
      title: $t('components.Log.809848-4'),
      dataIndex: 'triggerDesc',
      key: 'triggerDesc',
    }
  ]
  if (props.goal === 'product') {
    arr.push({
      title: $t('components.Log.809848-5'),
      dataIndex: 'sourceName',
      key: 'sourceName',
    })
  }
  return [
    ...arr,
    {
      title: $t('components.Log.809848-6'),
      dataIndex: 'actualDesc',
      key: 'actualDesc',
    },
    {
      title: $t('components.Log.809848-7'),
      dataIndex: 'action',
      key: 'action',
      width: 100
    }
  ]
})
const queryData = async () => {
  const params = {
    pageIndex: 0,
    pageSize: 51,
    // terms: [
    //   {
    //     column: 'alarmRecordId',
    //     termType: 'eq',
    //     value: props.currentId,
    //     type: 'and',
    //   },
    // ],
    sorts: [
      {
        name: 'alarmTime',
        order: 'desc',
      },
    ],
  }
  // const res = props.goal ? await queryPreconditioningLogList(props.configId, params) : await queryLogList(props.configId, params);
  const res = await queryLogList(props.currentId, params)
  if (res.success) {
    if (res.result.data?.length > 50) {
      exceed.value = true;
      dataSource.value = res.result.data.slice(0, 50);
    } else {
      exceed.value = false;
      dataSource.value = res.result.data;
    }
  }
};

const gotoDevice = (id) => {
  menuStory.jumpPage('device/Instance/Detail', {params: {id, tab: 'Running'}});
};
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
    }
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
  color: #4096FF;
}

.sourceName {
  display: flex;

  .name {
    width: 100px;
    white-space: nowrap;
  }
}
</style>
