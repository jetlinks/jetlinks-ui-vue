<template>
    <a-drawer
        visible
        :closable="false"
        @close="$emit('closeDrawer')"
        :width="700"
    >
        <template #title>
            <div class="drawerTitle">
                <div>{{ data?.name }}</div>
                <Ellipsis style="height: 22px; max-width: 650px"
                    ><div class="description">
                        {{ data?.description }}
                    </div></Ellipsis
                >
            </div>
        </template>
        <FirstKind
            v-if="[
                'mqtt-server-gateway',
                'mqtt-client-gateway',
                'websocket-server',
                'http-server-gateway',
                'coap-server-gateway',
                'tcp-server-gateway',
                'udp-device-gateway',
            ].includes(data.provider)"
            :data="data"
        />
        <SecondKind
            v-if="['plugin_gateway', 'media-plugin'].includes(data.provider)"
            :data="data"
        />
        <ThirdKind
            v-if="['Ctwing', 'OneNet'].includes(data.provider)"
            :data="data"
        />
        <FourthKind
            v-if="
                [
                    'edge-child-device',
                    'fixed-media',
                    'opc-ua',
                    'modbus-tcp',
                    'collector-gateway',
                    'onvif',
                ].includes(data.channel)
            "
            :data="data"
        />
        <FifthKind
            v-if="
                ['official-edge-gateway', 'child-device'].includes(
                    data.provider,
                )
            "
            :data="data"
        />
        <SixthKind v-if="data.provider === 'gb28181-2016'" :data="data" />
    </a-drawer>
</template>

<script setup>
import FirstKind from './components/FirstKind.vue';
import SecondKind from './components/SecondKind.vue';
import ThirdKind from './components/ThirdKind.vue';
import FourthKind from './components/FourthKind.vue';
import FifthKind from './components/FifthKind.vue';
import SixthKind from './components/SixthKind.vue';
const props = defineProps({
    data: {
        type: Object,
    },
});
const emit = defineEmits(['closeDrawer']);
</script>
<style lang="less" scoped>
.description {
    color: #777777;
    font-size: 12px;
}
</style>
