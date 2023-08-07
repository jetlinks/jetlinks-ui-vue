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
                        { label: '02离散输入寄存器', value: 'DiscreteInputs' },
                        { label: '03保存寄存器', value: 'HoldingRegisters' },
                        { label: '04输入寄存器', value: 'InputRegisters' },
                    ]"
                    placeholder="请选择所功能码"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                    @change="changeFunction"
                />
            </j-form-item>
            <j-form-item
                label="地址"
                :name="['pointKey']"
                validateFirst
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
                    :max="999999"
                    :precision="0"
                />
            </j-form-item>
            <p style="color: #616161" v-if="formData.configuration.function">
                PLC地址: {{
                    InitAddress[formData.configuration.function] +
                        Number(formData.pointKey) || 0
                }}
            </p>
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
                    :precision="0"
                    @blur="changeQuantity"
                />
            </j-form-item>

            <j-form-item
                v-if="['HoldingRegisters', 'InputRegisters'].includes(formData.configuration.function)"
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
            <j-form-item
                label="小数保留位数"
                :name="['configuration', 'codec', 'configuration', 'scale']"
            >
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入小数保留位数"
                    :min="0"
                    :max="65535"
                    :precision="0"
                    v-model:value="
                        formData.configuration.codec.configuration.scale
                    "
                />
            </j-form-item>
            <j-form-item
                v-if="formData.configuration.function"
                label="访问类型"
                name="accessModes"
            >
                <j-card-select
                    multiple
                    :showImage="false"
                    v-model:value="formData.accessModes"
                    :options="
                        formData.configuration.function === 'InputRegisters' ||
                        formData.configuration.function === 'DiscreteInputs'
                            ? [{ label: '读', value: 'read' }]
                            : [
                                  { label: '读', value: 'read' },
                                  { label: '写', value: 'write' },
                              ]
                    "
                    :column="2"
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
                <j-switch
                    @change="changeNspwc"
                    v-model:checked="formData.nspwc"
                />
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
                <j-card-select
                    :showImage="false"
                    v-model:value="
                        formData.configuration.parameter.writeByteCount
                    "
                    :options="[
                        { label: '是', value: true },
                        { label: '否', value: false },
                    ]"
                    @change="changeWriteByteCount"
                    :column="2"
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
                :rules="[...ModBusRules.interval]"
            >
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入采集频率"
                    v-model:value="formData.configuration.interval"
                    addon-after="ms"
                    :max="2147483648"
                    :min="0"
                />
            </j-form-item>

            <j-form-item label="" :name="['features']">
                <j-checkbox-group v-model:value="formData.features">
                    <j-checkbox value="changedOnly" name="type"
                        >只推送变化的数据</j-checkbox
                    >
                </j-checkbox-group>
            </j-form-item>

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
import type { Rule } from 'ant-design-vue/lib/form';
import {cloneDeep, omit} from 'lodash-es';

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['change']);
const loading = ref(false);
const providerListAll: any = ref([]);
const providerList: any = ref([]);
const formRef = ref<FormInstance>();

const id = props.data.id;
const collectorId = props.data.collectorId;
const provider = props.data.provider;
const oldPointKey = props.data.pointKey;

const InitAddress = {
    Coils: 1,
    DiscreteInputs: 10001,
    HoldingRegisters: 40001,
    InputRegisters: 30001,
};

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
                scale: undefined,
            },
        },
    },
    pointKey: undefined,
    accessModes: [],
    nspwc: false,
    features: [],
    description: '',
});

const handleOk = async () => {
    const data = await formRef.value?.validate();
    delete data?.nspwc;
    const { codec } = data?.configuration;

    if (!['HoldingRegisters', 'InputRegisters'].includes(data?.configuration.function)) {
        codec.provider = 'int8';
    }
    const { interval } = formData.value.configuration;
    const params = {
        ...props.data,
        ...data,
        provider,
        collectorId,
        interval,
    };

    // address是多余字段，但是react版本上使用到了这个字段
    params.configuration.parameter = {
      ...params.configuration.parameter,
      address: data?.pointKey,
    };

    if (props.data.provider === 'COLLECTOR_GATEWAY') {
      const configuration = cloneDeep(params.configuration)
      params.configuration = {
        configuration: configuration,
        interval: params.interval
      }
    }

    loading.value = true;
    const response = !id
        ? await savePointBatch(params).catch(() => {})
        : await updatePoint(id, { ...props.data, ...params }).catch(() => {});
    emit('change', response?.status === 200);
    loading.value = false;
};

const handleCancel = () => {
    emit('change', false);
};

const changeQuantity = () => {
    const { configuration, nspwc } = formData.value;
    if (configuration.function === 'HoldingRegisters') {
        formRef.value?.validate();
    }
    if (nspwc) {
        configuration.parameter.byteCount =
            Number(configuration.parameter.quantity) * 2;
    }
};
const changeNspwc = (value: boolean) => {
    const { configuration } = formData.value;
    if (value) {
        configuration.parameter.byteCount =
            Number(configuration.parameter.quantity || 0) * 2;
    }
};
const changeWriteByteCount = (value: Array<string>) => {
    formData.value.configuration.parameter.writeByteCount = value[0];
};
const changeFunction = (value: string) => {
    formData.value.accessModes = ['InputRegisters', 'DiscreteInputs'].includes(value) ? ['read'] : ['read', 'write'];
};

const checkProvider = (_rule: Rule, value: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if (value) {
            const { quantity } = formData.value.configuration.parameter;
            return checkProviderData[value] > Number(quantity) * 2
                ? reject('数据类型长度需 <= 寄存器数量 * 2')
                : resolve('');
        } else {
            return reject('');
        }
    });

const checkPointKey = (_rule: Rule, value: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if (value || Number(value) === 0) {
            if (Number(oldPointKey) === Number(value)) return resolve('');
            if (typeof value === 'object') return resolve('');
            const res: any = await _validateField(collectorId, {
                pointKey: value,
            });
            return res.result?.passed ? resolve('') : reject(res.result.reason);
        } else {
            return reject('请输入地址');
        }
    });

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const getProviderList = async () => {
    const res: any = await queryCodecProvider();
    providerListAll.value = res.result
        .filter((i: any) => i.id !== 'property' && i.id !== 'bool')
        .map((item: any) => ({
            value: item.id,
            label: item.name,
        }));
    setProviderList(formData.value.configuration.function);
};
getProviderList();

const setProviderList = (value: string | undefined) => {
    providerList.value = providerListAll.value;
};

watch(
    () => formData.value.configuration.function,
    (value) => {
        setProviderList(value);
    },
    { immediate: true, deep: true },
);
watch(
    () => props.data,
    (value) => {
        if (value.id && ['MODBUS_TCP', 'COLLECTOR_GATEWAY'].includes(value.provider)) {
            const _value: any = cloneDeep(value);
            const { writeByteCount, byteCount } =
            props.data.provider === 'COLLECTOR_GATEWAY' ? _value.configuration.configuration.parameter: _value.configuration.parameter;

          if (props.data.provider === 'COLLECTOR_GATEWAY') {
            formData.value = {
              ...omit(_value, ['configuration']),
              ..._value.configuration,
            }
          } else {
            formData.value = _value;
          }

          if (!!_value.accessModes[0]?.value) {
            formData.value.accessModes = value.accessModes.map(
                (i: any) => i.value,
            );
          }
          if (!!_value.features[0]?.value) {
            formData.value.features = value.features.map(
                (i: any) => i.value,
            );
          }
          formData.value.nspwc = !!writeByteCount || !!byteCount;
        }
    },
    { immediate: true, deep: true },
);
</script>

<style lang="less" scoped></style>
