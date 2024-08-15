<template>
    <j-modal :title="data.id ? $t('Save.SaveBACNet.3217216-0') : $t('Save.SaveBACNet.3217216-1')" visible @cancel="handleCancel">
        <j-form :model="formData" layout="vertical" ref="formRef">
            <j-form-item :label="$t('Save.SaveBACNet.3217216-2')" name="name" :rules="rules.name">
                <j-input
                    :placeholder="$t('Save.SaveBACNet.3217216-3')"
                    v-model:value="formData.name"
                    :maxlength="64"
                />
            </j-form-item>
            <j-form-item :label="$t('Save.SaveBACNet.3217216-4')" :name="['configuration', 'ObjectId']">
                <j-card>
                    <j-form-item :label="$t('Save.SaveBACNet.3217216-5')">
                        <j-input
                            v-model:value="formData.configuration.objectId.type"
                            disabled
                        ></j-input>
                    </j-form-item>
                    <j-form-item :label="$t('Save.SaveBACNet.3217216-6')">
                        <j-input
                            v-model:value="
                                formData.configuration.objectId.instanceNumber
                            "
                            disabled
                        ></j-input>
                    </j-form-item>
                </j-card>
            </j-form-item>
            <j-form-item
                :label="$t('Save.SaveBACNet.3217216-7')"
                :name="['configuration', 'propertyId']"
                :rules="rules.configuration.pointAddress"
            >
                <j-input
                    v-model:value="formData.configuration.propertyId"
                    disabled
                ></j-input>
            </j-form-item>
            <j-form-item :label="$t('Save.SaveBACNet.3217216-8')" :name="['configuration', 'valueType']">
                <j-select v-model:value="formData.configuration.valueType">
                    <j-select-option
                        v-for="item in bacnetValueType"
                        :key="item"
                        :value="item"
                        >{{ item }}</j-select-option
                    >
                </j-select>
            </j-form-item>
            <j-form-item
                :label="$t('Save.SaveBACNet.3217216-9')"
                name="accessModes"
                :rules="rules.accessModes"
            >
                <j-card-select
                    multiple
                    :showImage="false"
                    v-model:value="formData.accessModes"
                    :options="[
                        { label: $t('Save.SaveBACNet.3217216-10'), value: 'read' },
                        { label: $t('Save.SaveBACNet.3217216-11'), value: 'write' },
                        { label: $t('Save.SaveBACNet.3217216-12'), value: 'subscribe' },
                    ]"
                    :column="3"
                />
            </j-form-item>
            <j-form-item
                :name="['configuration', 'terms']"
                :rules="[
                    {
                        validator: Area,
                        trigger: 'change',
                    },
                ]"
            >
                <template #label>
                    <j-space>
                        <span>{{ $t('Save.SaveBACNet.3217216-13') }}</span
                        ><span class="explain"
                            >{{ $t('Save.SaveBACNet.3217216-14') }}</span
                        >
                    </j-space>
                </template>
                <DeathArea v-model:value="formData.configuration.terms" />
            </j-form-item>
            <j-form-item
                :label="$t('Save.SaveBACNet.3217216-15')"
                :name="['configuration', 'interval']"
                :rules="rules.configuration.interval"
            >
                <p>
                    {{ $t('Save.SaveBACNet.3217216-16') }}<span
                        style="
                            margin-left: 5px;
                            color: #9d9ea1;
                            font-size: 12px;
                        "
                        >{{ $t('Save.SaveBACNet.3217216-17') }}</span
                    >
                </p>
                <j-input-number
                    style="width: 100%"
                    :placeholder="$t('Save.SaveBACNet.3217216-18')"
                    v-model:value="formData.configuration.interval"
                    addon-after="ms"
                    :max="2147483648"
                    :min="0"
                />
            </j-form-item>
            <j-form-item name="features">
                <j-checkbox-group v-model:value="formData.features">
                    <j-checkbox value="changedOnly"
                        >{{ $t('Save.SaveBACNet.3217216-19') }}</j-checkbox
                    >
                </j-checkbox-group>
            </j-form-item>
            <j-form-item :label="$t('Save.SaveBACNet.3217216-20')" name="description">
                <j-textarea
                    :placeholder="$t('Save.SaveBACNet.3217216-21')"
                    v-model:value="formData.description"
                    :maxlength="200"
                    :rows="3"
                    showCount
                />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button @click="handleCancel">{{ $t('Save.SaveBACNet.3217216-22') }}</j-button>
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
                {{ $t('Save.SaveBACNet.3217216-23') }}
            </PermissionButton>
        </template>
    </j-modal>
</template>
<script setup lang="ts">
import {
    savePoint,
    updatePoint,
    getBacnetValueType,
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
const formRef = ref();
const formData = ref({
    name: props.data.name,
    configuration: props.data.configuration || {
        valueType: undefined,
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
            message: $t('Save.SaveBACNet.3217216-24'),
            trigger: 'blur',
        },
    ],
    configuration: {
        typeIdentifierName: [
            {
                required: true,
                message: $t('Save.SaveBACNet.3217216-25'),
                trigger: 'change',
            },
        ],
        pointAddress: [
            {
                required: true,
                message: $t('Save.SaveBACNet.3217216-26'),
                trigger: 'blur',
            },
        ],
        interval: [
            {
                required: true,
                message: $t('Save.SaveBACNet.3217216-18'),
                trigger: 'change',
            },
        ],
    },
    accessModes: [
        {
            required: true,
            message: $t('Save.SaveBACNet.3217216-27'),
            trigger: 'change',
        },
    ],
};

const Area = (_: any, value: any): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if (!value) {
            return resolve('');
        }
        if (value?.length === 0) {
            return resolve('');
        } else if (value?.length === 1) {
            return value[0].value && value[0].termType
                ? resolve('')
                : reject($t('Save.SaveBACNet.3217216-28'));
        } else {
            if (value?.[0].column === 'currentValue') {
                // value.forEach((item:any) => {
                //     if(item.termType && item.value){
                //        return resolve('')
                //     }else{
                //         return reject($t('Save.SaveBACNet.3217216-28'))
                //     }
                // });
                const pass = value.every(
                    (item: any) => item.termType && item.value,
                );
                return pass ? resolve('') : reject($t('Save.SaveBACNet.3217216-28'));
            } else {
                const validate = value.find((item: any) => {
                    item.column ===
                        `this['currentValue'] - this['lastValue']*init/100`;
                });
                return validate ? reject($t('Save.SaveBACNet.3217216-28')) : resolve('');
            }
        }
    });
const bacnetValueType = ref<string[]>([]);

const getIdAndType = async () => {
    //   const res = await getBacnetPropertyId()
    //   if(res.success) {
    //     bacnetPropertyId.value = res.result
    //   }
    const resp: any = await getBacnetValueType();
    if (resp.success) {
        bacnetValueType.value = resp.result;
    }
};

getIdAndType();
const handleOk = async () => {
    const res: any = await formRef.value?.validate();

    const params = {
        ...res,
        configuration: {
            ...res.configuration,
            objectId: props.data.configuration?.objectId,
        },
        inheritBreaker: true,
        pointKey: props.data.pointKey || randomString(9),
        provider: props.data.provider,
        collectorId: props.data.collectorId,
        accessModes: res?.accessModes.filter((item: any) => item),
    };
    loading.value = true;
    const response = !props.data.id
        ? await savePoint(params).catch(() => {})
        : await updatePoint(props.data.id, { ...props.data, ...params }).catch(
              () => {},
          );
    emit('change', response?.status === 200);
    loading.value = false;
};

const handleCancel = () => {
    emit('change', false);
};

onMounted(() => {
    formData.value.features = props.data.features?.map(
        (item: any) => item.value,
    );
    if (props.data.accessModes?.length !== 0) {
        formData.value.accessModes = props.data.accessModes?.map(
            (item: any) => item.value,
        );
    }
});
</script>
