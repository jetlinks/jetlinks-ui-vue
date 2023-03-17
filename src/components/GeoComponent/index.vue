<!-- 坐标点拾取组件 -->
<template>
    <div class="page-container">
        <j-input allowClear v-model:value="inputPoint">
            <template #addonAfter>
                <environment-outlined @click="modalVis = true" />
            </template>
        </j-input>
        <j-modal
            title="地理位置"
            ok-text="确认"
            cancel-text="取消"
            v-model:visible="modalVis"
            width="700px"
            @cancel="modalVis = false"
            @ok="handleModalSubmit"
            destroyOnClose
        >
            <div style="width: 100%; height: 400px">
                <el-amap
                    :center="center"
                    :zoom="zoom"
                    @init="initMap"
                    @click="clickMap"
                >
                    <el-amap-search-box visible @select="selectPoi" />
                    <el-amap-marker :position="position" />
                </el-amap>
                {{ mapPoint }}
            </div>
        </j-modal>
    </div>
</template>

<script setup lang="ts">
import { initAMapApiLoader } from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css';
import { EnvironmentOutlined } from '@ant-design/icons-vue';

initAMapApiLoader({
    // key: '95fa72137f4263f8e64ae01f766ad09c',
    key: 'a0415acfc35af15f10221bfa5a6850b4',
    securityJsCode: 'cae6108ec3dd222f946d1a7237c78be0',
});

interface EmitProps {
    (e: 'update:point', data: string): void;
}
const props = defineProps({
    point: { type: [Number, String], default: '' },
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

const zoom = ref(12);
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
    position.value = pointStr ? pointStr.split(',') : center.value;
};

/**
 * 地图点击
 * @param e
 */
const clickMap = (e: any) => {
    mapPoint.value = `${e.lnglat.lng},${e.lnglat.lat}`;
    position.value = [e.lnglat.lng, e.lnglat.lat];
};

/**
 * 选择搜索结果
 * @param e
 */
const selectPoi = (e: any) => {
    const selectPoint = [e.poi.location.lng, e.poi.location.lat];
    mapPoint.value = selectPoint.join(',');
    map.setCenter(selectPoint);
};
</script>

<style lang="less" scoped></style>
