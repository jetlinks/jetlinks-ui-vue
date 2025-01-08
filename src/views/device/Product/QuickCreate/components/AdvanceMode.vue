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
                                        <div class="address">
                                            <a-tooltip
                                                placement="top"
                                                :title="getDetails(network)"
                                            >
                                                {{ getDetails(network) }}
                                            </a-tooltip>
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
                            <template v-if="protocolList.length">
                                <a-col :span="8" v-for="i in protocolList">
                                    <div
                                        :class="{
                                            card: true,
                                            protocolCard: true,
                                            selected:
                                                i.id === protocol?.id ||
                                                i.id === selectedProtocolID,
                                        }"
                                        @click="() => selectResourceProtocol(i)"
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
                            </template>
                            <a-col :span="24" v-else>
                                <div
                                    class="noNetWork"
                                    @click="visibleAddProtocol = true"
                                >
                                    请选择协议
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
                                    selected:
                                        i.id === plugin?.id ||
                                        i.id === selectedPluginID,
                                }"
                                @click="() => selectResourcePlugin(i)"
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
    randomString: {
        type: String,
        default: '',
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
//资源库选中插件id
const selectedPluginID = ref();
//资源库选中协议id
const selectedProtocolID = ref();
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
    selectedProtocolID.value = '';
};

const selectedPlugin = (data) => {
    plugin.value = data;
    visibleAddPlugin.value = false;
    selectedPluginID.value = '';
};

const selectResourceProtocol = (data) => {
    protocol.value = {
        ...omit(data, ['id']),
        type: 'jar',
        configuration: {
            location: data.url,
            sourceId: data.id,
            version: data.version,
        },
    };
    selectedProtocolID.value = data.id;
};

const selectResourcePlugin = (data) => {
    plugin.value = {
        ...omit(data, ['id']),
        provider: 'jar',
        configuration: {
            location: data.url,
            sourceId: data.id,
            version: data.version,
        },
    };
    selectedPluginID.value = data.id;
};

const quitAdvanceMode = () => {
    emits('quit');
};

//获取网络组件地址
const getDetails = (slotProps) => {
    const { typeObject, shareCluster, configuration, cluster } = slotProps;
    const headers =
        typeObject.name.replace(/[^j-zA-Z]/g, '').toLowerCase() + '://';
    const content = !!shareCluster
        ? (configuration.publicHost || configuration.remoteHost) +
          ':' +
          (configuration.publicPort || configuration.remotePort)
        : (cluster[0].configuration.publicHost ||
              cluster[0].configuration.remoteHost) +
          ':' +
          (cluster[0].configuration.publicPort ||
              cluster[0].configuration.remotePort);
    let head = '远程:';
    if (!!shareCluster) {
        !!configuration.publicHost && (head = '公网:');
    } else {
        !!cluster[0].configuration.publicHos && (head = '公网:');
    }
    if (!shareCluster && cluster.length > 1) {
        const contentItem2 =
            (cluster[0].configuration.publicHost ||
                cluster[0].configuration.remoteHost) +
            ':' +
            (cluster[0].configuration.publicPort ||
                cluster[0].configuration.remotePort);
        let headItme2 = '远程';
        !!cluster[0].configuration.publicHos && (headItme2 = '公网:');
        if (cluster.length > 2) {
            return (
                head +
                headers +
                content +
                ' ' +
                headItme2 +
                headers +
                contentItem2 +
                '。。。'
            );
        }
        return (
            head + headers + content + ' ' + headItme2 + headers + contentItem2
        );
    }
    return head + headers + content;
};

const submitDada = () => {
    let data;
    const accessName = accessConfig.value.provider?.split('-')?.[0]
    const gateway = {
        name:
            accessConfig.value.provider?.split('-')?.[0] +
            '网关' +
            props.randomString,
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
    emits('submit',data,accessName);
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
