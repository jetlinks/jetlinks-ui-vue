<template >
    <j-modal :title="data.id ? '编辑' : '新增'" :visible="true" width="700px" @cancel="handleCancel">
        <j-form :model="form" layout="vertical" ref="formRef">
            <j-form-item label="点位名称" name="name">
                <j-input placeholder="请输入点位名称" v-model:value="form.name" />
            </j-form-item>
            <j-form-item label="地址区域" :name="['configuration', 'daveArea']" :rules="{
                required: true,
                message: '请选择地址区域',
                trigger: 'change',
            }">
                <j-select v-model:value="form.configuration.daveArea" show-search placeholder="请选择地址区域"
                    @change="daveAreaChange">
                    <j-select-option v-for="item in dataAreaFilterList" :key="item.id" :value="item.id">{{
                        item.name }}</j-select-option>
                </j-select>
            </j-form-item>
            <j-form-item label="地址编号" :name="['configuration', 'areaNumber']" v-show="form.configuration.daveArea == 'DB'"
                :rules="{
                    required: true,
                    message: '请输入地址编号',
                    trigger: 'blur',
                }">
                <j-input-number v-model:value="form.configuration.areaNumber" :maxlength="64" style="width: 100%"
                    :max="65535" autocomplete="off" :disabled="form.configuration.daveArea == 'DB' && deviceType == 'S200'"
                    placeholder="请输入地址编号" />
            </j-form-item>
            <j-form-item label="数据类型" :name="['configuration', 'type']" :rules="{
                required: true,
                message: '请选择数据类型',
                trigger: 'change',
            }">
                <j-select v-model:value="form.configuration.type" show-search placeholder="请选择数据类型"
                    @change="chooseS7DataType">
                    <j-select-option v-for="item in dataTypesList" :key="item.id" :value="item.id">{{
                        item.name }}</j-select-option>
                </j-select>
            </j-form-item>

            <j-form-item v-if="!disabled" label="字符串长度（byte）" :name="['configuration', 'bytes']" :rules="{
                required: true,
                message: '请输入0~65535之间的正整数',
                trigger: 'blur',
            }">
                <j-input-number type="number" style="width: 100%" addon-after="字节" v-model:value="form.configuration.bytes"
                    placeholder="请输入字符串长度" :precision="0" :controls="false" :maxlength="64" :disabled="disabled" />
            </j-form-item>

            <j-form-item v-if="form.configuration.type == 'Bool'" label="位偏移量（bit）" :name="['configuration', 'bits']"
                :rules="{
                    required: true,
                    message: '请输入0~7之间的正整数',
                    trigger: 'blur',
                }">
                <j-input-number type="number" style="width: 100%" addon-after="位" v-model:value="form.configuration.bits"
                    placeholder="请输入位偏移量" :precision="0" :min="0" :max="7" :controls="false" :maxlength="2" />
            </j-form-item>

            <j-form-item label="偏移量" :name="['configuration', 'offset']" :rules="{
                required: true,
                message: '请输入0~65535之间的正整数',
                trigger: 'blur',
            }">
                <j-input-number type="number" style="width: 100%" v-model:value="form.configuration.offset"
                    placeholder="请输入偏移量" :precision="0" :min="0" :max="65535" :controls="false" :maxlength="64" />
            </j-form-item>
            <j-form-item label="缩放因子" :name="['configuration', 'scaleFactor']">
                <j-input-number type="number" style="width: 100%" v-model:value="form.configuration.scaleFactor"
                    placeholder="缩放因子" :min="0" :max="65535" :controls="false" :maxlength="64" />
            </j-form-item>
            <j-form-item label="小数保留位数" :name="['configuration', 'scale']">
                <j-input-number type="number" style="width: 100%" v-model:value="form.configuration.scale"
                    placeholder="缩放因子" :precision="0" :min="1" :max="65535" :controls="false" :maxlength="64" />
            </j-form-item>
            <j-form-item label="访问类型" name="accessModes" :rules="{
                required: true,
                message: '请选择访问类型',
            }">
                <j-card-select multiple :showImage="false" v-model:value="form.accessModes" :options="[
                    { label: '读', value: 'read' },
                    { label: '写', value: 'write' },
                ]
                    " :column="2" />
            </j-form-item>
            <j-form-item :name="['configuration', 'terms']" :rules="[{
                validator: Area,
                trigger: 'change',
            }]">
                <template #label>
                    <j-space>
                        <span>点位死区</span><span class="explain">点位死区范围内的异常数据将被过滤（请勿配置非数值类型）</span>
                    </j-space>
                </template>
                <DeathArea v-model:value="form.configuration.terms" />
            </j-form-item>
            <j-form-item label="轮询任务" :name="['configuration', 'interval']">
                <p>
                    采集频率<span style="margin-left: 5px; color: #9d9ea1; font-size: 12px">采集频率为0时不执行轮询任务</span>
                </p>
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入采集频率"
                    v-model:value="form.configuration.interval"
                    addon-after="ms"
                    :max="2147483648"
                    :min="0"
                />
            </j-form-item>
            <j-form-item name="features">
                <j-checkbox-group v-model:value="form.features">
                    <j-checkbox value="changedOnly">只推送变化的数据</j-checkbox>
                </j-checkbox-group>
            </j-form-item>
            <j-form-item label="说明" name="description">
                <j-textarea placeholder="请输入说明" v-model:value="form.description" :maxlength="200" :rows="3" showCount />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="handleCancel">取消</j-button>
            <PermissionButton key="submit" type="primary" :loading="loading" @click="handleOk" style="margin-left: 8px"
                :hasPermission="`DataCollect/Collector:${data.id ? 'update' : 'add'}`">
                确认
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
            name: '变量存储区（V）',
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
            return value[0].value && value[0].termType ? resolve('') : reject('请配置点位死区');
        } else {
            if (value?.[0].column === 'currentValue') {
                // value.forEach((item:any) => {
                //     if(item.termType && item.value){
                //        return resolve('')
                //     }else{
                //         return reject('请配置点位死区')
                //     }
                // });
                const pass = value.every((item: any) => item.termType && item.value)
                return pass ? resolve('') : reject('请配置点位死区')
            } else {
                value.forEach((item: any) => {
                    if (item.column === `this['currentValue'] - this['lastValue']*init/100`) {
                        return reject('请配置点位死区')
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
