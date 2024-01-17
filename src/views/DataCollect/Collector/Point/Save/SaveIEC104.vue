<template>
    <j-modal :title="data.id ? '编辑' : '新增'" visible @cancel="handleCancel">
        <j-form :model="formData" layout="vertical" ref="formRef">
            <j-form-item
                label="点位名称"
                name="name"
                :rules="rules.name"
            >
                <j-input
                    placeholder="请输入点位名称"
                    v-model:value="formData.name"
                    :maxlength="64"
                />
            </j-form-item>
            <j-form-item
                label="类型标识"
                :name="['configuration', 'typeIdentifierName']"
                :rules="rules.configuration.typeIdentifierName"
            >
                <j-select
                    v-model:value="formData.configuration.typeIdentifierName"
                    :options="dataTypeList"
                    placeholder="请选择类型标识"
                    allowClear
                    show-search
                />
            </j-form-item>
            <j-form-item
                label="地址"
                :name="['configuration', 'pointAddress']"
                :rules="rules.configuration.pointAddress"
            >
                <j-input
                    v-model:value="formData.configuration.pointAddress"
                    placeholder="请输入地址"
                    :min="1"
                    :max="65535"
                    :precision="0"
                />
            </j-form-item>
            <j-form-item
                label="访问类型"
                name="accessModes"
                :rules="rules.accessModes"
            >
                <j-card-select
                    multiple
                    :showImage="false"
                    v-model:value="formData.accessModes"
                    :options="[
                        { label: '读', value: 'read' },
                        { label: '写', value: 'write' },
                        { label: '订阅', value: 'subscribe' },
                    ]"
                    :column="3"
                />
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
                <DeathArea v-model:value="formData.configuration.terms" />
            </j-form-item>
            <j-form-item label="轮询任务" :name="['configuration', 'interval']" :rules="rules.configuration.interval">
                <p>
                    采集频率<span
                        style="
                            margin-left: 5px;
                            color: #9d9ea1;
                            font-size: 12px;
                        "
                        >采集频率为0时不执行轮询任务</span
                    >
                </p>
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入采集频率"
                    v-model:value="formData.configuration.interval"
                    addon-after="ms"
                    :max="2147483648"
                    :min="0"
                />
            </j-form-item>
            <j-form-item name="features">
                <j-checkbox-group v-model:value="formData.features">
                    <j-checkbox value="changedOnly"
                        >只推送变化的数据</j-checkbox
                    >
                </j-checkbox-group>
            </j-form-item>
            <j-form-item label="说明" name="description">
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
            <j-button @click="handleCancel">取消</j-button>
            <PermissionButton
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleOk"
                style="margin-left: 8px"
                :hasPermission="`DataCollect/Collector:${
                    data.id ? 'update' : 'add'
                }`"
            >
                确认
            </PermissionButton>
        </template>
    </j-modal>
</template>
<script setup lang="ts">
import {
    savePoint,
    updatePoint,
} from '@/api/data-collect/collector';
import { randomString } from '@/utils/utils';
import DeathArea from './DeathArea.vue';
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['change']);

const loading = ref(false);
const formRef = ref()
const dataTypeList = ref([
    { label: '单点开关量', value: 'onePointTelecontrol' },
    { label: '双点开关量', value: 'twoPointTelecontrol' },
    { label: '归一化值', value: 'prefabActivationOneParameter' },
]);
const formData = ref({
    name: props.data.name,
    configuration: props.data.configuration || {
        typeIdentifierName: undefined,
        pointAddress: '',
        interval: 3000,
    },
    accessModes: [],
    features: [],
    description: props.data.description || '',
});

const rules = {
    name: [
        {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
        },
    ],
    configuration: {
        typeIdentifierName: [
            {
                required: true,
                message: '请输入类型标识',
                trigger: 'change',
            },
        ],
        pointAddress: [
            {
                required: true,
                message: '请输入地址',
                trigger: 'blur',
            },
        ],
        interval: [
            {
                required: true,
                message: '请输入采集频率',
                trigger: 'change',
            },
        ],
    },
    accessModes: [
        {
            required: true,
            message: '请选择访问类型',
            trigger: 'change',
        },
    ],
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

const handleOk = async () => {
    const res: any = await formRef.value?.validate();

    const params = {
        ...res,
        configuration: {
            ...res.configuration,
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

onMounted(() => {
    formData.value.features = props.data.features?.map((item: any) => item.value)
    if (props.data.accessModes?.length !== 0) {
        formData.value.accessModes = props.data.accessModes?.map((item: any) => item.value)
    }
})
</script>
