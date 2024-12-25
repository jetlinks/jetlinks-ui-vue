<template>
    <div class="container">
        <div v-if="!accessConfig">
            <div class="tips">
                <div>您已进入高级模式，可自定义接入配置</div>
                <a-button type="link" @click="quitAdvanceMode"
                    >退出高级模式</a-button
                >
            </div>
            <div style="margin-bottom: 16px">请选择接入方式</div>
            <a-row :gutter="[12, 12]">
                <a-col :span="12" v-for="i in accessList">
                    <div class="accessCard card" @click="() => selectAccess(i)">
                        <img :src="BackMap.get(i?.provider)" alt="" />
                        <div style="margin-left: 20px">
                            <div class="cardName">
                                {{ i?.provider + '网关' }}
                            </div>
                            <div class="cardDes">
                                {{ descriptions?.get(i?.provider) }}
                            </div>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div v-else>
            <div>
                <div class="accessInfo">
                    <img :src="BackMap.get(accessConfig?.provider)" alt="" />
                    <div style="margin-left: 20px">
                        <div class="cardName">
                            {{ accessConfig?.provider + '网关' }}
                        </div>
                        <div class="cardDes">
                            {{ descriptions?.get(accessConfig?.provider) }}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div
                    v-if="
                        ['network', 'OneNet', 'Ctwing'].includes(
                            accessConfig.channel,
                        )
                    "
                >
                    <div
                        v-if="
                            !['OneNet', 'Ctwing'].includes(accessConfig.channel)
                        "
                    >
                        <Title data="网络组件">
                            <template #extra>
                                <a-button
                                    type="link"
                                    @click="visibleAddNetwork = true"
                                    >选择</a-button
                                >
                            </template>
                        </Title>
                        <a-row :gutter="[12, 12]">
                            <a-col :span="8" v-if="network">
                                <div
                                    :class="{
                                        card: true,
                                        protocolCard: true,
                                        selected: true,
                                    }"
                                    style="margin-bottom: 10px"
                                >
                                    <img
                                        :src="getImage('/network.png')"
                                        alt=""
                                    />
                                    <div style="margin-left: 20px">
                                        <div class="cardName">
                                            {{ network.name }}
                                        </div>
                                        <div class="cardDes">
                                            <j-ellipsis>
                                                {{ network.description }}
                                            </j-ellipsis>
                                        </div>
                                    </div>
                                </div>
                            </a-col>
                            <a-col :span="24" v-else>
                                <div
                                    class="noNetWork"
                                    @click="visibleAddNetwork = true"
                                >
                                    请选择网络组件
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <div
                        v-if="
                            ![
                                'agent-media-device-gateway',
                                'agent-device-gateway',
                            ].includes(accessConfig.provider)
                        "
                    >
                        <Title data="协议">
                            <template #extra>
                                <a-button
                                    type="link"
                                    @click="visibleAddProtocol = true"
                                    >选择</a-button
                                >
                            </template>
                        </Title>
                        <a-row :gutter="[12, 12]">
                            <a-col :span="8" v-for="i in protocolList">
                                <div
                                    :class="{
                                        card: true,
                                        protocolCard: true,
                                        selected: i.id === protocol?.id,
                                    }"
                                    @click="protocol = i"
                                >
                                    <img
                                        :src="getImage('/protocol.png')"
                                        alt=""
                                    />
                                    <div style="margin-left: 20px">
                                        <div class="cardName">
                                            {{ i.name }}
                                        </div>
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                </div>
                <div v-if="accessConfig.channel === 'plugin'">
                    <Title data="插件">
                        <template #extra>
                            <a-button
                                type="link"
                                @click="visibleAddPlugin = true"
                                >选择</a-button
                            >
                        </template>
                    </Title>
                    <a-row :gutter="[12, 12]">
                        <a-col :span="8" v-for="i in pluginList">
                            <div
                                :class="{
                                    card: true,
                                    protocolCard: true,
                                    selected: i.id === plugin?.id,
                                }"
                                @click="() => selectResourceProtocol(i)"
                            >
                                <img :src="getImage('/plug.png')" alt="" />
                                <div style="margin-left: 20px">
                                    <div class="cardName">
                                        {{ i.name }}
                                    </div>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </div>
            </div>
            <div class="operation">
                <a-space>
                    <a-button @click="quitAdvanceMode">取消</a-button>
                    <a-button type="primary" @click="submitDada">确定</a-button>
                </a-space>
            </div>
        </div>
    </div>
    <Network
        v-if="visibleAddNetwork"
        :type="accessConfig?.provider"
        :selectedNetWork="network"
        @selectedNetWork="selectedNetWork"
        @close="visibleAddNetwork = false"
    />
    <Protocol
        v-if="visibleAddProtocol"
        :type="accessConfig?.provider"
        :selectedNetWork="protocol"
        @selectedProtocol="selectedProtocol"
        @close="visibleAddProtocol = false"
    />
    <Plugin
        v-if="visibleAddPlugin"
        :type="accessConfig?.provider"
        :selectedNetWork="plugin"
        @selectedPlugin="selectedPlugin"
        @close="visibleAddPlugin = false"
    />
</template>

<script setup>
import { BackMap } from '@/views/link/AccessConfig/data';
import Network from './NetWork/index.vue';
import Protocol from './Protocol/index.vue';
import Title from './Title/index.vue';
import Plugin from './Plugin/index.vue';
import { getImage, onlyMessage } from '@/utils/comm';
import { omit } from 'lodash-es';
import { gatewayType } from '../data';
const props = defineProps({
    accessList: {
        type: Array,
        default: [],
    },
    descriptions: {
        type: Object,
        default: () => {},
    },
});
const emits = defineEmits(['quit', 'submit']);
const accessConfig = ref();
const network = ref();
const protocol = ref();
const plugin = ref();
const visibleAddNetwork = ref(false);
const visibleAddProtocol = ref(false);
const visibleAddPlugin = ref(false);
const protocolList = computed(() => {
    const resource = accessConfig.value.bindInfo.some((i) => {
        return i.id === protocol.value?.id;
    });
    return resource || !protocol.value?.id
        ? accessConfig.value.bindInfo
        : [protocol.value];
});
const pluginList = computed(() => {
    const resource = accessConfig.value.bindInfo.some((i) => {
        return i.id === plugin.value?.id;
    });
    return resource || !plugin.value?.id
        ? accessConfig.value.bindInfo
        : [plugin.value];
});
const randomString = ref();
function generateString() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let randomLetter = letters[Math.floor(Math.random() * letters.length)];
    let randomNum1 = numbers[Math.floor(Math.random() * numbers.length)];
    let randomNum2 = numbers[Math.floor(Math.random() * numbers.length)];
    randomString.value = randomLetter + randomNum1 + randomNum2;
}

const selectAccess = (data) => {
    accessConfig.value = data;
};

const selectedNetWork = (data) => {
    network.value = data;
    visibleAddNetwork.value = false;
};

const selectedProtocol = (data) => {
    protocol.value = data;
    visibleAddProtocol.value = false;
};

const selectedPlugin = (data) => {
    plugin.value = data;
    visibleAddPlugin.value = false;
};

const selectResourceProtocol = (data) => {
    
};

const quitAdvanceMode = () => {
    emits('quit');
};

const submitDada = () => {
    generateString();
    let data;
    const gateway = {
        name:
            accessConfig.value.provider?.split('-')?.[0] +
            '网关' +
            randomString.value,
        ...omit(accessConfig.value, ['bindInfo', 'defaultAccess']),
        gatewayType: gatewayType.get(accessConfig.value.provider),
    };
    if (accessConfig.value.channel === 'network') {
        if (
            ['agent-media-device-gateway', 'agent-device-gateway'].includes(
                accessConfig.value.provider,
            )
        ) {
            if (!network.value) {
                onlyMessage('请选择网络组件', 'error');
                return;
            }
            data = {
                gateway,
                network: network.value,
            };
        } else {
            if (!network.value) {
                onlyMessage('请选择网络组件', 'error');
                return;
            }
            if (!protocol.value) {
                onlyMessage('请选择协议', 'error');
                return;
            }
            data = {
                network: network.value,
                gateway,
                protocol: protocol.value,
            };
        }
    } else if (['OneNet', 'Ctwing'].includes(accessConfig.value.channel)) {
        if (!protocol.value) {
            onlyMessage('请选择协议', 'error');
            return;
        }
        data = {
            protocol: protocol.value,
            gateway,
        };
    } else if (accessConfig.value.channel === 'plugin') {
        if (!plugin.value) {
            onlyMessage('请选择插件', 'error');
            return;
        }
        data = {
            gateway,
            plugin: plugin.value,
        };
    } else {
        data = {
            gateway,
        };
    }
    emits('submit', data);
};
</script>
<style lang="less" scoped>
.container {
    border: 1px solid #bebfbf;
    border-radius: 8px;
    padding: 20px;
    background-color: #f9fafc;

    .accessInfo {
        display: flex;
    }

    .accessCard {
        cursor: pointer;
    }

    .cardName {
        font-size: 16px;
        font-weight: 600;
    }

    .cardDes {
        margin-top: 20px;
    }

    .card {
        display: flex;
        border: 1px solid #949494;
        border-radius: 8px;
        padding: 20px;
        background-color: #fff;
    }

    .protocolCard {
        cursor: pointer;
    }

    .selected {
        border-color: #2f54eb;
    }

    .operation {
        margin-top: 16px;
        text-align: right;
    }
    .noNetWork {
        border: 1px dashed #949494;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        font-size: 18px;
        color: #7f7f7f;
        margin-bottom: 12px;
    }
}

.tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}
</style>
