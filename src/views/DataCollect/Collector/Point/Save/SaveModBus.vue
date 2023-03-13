<template lang="">
    <j-modal
        :title="data.id ? '编辑' : '新增'"
        :visible="true"
        width="700px"
        @cancel="handleCancel"
    >
        <j-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
            :rules="ModBusRules"
            ref="formRef"
        >
            <j-form-item label="点位名称" name="name">
                <j-input
                    placeholder="请输入点位名称"
                    v-model:value="formData.name"
                />
            </j-form-item>
            <j-form-item
                label="功能码"
                :name="['configuration', 'function']"
                :rules="ModBusRules.function"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.function"
                    :options="[
                        { label: '01线圈寄存器', value: 'Coils' },
                        { label: '03保存寄存器', value: 'HoldingRegisters' },
                        { label: '04输入寄存器', value: 'DiscreteInputs' },
                    ]"
                    placeholder="请选择所功能码"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
            </j-form-item>
            <j-form-item
                label="地址"
                :name="['pointKey']"
                :rules="[
                    ...ModBusRules.pointKey,
                    {
                        validator: checkPointKey,
                        trigger: 'blur',
                    },
                ]"
            >
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入地址"
                    v-model:value="formData.pointKey"
                    :min="0"
                    :max="255"
                />
            </j-form-item>
            <j-form-item
                label="寄存器数量"
                :name="['configuration', 'parameter', 'quantity']"
                :rules="ModBusRules.quantity"
            >
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入寄存器数量"
                    v-model:value="formData.configuration.parameter.quantity"
                    :min="1"
                    :max="255"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.configuration.function === 'HoldingRegisters'"
                label="数据类型"
                :name="['configuration', 'codec', 'provider']"
                :rules="[
                    ...ModBusRules.provider,
                    {
                        validator: checkProvider,
                        trigger: 'change',
                    },
                ]"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.codec.provider"
                    :options="providerList"
                    placeholder="请选择数据类型"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
            </j-form-item>
            <j-form-item
                label="缩放因子"
                :name="[
                    'configuration',
                    'codec',
                    'configuration',
                    'scaleFactor',
                ]"
                :rules="ModBusRules.scaleFactor"
            >
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入缩放因子"
                    v-model:value="
                        formData.configuration.codec.configuration.scaleFactor
                    "
                />
            </j-form-item>
            <j-form-item label="访问类型" name="accessModes">
                <!-- <RadioCard
                    layout="horizontal"
                    :checkStyle="true"
                    :options="[
                        { label: '读', value: 'read' },
                        { label: '写', value: 'write' },
                    ]"
                    v-model="formData.accessModes"
                /> -->
                <j-checkbox-group
                    v-model:value="formData.accessModes"
                    :options="[
                        { label: '读', value: 'read' },
                        { label: '写', value: 'write' },
                    ]"
                />
            </j-form-item>

            <j-form-item
                :name="['nspwc']"
                v-if="
                    formData.accessModes?.includes('write') &&
                    formData.configuration.function === 'HoldingRegisters'
                "
            >
                <span style="margin-right: 10px">非标准协议写入配置</span>
                <j-switch v-model:checked="formData.nspwc" />
            </j-form-item>

            <j-form-item
                v-if="
                    !!formData.nspwc &&
                    formData.accessModes?.includes('write') &&
                    formData.configuration.function === 'HoldingRegisters'
                "
                label="是否写入数据区长度"
                :name="['configuration', 'parameter', 'writeByteCount']"
                :rules="ModBusRules.writeByteCount"
            >
                <RadioCard
                    layout="horizontal"
                    :checkStyle="true"
                    :options="[
                        { label: '是', value: true },
                        { label: '否', value: false },
                    ]"
                    v-model="formData.configuration.parameter.writeByteCount"
                />
            </j-form-item>
            <j-form-item
                v-if="
                    !!formData.nspwc &&
                    formData.accessModes?.includes('write') &&
                    formData.configuration.function === 'HoldingRegisters'
                "
                label="自定义数据区长度（byte）"
                :name="['configuration', 'parameter', 'byteCount']"
                :rules="ModBusRules.byteCount"
            >
                <j-input
                    placeholder="请输入自定义数据区长度（byte）"
                    v-model:value="formData.configuration.parameter.byteCount"
                />
            </j-form-item>
            <j-form-item
                label="采集频率"
                :name="['configuration', 'interval']"
                :rules="[
                    ...ModBusRules.interval,
                    {
                        validator: checkLength,
                        trigger: 'change',
                    },
                ]"
            >
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入采集频率"
                    v-model:value="formData.configuration.interval"
                    :min="1"
                    addon-after="ms"
                />
            </j-form-item>

            <a-form-item label="" :name="['features']">
                <a-checkbox-group v-model:value="formData.features">
                    <a-checkbox value="changedOnly" name="type"
                        >只推送变化的数据</a-checkbox
                    >
                </a-checkbox-group>
            </a-form-item>

            <j-form-item label="说明" :name="['description']">
                <j-textarea
                    placeholder="请输入说明"
                    v-model:value="formData.description"
                    :maxlength="200"
                    :rows="3"
                    showCount
                />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="handleCancel">取消</j-button>
            <PermissionButton
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleOk"
                style="margin-left: 8px"
                :hasPermission="`DataCollect/Collector:${
                    id ? 'update' : 'add'
                }`"
            >
                确认
            </PermissionButton>
        </template>
    </j-modal>
</template>
<script lang="ts" setup>
import {
    savePointBatch,
    updatePoint,
    _validateField,
    queryCodecProvider,
} from '@/api/data-collect/collector';
import { ModBusRules, checkProviderData } from '../../data.ts';
import type { FormInstance } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/lib/form';
import { cloneDeep, isArray } from 'lodash-es';

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['change']);
const loading = ref(false);
const providerList = ref([]);
const formRef = ref<FormInstance>();

const id = props.data.id;
const collectorId = props.data.collectorId;
const provider = props.data.provider;
const oldPointKey = props.data.pointKey;

const formData = ref({
    name: '',
    configuration: {
        function: undefined,
        interval: 3000,
        parameter: {
            quantity: 1,
            writeByteCount: '',
            byteCount: 2,
            address: '',
        },
        codec: {
            provider: undefined,
            configuration: {
                scaleFactor: 1,
            },
        },
    },
    pointKey: '',
    accessModes: [],
    nspwc: false,
    features: [],
    description: '',
});

const onSubmit = async () => {
    const data = await formRef.value?.validate();

    delete data?.nspwc;
    const { codec } = data?.configuration;

    if (data?.configuration.function !== 'HoldingRegisters') {
        codec.provider = 'int8';
    }
    const params = {
        ...props.data,
        ...data,
        provider,
        collectorId,
    };

    // address是多余字段，但是react版本上使用到了这个字段
    params.configuration.parameter = {
        ...params.configuration.parameter,
        address: data?.pointKey,
    };

    loading.value = true;
    const response = !id
        ? await savePointBatch(params)
        : await updatePoint(id, { ...props.data, ...params });
    if (response.status === 200) {
        emit('change', true);
    }
    loading.value = false;
};

const handleOk = () => {
    onSubmit();
};
const handleCancel = () => {
    emit('change', false);
};

const checkLength = (_rule: Rule, value: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if (value) {
            return String(value).length > 64
                ? reject('最多可输入64个字符')
                : resolve('');
        }
    });

const checkProvider = (_rule: Rule, value: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if (value) {
            const { quantity } = formData.value.configuration.parameter;
            return checkProviderData[value] > Number(quantity) * 2
                ? reject('数据类型长度需 <= 寄存器数量 * 2')
                : resolve('');
        }
    });

const checkPointKey = (_rule: Rule, value: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if (value) {
            if (Number(oldPointKey) === Number(value)) return resolve('');
            const res = await _validateField(collectorId, {
                pointKey: value,
            });
            return res.result.passed ? resolve('') : reject(res.result.reason);
        }
    });

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const getProviderList = async () => {
    const res = await queryCodecProvider();
    providerList.value = res.result
        .filter((i) => i.id !== 'property')
        .map((item) => ({
            value: item.id,
            label: item.name,
        }));
};
getProviderList();

watch(
    () => formData.value.configuration.parameter.quantity,
    (value) => {
        formData.value.configuration.parameter.byteCount = Number(value) * 2;
    },
    { immediate: true, deep: true },
);
watch(
    () => props.data,
    (value) => {
        if (value.id && value.provider === 'MODBUS_TCP') {
            const _value = cloneDeep(value);
            const { writeByteCount, byteCount } =
                _value.configuration.parameter;
            formData.value = _value;
            if (!!_value.accessModes[0]?.value) {
                formData.value.accessModes = value.accessModes.map(
                    (i) => i.value,
                );
            }
            if (!!_value.features[0]?.value) {
                formData.value.features = value.features.map((i) => i.value);
            }
            formData.value.nspwc = !!writeByteCount || !!byteCount;
        }
    },
    { immediate: true, deep: true },
);
</script>

<style lang="less" scoped>
.form {
    .form-radio-button {
        width: 148px;
        height: 80px;
        padding: 0;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .form-upload-button {
        margin-top: 10px;
    }
    .form-submit {
        background-color: @primary-color !important;
    }
}
</style>
