<template>
  <a-drawer :width="850" :maskClosable="true" open @close="emits('close')" :closable="false">
    <div class="drawer">
      <div style="margin-bottom: 12px">
        <a-button type="link" @click="onClick(data.cardId)" size="small" style="padding: 0">
          <j-ellipsis>{{ data.cardId || '--' }}</j-ellipsis>
        </a-button>
      </div>
      <div class="items">
        <div class="item">
          <span style="color: #777777">ICCD</span>
          <j-ellipsis>{{ data.iccId || '--' }}</j-ellipsis>
        </div>
        <div class="item">
          <span style="color: #777777"> {{ $t('Detail.index.427958-3') }}</span>
          <a-button type="link" size="small" style="padding: 0" @click="onDeviceClick(data.deviceId)">
            <j-ellipsis>{{ data.deviceName || '--' }}</j-ellipsis>
          </a-button>
        </div>
      </div>
      <pro-search
          :columns="columns"
          type="simple"
          @search="handleSearch"
          style="padding: 0"
      />
      <div class="table-content">
        <j-pro-table
            v-if="data.cardId"
            :columns="columns"
            :request="queryPositionRecord"
            :defaultParams="{
              sorts: [{ name: 'locationTime', order: 'desc' }],
              terms: [
                  {
                    column: 'cardId',
                    value: data.cardId,
                    termType: 'eq'
                  }
              ]
            }"
            :params="params"
            mode="CARD"
            :gridColumns="[1]"
            style="padding: 0; margin: 0"
        >
          <template #card="item">
            <div class="_items-box">
              <div class="_items">
                <div>
                  <AIcon class="icon" type="EnvironmentOutlined"/>
                  <span style="color: #7f7f7f; margin-left: 8px">{{ $t('RealtimePositioning.index.390590-4') }}</span>
                </div>
                <j-ellipsis>{{ item.latitude ? `${item.longitude},${item.latitude}` : '--' }}</j-ellipsis>
              </div>
              <div class="_items">
                <div>
                  <AIcon class="icon" type="FileSearchOutlined"/>
                  <span style="color: #7f7f7f; margin-left: 8px">{{ $t('RealtimePositioning.index.390590-5') }}</span>
                </div>
                <j-ellipsis>{{ item.location || '--' }}</j-ellipsis>
              </div>
              <div class="_items">
                <div>
                  <AIcon class="icon" type="ClockCircleOutlined"/>
                  <span style="color: #7f7f7f; margin-left: 8px">{{ $t('RealtimePositioning.index.390590-6') }}</span>
                </div>
                <j-ellipsis>{{
                    item.locationTime ? dayjs(item.locationTime).format('YYYY-MM-DD HH:mm:ss') : '--'
                  }}
                </j-ellipsis>
              </div>
            </div>
          </template>
        </j-pro-table>
      </div>
    </div>
  </a-drawer>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {queryPositionRecord} from "@device-manager-ui/api/iot-card/realtimePositioning";
import dayjs from 'dayjs'
import {useMenuStore} from "@jetlinks-web-core/store";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['close'])
const {t: $t} = useI18n();
const params = ref({})
const menuStore = useMenuStore()

const columns = [
  {
    title: $t('RealtimePositioning.index.390590-6'),
    dataIndex: 'locationTime',
    key: 'locationTime',
    search: {
      type: 'date',
    },
  },
]

const handleSearch = (e) => {
  params.value = e
}

const onClick = (id) => {
  if (id) {
    menuStore.jumpPage('iot-card/CardManagement/Detail', {
      params: {id}
    })
  }
}

const onDeviceClick = (id) => {
  if (id) {
    menuStore.jumpPage('device/Instance/Detail', {
      params: {id}
    })
  }
}
</script>

<style lang="less" scoped>
.items {
  margin-bottom: 16px;

  .item {
    display: flex;
    gap: 16px;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}

.drawer {
  height: 100%;
  display: flex;
  flex-direction: column;

  .table-content {
    flex: 1;
    min-height: 0;
  }

  ._items-box {
    border: 1px solid #D9D9D9;
    border-radius: 6px;
    width: 100%;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  ._items {
    display: flex;
    gap: 16px;
  }

  .icon {
    color: @primary-color;
  }
}
</style>
