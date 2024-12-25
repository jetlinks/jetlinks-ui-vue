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
                            <span>接入配置</span>
                            <a-button
                                v-if="!visibleAdvanceMode"
                                type="link"
                                @click="showAdvancedMode"
                                >高级模式</a-button
                            >
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
                                        {{ accessData?.name }}
                                    </div>
                                    <a-row :gutter="[12, 12]">
                                        <a-col
                                            v-if="
                                                accessData.channel ===
                                                'network'
                                            "
                                        >
                                            <div>
                                                网络:
                                                {{
                                                    network.configuration
                                                        ?.host +
                                                    ':' +
                                                    network.configuration?.port
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
                                                ].includes(
                                                    accessData.provider,
                                                )
                                            "
                                        >
                                            <div>
                                                协议: {{ protocol?.name }}
                                            </div>
                                        </a-col>
                                        <a-col
                                            v-if="
                                                accessData.channel ===
                                                'plugin'
                                            "
                                        >
                                            <div>插件: {{ plugin?.name }}</div>
                                        </a-col>
                                    </a-row>
                                </div>
                            </template>
                            <div v-else>未满足条件,请点击高级模式</div>
                        </div>
                        <AdvanceMode
                            v-else
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
import { cloneDeep , omit } from 'lodash-es';
import Metadata from './components/Metadata.vue';
import { queryNetWorkConfig } from '@/api/device/quickCreate';
import { BackMap } from '@/views/link/AccessConfig/data';
import { getResourcesCurrent } from '@/api/link/accessConfig';
import { NetworkTypeMapping } from './data';
import { UDPList, TCPList } from './data';
import AdvanceMode from './components/AdvanceMode.vue';
import { getProviders } from '@/api/device/product';
import PerfectInfo from './components/PerfectInfo/index.vue';
import { gatewayType } from './data';

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
    if (accessConfig.value.channel === 'network') {
        return JSON.stringify(network.value) === '{}';
    }
});
const accessConfig = ref({});
const accessData = ref({})
function generateString() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let randomLetter = letters[Math.floor(Math.random() * letters.length)];
    let randomNum1 = numbers[Math.floor(Math.random() * numbers.length)];
    let randomNum2 = numbers[Math.floor(Math.random() * numbers.length)];
    return randomLetter + randomNum1 + randomNum2;
}

//资源库默认协议
const protocol = ref({});
//资源库默认插件
const plugin = ref({});
//设备接入网管描述
const accessDescriptions = ref(new Map());
//自动生成的网络组件
const network = ref({});

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

//查询默认接入方式网络组件可用端口
const queryAvailablePort = async () => {
    const res = await getResourcesCurrent();
    if (res.success && NetworkTypeMapping.get(accessData.value.provider)) {
        const req = await queryNetWorkConfig();
        if (req.success) {
            network.value.configuration = {
                publicHost: req.result.externalAddress || '0.0.0.0',
                host: req.result.localAddress || '0.0.0.0',
            };
        }
        const _ports = filterConfigByType(
            res.result,
            NetworkTypeMapping.get(accessData.value.provider),
        );
        const _host = _ports.find(
            (item) => item.host === network.value?.configuration?.host,
        );
        const ports = _host?.ports?.map((p) => {
            return p;
        });
        if (ports.length) {
            network.value.configuration.port = ports[0];
            network.value.configuration.publicPort = ports[0];
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
const advanceComplete = (data) => {
    protocol.value = data?.protocol;
    plugin.value = data?.plugin;
    network.value = data?.network;
    accessData.value = data.gateway;
    unmet.value = false;
    advancedMode.value = true;
    visibleAdvanceMode.value = false;
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

onMounted(() => {
    getDescription();
    metadata.value = JSON.parse(props.data?.metadata || '{}');
    metadataData.value = cloneDeep(metadata.value);
    accessConfig.value =
        props.data?.accessInfos?.filter((i) => {
            return i.defaultAccess;
        })?.[0] || {};
    if (accessConfig.value?.channel === 'network') {
        queryAvailablePort();
    }
    if (accessConfig.value?.bindInfo) {
        if (accessConfig.value?.channel === 'network') {
            protocol.value =
                accessConfig.value.bindInfo.filter((i) => {
                    return i.defaultAccess;
                })?.[0] || {};
        } else if (accessConfig.value?.channel === 'plugin') {
            plugin.value =
                accessConfig.value.bindInfo.filter((i) => {
                    return i.defaultAccess;
                })?.[0] || {};
        }
    }
    accessData.value = {
        name:
            accessConfig.value.provider?.split('-')?.[0] +
            '网关' +
            generateString(),
        ...omit(accessConfig.value, ['bindInfo', 'defaultAccess']),
        gatewayType: gatewayType.get(accessConfig.value.provider),
    }
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
