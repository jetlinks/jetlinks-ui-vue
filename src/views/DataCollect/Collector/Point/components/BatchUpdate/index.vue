<template>
    <j-modal
        :title="$t('BatchUpdate.index.3217220-0')"
        :visible="true"
        width="700px"
        @cancel="handleCancel"
        :destroyOnClose="true"
    >
        <div class="sizeText">
            {{ $t('BatchUpdate.index.3217220-1',[data.length,labelName.join(',')]) }}
        </div>
        <j-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
            ref="formRef"
        >
            <j-form-item :label="$t('BatchUpdate.index.3217220-3')" v-if="provider === 'BACNetIp'">
                <j-select
                    v-model:value="formData.valueType"
                    allowClear
                    :placeholder="$t('BatchUpdate.index.3217220-4')"
                >
                    <j-select-option
                        v-for="item in bacnetValueType"
                        :key="item"
                        :value="item"
                        >{{ item }}</j-select-option
                    >
                </j-select>
            </j-form-item>
            <j-form-item :label="$t('BatchUpdate.index.3217220-5')" name="accessModes">
                <j-card-select
                    multiple
                    :showImage="false"
                    v-model:value="formData.accessModes"
                    :options="[
                        { label: $t('BatchUpdate.index.3217220-6'), value: 'read' },
                        { label: $t('BatchUpdate.index.3217220-7'), value: 'write' },
                        { label: $t('BatchUpdate.index.3217220-8'), value: 'subscribe' },
                    ]"
                />
            </j-form-item>
            <j-form-item
                :name="['interval']"
                :rules="[
                    {
                        pattern: regOnlyNumber,
                        message: $t('BatchUpdate.index.3217220-9'),
                    },
                ]"
            >
                <template #label>
                    <span>
                        {{ $t('BatchUpdate.index.3217220-10') }}
                        <j-tooltip :title="$t('BatchUpdate.index.3217220-11')">
                            <AIcon
                                type="QuestionCircleOutlined"
                                style="margin-left: 2px"
                            />
                        </j-tooltip>
                    </span>
                </template>
                <j-input-number
                    style="width: 100%"
                    :placeholder="$t('BatchUpdate.index.3217220-12')"
                    v-model:value="formData.interval"
                    addon-after="ms"
                    :max="2147483648"
                    :min="0"
                    :precision="0"
                />
            </j-form-item>
            <j-form-item :label="$t('BatchUpdate.index.3217220-13')">
                <a-switch v-model:checked="formData.pushControl"></a-switch>
            </j-form-item>
            <j-form-item :name="['features']" v-if="formData.pushControl"> 
                <j-checkbox-group v-model:value="formData.features">
                    <j-checkbox value="changedOnly" name="type"
                        >{{ $t('BatchUpdate.index.3217220-14') }}</j-checkbox
                    >
                </j-checkbox-group>
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="handleCancel">{{ $t('BatchUpdate.index.3217220-15') }}</j-button>
            <PermissionButton
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleOk"
                style="margin-left: 8px"
                :hasPermission="`DataCollect/Collector:update`"
            >
                {{ $t('BatchUpdate.index.3217220-16') }}
            </PermissionButton>
        </template>
    </j-modal>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import {
    savePointBatch,
    getBacnetValueType,
} from '@/api/data-collect/collector';
import { cloneDeep, isObject , omit } from 'lodash-es';
import { regOnlyNumber } from '../../../data';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
    provider: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['change']);
const loading = ref(false);
const formRef = ref<FormInstance>();

const formData = ref({
    accessModes: [],
    interval: undefined,
    features: [],
    valueType: undefined,
    pushControl: false,
});

const bacnetValueType = ref<string[]>([]);

const getIdAndType = async () => {
    const resp: any = await getBacnetValueType();
    if (resp.success) {
        bacnetValueType.value = resp.result;
    }
};

const handleOk = async () => {
    const data = cloneDeep(formData.value);
    const { accessModes, features, interval, valueType , pushControl } = data;
    const ischange =
        accessModes.length !== 0 ||
        pushControl ||
        Number(interval) === 0 ||
        !!interval ||
        !!valueType;
    if (ischange) {
        const params = cloneDeep(props.data);
        params.forEach((i: any) => {
            if (accessModes.length !== 0) {
                i.accessModes = data.accessModes;
            } else {
                if (isObject(i.accessModes)) {
                    i.accessModes = i.accessModes.map(
                        (item: any) => item.value,
                    );
                }
            }
            if (features.length !== 0) {
                i.features = data.features;
            } else {
                i.features = [];
            }
            
            if (!!interval || Number(interval) === 0) {
                i.interval = data.interval;
                i.configuration = {
                    ...i.configuration,
                    interval: data.interval,
                };
            }
            if (data.valueType) {
                i.configuration = {
                    ...i.configuration,
                    valueType: data.valueType,
                };
            }
        });
        loading.value = true;
        const response = await savePointBatch(params).catch(() => {});
        emit('change', response?.status === 200);
        loading.value = false;
    } else {
        emit('change', true);
    }
};

const handleCancel = () => {
    emit('change', false);
};

watch(
    () => props.provider,
    () => {
        if (props.provider === 'BACNetIp') {
            getIdAndType();
        }
    },
    { immediate: true },
);

const labelName = computed(() => {
    const arr = [];
    if (formData.value.accessModes.length) {
        arr.push($t('BatchUpdate.index.3217220-5'));
    }
    if (!!formData.value.interval) {
        arr.push($t('BatchUpdate.index.3217220-10'));
    }
    if (formData.value.features.length) {
        arr.push($t('BatchUpdate.index.3217220-14'));
    }
    if (formData.value.type) {
        arr.push($t('BatchUpdate.index.3217220-17'));
    }
    if (formData.value.valueType) {
        arr.push($t('BatchUpdate.index.3217220-3'));
    }
    return arr;
});
</script>

<style lang="less" scoped>
.sizeText {
    margin-bottom: 20px;
}
</style>
