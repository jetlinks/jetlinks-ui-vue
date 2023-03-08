<template>
    <j-modal
        title="执行动作"
        visible
        :width="860"
        @cancel="onCancel"
        @ok="save"
        :maskClosable="false"
    >
        <j-steps :current="current" @change="stepChange">
            <j-step>
                <template #title>选择产品</template>
            </j-step>
            <j-step>
                <template #title>选择设备</template>
            </j-step>
            <j-step>
                <template #title>执行动作</template>
            </j-step>
        </j-steps>
        <j-divider style="margin-bottom: 10px" />
        <div class="steps-content">
            <Product
                v-if="current === 0"
                v-model:rowKey="DeviceModel.productId"
                v-model:detail="DeviceModel.productDetail"
            />
            <Device
                v-else-if="current === 1"
                :name="name"
                :parallel="parallel"
                :branchGroup="branchGroup"
                :thenName="thenName"
                :values="DeviceModel"
                @save="onDeviceSave"
            />
            <Action v-else-if="current === 2"
                :name="name"
                :branchGroup="branchGroup"
                :thenName="thenName"
                :values="DeviceModel"
             />
        </div>
        <template #footer>
            <div class="steps-action">
                <j-button v-if="current === 0" @click="onCancel">取消</j-button>
                <j-button v-else @click="prev">上一步</j-button>
                <j-button type="primary" v-if="current < 2" @click="saveClick"
                    >下一步</j-button
                >
                <j-button type="primary" v-else @click="saveClick"
                    >确定</j-button
                >
            </div>
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import { DeviceModelType } from './typings';
import Product from './Product.vue';
import Device from './device/index.vue';
import Action from './actions/index.vue';
import { onlyMessage } from '@/utils/comm';
import { detail } from '@/api/device/product'

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
    branchGroup: {
        type: Number,
        default: 0,
    },
    parallel: {
        type: Boolean,
    },
});

const current = ref<number>(0);

const DeviceModel = reactive<DeviceModelType>({
    productId: '',
    deviceId: '',
    productDetail: {},
    device: {},
    deviceDetail: {},
    options: {},
    selector: 'fixed',
    selectorValues: [],
    upperKey: '',
    source: 'fixed',
    relationName: '',
    message: {},
    propertiesName: '',
    propertiesValue: '',
    columns: [],
    actionName: '',
    tagList: [],
});

const emit = defineEmits<Emit>();

const onCancel = () => {
    emit('cancel');
};

const save = async (step?: number) => {
    let _step = step !== undefined ? step : current.value;
    if (_step === 0) {
        DeviceModel.productId
            ? (current.value = 1)
            : onlyMessage('请选择产品', 'error');
    } else if (_step === 1) {
        DeviceModel.deviceId
            ? (current.value = 2)
            : onlyMessage('请选择设备', 'error');
    } else {
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

const onDeviceSave = (_data: any, _detail: any) => {
    Object.assign(DeviceModel, _data)
    DeviceModel.deviceId = _detail.id
    DeviceModel.deviceDetail = _detail
}

watch(
    () => props.value,
    (newValue) => {
        Object.assign(DeviceModel, newValue);
        if(newValue?.productId){
            detail(newValue.productId).then(resp => {
                if(resp.status === 200){
                    DeviceModel.productDetail = resp.result
                }
            })
        }
    },
    { immediate: true, deep: true },
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