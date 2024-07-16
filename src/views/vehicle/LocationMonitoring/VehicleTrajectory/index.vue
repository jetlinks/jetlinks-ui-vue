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
                            value="正常速度"
                            id="start"
                            :onclick="startAnimation"
                        />
                        <input
                            type="button"
                            class="btn"
                            value="快速"
                            id="pause"
                            :onclick="pauseAnimation"
                        />
                        <input
                            type="button"
                            class="btn"
                            value="慢速"
                            id="resume"
                            :onclick="resumeAnimation"
                        />
                        <input
                            type="button"
                            class="btn"
                            value="暂停"
                            id="resume"
                            :onclick="stopAni"
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
    [116.478998, 39.998555],
    [116.479282, 39.99856],
    [116.479658, 39.998528],
    [116.480151, 39.998453],
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
const sliderValueCopy = ref(1);
const sliderMax = ref(100);

const sliderChange = (value) => {
    sliderValueCopy.value = value;
    const vehicleLocation = path.value[value - 1];
    marker.value.setPosition(
        new AMap.LngLat(vehicleLocation[0], vehicleLocation[1]),
    );
    MapRef.value.setCenter(vehicleLocation, true); //更新地图中心坐标
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
            strokeWeight: 6, //线宽
        });

        // passedPolyline.value = new AMap.Polyline({
        //     map: MapRef.value,
        //     showDir: true,
        //     strokeColor: '#AF5', //线颜色
        //     strokeWeight: 6, //线宽
        // });

        marker.value.on('moving', (e) => {
            // console.log('e', e);
            // sliderValue.value = e.passedPath.length; // 车移动更新进度条
            sliderValue.value = e.passedPath.length + sliderValueCopy.value - 1; // 车移动更新进度条
            map.setCenter(e.target.getPosition(), true);
        });
    });

    map.setFitView();
};

// const setPassedPolyline = () => {
//     //判断地图是否已划车辆轨迹线
//     if (passedPolyline.value) {
//         passedPolyline.value.destroy();
//     }
//     let replayPath = [];
//     //轨迹线和进度条结合
//     for (let i = 0; i < sliderValue.value; i++) {
//         replayPath.push(path.value[i]);
//     }
//     passedPolyline.value = new AMap.Polyline({
//         map: MapRef.value,
//         path: replayPath,
//         showDir: true,
//         strokeColor: '#AF5', //线颜色
//         strokeWeight: 6, //线宽
//     });
// };

const startAnimation = () => {
    const spend = 300;
    funAnimation(spend);
};

const pauseAnimation = () => {
    const spend = 150;
    funAnimation(spend);
};

const resumeAnimation = () => {
    const spend = 600;
    funAnimation(spend);
};

const funAnimation = (e) => {
    marker.value.stopMove();
    const spend = e;
    /**
     * 判断车辆行驶半途中，按快速按钮或者慢速按钮，继续行驶开始位置是上次暂停的地方
     * 并且判断进度条的位置和值，与车辆行进记录保持一直
     */
    sliderValueCopy.value = sliderValue.value;
    if (sliderValueCopy.value > path.value.length - 1) {
        sliderValue.value = 1;
        sliderValueCopy.value = 1;
    }
    if (sliderValue.value < path.value.length) {
        marker.value.stopMove();
        let replayPath = [];
        //轨迹线和进度条结合
        for (let i = sliderValue.value - 1; i < path.value.length; i++) {
            replayPath.push(path.value[i]);
        }
        marker.value.moveAlong(replayPath, {
            // 每一段的时长
            duration: spend, //可根据实际采集时间间隔设置
            aniInterval: replayPath.length * spend,
            // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
            autoRotation: true,
        });
    } else {
        marker.value.moveAlong(path.value, {
            // 每一段的时长
            duration: spend, //可根据实际采集时间间隔设置
            aniInterval: path.value.length * spend,
            // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
            autoRotation: true,
        });
    }
};

const stopAni = () => {
    marker.value.stopMove();
};

// onMounted(() => {

// });
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
    opacity: 0.85;
    border-radius: 0.4rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
    position: relative;
    bottom: 13rem;
    left: 4px;
}
.input-card .btn {
    margin-right: 1.2rem;
    width: 6rem;
}

.input-card .btn:last-child {
    margin-right: 0;
}

.item-slider {
    width: 100%;
}
</style>
