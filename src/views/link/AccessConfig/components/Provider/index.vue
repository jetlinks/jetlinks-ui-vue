<template>
    <TitleComponent data="自定义设备接入"></TitleComponent>
    <div>
        <a-row :gutter="[24, 24]">
            <a-col :span="12" v-for="item in dataSource" :key="item.id">
                <div class="provider">
                    <div class="box">
                        <div class="left">
                            <div class="images">
                                <img :src="backMap.get(item.id)" />
                            </div>
                            <div class="context">
                                <div class="title">
                                    {{ item.name }}
                                </div>
                                <div class="desc">
                                    <a-tooltip :title="item.description">
                                        {{ item.description || '' }}
                                    </a-tooltip>
                                </div>
                            </div>
                        </div>
                        <div class="right">
                            <a-button type="primary" @click="click(item)"
                                >接入</a-button
                            >
                        </div>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script lang="ts" setup name="AccessConfigProvider">
import TitleComponent from '@/components/TitleComponent/index.vue';
import { getImage } from '@/utils/comm';

const props = defineProps({
    dataSource: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['onClick']);

const backMap = new Map();
backMap.set('mqtt-server-gateway', getImage('/access/mqtt.png'));
backMap.set('websocket-server', getImage('/access/websocket.png'));
backMap.set('modbus-tcp', getImage('/access/modbus.png'));
backMap.set('coap-server-gateway', getImage('/access/coap.png'));
backMap.set('tcp-server-gateway', getImage('/access/tcp.png'));
backMap.set('Ctwing', getImage('/access/ctwing.png'));
backMap.set('child-device', getImage('/access/child-device.png'));
backMap.set('opc-ua', getImage('/access/opc-ua.png'));
backMap.set('http-server-gateway', getImage('/access/http.png'));
backMap.set('fixed-media', getImage('/access/video-device.png'));
backMap.set('udp-device-gateway', getImage('/access/udp.png'));
backMap.set('OneNet', getImage('/access/onenet.png'));
backMap.set('gb28181-2016', getImage('/access/gb28181.png'));
backMap.set('mqtt-client-gateway', getImage('/access/mqtt-broke.png'));
backMap.set('edge-child-device', getImage('/access/child-device.png'));
backMap.set('official-edge-gateway', getImage('/access/edge.png'));

const click = (value: object) => {
    emit('onClick', value);
};

</script>

<style lang="less" scoped>
.provider {
    position: relative;
    width: 100%;
    padding: 20px;
    background: url('/public/images/access/background.png') no-repeat;
    background-size: 100% 100%;
    border: 1px solid #e6e6e6;

    &::before {
        position: absolute;
        top: 0;
        left: 40px;
        display: block;
        width: 15%;
        min-width: 64px;
        height: 2px;
        background-image: url('/public/images/access/rectangle.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        // border: 1px #8da1f4 solid;
        // border-bottom-left-radius: 10%;
        // border-bottom-right-radius: 10%;
        content: ' ';
    }

    &:hover {
        box-shadow: 0 0 24px rgba(#000, 0.1);
    }
}

.box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .left {
        display: flex;
        width: calc(100% - 70px);
        .images {
            width: 64px;
            height: 64px;

            img {
                width: 100%;
            }
        }

        .context {
            width: calc(100% - 84px);
            margin: 10px;

            .title {
                font-weight: 600;
            }

            .desc {
                width: 100%;
                margin-top: 10px;
                overflow: hidden;
                color: rgba(0, 0, 0, 0.55);
                font-weight: 400;
                font-size: 13px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
    .right {
        width: 70px;
    }
}
</style>
