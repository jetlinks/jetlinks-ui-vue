<template>
    <page-container>
        <full-page fixed>
            <div class="region-map">
                <AMapComponent @init="initMap"> </AMapComponent>
                <div class="tree-card">
                    <MapTree @select-data="selectData" />
                </div>
                <div class="search-card">
                    <j-input
                        placeholder="请输入车辆简称"
                        v-model:value="mapSearchValue"
                        @pressEnter="mapSearch"
                        style="height: 48px"
                        @change="mapSearchChange"
                    >
                        <template #suffix>
                            <AIcon type="SearchOutlined" @click="mapSearch" />
                        </template>
                    </j-input>
                </div>
                <div class="vehicleType-card">
                    <j-radio-group
                        class="radio-group"
                        v-model:value="typeValue"
                    >
                        <j-radio class="type-radio radio-all" value="a"
                            >全部车辆</j-radio
                        >
                        <j-radio class="type-radio radio-Alarm" value="b"
                            >故障车辆</j-radio
                        >
                        <j-radio class="type-radio radio-Fault" value="c"
                            >告警车辆</j-radio
                        >
                    </j-radio-group>
                </div>
            </div>
        </full-page>
    </page-container>
</template>

<script lang="ts" setup>
import AMapComponent from '@/components/AMapComponent/index.vue';
import MapTree from './mapTree/index.vue';
import { createWindow } from './utils/index';
const MapRef = ref();
const loading = ref(true);
const mapSearchValue = ref();
const typeValue = ref('a');

const groupId = ref();
const selectData = (data: any) => {
    groupId.value = data[0];
    console.log('data', data);
};

const lineArr = [
    [116.478935, 39.997761],
    [116.479282, 39.99856],
    [116.479658, 39.998528],
    [116.481149, 39.998184],
    [116.483633, 39.998935],
    [116.484648, 39.999861],
    [116.485401, 40.0000123],
];

const path = ref(lineArr);

const initMap = (e: any) => {
    // console.log('map', e);
    loading.value = true;
    MapRef.value = e;
    loading.value = false;
    const map = MapRef.value;
    map.setZoom(12);
    MapRef.value.setCenter(path.value[0], true);
    const labelsLayer = new AMap.LabelsLayer({
        zooms: [3, 20],
        zIndex: 1000,
        collision: true, //该层内标注是否避让
        allowCollision: true, //不同标注层之间是否避让
    });

    //设置一个图标对象
    const icon = {
        type: 'image', //图标类型，现阶段只支持 image 类型
        image: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png', //可访问的图片 URL
        size: [24, 48], //图片尺寸
        anchor: 'center', //图片相对 position 的锚点，默认为 bottom-center
    };

    const labelMarker1 = new AMap.LabelMarker({
        name: '标准1', //此属性非绘制文字内容，仅为标识使用
        position: lineArr[0],
        zIndex: 16,
        rank: 1, //避让优先级
        icon: icon, //标注图标，将 icon 对象传给 icon 属性
    });

    labelsLayer.add(labelMarker1);
    map.add(labelsLayer);
    labelMarker1.on('click', (e: any) => {
        openInfo(e.data.data.position);
    });
    map.setFitView();
};

const openInfo = (data: any) => {
    const myData = {
        name: '20000724（皖AB0387）',
        type: 0,
        orgName: '牵引车分公司',
        vehicleType: '牵引汽油车',
        typeN: 'QYCD25-QCG',
        speed: '30',
        vehicleFault: 1,
        vehicleAlarm: 2,
        positionTime: '2024-07-19 09:00:00',
        PositionLocation: '北京市望京阜通东大街方恒国际中心A座16层',
    };
    const closeApp = () => {
        infoWindow.close();
    };
    const { div, app } = createWindow('测试数据', myData, closeApp);
    const infoWindow = new AMap.InfoWindow({
        content: div,
        isCustom: true,
        offset: new AMap.Pixel(0, -35),
    });
    infoWindow.open(MapRef.value, data);
};

const mapSearch = () => {
    console.log('mapSearch');
};
const mapSearchChange = () => {
    console.log('mapSearchChange !!!');
};
</script>

<style lang="less" scoped>
.region-map {
    height: 100%;
    width: 100%;
    padding: 4px;
}
.tree-card {
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border-radius: 0.25rem;
    width: 260px;
    height: 700px;
    border-width: 0;
    opacity: 0.85;
    border-radius: 0.4rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
    position: absolute;
    top: 86px;
    left: 245px;
}

.search-card {
    display: flex;
    flex-direction: row;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border-radius: 0.25rem;
    width: 360px;
    height: 48px;
    border-width: 0;
    opacity: 0.85;
    border-radius: 0.4rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
    position: absolute;
    top: 100px;
    right: 650px;
}
.vehicleType-card {
    min-width: 0;
    word-wrap: break-word;
    background-color: #657aaf;
    background-clip: border-box;
    border-radius: 0.25rem;
    width: 420px;
    height: 40px;
    border-width: 0;
    opacity: 0.92;
    border-radius: 0.4rem;
    box-shadow: 0 2px 6px 0 rgba(234, 235, 243, 0.5);
    position: absolute;
    top: 104px;
    right: 200px;
}

.radio-group {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 100%;
}
.type-radio {
    color: #fff;
    margin-left: 30px;
    line-height: 40px;
}
:deep(.radio-all) {
    .ant-radio-inner {
        // background-color: #1e90ff; /* 选中时的圆圈颜色 */
        border-color: #1e90ff;
    }
    .ant-radio-inner::hover {
        background-color: #1e90ff; /* 选中时的圆圈颜色 */
        border-color: #1e90ff;
    }
    .ant-radio-inner::after {
        background-color: #1e90ff; /* 改变选中标记的颜色 */
    }
}
:deep(.radio-Alarm) {
    .ant-radio-inner {
        // background-color: #ffa502;
        border-color: #ffa502;
    }
    .ant-radio-inner::hover {
        background-color: #ffa502;
        border-color: #ffa502;
    }
    .ant-radio-inner::after {
        background-color: #ffa502;
    }
}

:deep(.radio-Fault) {
    .ant-radio-inner {
        // background-color: #ff4757;
        border-color: #ff4757;
    }
    .ant-radio-inner::hover {
        background-color: #ff4757;
        border-color: #ff4757;
    }
    .ant-radio-inner::after {
        background-color: #ff4757;
    }
}
</style>
