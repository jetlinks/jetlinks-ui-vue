<!-- 坐标点拾取组件 -->
<template>
    <div class="page-container">
        <a-input allowClear v-model:value="inputPoint">
            <template #addonAfter>
                <AIcon type="EnvironmentOutlined" @click="showMap" />
            </template>
        </a-input>
        <a-modal
            title="地理位置"
            ok-text="确认"
            cancel-text="取消"
            v-model:visible="modalVis"
            width="700px"
            @cancel="modalVis = false"
            @ok="handleModalSubmit"
            destroyOnClose
            :zIndex="1031"
        >
            <div style="width: 100%; height: 400px">
              <AMapComponent
                  style="height: 100%"
                  :center="center"
                  :zoom="zoom"
                  @init="initMap"
              >
                <el-amap-search-box visible @select="selectPoi" />
                <el-amap-marker :position="position" />
              </AMapComponent>
              <div>
                {{ mapPoint }}
              </div>
            </div>
        </a-modal>

    </div>
</template>

<script setup lang="ts" name="SelectAMap">
interface EmitProps {
    (e: 'update:point', data: string): void;
    (e: 'change', data: string): void;
}
const props = defineProps({
    point: { type: String, default: '' },
});
const emit = defineEmits<EmitProps>();

// 手动输入的坐标点(经纬度字符串)
const inputPoint = computed({
    get: () => {
        return props.point;
    },
    set: (val: any) => {
        mapPoint.value = val;
        emit('update:point', val);
        emit('change', val);
    },
});

// 地图弹窗
const modalVis = ref<boolean>(false);
const handleModalSubmit = () => {
    inputPoint.value = mapPoint.value;
    modalVis.value = false;
};

// 地图拾取的坐标点(经纬度字符串)
const mapPoint = ref('');

const zoom = ref(14);
const center = ref([106.55, 29.56]);
let map: any = null;

// 地图经纬度
const position = ref<number[] | string[]>([]);

/**
 * 地图初始化
 * @param e
 */
const initMap = (e: any) => {
    map = e;
    const pointStr = mapPoint.value as string;
    const markerPoint = pointStr ? pointStr.split(',') : center.value
    position.value = markerPoint;
    map.setCenter(markerPoint);
    map.on('click', (_event: any) => {
      clickMap(_event)
    })
};

/**
 * 地图点击
 * @param e
 */
const clickMap = (e: any) => {
    mapPoint.value = `${e.lnglat.lng},${e.lnglat.lat}`;
    position.value = [e.lnglat.lng, e.lnglat.lat];
};

const showMap = () => {
  mapPoint.value = props.point
  modalVis.value = true;
}

/**
 * 选择搜索结果
 * @param e
 */
const selectPoi = (e: any) => {
  if (e.poi.location) {
    const selectPoint = [e.poi.location.lng, e.poi.location.lat];
    mapPoint.value = selectPoint.join(',');
    position.value = selectPoint
    map.setCenter(selectPoint);
  }
};

</script>

<style lang="less">
.amap-sug-result {
  z-index: 1050;
}
</style>
