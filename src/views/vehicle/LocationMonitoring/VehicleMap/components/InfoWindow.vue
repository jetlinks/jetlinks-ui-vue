<template>
    <div class="position">
        <div class="position-cont">
            <div class="primary-title">
                <span class="title-left">{{ result?.name }}</span>
                <span class="title-right"
                    ><j-button v-if="result?.type === 0" class="fault-btn-0"
                        >正常</j-button
                    >
                    <j-button
                        v-else-if="result?.type === 1"
                        class="fault-btn-1"
                    >
                        故障/预警
                    </j-button></span
                >
            </div>
            <div class="divider"></div>
            <div class="primary-con">
                <j-row :gutter="24">
                    <j-col class="content" :span="12">
                        <span class="position-name">组织：</span>
                        <span class="position-val"
                            ><j-ellipsis style="width: 110px">{{
                                result?.orgName
                            }}</j-ellipsis></span
                        >
                    </j-col>
                    <j-col class="content" :span="12">
                        <span class="position-name">车辆类型：</span>
                        <span class="position-val"
                            ><j-ellipsis style="width: 110px">{{
                                result?.vehicleType
                            }}</j-ellipsis></span
                        >
                    </j-col>
                </j-row>
                <j-row :gutter="24">
                    <j-col class="content" :span="12">
                        <span class="position-name">型号：</span>
                        <span class="position-val"
                            ><j-ellipsis style="width: 110px">{{
                                result?.typeN
                            }}</j-ellipsis></span
                        >
                    </j-col>
                    <j-col class="content" :span="12">
                        <span class="position-name">速度：</span>
                        <span class="position-val"
                            ><j-ellipsis style="width: 110px"
                                >{{ result?.speed || 0 }}km/h</j-ellipsis
                            ></span
                        >
                    </j-col>
                </j-row>
                <j-row :gutter="24">
                    <j-col class="content" :span="12">
                        <span class="position-name">车辆故障：</span>
                        <span class="position-val"
                            ><j-button
                                v-if="result?.vehicleFault === 0"
                                class="fault-btn-0"
                                >无故障</j-button
                            >
                            <j-button
                                v-else-if="result?.vehicleFault === 1"
                                class="fault-btn-1"
                            >
                                故障
                            </j-button></span
                        >
                    </j-col>
                    <j-col class="content" :span="12">
                        <span class="position-name">车辆预警：</span>
                        <span class="position-val"
                            ><j-button
                                v-if="result?.vehicleAlarm === 0"
                                class="fault-btn-0"
                                >无预警</j-button
                            >
                            <j-button
                                v-else-if="result?.vehicleAlarm === 1"
                                class="fault-btn-2"
                            >
                                预警
                            </j-button></span
                        >
                    </j-col>
                </j-row>
                <j-row :gutter="24">
                    <j-col class="content-foo" :span="24">
                        <span class="foo-name">定位时间：</span>
                        <span class="foo-name"
                            ><j-ellipsis style="width: 240px">{{
                                result?.positionTime
                            }}</j-ellipsis></span
                        >
                    </j-col>
                </j-row>
                <j-row :gutter="24">
                    <j-col class="content-foo" :span="24">
                        <span class="foo-name">定位位置：</span>
                        <span class="foo-name"
                            ><j-ellipsis style="width: 240px">{{
                                result?.PositionLocation
                            }}</j-ellipsis></span
                        >
                    </j-col>
                </j-row>
            </div>
        </div>
        <j-button class="close-btn" @click="close">关闭</j-button>
    </div>
</template>
<script setup lang="ts">
import { defineProps, ref } from 'vue';
// 定义 props 类型
const props = defineProps({
    locationName: String, // 字符串类型的 prop1
    result: Object,
    closeApp: {
        type: Function,
        required: true,
    },
});
const close = () => {
    props.closeApp();
};
</script>

<style lang="less" scoped>
.position {
    width: 450px;
    border-radius: 10px;
    background-color: #636e72;
    opacity: 0.8;
    padding: 10px;
    display: flex;
    color: #fff;

    &-cont {
        width: 0;
        flex: 1;

        .primary-title {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;

            .title-left {
                align-self: flex-start;
            }

            .title-right {
                align-self: flex-end;
                padding-right: 40px;
            }
        }

        .divider {
            width: 100%;
            margin: 3px;
            border-bottom: 1px solid #c6d2da;
        }

        .primary-con {
            padding-top: 5px;

            div {
                margin-bottom: 2px;
            }
        }
    }

    .close-btn {
        width: 40px;
        height: 20px;
        font-size: 12px;
        line-height: 16px;
        padding: 2px 4px;
        margin: 2px;
        position: absolute;
        top: 4px;
        right: 2px;
    }
}

.position::before {
    content: '';
    position: absolute;
    bottom: -10px; /* 倒三角的位置 */
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 10px solid #5c6669; /* 气泡的颜色 */
}

.content {
    display: flex;
    flex-direction: row;
    width: 200;
}

.content-foo {
    display: flex;
    width: 420px;
    .foo-name {
        height: 18px;
        line-height: 18px;
        font-size: 14px;
    }
}

.fault-btn-0 {
    height: 20px;
    padding: 2px 6px 2px 6px;
    border-radius: 3px;
    background: #0fce8c1a;
    color: #0fce8c;
    border: 1px solid #0fce8c99;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
}

.fault-btn-1 {
    height: 20px;
    padding: 2px 6px 2px 6px;
    border-radius: 3px;
    background: #f99d311a;
    color: #f99d31;
    border: 1px solid #f99d3199;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
}

.fault-btn-2 {
    height: 20px;
    padding: 2px 6px 2px 6px;
    border-radius: 3px;
    background: rgba(229, 0, 18, 0.1);
    color: rgba(229, 0, 18, 1);
    border: 1px solid rgba(229, 0, 18, 1);
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
}

.position-name {
    height: 18px;
    line-height: 18px;
    font-size: 14px;
}

.position-val {
    width: 100px;
    height: 18px;
    line-height: 18px;
    font-size: 14px;
}
</style>
