<template>
    <j-modal
        :title="$t('Device.index.5425975-0')"
        visible
        :width="860"
        @cancel="onCancel"
        @ok="save"
        :maskClosable="false"
    >
        <j-steps :current="current" @change="stepChange">
            <j-step>
                <template #title>{{ $t('Device.index.5425975-1') }}</template>
            </j-step>
            <j-step>
                <template #title>{{ $t('Device.index.5425975-2') }}</template>
            </j-step>
            <j-step>
                <template #title>{{ $t('Device.index.5425975-0') }}</template>
            </j-step>
        </j-steps>
        <j-divider style="margin-bottom: 10px" />
        <div class="steps-content">
            <Product
                v-if="current === 0"
                v-model:rowKey="DeviceModel.productId"
                v-model:detail="productDetail"
                @change="onProductChange"
            />
            <Device
                v-else-if="current === 1"
                :name="name"
                :parallel="parallel"
                :branchesName="branchesName"
                :thenName="thenName"
                :values="DeviceModel"
                @save="onDeviceSave"
                :productDetail="productDetail"
                ref="deviceRef"
            />
            <Action
                v-else-if="current === 2"
                :name="name"
                :branchesName="branchesName"
                :thenName="thenName"
                :values="DeviceModel"
                :productDetail="productDetail"
                :columnMap="options.columnMap"
                ref="actionRef"
                @change="onActionsChange"
            />
        </div>
        <template #footer>
            <div class="steps-action">
                <j-button v-if="current === 0" @click="onCancel">{{ $t('Device.index.5425975-3') }}</j-button>
                <j-button v-else @click="prev">{{ $t('Device.index.5425975-4') }}</j-button>
                <j-button type="primary" v-if="current < 2" @click="saveClick"
                    >{{ $t('Device.index.5425975-5') }}</j-button
                >
                <j-button type="primary" v-else @click="saveClick"
                    >{{ $t('Device.index.5425975-6') }}</j-button
                >
            </div>
        </template>
    </j-modal>
</template>

<script lang="ts" setup name="ActionDeviceModal">
import { DeviceModelType, DeviceOptionType } from './typings';
import Product from './Product.vue';
import Device from './device/index.vue';
import Action from './actions/index.vue';
import { onlyMessage } from '@/utils/comm';

import { useSceneStore } from '@/store/scene';
import { storeToRefs } from 'pinia';
import { isActionChange } from '../../util';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);

type Emit = {
    (e: 'cancel'): void;
    (e: 'save', data: any, options: Record<string, any>): void;
};

const props = defineProps({
    value: {
        type: Object,
        default: () => {},
    },
    name: {
        type: Number,
        default: 0,
    },
    thenName: {
        type: Number,
        default: 0,
    },
    branchesName: {
        type: Number,
        default: 0,
    },
    parallel: {
        type: Boolean,
    },
    options: {
      type: Object,
      default: () => ({})
    }
});

const current = ref<number>(0);
const deviceRef = ref<any>();
const actionRef = ref<any>();

const productDetail = ref<any>({});

const DeviceModel = reactive<DeviceModelType>({
    productId: '',
    deviceId: '',
    selector: 'fixed',
    selectorValues: [],
    upperKey: '',
    source: 'fixed',
    message: {
        messageType: 'INVOKE_FUNCTION',
    },
});

const DeviceOptions = ref<DeviceOptionType>({});

const emit = defineEmits<Emit>();
const optionColumnCache = ref<string[]>(props.options?.otherColumn || [])

const onCancel = () => {
    emit('cancel');
};

const onSave = (_data: any, _columnMap: any = {}) => {
    const item: any = {
        selector: DeviceModel.selector,
        source: DeviceModel.source,
        selectorValues: DeviceModel.selectorValues,
        productId: DeviceModel.productId,
        upperKey: DeviceModel.upperKey,
        message: _data.message,
    };
    if (DeviceModel.selector === 'relation') {
        item.upperKey = 'scene.deviceId';
    }
    const _options: any = {
        // name: '-', //设备名称
        // type: '', //类型
        // properties: '', //属性功能
        // propertiesValue: '', //设置功能
        selector: DeviceModel.selector, //选择器标识
        triggerName: data.value.options?.trigger?.name || $t('Device.index.5425975-7'),
        ...DeviceOptions.value,
        otherColumns: [],
        columnMap: _columnMap
    };
    const _type = _data.message.messageType;
    if (_type === 'INVOKE_FUNCTION') {
        _options.type = $t('Device.index.5425975-8');
    }
    if (_type === 'READ_PROPERTY') {
        _options.type = $t('Device.index.5425975-9');
    }
    if (_type === 'WRITE_PROPERTY') {
        _options.type = $t('Device.index.5425975-10');
        _options.propertiesValue =
            (typeof _options?.propertiesValue === 'object'
                ? JSON.stringify(_options?.propertiesValue)
                : _options?.propertiesValue)
      _options.otherColumns = optionColumnCache.value
    }

    emit('save', item, JSON.parse(JSON.stringify(_options)));
};

const onProductChange = (_val: any, bol: boolean) => {
    if (!bol) {
        DeviceModel.selectorValues = undefined;
        DeviceModel.deviceId = ''
        DeviceModel.selector = 'fixed',
        DeviceModel.upperKey = ''
        DeviceModel.source = 'fixed'
        const flag = isActionChange(
            JSON.parse(_val.metadata || '{}'),
            DeviceModel?.message,
        );
        if (!flag) {
            DeviceModel.message = {
                messageType: 'INVOKE_FUNCTION',
            };
        }
    }
    productDetail.value = _val;
    DeviceOptions.value.productName = _val?.name;
};

const onDeviceSave = (_data: any, obj?: any) => {
    Object.assign(DeviceModel, { ..._data });
    DeviceOptions.value = { ...unref(DeviceOptions), ...obj };
};

const onActionsChange = (options?: any, optionColumn: string[]) => {
    optionColumnCache.value = optionColumn
    const obj = {
        ...DeviceOptions.value,
        ...options,
    };
    DeviceOptions.value = obj;
};

const save = async (step?: number) => {
    let _step = step !== undefined ? step : current.value;
    if (_step === 0) {
        DeviceModel.productId
            ? (current.value = 1)
            : onlyMessage($t('Device.index.5425975-11'), 'error');
    } else if (_step === 1) {
        if (deviceRef.value) {
            await deviceRef.value?.onFormSave();
            current.value = 2;
        } else if (DeviceModel.selectorValues?.length) {
            current.value = 2;
        } else {
            onlyMessage($t('Device.index.5425975-12'), 'error');
        }
    } else {
        if (actionRef.value) {
            const _data = await actionRef.value?.onFormSave();
            const _columnMap = actionRef.value?.getColumnMap()
            onSave(_data, _columnMap);
        }
    }
};

const stepChange = (step: number) => {
    if (step !== 0) {
        save(step - 1);
    } else {
        current.value = 0;
    }
};

const prev = () => {
    current.value -= 1;
};

const saveClick = () => save();

watch(
    () => props.value,
    (newValue) => {
        Object.assign(DeviceModel, newValue);
    },
    { immediate: true },
);
</script>

<style lang="less" scoped>
.steps-steps {
    width: 100%;
    margin-bottom: 17px;
    padding-bottom: 17px;
    border-bottom: 1px solid #f0f0f0;
}

.steps-content {
    width: 100%;
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
