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
                <div class="search-card">
                    <j-input
                        placeholder="请输入车辆简称"
                        v-model:value="mapSearchValue"
                        @pressEnter="mapSearch"
                        style="height: 40px"
                        @change="mapSearchChange"
                    >
                        <template #suffix>
                            <AIcon type="SearchOutlined" @click="mapSearch" />
                        </template>
                    </j-input>
                </div>
                <div class="vehicleType-time">
                    <TimeSelect
                        key="flow-static"
                        :quickBtnList="[
                            { label: '今日', value: 'day' },
                            { label: '本周', value: 'week' },
                            { label: '本月', value: 'month' },
                        ]"
                        :type="'week'"
                        @change="getEcharts"
                    />
                </div>
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
import TimeSelect from './components/TimeSelect.vue';
const MapRef = ref();
const loading = ref(true);
const mapSearchValue = ref();

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

const mapSearch = () => {
    console.log('mapSearch');
};
const mapSearchChange = () => {
    console.log('mapSearchChange !!!');
};

const getEcharts = (data) => {
    let _time = '1m';
    let format = 'M月dd日 HH:mm';
    let limit = 12;
    const dt = data.end - data.start;
    const hour = 60 * 60 * 1000;
    const days = hour * 24;
    const months = days * 30;
    const year = 365 * days;
    if (dt <= hour + 10) {
        limit = 60;
        format = 'HH:mm';
    } else if (dt > hour && dt <= days) {
        _time = '1h';
        limit = 24;
    } else if (dt > days && dt < year) {
        limit = Math.abs(Math.ceil(dt / days)) + 1;
        _time = '1d';
        format = 'M月dd日 HH:mm:ss';
    } else if (dt >= year) {
        limit = Math.abs(Math.floor(dt / months));
        _time = '1M';
        format = 'yyyy年-M月';
    }
};

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
    padding-bottom: 1rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
    position: relative;
    bottom: 10rem;
    left: 4px;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 0.75rem 1.25rem;
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
    height: 40px;
    border-width: 0;
    opacity: 0.85;
    border-radius: 0.38rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
    position: absolute;
    top: 100px;
    left: 300px;
}

.vehicleType-time {
    min-width: 0;
    word-wrap: break-word;
    background-clip: border-box;
    border-radius: 0.25rem;
    width: 600px;
    height: 40px;
    border-width: 0;
    opacity: 0.8;
    border-radius: 0.4rem;
    position: absolute;
    top: 106px;
    left: 700px;
}

.input-card .btn {
    margin-right: 1.2rem;
    width: 5rem;
}

.input-card .btn:last-child {
    margin-right: 0;
}

.item-slider {
    width: 100%;
}

hr {
    margin: 0.5rem 0;
    box-sizing: content-box;
    height: 0;
    overflow: visible;
    border: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

label {
    display: inline-block;
    margin-bottom: 0.4rem;
}

label,
.btn {
    margin-left: 0;
    font-size: 0.8rem;
}

button,
input,
select {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    overflow: visible;
    text-transform: none;
}

[type='button']::-moz-focus-inner,
[type='reset']::-moz-focus-inner,
[type='submit']::-moz-focus-inner,
button::-moz-focus-inner {
    padding: 0;
    border-style: none;
}

input[type='checkbox'],
input[type='radio'] {
    box-sizing: border-box;
    padding: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0;
    margin: 0 0.45rem 0 0;
}

h4 {
    line-height: 1.8;
    font-weight: 300;
    font-size: 0.95rem;
}

.btn {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    background-color: transparent;
    background-image: none;
    color: #25a5f7;
    border-color: #25a5f7;
    padding: 0.22rem 0.45rem;
    line-height: 1.5;
    border-radius: 0.9rem;
    -webkit-appearance: button;
    cursor: pointer;
}

.btn:hover {
    color: #fff;
    background-color: #25a5f7;
    border-color: #25a5f7;
}

.btn:hover {
    text-decoration: none;
}

.input-item {
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-align: center;
    align-items: center;
    width: 100%;
    height: 2rem;
}

.input-item:last-child {
    margin-bottom: 0;
}

.input-item > select,
.input-item > input[type='text'],
.input-item > input[type='date'] {
    position: relative;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    width: 1%;
    margin-bottom: 0;
}

.input-item > select:not(:last-child),
.input-item > input[type='text']:not(:last-child),
.input-item > input[type='date']:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.input-item > select:not(:first-child),
.input-item > input[type='text']:not(:first-child),
.input-item > input[type='date']:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.input-item-prepend {
    margin-right: -1px;
}

.input-item-text,
input[type='text'],
input[type='date'],
select {
    height: calc(2.2rem + 2px);
}

.input-item-text {
    width: 6rem;
    text-align: justify;
    padding: 0.4rem 0.7rem;
    display: inline-block;
    text-justify: distribute-all-lines;
    text-align-last: justify;
    -moz-text-align-last: justify;
    -webkit-text-align-last: justify;
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    text-align: center;
    white-space: nowrap;
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
}

.input-item-text input[type='checkbox'],
.input-item-text input[type='radio'] {
    margin-top: 0;
}
</style>
