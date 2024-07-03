<template>
    <div class="box">
        <div class="box-top">
            <j-space>
                <PermissionButton type="primary" @click="firstLock">
                    <!-- <template #icon><AIcon type="PlusOutlined" /></template> -->
                    一级锁车
                </PermissionButton>
                <PermissionButton type="primary" @click="secondLock">
                    <!-- <template #icon><AIcon type="PlusOutlined" /></template> -->
                    二级锁车
                </PermissionButton>
                <PermissionButton type="primary" @click="viewPhotos">
                    <!-- <template #icon><AIcon type="PlusOutlined" /></template> -->
                    查看照片
                </PermissionButton>
            </j-space>
        </div>
        <div class="box-cont">
            <j-row>
                <j-col :span="12"> <div>left - 监控视频</div></j-col>
                <j-col :span="12">
                    <div class="map-page-container">
                        <AMapComponent @init="initMap" />
                    </div>
                    <div class="toolbar">
                        <!-- <button @click="getMap()">获取地图实例</button> -->
                        获取地图实例
                    </div>
                </j-col>
            </j-row>
        </div>
    </div>
</template>

<script lang="ts" setup>
const mapRef = ref();
const loading = ref(true);
const initMap = (e: any) => {
    console.log('map', e);
    loading.value = true;
    mapRef.value = e;
    loading.value = false;
};
const firstLock = () => {
    console.log('一级锁车');
};
const secondLock = () => {
    console.log('二级锁车');
};
const viewPhotos = () => {
    console.log('查看照片');
};
</script>

<style lang="less" scoped>
.box {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    min-height: 100%;
    .box-top {
        height: 50px;
    }
    .box-cont {
        border-top: 2px solid #b4b4b4;
        height: 400px;

        .ant-row {
            margin-top: 12px;
        }
    }
}
.map-page-container {
    height: 400px;
}
</style>
