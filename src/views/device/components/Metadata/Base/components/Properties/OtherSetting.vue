<template>
    <PopoverModal
        v-if="!disabled"
        v-model:visible="modalVisible"
        body-style="padding-top:4px;width:600px;"
        placement="bottomRight"
        :disabled="disabled"
        @ok="confirm"
        @cancel="cancel"
    >
        <template #content>
            <j-scrollbar height="350" v-if="showContent">
                <j-collapse v-model:activeKey="activeKey" v-if="visible">
                    <j-collapse-panel
                        v-if="!(props.isProduct && target === 'device')"
                        v-for="(item, index) in config"
                        :key="'store_' + index"
                    >
                        <template #header>
                            {{ item.name }}
                            <j-tooltip
                                v-if="item.description"
                                :title="item.description"
                            >
                                <AIcon
                                    type="ExclamationCircleOutlined"
                                    style="padding-left: 12px; padding-top: 4px"
                                />
                            </j-tooltip>
                        </template>
                        <j-table
                            :columns="columns"
                            :data-source="item.properties"
                            :pagination="false"
                            rowKey="id"
                        >
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.dataIndex === 'type'">{{
                                    record.type?.name
                                }}</template>
                                <value-item
                                    v-else-if="column.dataIndex === 'value'"
                                    v-model:modelValue="
                                        configValue[record.property]
                                    "
                                    :itemType="
                                        item.properties[index].type?.type
                                    "
                                    :extra="{
                                        dropdownStyle: {
                                            zIndex: 1071,
                                        },
                                        popupStyle: {
                                            zIndex: 1071,
                                        },
                                    }"
                                    :getPopupContainer="
                                        (node) => tableWrapperRef || node
                                    "
                                    :options="
                                        (
                                            item.properties[index].type
                                                ?.elements || []
                                        ).map((a) => ({
                                            label: a.text,
                                            value: a.value,
                                        }))
                                    "
                                />
                            </template>
                        </j-table>
                    </j-collapse-panel>
                    <j-collapse-panel
                        key="metrics"
                        v-if="
                            showMetrics &&
                            !(props.isProduct && target === 'device')
                        "
                    >
                        <template #header>
                            指标配置
                            <j-tooltip
                                title="场景联动页面可引用指标配置作为触发条件"
                            >
                                <AIcon
                                    type="ExclamationCircleOutlined"
                                    style="padding-left: 12px; padding-top: 4px"
                                />
                            </j-tooltip>
                        </template>
                        <Metrics
                            ref="metricsRef"
                            :options="booleanOptions"
                            :type="props.type"
                            :value="myValue.metrics"
                        />
                    </j-collapse-panel>
                    <j-collapse-panel key="extra" v-if="showExtra">
                        <template #header>
                            <a-space>
                                <div>阈值限制</div>
                                <template
                                    v-if="
                                        props.isProduct && target === 'device'
                                    "
                                >
                                    <a-button
                                        type="link"
                                        style="padding: 0 4px; height: 22px"
                                        @click="(e) => resetThreshold(e)"
                                    >
                                        <template #icon>
                                            <AIcon type="RedoOutlined" />
                                        </template>
                                        重置
                                    </a-button>
                                    <a-tooltip>
                                        <template #title
                                            >重置后阀值限制继承于产品</template
                                        >
                                        <AIcon type="QuestionCircleOutlined" />
                                    </a-tooltip>
                                </template>
                                <a-button
                                    v-else
                                    type="link"
                                    style="padding: 0 4px; height: 22px"
                                    @click="(e) => resetThreshold(e)"
                                >
                                    <template #icon>
                                        <AIcon type="RedoOutlined" />
                                    </template>
                                    清空
                                </a-button>
                            </a-space>
                        </template>
                        <a-form
                            :model="extraForm"
                            layout="vertical"
                            ref="ThresholdRef"
                        >
                            <a-form-item>
                                <div class="extra-limit extra-check-group">
                                    <CardSelect
                                        v-model:value="extraForm.type"
                                        :options="[
                                            {
                                                label: '上下限',
                                                value: 'number-range',
                                            },
                                        ]"
                                        :showImage="false"
                                        @select="limitSelect"
                                    />
                                </div>
                            </a-form-item>
                            <a-form-item
                                v-if="extraForm.type"
                                name="limit"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入上下限',
                                    },
                                    {
                                        validator: validateLimit,
                                        trigger: 'change',
                                    },
                                ]"
                            >
                                <template #label
                                    ><div class="extra-title">
                                        阈值
                                    </div></template
                                >
                                <a-space
                                    v-if="extraForm.type === 'number-range'"
                                >
                                    <a-input-number
                                        v-model:value="extraForm.limit.lower"
                                        style="width: 178px"
                                        placeholder="请输入下限"
                                    />
                                    <span>~</span>
                                    <a-input-number
                                        v-model:value="extraForm.limit.upper"
                                        style="width: 178px"
                                        :min="extraForm.limit.lower"
                                        placeholder="请输入上限"
                                    />
                                </a-space>
                            </a-form-item>
                            <a-form-item
                                v-if="extraForm.type"
                                name="mode"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请选择处理方式',
                                    },
                                ]"
                            >
                                <template #label>
                                    <div class="extra-title">
                                        超出阈值数据处理方式
                                    </div></template
                                >
                                <div class="extra-handle extra-check-group">
                                    <CardSelect
                                        v-model:value="extraForm.mode"
                                        :options="[
                                            { label: '忽略', value: 'ignore' },
                                            { label: '记录', value: 'record' },
                                            {
                                                label: '告警',
                                                value: 'device-alarm',
                                            },
                                        ]"
                                        :showImage="false"
                                    />
                                    <div style="margin: 8px 0">
                                        {{ handleTip }}
                                    </div>
                                </div></a-form-item
                            >
                        </a-form>
                    </j-collapse-panel>
                </j-collapse>
            </j-scrollbar>
            <div v-else style="padding-top: 24px">
                <j-empty description="没有动态配置项" />
            </div>
        </template>
        <PermissionButton
            key="setting"
            :disabled="disabled"
            :has-permission="hasPermission"
            :tooltip="tooltip"
            type="primary"
        >
            <AIcon type="EditOutlined" />
            配置
        </PermissionButton>
    </PopoverModal>
    <PermissionButton
        v-else
        key="setting"
        :disabled="disabled"
        :has-permission="hasPermission"
        :tooltip="tooltip"
        type="primary"
    >
        <AIcon type="EditOutlined" />
        配置
    </PermissionButton>
</template>

<script setup lang="ts" name="OtherSetting">
import Metrics from './Metrics/Metrics.vue';
import { watch } from 'vue';
import { useProductStore } from 'store/product';
import { useInstanceStore } from 'store/instance';
import {
    getMetadataConfig,
    getMetadataDeviceConfig,
} from '@/api/device/product';
import { omit, cloneDeep } from 'lodash-es';
import { PopoverModal } from '@/components/Metadata/Table';
import { useTableWrapper } from '@/components/Metadata/Table/context';
import { useThreshold } from './hooks';

const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
    type: {
        type: String,
        default: undefined,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    id: {
        type: String,
        default: undefined,
    },
    name: {
        type: String,
        default: undefined,
    },
    record: {
        type: Object,
        default: () => ({}),
    },
    hasPermission: String,
    tooltip: Object,
    metadataType: {
        type: String,
        default: 'properties',
    },
    target: String,
    isProduct: {
        type: Boolean,
        default: false,
    },
});

const type = inject('_metadataType');

const productStore = useProductStore();
const deviceStore = useInstanceStore();
const tableWrapperRef = useTableWrapper();

const {
    thresholdUpdate,
    thresholdDetail,
    thresholdDetailQuery,
    thresholdDelete,
} = useThreshold(props);

const emit = defineEmits(['update:value', 'change']);

const ThresholdRef = ref();
const activeKey = ref();
const metricsRef = ref();

const myValue = ref(props.value);
const visible = ref(false);
const modalVisible = ref(false);

const config = ref<any>([]);
const configValue = ref(props.value?.expands);

const extraForm = reactive({
    limit: {
        upper: 0,
        lower: 0,
    },
    mode: ['ignore'],
    type: '',
});

const typeMap = {
    properties: 'property',
    functions: 'function',
    events: 'event',
    tags: 'tag',
};

const handleTip = computed(() => {
    if (extraForm.mode.includes('ignore')) {
        return '平台将忽略超出阈值的数据，无法查看上报记录';
    } else if (extraForm.mode.includes('record')) {
        return '您可以在告警记录-无效数据页面查看超出阈值的数据上报记录';
    }
    return '您可以在设备详情-告警记录 页面查看告警情况';
});

const showContent = computed(() => {
    if (props.isProduct && props.target === 'device') {
        // 继承的物模型
        return showExtra.value;
    }

    return showMetrics.value || config.value.length > 0;
});

const showMetrics = computed(() => {
    return [
        'int',
        'long',
        'float',
        'double',
        'string',
        'boolean',
        'date',
    ].includes(props.type as any);
});

const showExtra = computed(() => {
    return (
        ['int', 'long', 'float', 'double'].includes(props.type as any) &&
        props.metadataType === 'properties'
    );
});

const booleanOptions = ref([
    { label: '否', value: 'false' },
    { label: '是', value: 'true' },
]);

const columns = ref([
    {
        title: '参数名称',
        dataIndex: 'name',
        width: 150,
        ellipsis: true,
    },
    {
        title: '输入类型',
        dataIndex: 'type',
        width: 150,
    },
    {
        title: '值',
        dataIndex: 'value',
    },
]);

const limitSelect = (keys: string[], key: string, isSelected: boolean) => {
    if (!isSelected) {
        // 删除
        if (key === 'number-range') {
            extraForm.limit.lower = 0;
            extraForm.limit.upper = 0;
        }
    }

    if (keys.length === 0) {
        extraForm.mode = ['ignore'];
    }
};
const resetValue = () => {
    extraForm.mode = ['ignore'];
    extraForm.type = '';
    extraForm.limit.lower = 0;
    extraForm.limit.upper = 0;
};
const resetThreshold = async (e: any) => {
    e.stopPropagation();
    await thresholdDelete();
    resetValue();
    thresholdDetailQuery();
};

const validateLimit = (_: any, value: any) => {
    if (value.lower !== null && value.upper !== null) {
        return value.upper < value.lower
            ? Promise.reject('上限必须小于下限')
            : Promise.resolve();
    } else {
        return Promise.reject('请输入上下限');
    }
};

const getConfig = async () => {
    const id =
        type === 'product' ? productStore.current?.id : deviceStore.current.id;

    if (!props.id || !id || !props.type) return;

    if (props.type === 'boolean') {
        const booleanValue = props.record.valueType;
        booleanOptions.value[0] = {
            label: booleanValue.falseText || '否',
            value: booleanValue.falseValue || 'false',
        };
        booleanOptions.value[1] = {
            label: booleanValue.trueText || '是',
            value: booleanValue.trueValue || 'true',
        };
    }

    const params: any = {
        deviceId: id,
        metadata: {
            id: props.id,
            type: typeMap[props.metadataType],
            dataType: props.type,
        },
    };

    const resp =
        type === 'product'
            ? await getMetadataConfig(params)
            : await getMetadataDeviceConfig(params);
    if (resp.success) {
        config.value = resp.result;
        if (resp.result.length) {
            activeKey.value = ['store_0'];
        } else if (showMetrics.value) {
            activeKey.value = ['metrics'];
        }

        if (resp.result.length && !configValue.value) {
            resp.result.forEach((a) => {
                if (a.properties) {
                    a.properties.forEach((b) => {
                        configValue.value[b.property] = undefined;
                    });
                }
            });
        }
    }
    visible.value = true;
};

const confirm = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let metrics: any;
            metrics = await metricsRef.value?.getData();

            const expands = {
                ...(configValue.value || {}),
            };

            if (metrics) {
                expands.metrics = metrics;
            }
            if (showExtra.value && extraForm.type) {
                ThresholdRef.value?.validate().then(async () => {
                    await thresholdUpdate(extraForm);
                    expands.otherEdit = true;
                    emit('update:value', {
                        ...props.value,
                        ...expands,
                    });
                    emit('change');
                    modalVisible.value = false;
                    resolve(true);
                });
            } else {
                expands.otherEdit = true;
                emit('update:value', {
                    ...props.value,
                    ...expands,
                });
                emit('change');
                modalVisible.value = false;
                resolve(true);
            }
        } catch (err) {
            reject(false);
        }
    });
};

watch(
    () => modalVisible.value,
    () => {
        if (modalVisible.value) {
            configValue.value = omit(props.value, [
                'source',
                'type',
                'metrics',
                'required',
            ]);
            getConfig();

            if (showExtra.value) {
                thresholdDetailQuery();
            }
        }
    },
    { immediate: true },
);

const cancel = () => {
    myValue.value = cloneDeep(props.value);
};

watch(
    () => thresholdDetail,
    () => {
        if (
            thresholdDetail.value &&
            JSON.stringify(thresholdDetail.value) !== '{}'
        ) {
            extraForm.mode = thresholdDetail.value?.mode;
            extraForm.type = thresholdDetail.value?.type || '';
            extraForm.limit = thresholdDetail.value?.limit;
        }
    },
    { immediate: true, deep: true },
);

watch(
    () => JSON.stringify(props.value),
    () => {
        myValue.value = cloneDeep(props.value);
    },
    { immediate: true },
);
</script>

<style scoped lang="less">
.extra-tip {
    padding: 8px;
    background-color: rgba(#000, 0.05);
}

.extra-title {
    font-size: 16px;
    margin: 12px 0;
}

.extra-check-group {
    :deep(.j-card-item) {
        padding: 12px 14px !important;
    }
}
</style>
