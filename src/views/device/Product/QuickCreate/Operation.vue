<template>
    <div class="container">
        <a-row align="middle" :gutter="[16, 16]">
            <a-col :span="2">
                <div class="title">快捷创建</div>
            </a-col>
            <a-col :span="22">
                <div class="tip">海量产品方案支撑，轻松创建标准产品</div>
            </a-col>
        </a-row>
        <div class="createSteps">
            <a-steps direction="vertical" :current="current">
                <a-step>
                    <template #title>
                        <div>
                            <span>已选择产品</span>
                            <a-button type="link" @click="emits('reselection')"
                                >重新选择</a-button
                            >
                        </div>
                    </template>
                    <template #description>
                        <div class="resource">
                            <img src="" alt="" />
                            <div>
                                {{ data?.name }}
                            </div>
                            <a-button type="link" @click="showMetadata">
                                <template #icon>
                                    <AIcon type="InboxOutlined"></AIcon>
                                </template>
                                物模型
                            </a-button>
                        </div>
                    </template>
                </a-step>
                <a-step>
                    <template #title>
                        <div>
                            <span style="margin-right: 8px">接入配置</span>
                            <a-space>
                                <a-button
                                    v-if="advancedMode"
                                    type="link"
                                    @click="restoreDefault"
                                >
                                    恢复默认
                                </a-button>
                                <a-button
                                    v-if="!visibleAdvanceMode && !advancedMode"
                                    type="link"
                                    @click="showAdvancedMode"
                                    >高级模式</a-button
                                >
                            </a-space>
                        </div>
                    </template>
                    <template #description>
                        <div
                            v-if="!visibleAdvanceMode"
                            :class="{ accessConfig: true, unmet: unmet }"
                        >
                            <template v-if="!unmet">
                                <img
                                    :src="BackMap.get(accessData?.provider)"
                                    alt=""
                                />
                                <div style="margin-left: 24px">
                                    <div class="accessName">
                                        {{ accessName }}
                                    </div>
                                    <a-row :gutter="[12, 12]">
                                        <a-col
                                            v-if="
                                                accessData.channel === 'network'
                                            "
                                        >
                                            <div>
                                                网络:
                                                {{
                                                    accessData.provider ===
                                                    'mqtt-client-gateway'
                                                        ? network.configuration
                                                              ?.remoteHost +
                                                          ':' +
                                                          network.configuration
                                                              ?.remotePort
                                                        : network.configuration
                                                              ?.host +
                                                          ':' +
                                                          network.configuration
                                                              ?.port
                                                }}
                                            </div>
                                        </a-col>
                                        <a-col
                                            v-if="
                                                [
                                                    'network',
                                                    'OneNet',
                                                    'Ctwing',
                                                ].includes(
                                                    accessData.channel,
                                                ) &&
                                                ![
                                                    'agent-media-device-gateway',
                                                    'agent-device-gateway',
                                                ].includes(accessData.provider)
                                            "
                                        >
                                            <div>
                                                协议: {{ protocol?.name }}
                                            </div>
                                        </a-col>
                                        <a-col
                                            v-if="
                                                accessData.channel === 'plugin'
                                            "
                                        >
                                            <div>插件: {{ plugin?.name }}</div>
                                        </a-col>
                                    </a-row>
                                </div>
                            </template>
                            <div v-else>
                                {{
                                    accessConfig.provider ===
                                    'mqtt-client-gateway'
                                        ? 'MQTT Broker接入请点击高级模式配置'
                                        : '未满足条件,请点击高级模式'
                                }}
                            </div>
                        </div>
                        <AdvanceMode
                            v-else
                            :randomString="randomString"
                            :accessList="data?.accessInfos"
                            :descriptions="accessDescriptions"
                            @submit="advanceComplete"
                            @quit="visibleAdvanceMode = false"
                        />
                    </template>
                </a-step>
                <a-step title="完善产品信息">
                    <template #description v-if="!unmet && !visibleAdvanceMode">
                        <PerfectInfo
                            :data="data"
                            :protocol="protocol"
                            :plugin="plugin"
                            :network="network"
                            :accessData="accessData"
                            :metadata="metadataData"
                            :advancedMode="advancedMode"
                            @cancel="emits('reselection')"
                        />
                    </template>
                </a-step>
            </a-steps>
        </div>
        <Metadata
            v-if="metadataVisible"
            :metadata="metadata"
            :data="metadataData"
            @close="metadataVisible = false"
            @complete="generateMetadata"
        />
    </div>
</template>

<script setup>
import { cloneDeep, omit } from 'lodash-es';
import Metadata from './components/Metadata.vue';
import {
    queryNetWorkConfig,
    queryAliveNetWork,
    queryNetWork,
} from '@/api/device/quickCreate';
import { BackMap } from '@/views/link/AccessConfig/data';
import { getResourcesCurrent, getProtocolList } from '@/api/link/accessConfig';
import { NetworkTypeMapping } from './data';
import { UDPList, TCPList } from './data';
import AdvanceMode from './components/AdvanceMode.vue';
import { getProviders } from '@/api/device/product';
import PerfectInfo from './components/PerfectInfo/index.vue';
import { gatewayType } from './data';
import { ProtocolMapping } from './components/Protocol/data';

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const emits = defineEmits(['reselection']);

const advancedMode = ref(false);

//接口获取到的物模型
const metadata = ref();
//network类型无可用端口
const unmet = computed(() => {
    if (accessData.value.channel === 'network') {
        return Object.keys(network.value).length === 0;
    } else {
        return false;
    }
});
const accessConfig = ref({});
const accessData = ref({});
const randomString = ref();
const generateString = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let randomLetter = letters[Math.floor(Math.random() * letters.length)];
    let randomNum1 = numbers[Math.floor(Math.random() * numbers.length)];
    let randomNum2 = numbers[Math.floor(Math.random() * numbers.length)];
    randomString.value = randomLetter + randomNum1 + randomNum2;
};

//资源库选中协议
const protocol = ref({});
//资源库选中插件
const plugin = ref({});
//设备接入网管描述
const accessDescriptions = ref(new Map());
//选中使用的网络组件
const network = ref({});
//默认创建的网络组件
const defaultNetwork = ref({});
//显示的网关名称
const accessName = ref()
const current = ref(1);

const metadataVisible = ref(false);
const visibleAdvanceMode = ref(false);
const showMetadata = () => {
    metadataVisible.value = true;
};
const metadataData = ref();

//获取对应网络组件类型是否有可用端口
const filterConfigByType = (data, type) => {
    let _temp = type;
    if (TCPList.includes(type)) {
        _temp = 'TCP';
    } else if (UDPList.includes(type)) {
        _temp = 'UDP';
    }
    // 只保留ports 包含type的数据
    const _config = data?.filter((item) => {
        return Object.keys(item.ports).includes(_temp);
    });

    // 只保留ports的type数据
    return _config?.map((i) => {
        i.ports = i.ports[_temp];
        return i;
    });
};

//选中物模型
const generateMetadata = (data) => {
    metadataData.value = data;
    metadataVisible.value = false;
};
const showAdvancedMode = () => {
    visibleAdvanceMode.value = true;
};
//恢复默认配置
const restoreDefault = () => {
    if (accessConfig.value.channel === 'network') {
        network.value = defaultNetwork.value;
    }
    getDefault();
    advancedMode.value = false;
};

//查询有可以复用的网络组件
const getUseableNetWork = async () => {
    const res = await queryAliveNetWork(
        NetworkTypeMapping.get(accessConfig.value.provider),
    );
    if (res.success && res.result.length) {
        const networkId = res.result[0].id;
        const params = {
            terms: [
                {
                    terms: [
                        {
                            type: 'or',
                            value: networkId,
                            termType: 'eq',
                            column: 'id',
                        },
                    ],
                },
            ],
        };
        const req = await queryNetWork(params);
        if (req.success && req.result) {
            return req.result[0]
        }
    }
};

//查询默认接入方式网络组件可用端口
const queryAvailablePort = async () => {
    const res = await getResourcesCurrent();
    if (res.success && NetworkTypeMapping.get(accessConfig.value.provider)) {
        const req = await queryNetWorkConfig();
        let host;
        if (req.success) {
            host = req.result.localAddress || '0.0.0.0';
        }
        const _ports = filterConfigByType(
            res.result,
            NetworkTypeMapping.get(accessConfig.value.provider),
        );
        const _host = _ports.find((item) => item.host === host);
        const ports = _host?.ports?.map((p) => {
            return p;
        });
        if (ports.length) {
            network.value.configuration = {
                publicHost: req.result.externalAddress || '0.0.0.0',
                host: host,
            };
            network.value.configuration.port = ports[0];
            network.value.configuration.publicPort = ports[0];
            network.value.type = NetworkTypeMapping.get(
                accessConfig.value.provider,
            );
            network.value.shareCluster = true;
            network.value.name =
                accessConfig.value.provider?.split('-')?.[0] +
                '网络组件' +
                randomString.value;
            defaultNetwork.value = cloneDeep(network.value);
        }
    }
};

const getDescription = async () => {
    const res = await getProviders();
    if (res.success) {
        res.result.forEach((i) => {
            accessDescriptions.value.set(i.id, i.description);
        });
    }
};
//高级模式选择完成
const advanceComplete = (data,name) => {
    protocol.value = data?.protocol;
    plugin.value = data?.plugin;
    network.value = data?.network;
    accessData.value = data.gateway;
    unmet.value = false;
    advancedMode.value = true;
    visibleAdvanceMode.value = false;
    accessName.value = name
};

//查询协议是否已经存在平台中
const protocolExist = async (id) => {
    const resp = await getProtocolList(
        ProtocolMapping.get(accessConfig.value?.provider),
        {
            'sorts[0].name': 'createTime',
            'sorts[0].order': 'desc',
            paging: false,
        },
    );
    if (resp.status === 200) {
        return resp.result.find((i) => {
            return i?.configuration?.sourceId === id;
        });
    }
};

//获取默认协议或插件
const getDefault = async () => {
    if (accessConfig.value?.bindInfo) {
        if (
            ['network', 'OneNet', 'Ctwing'].includes(accessConfig.value.channel)
        ) {
            const data =
                accessConfig.value.bindInfo.filter((i) => {
                    return i.defaultAccess;
                })?.[0] || {};
            if (JSON.stringify(data) !== '{}') {
                const existProtocol = await protocolExist(data.id);
                protocol.value = existProtocol
                    ? existProtocol
                    : {
                          ...omit(data, ['id']),
                          type: 'jar',
                          configuration: {
                              location: data.url,
                              sourceId: data.id,
                              version: data.version,
                          },
                      };
            }
        } else if (accessConfig.value?.channel === 'plugin') {
            const data =
                accessConfig.value.bindInfo.filter((i) => {
                    return i.defaultAccess;
                })?.[0] || {};
            if (JSON.stringify(data) !== '{}') {
                plugin.value = {
                    ...omit(data, ['id']),
                    provider: 'jar',
                    configuration: {
                        location: data.url,
                        sourceId: data.id,
                        version: data.version,
                    },
                };
            }
        }
    }
    accessName.value = accessConfig.value.provider?.split('-')?.[0]
    accessData.value = {
        name:
            accessConfig.value.provider?.split('-')?.[0] +
            '网关' +
            randomString.value,
        ...omit(accessConfig.value, ['bindInfo', 'defaultAccess']),
        gatewayType: gatewayType.get(accessConfig.value.provider),
    };
};

watch(
    () => [unmet.value, visibleAdvanceMode.value],
    () => {
        if (!unmet.value && !visibleAdvanceMode.value) {
            current.value = 2;
        } else {
            current.value = 1;
        }
    },
);

onMounted(async () => {
    getDescription();
    generateString();
    metadata.value = JSON.parse(props.data?.metadata || '{}');
    metadataData.value = cloneDeep(metadata.value);
    accessConfig.value =
        props.data?.accessInfos?.filter((i) => {
            return i.defaultAccess;
        })?.[0] || {};
    if (
        accessConfig.value?.channel === 'network' &&
        accessConfig.value.provider !== 'mqtt-client-gateway'
    ) {
        const data = await getUseableNetWork();
        if (data) {
            network.value = data;
            defaultNetwork.value = cloneDeep(network.value);
        } else {
            queryAvailablePort();
        }
    }
    getDefault();
});
</script>
<style lang="less" scoped>
.container {
    padding: 10px 20px;
}

.title {
    font-size: 16px;
}

.createSteps {
    margin-top: 40px;
    padding: 0 20px;

    .accessConfig {
        display: flex;
        align-items: center;
        border: 1px solid #c1c1c1;
        padding: 10px 20px;
        border-radius: 8px;

        .accessName {
            font-size: 16px;
            margin-bottom: 8px;
        }
    }

    .unmet {
        background-color: #848587;
    }

    .perfectInfo {
        border: 1px solid #c1c1c1;
        padding: 20px;
    }
}

.resource {
    border: 1px solid #bebfbf;
    display: flex;
    padding: 10px;
    align-items: center;
    border-radius: 4px;
}

:deep(.ant-steps-item:hover .ant-steps-item-description) {
    color: inherit !important;
    /* 取消颜色变化 */
}
</style>
