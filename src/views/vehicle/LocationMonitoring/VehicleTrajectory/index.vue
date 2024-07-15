<template>
    <page-container>
        <full-page fixed>
            <div class="region-map">
                <AMapComponent @init="initMap">
                    <!-- <el-amap-polyline
                :vid="'polyline'"
                :path="path"
                :strokeColor="polColor"
                :strokeWeight="5"
                :strokeOpacity="0.8"
                :strokeStyle="'solid'"
                :editable="false"
                :reEventWhenUpdate="true"
            ></el-amap-polyline> -->
                </AMapComponent>
                <div class="input-card">
                    <h4>轨迹进度</h4>
                    <div class="input-item">
                        <j-slider
                            class="item-slider"
                            :min="1"
                            :max="sliderMax"
                            v-model:value="sliderValue"
                            @afterChange="sliderChange"
                        />
                    </div>
                    <h4>操作</h4>
                    <div class="input-item">
                        <input
                            type="button"
                            class="btn"
                            value="开始"
                            id="start"
                            :onclick="startAnimation"
                        />
                        <input
                            type="button"
                            class="btn"
                            value="暂停"
                            id="pause"
                            :onclick="pauseAnimation"
                        />
                        <input
                            type="button"
                            class="btn"
                            value="继续"
                            id="resume"
                            :onclick="resumeAnimation"
                        />
                    </div>
                </div>
            </div>
        </full-page>
    </page-container>
</template>

<script setup>
import AMapComponent from '@/components/AMapComponent/index.vue';
const MapRef = ref();
const loading = ref(true);
const lineArr = [
    [116.478935, 39.997761],
    [116.478939, 39.997825],
    [116.478912, 39.998549],
    [116.478912, 39.998549],
    [116.478998, 39.998555],
    [116.478998, 39.998555],
    [116.479282, 39.99856],
    [116.479658, 39.998528],
    [116.480151, 39.998453],
    [116.480784, 39.998302],
    [116.480784, 39.998302],
    [116.481149, 39.998184],
    [116.481573, 39.997997],
    [116.481863, 39.997846],
    [116.482072, 39.997718],
    [116.482362, 39.997718],
    [116.483633, 39.998935],
    [116.48367, 39.998968],
    [116.484648, 39.999861],
    [116.48482, 40.0000001],
    [116.48506, 40.000215],
    [116.485401, 40.0000123],
];

const path = ref(lineArr);
const polyline = ref();

const marker = ref();
const passedPolyline = ref();
const sliderValue = ref(1);
const sliderMax = ref(100);
const passedPath = ref();

const circleCenter = ref(lineArr[0]);

const sliderChange = (value) => {
    const vehicleLocation = path.value[value - 1];
    marker.value.setPosition(
        new AMap.LngLat(vehicleLocation[0], vehicleLocation[1]),
    );

    MapRef.value.setCenter(vehicleLocation, true); //更新地图中心坐标
    // playCar();
};

//重置
const reset = () => {
    // this.map.clearMap();
};

const initMap = (e) => {
    // console.log('map', e);
    loading.value = true;
    MapRef.value = e;
    loading.value = false;
    const map = MapRef.value;
    map.setZoom(15);
    MapRef.value.setCenter(path.value[0], true);

    sliderMax.value = lineArr.length;

    map.plugin('AMap.MoveAnimation', () => {
        marker.value = new AMap.Marker({
            map: map,
            position: lineArr[0],
            icon: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
            offset: new AMap.Pixel(-13, -26),
        });

        polyline.value = new AMap.Polyline({
            map: map,
            path: lineArr,
            showDir: true,
            strokeColor: '#28F', //线颜色
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 6, //线宽
            // strokeStyle: "solid"  //线样式
        });

        passedPolyline.value = new AMap.Polyline({
            map: map,
            strokeColor: '#AF5', //线颜色
            showDir: true,
            strokeWeight: 6, //线宽
            // strokeOpacity: 1,
        });

        marker.value.on('moving', (e) => {
            sliderValue.value = e.passedPath.length; // 车移动更新进度条
            // console.log('passedPolyline.value', passedPolyline.value.getPath());
            passedPolyline.value.setPath(e.passedPath);
            passedPath.value = e.passedPath;
            // polColor.value = '#AF5';
            // console.log('e.target.getPosition()', e.target.getPosition());
            map.setCenter(e.target.getPosition(), true);
        });
    });

    map.setFitView();
};

const playCar = () => {
    if (marker.value) {
        marker.value.stopMove();
    }

    //计算继续开始的线路
    let replayPath = [];
    for (let i = sliderValue.value - 1; i < path.value.length; i++) {
        replayPath.push(new AMap.LngLat(path.value[i][0], path.value[i][1]));
    }
    if (replayPath.length === 0) {
        marker.value.moveAlong(path.value, {
            // 每一段的时长
            duration: 500, //可根据实际采集时间间隔设置
            aniInterval: 500 * path.value.length,
            // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
            autoRotation: true,
        });
    } else {
        console.log('sliderValue.value', sliderValue.value);
        console.log('replayPath', replayPath);
        marker.value.moveAlong(replayPath, {
            // 每一段的时长
            duration: 500, //可根据实际采集时间间隔设置
            aniInterval: 500 * path.value.length,
            // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
            autoRotation: true,
        });
    }
};

const startAnimation = () => {
    marker.value.moveAlong(path.value, {
        // 每一段的时长
        duration: 500, //可根据实际采集时间间隔设置
        aniInterval: 500 * path.value.length,
        // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
        autoRotation: true,
    });
};

const pauseAnimation = () => {
    marker.value.pauseMove();
};

const resumeAnimation = () => {
    marker.value.resumeMove();
};

watch(
    passedPath.value,
    (newValue, oldValue) => {
        console.log('newValue', newValue);
    },
    {
        deep: true,
    },
);
</script>

<style scoped>
@import 'https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css';
.region-map {
    height: 100%;
    width: 100%;
    padding: 10px;
}
.input-card {
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border-radius: 0.25rem;
    width: 100%;
    border-width: 0;
    border-radius: 0.4rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
    position: relative;
    bottom: 13rem;
    left: 4px;
}
.input-card .btn {
    margin-right: 1.2rem;
    width: 9rem;
}

.input-card .btn:last-child {
    margin-right: 0;
}

.item-slider {
    width: 100%;
}

.amap-logo {
    display: none !important;
}
.amap-copyright {
    display: none !important;
}
</style>
