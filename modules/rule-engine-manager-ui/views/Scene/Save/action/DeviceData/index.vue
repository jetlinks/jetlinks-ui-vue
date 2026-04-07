<template>
    <a-modal
        :title="$t('Device.index.9667820-0')"
        open
        :width="860"
        @cancel="onCancel"
        @ok="save"
        :maskClosable="false"
    >
        <a-steps :current="current" @change="stepChange">
            <a-step>
                <template #title>{{ $t('Device.index.9667820-1') }}</template>
            </a-step>
            <a-step>
                <template #title>{{ $t('Device.index.9667820-2') }}</template>
            </a-step>
        </a-steps>
        <a-divider style="margin-bottom: 10px" />
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
                :productDetail="productDetail"
                ref="deviceRef"
                @save="onDeviceSave"
            />
        </div>
        <template #footer>
            <div class="steps-action">
              <template v-if="current === 0">
                <a-button @click="onCancel">{{ $t('Device.index.9667820-3') }}</a-button>
                <a-button type="primary" @click="saveClick">{{ $t('Device.index.9667820-5') }}</a-button>
              </template>
              <template v-else>
                <a-button @click="prev">{{ $t('Device.index.9667820-4') }}</a-button>
                <a-button type="primary" @click="saveClick">{{ $t('Device.index.9667820-6') }}</a-button >
              </template>
            </div>
        </template>
    </a-modal>
</template>

<script lang="ts" setup name="ActionDeviceModal">
import type {DeviceModelDataType, DeviceOptionType} from './typings';
import Product from './Product.vue';
import Device from './device/index.vue';
import { onlyMessage } from '@jetlinks-web/utils';
import { detail } from '@rule-engine-manager-ui/api/instance';
import { useSceneStore } from '@rule-engine-manager-ui/store/scene';
import { storeToRefs } from 'pinia';
import { isActionChange } from '../../util';
import { handleMetadata } from './util'
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
const productDetail = ref<any>({});

const DeviceModel = reactive<DeviceModelDataType>({
    productId: '',
    deviceId: '',
    selector: {
      selector: 'fixed',
      selectorValues: [],
      upperKey: '',
      source: 'fixed',
    },
    message: {
        messageType: 'INVOKE_FUNCTION',
    },
});

const DeviceOptions = ref<DeviceOptionType>({});

const emit = defineEmits<Emit>();

const onCancel = () => {
    emit('cancel');
};

const onSave = async () => {
    let metadata = productDetail.value.metadata || '{}';
    if (DeviceModel.selector.selector === 'fixed' && DeviceModel.selector.selectorValues === 1) {
      const resp = await detail(DeviceModel.selector.selectorValues[0].id);
      if (resp.success) {
        metadata = resp.result?.metadata || '{}'
      }
    }

    const item: any = {
        selector: DeviceModel.selector,
        productId: DeviceModel.productId,
        configs: ['state', 'onlineTime', 'offlineTime', 'deviceName', 'productName'],
        ...handleMetadata(JSON.parse(metadata)),
    };
    if (DeviceModel.selector.selector === 'relation') {
        item.selector.upperKey = 'scene.deviceId';
    }
    const _options: any = {
        selector: DeviceModel.selector.selector, //选择器标识
        triggerName: data.value.options?.trigger?.name || $t('Device.index.9667820-7'),
        ...DeviceOptions.value,
        otherColumns: [],
    };
    console.log(item)
    emit('save', item, JSON.parse(JSON.stringify(_options)));
};

const onProductChange = (_val: any, bol: boolean) => {
    if (!bol) {
      DeviceModel.selector = {
        selectorValues: undefined,
        selector: 'fixed',
        upperKey: '',
        source: 'fixed'
      }
        DeviceModel.deviceId = ''
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

const save = async (step?: number) => {
    let _step = step !== undefined ? step : current.value;
    if (_step === 0) {
        DeviceModel.productId
            ? (current.value = 1)
            : onlyMessage($t('Device.index.9667820-11'), 'error');
    } else {
        if (deviceRef.value) {
            const resp = await deviceRef.value?.onFormSave();
            if(resp){
              onSave();
            }
        } else if (DeviceModel.selector.selectorValues?.length) {
            onSave();
        } else {
            onlyMessage($t('Device.index.9667820-12'), 'error');
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
