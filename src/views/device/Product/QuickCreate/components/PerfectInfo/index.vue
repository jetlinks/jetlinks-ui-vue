<template>
    <div class="perfectInfo">
        <div class="configuration">
            <div>产品配置</div>
            <a-form :model="form" layout="vertical" ref="formRef">
                <a-form-item
                    label="产品名称"
                    name="name"
                    :rules="[
                        {
                            required: true,
                            message: '请输入名称',
                            trigger: 'blur',
                        },
                        {
                            max: 64,
                            message: '最多可输入64位字符',
                            trigger: 'change',
                        },
                    ]"
                >
                    <a-input v-model:value="form.name"></a-input>
                </a-form-item>
                <a-form-item
                    label="设备类型"
                    name="deviceType"
                    :rules="[
                        {
                            required: true,
                            validator: validateDeviceType,
                            trigger: 'change'
                        },
                    ]"
                >
                    <CardSelect
                        v-model:value="form.deviceType"
                        :options="deviceOptions"
                    >
                        <template #title="item">
                            <span>{{ item.title }}</span>
                            <a-tooltip :title="item.option.tooltip">
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </a-tooltip>
                        </template>
                    </CardSelect>
                </a-form-item>
                <a-form-item
                    v-for="i in configuration"
                    ::name="['configuration',i.property]"
                    :key="i"
                    :label="i.name"
                    :rules="[
                        {
                            required: !!i?.type?.expands?.required,
                            message: `${
                                i.type.type === 'enum' || 'boolean'
                                    ? '请选择'
                                    : '请输入'
                            }${i.name}`,
                        },
                    ]"
                >
                    <a-input
                        placeholder="请输入"
                        v-if="i.type.type === 'string'"
                        v-model:value="form.configuration[i.property]"
                    ></a-input>
                    <a-input-password
                        placeholder="请输入"
                        v-if="i.type.type === 'password'"
                        v-model:value="form.configuration[i.property]"
                    ></a-input-password>
                    <a-select
                        placeholder="请选择"
                        v-if="
                            i.type.type === 'enum' || i.type.type === 'boolean'
                        "
                        v-model:value="form.configuration[i.property]"
                        :options="getOptions(i)"
                    >
                    </a-select>
                    <a-input-number
                        v-if="
                            ['int', 'float', 'double', 'long'].includes(
                                i.type.type,
                            )
                        "
                        v-model:value="form.configuration[i.property]"
                        placeholder="请输入"
                    ></a-input-number>
                </a-form-item>
                <a-form-item label="存储策略" required name="storePolicy">
                    <a-select ref="select" v-model:value="form.storePolicy">
                        <a-select-option
                            v-for="(item, index) in storageList"
                            :key="index"
                            :value="item.id"
                            >{{ item.name }}</a-select-option
                        >
                    </a-select>
                </a-form-item>
            </a-form>
        </div>
        <div
            class="configuration"
            v-if="
                ['gb28181-2016', 'Ctwing', 'OneNet-platform'].includes(
                    accessData.provider,
                )
            "
        >
            <div>网关配置</div>
            <GB28181
                ref="accessRef"
                v-if="accessData.provider === 'gb28181-2016'"
            />
            <Ctwing ref="accessRef" v-if="accessData.provider === 'Ctwing'" />
            <OneNet ref="accessRef" v-if="accessData.provider === 'OneNet-platform'" />
        </div>
        <div
            class="configuration"
            v-if="!advancedMode && accessData.channel === 'network'"
        >
            <div>网络组件配置</div>
            <Network ref="networkRef" :accessData="accessData" />
        </div>
        <div style="text-align: right;">
            <a-space>
                <a-button @click="emits('cancel')" :disabled="loading"
                    >取消</a-button
                >
                <a-button @click="createProduct" :loading="loading" type="primary"
                    >确定</a-button
                >
            </a-space>
        </div>
    </div>
</template>

<script setup>
import {
    queryPluginConfiguration,
    queryProtocolConfiguration,
    quickCreateProduct,
    queryGB28181Configuration,
} from '@/api/device/quickCreate';
import { getStoragList } from '@/api/device/product';
import { getImage, onlyMessage } from '@/utils/comm';
import GB28181 from './GB28181/index.vue';
import Ctwing from './Ctwing/index.vue';
import OneNet from './OneNet/index.vue';
import Network from './Network/index.vue';
import { useMenuStore } from '@/store/menu';
import CardSelect from '@/components/CardSelect/CardSelect.vue'
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    accessData: {
        type: Object,
        default: () => {},
    },
    advancedMode: {
        type: Boolean,
        default: false,
    },
    protocol: {
        type: Object,
        default: () => {},
    },
    plugin: {
        type: Object,
        default: () => {},
    },
    network: {
        type: Object,
        default: () => {},
    },
    metadata: {
        type: Object,
        default: () => {},
    },
});

const emits = defineEmits(['cancel']);

const accessRef = ref();
const networkRef = ref();
const formRef = ref();
const storageList = ref([]);
const menuStory = useMenuStore();
const loading = ref(false);

//设备类型
const deviceList = [
    {
        label: '直连设备',
        value: 'device',
        iconUrl: getImage('/device-type-1.png'),
        tooltip: '直连物联网平台的设备',
    },
    {
        label: '网关子设备',
        value: 'childrenDevice',
        iconUrl: getImage('/device-type-2.png'),
        tooltip: '作为网关的子设备，由网关代理连接到物联网平台',
    },
    {
        label: '网关设备',
        value: 'gateway',
        iconUrl: getImage('/device/device-type-3.png'),
        tooltip: '能挂载子设备与平台进行通信的设备',
    },
];

//配置信息
const configuration = ref([]);

const form = ref({
    name: '',
    deviceType: '',
    storePolicy: '',
    configuration: {},
    metadata: undefined,
});

const deviceOptions = computed(() => {
    return deviceList.filter((i) => {
        return props.data?.deviceType.some((item) => {
            return item.value === i.value;
        });
    });
});

const getOptions = (i) => {
    if (i.type.type === 'enum') {
        return (i.type?.elements || []).map((item) => {
            return {
                label: item?.text,
                value: item?.value,
            };
        });
    } else if (i.type.type === 'boolean') {
        return [
            {
                label: i.type?.falseText,
                value: i.type?.falseValue,
            },
            {
                label: i.type?.trueText,
                value: i.type?.trueValue,
            },
        ];
    }
    return undefined;
};

/**
 * 校验是否选择设备类型
 */
const validateDeviceType = async (_rule, value) => {
    if (!value) {
        return Promise.reject('请选择设备类型');
    } else {
        return Promise.resolve();
    }
};

const changeDeviceType = (value) => {
    form.value.deviceType = value[0];
};

const createProduct = async () => {
    loading.value = true;
    const allPromise = [formRef.value.validate()];
    //accessRef和networkRef 接入网关类型同时只能满足一个存在
    if (accessRef.value) {
        allPromise.push(accessRef.value?.submitData());
    }
    if (networkRef.value) {
        allPromise.push(networkRef.value.submitData());
    }
    Promise.all(allPromise)
        .then(async (dataArr) => {
            const product = {
                ...form.value,
                transportProtocol: props.accessData.transport,
                metadata: JSON.stringify(props.metadata),
            };
            let data;
            if (props.accessData.channel === 'network') {
                if (
                    [
                        'agent-media-device-gateway',
                        'agent-device-gateway',
                    ].includes(props.accessData.provider)
                ) {
                    data = {
                        resourceId: props.data.id,
                        gateway: {
                            ...props.accessData,
                            protocol: props.accessData.provider,
                        },
                        network: props.advancedMode
                            ? props.network
                            : {
                                  ...props.network,
                                  configuration: {
                                      ...props.network.configuration,
                                      ...dataArr[1],
                                  },
                              },
                        product,
                    };
                } else {
                    data = {
                        resourceId: props.data.id,
                        network: props.advancedMode
                            ? props.network
                            : {
                                  ...props.network,
                                  configuration: {
                                      ...props.network.configuration,
                                      ...dataArr[1],
                                  },
                              },
                        gateway: props.accessData,
                        protocol: props.protocol,
                        product,
                    };
                }
            } else if (
                ['OneNet', 'Ctwing'].includes(props.accessData.channel)
            ) {
                data = {
                    resourceId: props.data.id,
                    gateway: {
                        ...props.accessData,
                        configuration: {
                            ...props.accessData?.configuration,
                            ...dataArr[1],
                        },
                    },
                    protocol: props.protocol,
                    product,
                };
            } else if (props.accessData.channel === 'plugin') {
                data = {
                    resourceId: props.data.id,
                    gateway: props.accessData,
                    plugin: props.plugin,
                    product,
                };
            } else if (
                ['gb28181-2016'].includes(
                    props.accessData.provider,
                )
            ) {
                data = {
                    resourceId: props.data.id,
                    gateway: {
                        ...props.accessData,
                        configuration: {
                            ...props.accessData?.configuration,
                            ...dataArr[1],
                        },
                    },
                    product
                };
            } else {
                data = {
                    resourceId: props.data.id,
                    gateway: props.accessData,
                    product,
                };
            }
            const res = await quickCreateProduct(data);
            if (res.success) {
                onlyMessage('操作成功');
                menuStory.jumpPage('device/Product');
            }
        })
        .catch((err) => {
            loading.value = false;
        });
};

//从协议中获取配置项
const getConfigurationByProtocol = async () => {
    const res = await queryProtocolConfiguration(props.accessData.transport, {
        ...props.protocol,
        type: 'jar',
    });
    if (res.success) {
        res.result?.transports?.forEach((i) => {
            i.configs.properties.forEach((item) => {
                if (item.name === '流传输模式') {
                    form.value.configuration[item.property] =
                        item.type.expands?.defaultValue;
                }
                configuration.value.push(item);
            });
        });
    }
};

//从插件中获取配置项
const getConfigurationByPlugin = async () => {
    const res = await queryPluginConfiguration(props.plugin);
    if (res.success) {
        res.result?.others?.configMetadata?.properties.forEach((item) => {
            if (item.name === '流传输模式') {
                form.value.configuration[item.property] =
                    item.type.expands?.defaultValue;
            }
            configuration.value.push(item);
        });
    }
};

//获取国标类型的配置项
const getConfigurationByGB28181 = async () => {
    const res = await queryGB28181Configuration();
    if (res.success) {
        res.result?.forEach((i) => {
            i.configs.properties.forEach((item) => {
                if (item.name === '流传输模式') {
                    form.value.configuration[item.property] =
                        item.type.expands?.defaultValue;
                }
                configuration.value.push(item);
            });
        });
    }
};

watch(
    () => props.accessData,
    () => {
        getStoragList().then((resp) => {
            if (resp.status === 200) {
                storageList.value = resp.result;
            }
        });

        if (
            ['network', 'OneNet', 'Ctwing'].includes(
                props.accessData.channel,
            ) &&
            !['agent-media-device-gateway', 'agent-device-gateway'].includes(
                props.accessData.provider,
            )
        ) {
            getConfigurationByProtocol();
        } else if (props.accessData.channel === 'plugin') {
            getConfigurationByPlugin();
        } else if (props.accessData.provider === 'gb28181-2016') {
            getConfigurationByGB28181();
        }
    },
    {
        immediate: true,
        deep: true,
    },
);
</script>
<style lang="less" scoped></style>
