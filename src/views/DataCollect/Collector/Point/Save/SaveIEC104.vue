<template>
    <j-modal :title="data.id ? $t('Save.SaveIEC104.3217215-0') : $t('Save.SaveIEC104.3217215-1')" visible @cancel="handleCancel">
        <j-form :model="formData" layout="vertical" ref="formRef">
            <j-form-item
                :label="$t('Save.SaveIEC104.3217215-2')"
                name="name"
                :rules="rules.name"
            >
                <j-input
                    :placeholder="$t('Save.SaveIEC104.3217215-3')"
                    v-model:value="formData.name"
                    :maxlength="64"
                />
            </j-form-item>
            <j-form-item
                :label="$t('Save.SaveIEC104.3217215-4')"
                :name="['configuration', 'typeIdentifierName']"
                :rules="rules.configuration.typeIdentifierName"
            >
                <j-select
                    v-model:value="formData.configuration.typeIdentifierName"
                    :options="dataTypeList"
                    :placeholder="$t('Save.SaveIEC104.3217215-5')"
                    allowClear
                    show-search
                />
            </j-form-item>
            <j-form-item
                :label="$t('Save.SaveIEC104.3217215-6')"
                :name="['configuration', 'pointAddress']"
                :rules="rules.configuration.pointAddress"
            >
                <j-input
                    v-model:value="formData.configuration.pointAddress"
                    :placeholder="$t('Save.SaveIEC104.3217215-7')"
                    :min="1"
                    :max="65535"
                    :precision="0"
                />
            </j-form-item>
            <j-form-item
                :label="$t('Save.SaveIEC104.3217215-8')"
                name="accessModes"
                :rules="rules.accessModes"
            >
                <j-card-select
                    multiple
                    :showImage="false"
                    v-model:value="formData.accessModes"
                    :options="[
                        { label: $t('Save.SaveIEC104.3217215-9'), value: 'read' },
                        { label: $t('Save.SaveIEC104.3217215-10'), value: 'write' },
                        { label: $t('Save.SaveIEC104.3217215-11'), value: 'subscribe' },
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
                        <span>{{ $t('Save.SaveIEC104.3217215-12') }}</span><span class="explain">{{ $t('Save.SaveIEC104.3217215-13') }}</span>
                    </j-space>
                </template>
                <DeathArea v-model:value="formData.configuration.terms" />
            </j-form-item>
            <j-form-item :label="$t('Save.SaveIEC104.3217215-14')" :name="['configuration', 'interval']" :rules="rules.configuration.interval">
                <p>
                    {{ $t('Save.SaveIEC104.3217215-15') }}<span
                        style="
                            margin-left: 5px;
                            color: #9d9ea1;
                            font-size: 12px;
                        "
                        >{{ $t('Save.SaveIEC104.3217215-16') }}</span
                    >
                </p>
                <j-input-number
                    style="width: 100%"
                    :placeholder="$t('Save.SaveIEC104.3217215-17')"
                    v-model:value="formData.configuration.interval"
                    addon-after="ms"
                    :max="2147483648"
                    :min="0"
                />
            </j-form-item>
            <j-form-item name="features">
                <j-checkbox-group v-model:value="formData.features">
                    <j-checkbox value="changedOnly"
                        >{{ $t('Save.SaveIEC104.3217215-18') }}</j-checkbox
                    >
                </j-checkbox-group>
            </j-form-item>
            <j-form-item :label="$t('Save.SaveIEC104.3217215-19')" name="description">
                <j-textarea
                    :placeholder="$t('Save.SaveIEC104.3217215-20')"
                    v-model:value="formData.description"
                    :maxlength="200"
                    :rows="3"
                    showCount
                />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button @click="handleCancel">{{ $t('Save.SaveIEC104.3217215-21') }}</j-button>
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
                {{ $t('Save.SaveIEC104.3217215-22') }}
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
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
    { label: $t('Save.SaveIEC104.3217215-23'), value: 'onePointTelecontrol' },
    { label: $t('Save.SaveIEC104.3217215-24'), value: 'twoPointTelecontrol' },
    { label: $t('Save.SaveIEC104.3217215-25'), value: 'prefabActivationOneParameter' },
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
            message: $t('Save.SaveIEC104.3217215-26'),
            trigger: 'blur',
        },
    ],
    configuration: {
        typeIdentifierName: [
            {
                required: true,
                message: $t('Save.SaveIEC104.3217215-27'),
                trigger: 'change',
            },
        ],
        pointAddress: [
            {
                required: true,
                message: $t('Save.SaveIEC104.3217215-7'),
                trigger: 'blur',
            },
        ],
        interval: [
            {
                required: true,
                message: $t('Save.SaveIEC104.3217215-17'),
                trigger: 'change',
            },
        ],
    },
    accessModes: [
        {
            required: true,
            message: $t('Save.SaveIEC104.3217215-28'),
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
            return value[0].value && value[0].termType ? resolve('') : reject($t('Save.SaveIEC104.3217215-29'));
        } else {
            if (value?.[0].column === 'currentValue') {
                // value.forEach((item:any) => {
                //     if(item.termType && item.value){
                //        return resolve('')
                //     }else{
                //         return reject($t('Save.SaveIEC104.3217215-29'))
                //     }
                // });
                const pass = value.every((item: any) => item.termType && item.value)
                return pass ? resolve('') : reject($t('Save.SaveIEC104.3217215-29'))
            } else {
                value.forEach((item: any) => {
                    if (item.column === `this['currentValue'] - this['lastValue']*init/100`) {
                        return reject($t('Save.SaveIEC104.3217215-29'))
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
