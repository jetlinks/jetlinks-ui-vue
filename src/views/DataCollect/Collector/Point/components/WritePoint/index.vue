<template>
    <j-modal :title="$t('WritePoint.index.3217217-0')" :visible="true" width="500px" @cancel="handleCancel">
        <j-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
            ref="formRef"
        >
            <j-form-item
                :label="data.name"
                name="value"
                :rules="[
                    {
                        required: true,
                        message: $t('WritePoint.index.3217217-1', [data.name]),
                    },
                ]"
                v-if="
                    data.provider === 'MODBUS_TCP' &&
                    data?.configuration.function === 'Coils'
                "
            >
                <j-textarea
                    :placeholder="$t('WritePoint.index.3217217-2')"
                    v-model:value="formData.value"
                    :maxlength="200"
                    :rows="3"
                    showCount
                />
            </j-form-item>
            <j-form-item
                :label="data.name"
                name="value"
                :rules="[
                    {
                        required: true,
                        message: $t('WritePoint.index.3217217-1', [data.name]),
                    },
                    {
                        validator: validatorOpc_UA,
                        trigger: 'change',
                    },
                ]"
                v-else-if="data.provider === 'OPC_UA'"
            >
                <template v-for="(i, index) in formData.value">
                    <div style="margin-top: 10px">
                        <j-input-number
                            v-if="
                                [
                                    'double',
                                    'float',
                                    'llong',
                                    'long',
                                    'integer',
                                    'short',
                                ].includes(valueType)
                            "
                            style="width: 100%"
                            :placeholder="$t('WritePoint.index.3217217-2')"
                            v-model:value="formData.value[index]"
                        />
                        <j-select
                            v-else-if="['boolean'].includes(valueType)"
                            style="width: 100%"
                            v-model:value="formData.value[index]"
                            :options="[
                                {
                                    label: $t('WritePoint.index.3217217-3'),
                                    value: true,
                                },
                                {
                                    label: $t('WritePoint.index.3217217-4'),
                                    value: false,
                                },
                            ]"
                            :placeholder="$t('WritePoint.index.3217217-5')"
                            allowClear
                            show-search
                            :filter-option="filterOption"
                        />
                        <j-date-picker
                            v-else-if="['datetime'].includes(valueType)"
                            style="width: 100%"
                            format="YYYY-MM-DD HH:mm:ss"
                            show-time
                            :placeholder="$t('WritePoint.index.3217217-5')"
                            @change="(value: Dayjs, dateString: string)=>onChange(value,dateString,index)"
                        />

                        <j-input
                            v-else
                            :placeholder="$t('WritePoint.index.3217217-2')"
                            v-model:value="formData.value[index]"
                        />
                    </div>
                </template>
                <div style="margin-top: 10px">
                    <a-button @click="formData.value.push('')">+</a-button>
                    <a-button
                        v-if="formData.value.length !== 1"
                        @click="
                            formData.value.splice(formData.value.length - 1, 1)
                        "
                        >-</a-button
                    >
                </div>
            </j-form-item>
            <j-form-item
                :label="data.name"
                name="value"
                :rules="[
                    {
                        required: true,
                        message: $t('WritePoint.index.3217217-1', [data.name]),
                    },
                ]"
                v-else-if="data.provider === 'snap7'"
            >
                <j-input-number
                    v-if="s7Type.includes(data.configuration?.type)"
                    style="width: 100%"
                    :placeholder="$t('WritePoint.index.3217217-2')"
                    v-model:value="formData.value"
                />
                <j-select
                    v-else-if="['Bool'].includes(data.configuration?.type)"
                    style="width: 100%"
                    v-model:value="formData.value"
                    :options="[
                        {
                            label: $t('WritePoint.index.3217217-3'),
                            value: true,
                        },
                        {
                            label: $t('WritePoint.index.3217217-4'),
                            value: false,
                        },
                    ]"
                    :placeholder="$t('WritePoint.index.3217217-5')"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
                <j-input
                    v-else
                    :placeholder="$t('WritePoint.index.3217217-2')"
                    v-model:value="formData.value"
                />
            </j-form-item>
            <j-form-item
                :label="data.name"
                name="value"
                :rules="
                    ['hex'].includes(valueType)
                        ? [
                              {
                                  required: true,
                                  message: $t('WritePoint.index.3217217-1', [data.name]),
                              },
                              {
                                  validator: validateHex,
                                  trigger: 'blur',
                              },
                          ]
                        : [
                              {
                                  required: true,
                                  message: $t('WritePoint.index.3217217-1', [data.name]),
                              },
                          ]
                "
                v-else
            >
                <j-input-number
                    v-if="valueTypeArray.includes(valueType)"
                    style="width: 100%"
                    :placeholder="$t('WritePoint.index.3217217-2')"
                    v-model:value="formData.value"
                />
                <j-select
                    v-else-if="['boolean'].includes(valueType)"
                    style="width: 100%"
                    v-model:value="formData.value"
                    :options="[
                        {
                            label: $t('WritePoint.index.3217217-3'),
                            value: true,
                        },
                        {
                            label: $t('WritePoint.index.3217217-4'),
                            value: false,
                        },
                    ]"
                    :placeholder="$t('WritePoint.index.3217217-5')"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
                <j-date-picker
                    v-else-if="['datetime'].includes(valueType)"
                    style="width: 100%"
                    format="YYYY-MM-DD HH:mm:ss"
                    show-time
                    :placeholder="$t('WritePoint.index.3217217-5')"
                    @change="onChange"
                />

                <j-input
                    v-else
                    :placeholder="$t('WritePoint.index.3217217-2')"
                    v-model:value="formData.value"
                />
            </j-form-item>
            <j-form-item
                v-if="data?.provider === 'BACNetIp'"
                :rules="[
                    {
                        required: true,
                        message: $t('WritePoint.index.3217217-6'),
                    },
                ]"
                :name="['others', 'priority']"
            >
                <template #label>
                    <div>
                        <span>{{ $t('WritePoint.index.3217217-7') }}</span>
                        <a-tooltip>
                            <template #title
                                >{{ $t('WritePoint.index.3217217-8') }}
                                <br />
                                {{ $t('WritePoint.index.3217217-9') }}<br />
                                {{ $t('WritePoint.index.3217217-10') }}<br />
                                {{ $t('WritePoint.index.3217217-11') }}</template
                            >
                            <AIcon
                                type="QuestionCircleOutlined"
                                style="margin-left: 10px"
                            ></AIcon>
                        </a-tooltip>
                    </div>
                </template>
                <a-select v-model:value="formData.others.priority">
                    <a-select-option
                        v-for="(i, index) in priority"
                        :value="index + 1"
                    >
                        {{ index + 1 }}
                    </a-select-option>
                </a-select>
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="handleCancel">{{ $t('WritePoint.index.3217217-12') }}</j-button>
            <PermissionButton
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleOk"
                style="margin-left: 8px"
                :hasPermission="`DataCollect/Collector:update`"
            >
                {{ $t('WritePoint.index.3217217-13') }}
            </PermissionButton>
        </template>
    </j-modal>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import { writePoint } from '@/api/data-collect/collector';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const valueType: string = (
    props.data?.provider === 'OPC_UA'
        ? props?.data?.configuration?.type || 'String'
        : props.data?.configuration?.codec?.provider || 'int8'
).toLocaleLowerCase();

const valueTypeArray = [
    'int8',
    'int16',
    'int32',
    'ieee754_float',
    'ieee754_double',
    'number',
];

const s7Type = [
    'Byte',
    'Word',
    'DWord',
    'USInt',
    'SInt',
    'Int',
    'UDInt',
    'DInt',
    'Real',
    'LReal',
];

const emit = defineEmits(['change']);
const loading = ref(false);
const formRef = ref<FormInstance>();
const priority = new Array(16);
const formData = ref({
    value: props.data.provider === 'OPC_UA' ? [''] : '',
    others: {
        priority: 1,
    },
});

const validateHex = async (rule: any, value: any) => {
    return /^0[xX][0-9A-Fa-f]+$|^[0-9A-Fa-f]+$/.test(value)
        ? Promise.resolve()
        : Promise.reject($t('WritePoint.index.3217217-14'));
};

const validatorOpc_UA = async (rule: any, value: any) => {
    console.log(value);
    return value.length &&
        value.every((i) => {
            return i;
        })
        ? Promise.resolve()
        : Promise.reject($t('WritePoint.index.3217217-15', [props.data.name]));
};

const collectorId = props.data.collectorId;
const pointId: string = props.data.id;

const onChange = (value: Dayjs, dateString: string, index?: number) => {
    if (props.data.provider === 'OPC_UA') {
        formData.value.value[index] = dateString;
    } else {
        formData.value.value = dateString;
    }
};

const handleOk = async () => {
    const data:any = await formRef.value?.validate();
    // if (['hex'].includes(valueType)) {
    //     if (data?.value) {
    //         data.value = convertHexToDecimal(data?.value);
    //     }
    // }
    if (props.data.provider === 'OPC_UA') {
        data.value = data.value.length === 1 ?  data.value[0] : data.value
    }
    const params: any = {
        ...data,
        pointId,
    };
    loading.value = true;
    const response = await writePoint(collectorId, [params]).catch(() => {});
    emit('change', response?.status === 200);
    loading.value = false;
};

const handleCancel = () => {
    emit('change', false);
};

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const convertHexToDecimal = (value: any) => {
    // 去除可能存在的前缀（如0x）
    let hexString = value.replace(/^0x/i, '');
    // 将16进制字符串转换为10进制数值
    return parseInt(hexString, 16);
};
</script>

<style lang="less" scoped></style>
