<template>
    <j-modal :title="data.id ? $t('Save.SaveS7.3217213-0') : $t('Save.SaveS7.3217213-1')" :visible="true" width="700px" @cancel="handleCancel">
        <j-form :model="form" layout="vertical" ref="formRef">
            <j-form-item :label="$t('Save.SaveS7.3217213-2')" name="name">
                <j-input :placeholder="$t('Save.SaveS7.3217213-3')" v-model:value="form.name" />
            </j-form-item>
            <j-form-item :label="$t('Save.SaveS7.3217213-4')" :name="['configuration', 'daveArea']" :rules="{
                required: true,
                message: $t('Save.SaveS7.3217213-5'),
                trigger: 'change',
            }">
                <j-select v-model:value="form.configuration.daveArea" show-search :placeholder="$t('Save.SaveS7.3217213-5')"
                    @change="daveAreaChange">
                    <j-select-option v-for="item in dataAreaFilterList" :key="item.id" :value="item.id">{{
                        item.name }}</j-select-option>
                </j-select>
            </j-form-item>
            <j-form-item :label="$t('Save.SaveS7.3217213-6')" :name="['configuration', 'areaNumber']" v-show="form.configuration.daveArea == 'DB'"
                :rules="{
                    required: true,
                    message: $t('Save.SaveS7.3217213-7'),
                    trigger: 'blur',
                }">
                <j-input-number v-model:value="form.configuration.areaNumber" :maxlength="64" style="width: 100%"
                    :max="65535" autocomplete="off" :disabled="form.configuration.daveArea == 'DB' && deviceType == 'S200'"
                    :placeholder="$t('Save.SaveS7.3217213-7')" />
            </j-form-item>
            <j-form-item :label="$t('Save.SaveS7.3217213-8')" :name="['configuration', 'type']" :rules="{
                required: true,
                message: $t('Save.SaveS7.3217213-9'),
                trigger: 'change',
            }">
                <j-select v-model:value="form.configuration.type" show-search :placeholder="$t('Save.SaveS7.3217213-9')"
                    @change="chooseS7DataType">
                    <j-select-option v-for="item in dataTypesList" :key="item.id" :value="item.id">{{
                        item.name }}</j-select-option>
                </j-select>
            </j-form-item>

            <j-form-item v-if="!disabled" :label="$t('Save.SaveS7.3217213-10')" :name="['configuration', 'bytes']" :rules="{
                required: true,
                message: $t('Save.SaveS7.3217213-11'),
                trigger: 'blur',
            }">
                <j-input-number type="number" style="width: 100%" :addon-after="$t('Save.SaveS7.3217213-12')" v-model:value="form.configuration.bytes"
                    :placeholder="$t('Save.SaveS7.3217213-13')" :precision="0" :controls="false" :disabled="disabled" :max="65535" :min="0" />
            </j-form-item>

            <j-form-item v-if="form.configuration.type == 'Bool'" :label="$t('Save.SaveS7.3217213-14')" :name="['configuration', 'bits']"
                :rules="{
                    required: true,
                    message: $t('Save.SaveS7.3217213-15'),
                    trigger: 'blur',
                }">
                <j-input-number type="number" style="width: 100%" :addon-after="$t('Save.SaveS7.3217213-16')" v-model:value="form.configuration.bits"
                    :placeholder="$t('Save.SaveS7.3217213-17')" :precision="0" :min="0" :max="7" :controls="false" :maxlength="2" />
            </j-form-item>

            <j-form-item :label="$t('Save.SaveS7.3217213-18')" :name="['configuration', 'offset']" :rules="{
                required: true,
                message: $t('Save.SaveS7.3217213-11'),
                trigger: 'blur',
            }">
                <j-input-number type="number" style="width: 100%" v-model:value="form.configuration.offset"
                    :placeholder="$t('Save.SaveS7.3217213-19')" :precision="0" :min="0" :max="65535" :controls="false" :maxlength="64" />
            </j-form-item>
            <j-form-item :label="$t('Save.SaveS7.3217213-20')" :name="['configuration', 'scaleFactor']">
                <j-input-number type="number" style="width: 100%" v-model:value="form.configuration.scaleFactor"
                    :placeholder="$t('Save.SaveS7.3217213-20')" :min="0" :max="65535" :controls="false" :maxlength="64" />
            </j-form-item>
            <j-form-item :label="$t('Save.SaveS7.3217213-21')" :name="['configuration', 'scale']">
                <j-input-number type="number" style="width: 100%" v-model:value="form.configuration.scale"
                    :placeholder="$t('Save.SaveS7.3217213-20')" :precision="0" :min="1" :max="65535" :controls="false" :maxlength="64" />
            </j-form-item>
            <j-form-item :label="$t('Save.SaveS7.3217213-22')" name="accessModes" :rules="{
                required: true,
                message: $t('Save.SaveS7.3217213-23'),
            }">
                <j-card-select multiple :showImage="false" v-model:value="form.accessModes" :options="[
                    { label: $t('Save.SaveS7.3217213-24'), value: 'read' },
                    { label: $t('Save.SaveS7.3217213-25'), value: 'write' },
                ]
                    " :column="2" />
            </j-form-item>
            <j-form-item :name="['configuration', 'terms']" :rules="[{
                validator: Area,
                trigger: 'change',
            }]">
                <template #label>
                    <j-space>
                        <span>{{ $t('Save.SaveS7.3217213-26') }}</span><span class="explain">{{ $t('Save.SaveS7.3217213-27') }}</span>
                    </j-space>
                </template>
                <DeathArea v-model:value="form.configuration.terms" />
            </j-form-item>
            <j-form-item :label="$t('Save.SaveS7.3217213-28')" :name="['configuration', 'interval']">
                <p>
                    {{ $t('Save.SaveS7.3217213-29') }}<span style="margin-left: 5px; color: #9d9ea1; font-size: 12px">{{ $t('Save.SaveS7.3217213-30') }}</span>
                </p>
                <j-input-number
                    style="width: 100%"
                    :placeholder="$t('Save.SaveS7.3217213-31')"
                    v-model:value="form.configuration.interval"
                    addon-after="ms"
                    :max="2147483648"
                    :min="0"
                />
            </j-form-item>
            <j-form-item name="features">
                <j-checkbox-group v-model:value="form.features">
                    <j-checkbox value="changedOnly">{{ $t('Save.SaveS7.3217213-32') }}</j-checkbox>
                </j-checkbox-group>
            </j-form-item>
            <j-form-item :label="$t('Save.SaveS7.3217213-33')" name="description">
                <j-textarea :placeholder="$t('Save.SaveS7.3217213-34')" v-model:value="form.description" :maxlength="200" :rows="3" showCount />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="handleCancel">{{ $t('Save.SaveS7.3217213-35') }}</j-button>
            <PermissionButton key="submit" type="primary" :loading="loading" @click="handleOk" style="margin-left: 8px"
                :hasPermission="`DataCollect/Collector:${data.id ? 'update' : 'add'}`">
                {{ $t('Save.SaveS7.3217213-36') }}
            </PermissionButton>
        </template>
    </j-modal>
</template>
<script lang="ts" setup>
import {
    savePoint,
    updatePoint,
    _validateField,
    getArea,
    getSnapTypes
} from '@/api/data-collect/collector';
import type { FormInstance } from 'ant-design-vue';
import DeathArea from './DeathArea.vue';
import { randomString } from '@/utils/utils';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
    data: {
        type: Object,
        default: () => { },
    }
});

const dataAreaFilter = {
    S200: [
        'RELAY',
        'HIGH_SPEED',
        'SYSTEM_FLAGS',
        'ANALOG_INPUTS',
        'ANALOG_OUTPUTS',
        'I',
        'Q',
        'M',
        'IEC_COUNTERS',
        'IEC_TIMERS',
    ],
    S1200: ['I', 'Q', 'M', 'DB'],
    S1500: ['I', 'Q', 'M', 'DB'],
    S300: ['I', 'Q', 'M', 'DB', 'C', 'T'],
    S400: ['I', 'Q', 'M', 'DB', 'C', 'T'],
};
const emit = defineEmits(['change']);
const loading = ref(false);
const formRef = ref<FormInstance>();
const deviceType = ref<string>(props. data.deviceType);
const dataTypesList = ref<any[]>([]);
const daveAreaList = ref<any>([]);



const form = ref<any>({
    name: props.data.name || '',
    configuration: props.data.configuration || {
        type: undefined,
        interval: 3000,
        areaNumber: undefined,
        bytes: undefined,
        terms: []
    },
    accessModes: [],
    features: [],
    description: props.data.description || '',
    // inheritBreaker: true,
    // pointKey: randomString(9)
});


/**选择S7点位数据类型 */
const disabled = ref(true);
const chooseS7DataType = (val: string) => {
    const result: any = dataTypesList.value.find((item: any) => item.id == val);
    form.value.configuration.bytes = result.length;
    disabled.value = result.length != 0;
};

const daveAreaChange = (val: string) => {
    if (val === 'DB') {
        form.value.configuration.areaNumber = 1;
    } else {
        form.value.configuration.areaNumber = 0;
    }
}

/**
 * 获取地区信息
 */
const getAreaList = async () => {
    const res = await getArea();
    if (res.success) {
        daveAreaList.value = res.result;
    }
};
getAreaList();

/**
 * 获取数据类型
 */
const getTypes = async () => {
    const res: any = await getSnapTypes();
    dataTypesList.value = res.result;
};
getTypes();

const dataAreaFilterList = computed(() => {
    let result = daveAreaList.value.filter((item: any) =>
        dataAreaFilter[deviceType.value]?.includes(item.id),
    );
    if (deviceType.value == 'S200') {
        result.push({
            id: 'DB',
            name: $t('Save.SaveS7.3217213-37'),
            address: '',
        });
    }
    return result;
});

const handleOk = async () => {
    const res: any = await formRef.value?.validate();

    const params = {
        ...res,
        configuration: {
            ...res.configuration,
            bytes: res.configuration.bytes || form.value.configuration.bytes
        },
        inheritBreaker: true,
        pointKey: props.data.pointKey || randomString(9),
        provider: props.data.provider,
        collectorId: props.data.collectorId,
        accessModes: res?.accessModes.filter((item: any) => item)
    }
    loading.value = true;
    const response = !props.data.id
        ? await savePoint(params).catch(() => { })
        : await updatePoint(props.data.id, { ...props.data, ...params }).catch(() => { });
    emit('change', response?.status === 200);
    loading.value = false;
};

const handleCancel = () => {
    emit('change', false);
};

const Area = (_: any, value: any): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if (!value) {
            return resolve('')
        }
        if (value?.length === 0) {
            return resolve('')
        } else if (value?.length === 1) {
            return value[0].value && value[0].termType ? resolve('') : reject($t('Save.SaveS7.3217213-38'));
        } else {
            if (value?.[0].column === 'currentValue') {
                // value.forEach((item:any) => {
                //     if(item.termType && item.value){
                //        return resolve('')
                //     }else{
                //         return reject($t('Save.SaveS7.3217213-38'))
                //     }
                // });
                const pass = value.every((item: any) => item.termType && item.value)
                return pass ? resolve('') : reject($t('Save.SaveS7.3217213-38'))
            } else {
                value.forEach((item: any) => {
                    if (item.column === `this['currentValue'] - this['lastValue']*init/100`) {
                        return reject($t('Save.SaveS7.3217213-38'))
                    } else {
                        return resolve('')
                    }
                });
            }

        }
    });

onMounted(() => {
    form.value.features = props.data.features?.map((item: any) => item.value)
    form.value.configuration.bytes = props.data.configuration?.bytes
    if (props.data.accessModes?.length !== 0) {
        form.value.accessModes = props.data.accessModes?.map((item: any) => item.value)
    }
    console.log(props.data.configuration, 123)
})


watch(
    () => dataTypesList.value,
    (val: any[]) => {
        if (val) {
            const result: any = dataTypesList.value.find(
                (item: any) => item.id == form.value.configuration.type,
            );
            if (result) {
                // console.log('result',result)
                disabled.value = (result && result.length !== 0);
            }
        }
    },
);

watch(
    () => form.value.configuration.type,
    (val) => {
        if (val !== 'Bool') {
            form.value.configuration.bits = 0;
        }
    },
    { deep: true },
);

</script>

<style lang="less" scoped>
.explain {
    color: #adadad;
    font-size: 12px;
}
</style>
