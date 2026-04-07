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
            <div style="height: 350px; overflow-y: auto" v-if="showContent">
                <a-collapse v-model:activeKey="activeKey" v-if="visible">
                    <a-collapse-panel
                        v-if="!(props.isProduct && target === 'device')"
                        v-for="(item, index) in config"
                        :key="'store_' + index"
                    >
                        <template #header>
                            {{ item.name }}
                            <a-tooltip
                                v-if="item.description"
                                :title="item.description"
                            >
                                <AIcon
                                    type="ExclamationCircleOutlined"
                                    style="padding-left: 12px; padding-top: 4px"
                                />
                            </a-tooltip>
                        </template>
                        <a-table
                            :columns="columns"
                            :data-source="item.properties"
                            :pagination="false"
                            rowKey="id"
                        >
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.dataIndex === 'type'">{{
                                        record.type?.name
                                    }}</template>
                                <template
                                    v-else-if="column.dataIndex === 'value'"
                                >
                                    <a-tooltip
                                        v-if="_disabled(record.property)"
                                        color="#ffffff"
                                        :get-popup-container="popContainer"
                                        :arrowPointAtCenter="true"
                                        placement="topRight"
                                    >
                                        <template #title>
                                            <div style="color: #1A1A1A; padding: 12px">
                                              {{ $t('Properties.OtherSetting.237457-0') }}
                                              <div style="display: flex; flex-wrap: wrap; gap: 4px 8px; margin-top: 8px">
                                                <div
                                                    style="background-color: #F0F0F0; padding: 4px 8px; border-radius: 4px;color: #777777;"
                                                    v-for="item in conflictData" :key="item">
                                                {{item}}
                                              </div>
                                              </div>
                                            </div>
                                        </template>
                                        <div
                                            class="table-form-error-target"
                                        ></div>
                                    </a-tooltip>
                                    <div
                                        style="position: relative"
                                        :class="{
                                            'edit-table-form-has-error':
                                                _disabled(record.property),
                                        }"
                                    >
                                        <j-value-item
                                            style="width: 100%"
                                            v-model:modelValue="
                                                configValue[record.property]
                                            "
                                            :itemType="
                                                item.properties[index].type
                                                    ?.type
                                            "

                                            :extraProps="{
                                                dropdownStyle: {
                                                    zIndex: 1071,
                                                },
                                                popupStyle: {
                                                    zIndex: 1071,
                                                },
                                                disabled: _disabled(record.property),
                                                getPopupContainer: (node) => tableWrapperRef || node
                                            }"
                                            :options="getOptions(item, index)"
                                        />
                                    </div>
                                </template>
                            </template>
                        </a-table>
                    </a-collapse-panel>
                    <a-collapse-panel
                        key="metrics"
                        v-if="
                            showMetrics &&
                            !(props.isProduct && target === 'device')
                        "
                    >
                        <template #header>
                            {{ $t('Properties.OtherSetting.237457-1') }}
                            <a-tooltip
                                :title="$t('Properties.OtherSetting.237457-2')"
                            >
                                <AIcon
                                    type="ExclamationCircleOutlined"
                                    style="padding-left: 12px; padding-top: 4px"
                                />
                            </a-tooltip>
                        </template>
                        <Metrics
                            ref="metricsRef"
                            :options="booleanOptions"
                            :type="props.type"
                            :value="myValue.metrics"
                        />
                    </a-collapse-panel>
                    <a-collapse-panel key="extra" v-if="showExtra">
                        <template #header>
                            <a-space>
                                <div>{{ $t('Properties.OtherSetting.237457-3') }}</div>
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
                                        {{ $t('Properties.OtherSetting.237457-4') }}
                                    </a-button>
                                    <a-tooltip>
                                        <template #title
                                            >{{ $t('Properties.OtherSetting.237457-5') }}</template
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
                                    {{ $t('Properties.OtherSetting.237457-6') }}
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
                                    <j-card-select
                                        v-model:value="extraForm.type"
                                        :options="[
                                            {
                                                label: $t('Properties.OtherSetting.237457-7'),
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
                                        message: $t('Properties.OtherSetting.237457-8'),
                                    },
                                    {
                                        validator: validateLimit,
                                        trigger: 'change',
                                    },
                                ]"
                            >
                                <template #label
                                    ><div class="extra-title">
                                        {{ $t('Properties.OtherSetting.237457-9') }}
                                    </div></template
                                >
                                <a-space
                                    v-if="extraForm.type === 'number-range'"
                                >
                                    <a-input-number
                                        v-model:value="extraForm.limit.lower"
                                        style="width: 178px"
                                        :placeholder="$t('Properties.OtherSetting.237457-10')"
                                    />
                                    <span>~</span>
                                    <a-input-number
                                        v-model:value="extraForm.limit.upper"
                                        style="width: 178px"
                                        :min="extraForm.limit.lower"
                                        :placeholder="$t('Properties.OtherSetting.237457-11')"
                                    />
                                </a-space>
                            </a-form-item>
                            <a-form-item
                                v-if="extraForm.type"
                                name="mode"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Properties.OtherSetting.237457-12'),
                                    },
                                ]"
                            >
                                <template #label>
                                    <div class="extra-title">
                                        {{ $t('Properties.OtherSetting.237457-13') }}
                                    </div></template
                                >
                                <div class="extra-handle extra-check-group">
                                    <j-card-select
                                        v-model:value="extraForm.mode"
                                        :options="[
                                            { label: $t('Properties.OtherSetting.237457-14'), value: 'ignore' },
                                            {
                                                label: $t('Properties.OtherSetting.237457-15'),
                                                value: 'device-record',
                                            },
                                            {
                                                label: $t('Properties.OtherSetting.237457-16'),
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
                    </a-collapse-panel>
                </a-collapse>
            </div>
            <div v-else style="padding-top: 24px">
                <j-empty :description="$t('Properties.OtherSetting.237457-17')" />
            </div>
        </template>
        <j-permission-button
            key="setting"
            :disabled="disabled"
            :has-permission="hasPermission"
            :tooltip="tooltip"
            type="primary"
        >
            <AIcon type="EditOutlined" />
            {{ $t('Properties.OtherSetting.237457-18') }}
        </j-permission-button>
    </PopoverModal>
    <j-permission-button
        v-else
        key="setting"
        :disabled="disabled"
        :has-permission="hasPermission"
        :tooltip="tooltip"
        type="primary"
    >
        <AIcon type="EditOutlined" />
        {{ $t('Properties.OtherSetting.237457-18') }}
    </j-permission-button>
</template>

<script setup lang="ts" name="OtherSetting">
import Metrics from './Metrics/Metrics.vue';
import { watch } from 'vue';
import { useProductStore } from '../../../../../../../store/product';
import { useInstanceStore } from '../../../../../../../store/instance';
import {
    getMetadataConfig,
    getMetadataDeviceConfig,
} from '../../../../../../../api/product';
import { PopoverModal } from '../../../../../../../components/Metadata';
import { useTableWrapper } from '../../../../../../../components/Metadata/context';
import { omit, cloneDeep } from 'lodash-es';
import { useThreshold } from './hooks';
import { useSystemStore } from '@jetlinks-web-core/store';
import { useI18n } from 'vue-i18n';
import {isNoCommunity} from "@jetlinks-web-core/utils";

const { t: $t } = useI18n();

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

const { showThreshold } = useSystemStore();
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
const configValue = ref(props.value || {});

const extraForm = reactive({
    limit: {
        upper: 0,
        lower: 0,
    },
    mode: 'ignore',
    type: '',
});

const typeMap = {
    properties: 'property',
    functions: 'function',
    events: 'event',
    tags: 'tag',
};

const handleTip = computed(() => {
    if (extraForm.mode === 'ignore') {
        return $t('Properties.OtherSetting.237457-19');
    } else if (extraForm.mode === 'device-record') {
        return $t('Properties.OtherSetting.237457-20');
    }
    return $t('Properties.OtherSetting.237457-21');
});

const showContent = computed(() => {
    if (props.isProduct && props.target === 'device') {
        // 继承的物模型
        return showExtra.value;
    }

    return (showMetrics.value || config.value.length > 0) && props.id;
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
        props.metadataType === 'properties' &&
        showThreshold && isNoCommunity
    );
});

const booleanOptions = ref([
    { label: $t('Properties.OtherSetting.237457-22'), value: 'false' },
    { label: $t('Properties.OtherSetting.237457-23'), value: 'true' },
]);

const columns = ref([
    {
        title: $t('Properties.OtherSetting.237457-24'),
        dataIndex: 'name',
        width: 150,
        ellipsis: true,
    },
    {
        title: $t('Properties.OtherSetting.237457-25'),
        dataIndex: 'type',
        width: 150,
    },
    {
        title: $t('Properties.OtherSetting.237457-26'),
        dataIndex: 'value',
    },
]);

const popContainer = (e) => {
    return e;
};

const limitSelect = (keys: string[], key: string, isSelected: boolean) => {
    if (!isSelected) {
        // 删除
        if (key === 'number-range') {
            extraForm.limit.lower = 0;
            extraForm.limit.upper = 0;
        }
    }

    if (keys.length === 0) {
        extraForm.mode = 'ignore';
    }
};
const resetValue = () => {
    extraForm.mode = 'ignore';
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
            ? Promise.reject($t('Properties.OtherSetting.237457-27'))
            : Promise.resolve();
    } else {
        return Promise.reject($t('Properties.OtherSetting.237457-8'));
    }
};

const getConfig = async () => {
    const id =
        type === 'product' ? productStore.current?.id : deviceStore.current.id;

    if (!props.id || !id || !props.type) return;

    if (props.type === 'boolean') {
        const booleanValue = props.record.valueType;
        booleanOptions.value[0] = {
            label: booleanValue.falseText || $t('Properties.OtherSetting.237457-22'),
            value: booleanValue.falseValue || 'false',
        };
        booleanOptions.value[1] = {
            label: booleanValue.trueText || $t('Properties.OtherSetting.237457-23'),
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
        if (showExtra.value) {
            activeKey.value = ['extra'];
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

            console.log(expands, 'expands')
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

//获取下拉选择
const getOptions = (item: any, index: any) => {
    if (item.properties[index].type?.type === 'boolean') {
        return [
            {
                label: item.properties[index].type?.trueText,
                value: item.properties[index].type?.trueValue,
            },
            {
                label: item.properties[index].type?.falseText,
                value: item.properties[index].type?.falseValue,
            },
        ];
    } else {
        return (item.properties[index].type?.elements || []).map((a) => ({
            label: a.text,
            value: a.value,
        }));
    }
};

//判断设备接入配置项是否跟物模型字段冲突
const conflictData = computed(() => {
    let arr:any = []
    if(props.metadataType === 'properties') {
        arr = ['groupId', 'groupName', 'source', 'type', 'virtualRule']
    }
    if(props.metadataType === 'events') {
        arr = ['level']
    }
    return [...arr, 'metrics']
})

const _disabled = (_property:any) => {
    return conflictData.value.includes(_property)
}

watch(
    () => modalVisible.value,
    async () => {
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

.table-form-error-target {
    position: absolute;
    right: 2px;
    top: 0;
    border: 16px solid transparent;
    border-top-color: @error-color;
    border-right-width: 0;
    border-bottom-width: 0;
}
</style>
