<template>
  <div style="width: 100%; height: 100%;position: relative">
    <a-map-component @init="onMapInit" :center="center">
      <template v-for="item in markerPoints" :key="item.id">
        <el-amap-marker
            :position="item.lnglat"
            @click="clickMarker(item)"
        >
          <img :src="markerImg" :width="20"/>
        </el-amap-marker>
      </template>
      <el-amap-info-window
          v-if="windowPosition.lnglat"
          v-model:visible="visible"
          :position="windowPosition.lnglat"
          :autoMove="true"
          :isCustom="true"
          :offset="[20, -10]"
          :closeWhenClickMap="!isShow"
      >
        <div class="windowBox">
          <div class="flex-box" style="margin-bottom: 16px">
            <div class="window-img">
              <img :src="InfoImg" style="height: 100%; max-width: 100%"/>
            </div>
            <div style="flex: 1; min-width: 0">
              <div class="flex-box" style="justify-content: space-between">
                <div style="font-size: 16px; cursor: pointer" @click="onClick(windowPosition.cardId)">{{ windowPosition.cardId }}</div>
                <a-tooltip :title="$t('RealtimePositioning.index.390590-9')">
                  <a-button type="text" @click="onHistory(windowPosition)">
                    <AIcon type="ProfileOutlined" />
                  </a-button>
                </a-tooltip>
              </div>
              <div class="flex-box" style="margin: 4px 0">
                <span class="label">ICCID</span>
                <j-ellipsis>{{ windowPosition.iccId || '--' }}</j-ellipsis>
              </div>
              <div class="flex-box">
                <span class="label">{{ $t('CardManagement.index.427944-4') }}</span>
                <a @click="onDeviceClick(windowPosition.deviceId)">
                  <j-ellipsis>{{ windowPosition.deviceName || "--" }}</j-ellipsis>
                </a>
              </div>
            </div>
          </div>
          <div class="items-list">
            <div class="_items flex-box">
              <div>
                <AIcon class="icon" type="EnvironmentOutlined"/>
                <span class="label">{{ $t('RealtimePositioning.index.390590-4') }}</span>
              </div>
              <j-ellipsis>{{ windowPosition.lnglat.join(',') }}</j-ellipsis>
            </div>
            <div class="_items flex-box">
              <div>
                <AIcon class="icon" type="FileSearchOutlined"/>
                <span class="label">{{ $t('RealtimePositioning.index.390590-5') }}</span>
              </div>
              <j-ellipsis>{{ windowPosition.location || "--" }}</j-ellipsis>
            </div>
            <div class="_items flex-box">
              <div>
                <AIcon class="icon" type="ClockCircleOutlined"/>
                <span class="label">{{ $t('RealtimePositioning.index.390590-6') }}</span>
              </div>
              <j-ellipsis>{{ windowPosition.locationTime ? dayjs(windowPosition.locationTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}</j-ellipsis>
            </div>
          </div>
        </div>
      </el-amap-info-window>
    </a-map-component>
  </div>
  <HistoryList v-if="history.visible" :data="history.data" @close="history.visible = false" />
</template>

<script setup>
import markerImg from '@device-manager-ui/assets/iot-card/realtime-positioning/marker.png'
import InfoImg from '@device-manager-ui/assets/iot-card/realtime-positioning/info.png'
import HistoryList from "./HistoryList.vue";
import {useI18n} from "vue-i18n";
import dayjs from 'dayjs'
import {useMenuStore} from "@jetlinks-web-core/store";

const props = defineProps({
  marks: {
    type: Array,
    default: () => []
  },
  isShow: {
    type: Boolean,
    default: false
  }
})

const {t: $t} = useI18n();
const markerPoints = ref([])
const windowPosition = ref({})
const center = ref();
const visible = ref(props.isShow)
const history = reactive({
  visible: false,
  data: {}
})
const menuStore = useMenuStore()
let map;
const clickMarker = (item) => {
  visible.value = true
  windowPosition.value = item
  center.value =  item.lnglat
}

const onMapInit = (instance) => {
  if (!map) {
    map = instance
  }
}

const onClick = (id) => {
  if(props.isShow){
    return
  }
  if(id){
    menuStore.jumpPage('iot-card/CardManagement/Detail', {
      params: {id}
    })
  }
}

const onDeviceClick = (id) => {
  if(id){
    menuStore.jumpPage('device/Instance/Detail', {
      params: {id}
    })
  }
}

const onHistory = (dt) => {
  history.visible = true
  history.data = dt
}

const onRefresh = () => {
  visible.value = false
  windowPosition.value = {}
}

watch(() => props.marks, (val) => {
  markerPoints.value = val.map(item => {
    return {
      ...item,
      lnglat: [item.longitude, item.latitude],
      label: item.iccId
    }
  })
  if(markerPoints.value[0]?.lnglat){
    center.value =  markerPoints.value[0].lnglat
    if(props.isShow){
      visible.value = true
      windowPosition.value = markerPoints.value[0]
    }
  }
}, {
  immediate: true,
  deep: true
})

defineExpose({onRefresh})
</script>
<style lang="less" scoped>
.windowBox {
  width: 400px;
  background-color: rgba(255, 255, 255, 0.65);
  border-radius: 6px;
  overflow: hidden;
  padding: 16px;
  border: 1px solid #ffffff;
  backdrop-filter: blur(8px);
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),0 3px 6px -4px rgba(0, 0, 0, 0.12),0px 9px 28px 8px rgba(0, 0, 0, 0.05);

  .window-img {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.actions {
  position: absolute;
  bottom: 20px;
  right: 50%;
  left: 50%;
}

.flex-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.items-list {
  background-color: #ffffff;
  border-radius: 6px;
  border: 1px solid #e6e6e6;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  ._items {
    & > div {
      white-space: nowrap;
    }

    .icon {
      margin-right: 10px;
      color: @primary-color;
    }
  }
}

.label {
  color: #777777;
}
</style>

