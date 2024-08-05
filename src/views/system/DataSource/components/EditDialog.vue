<template>
    <j-modal
        class="edit-dialog-container"
        width="1050px"
        visible
        :title="dialogTitle"
        :confirmLoading="loading"
        @ok="confirm"
        @cancel="emits('cancel')"
    >
        <j-form ref="formRef" :model="form.data" layout="vertical">
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item
                        name="name"
                        :label="$t('components.EditDialog.039152-0')"
                        :rules="[
                            { required: true, message: $t('components.EditDialog.039152-1') },
                            { max: 64, message: $t('components.EditDialog.039152-2') },
                        ]"
                    >
                        <j-input
                            v-model:value="form.data.name"
                            :placeholder="$t('components.EditDialog.039152-1')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="typeId"
                        :label="$t('components.EditDialog.039152-3')"
                        :rules="[{ required: true, message: $t('components.EditDialog.039152-4') }]"
                    >
                        <j-select
                            v-model:value="form.data.typeId"
                            :options="form.typeOptions"
                            :placeholder="$t('components.EditDialog.039152-4')"
                            :disabled="!!form.data.id"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-if="form.data.typeId === 'rdb'">
                <j-col :span="24">
                    <j-form-item
                        :name="['shareConfig', 'url']"
                        label="URL"
                        :rules="[
                            {
                                required: true,
                                message: $t('components.EditDialog.039152-5'),
                                trigger: 'change',
                            },
                            { validator: checkUrl, trigger: 'blur' },
                        ]"
                    >
                        <j-input
                            v-model:value="form.data.shareConfig.url"
                            :placeholder="$t('components.EditDialog.039152-6')"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-if="form.data.typeId === 'rabbitmq'">
                <j-col :span="24">
                    <j-form-item
                        :name="['shareConfig', 'adminUrl']"
                        :label="$t('components.EditDialog.039152-7')"
                        :rules="[
                            { required: true, message: $t('components.EditDialog.039152-8') },
                            { validator: validateAdminUrl },
                        ]"
                    >
                        <j-input
                            v-model:value="form.data.shareConfig.adminUrl"
                            :placeholder="$t('components.EditDialog.039152-9')"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-if="form.data.typeId === 'rabbitmq'">
                <j-col :span="24">
                    <j-form-item
                        :name="['shareConfig', 'addresses']"
                        :label="$t('components.EditDialog.039152-10')"
                        :rules="[
                            { required: true, message: $t('components.EditDialog.039152-11') },
                            { validator: validateAddress },
                        ]"
                    >
                        <j-input
                            v-model:value="form.data.shareConfig.addresses"
                            :placeholder="$t('components.EditDialog.039152-12')"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-show="form.data.typeId">
                <j-col :span="12">
                    <j-form-item
                        :name="['shareConfig', 'username']"
                        :label="$t('components.EditDialog.039152-13')"
                        :rules="[
                            { required: true, message: $t('components.EditDialog.039152-14') },
                            {
                                max: 64,
                                message: $t('components.EditDialog.039152-2'),
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="form.data.shareConfig.username"
                            :placeholder="$t('components.EditDialog.039152-14')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        :name="['shareConfig', 'password']"
                        :label="$t('components.EditDialog.039152-15')"
                        :rules="[
                            { required: true, message: $t('components.EditDialog.039152-16') },
                            {
                                max: 64,
                                message: $t('components.EditDialog.039152-2'),
                            },
                        ]"
                    >
                        <j-input-password
                            v-model:value="form.data.shareConfig.password"
                            :placeholder="$t('components.EditDialog.039152-16')"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-if="form.data.typeId === 'rabbitmq'">
                <j-col :span="24">
                    <j-form-item
                        :name="['shareConfig', 'virtualHost']"
                        :label="$t('components.EditDialog.039152-17')"
                        :rules="[
                            { required: true, message: $t('components.EditDialog.039152-18') },
                            {
                                max: 64,
                                message: $t('components.EditDialog.039152-2'),
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="form.data.shareConfig.virtualHost"
                            :placeholder="$t('components.EditDialog.039152-18')"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-if="form.data.typeId === 'rdb'">
                <j-col :span="24">
                    <j-form-item
                        :name="['shareConfig', 'schema']"
                        label="schema"
                        :rules="[
                            { required: true, message: $t('components.EditDialog.039152-19') },
                            {
                                max: 64,
                                message: $t('components.EditDialog.039152-2'),
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="form.data.shareConfig.schema"
                            :placeholder="$t('components.EditDialog.039152-19')"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24">
                <j-col :span="24">
                    <j-form-item name="description" :label="$t('components.EditDialog.039152-20')">
                        <j-textarea
                            v-model:value="form.data.description"
                            :placeholder="$t('components.EditDialog.039152-21')"
                            :rows="3"
                            showCount
                            :maxlength="200"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import {
    getDataTypeDict_api,
    saveDataSource_api,
} from '@/api/system/dataSource';
import { FormInstance } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/lib/form';
import type { dictItemType, optionItemType, sourceItemType } from '../typing';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const emits = defineEmits(['confirm', 'cancel']);
const props = defineProps<{
    data: sourceItemType;
}>();
// 弹窗相关
const dialogTitle = computed(() =>
    props.data.id ? $t('components.EditDialog.039152-22') : $t('components.EditDialog.039152-23'),
);
const loading = ref(false);

const checkUrl = (_rule: Rule, value: string): Promise<any> => {
    if (!value) return Promise.resolve();
    const arr = value.split(':');
    if (arr?.[0] === 'jdbc' || arr?.[0] === 'r2dbc') {
        return Promise.resolve();
    } else {
        return Promise.reject($t('components.EditDialog.039152-24'));
    }
};

/**
 * 管理地址校验
 */
const validateAdminUrl = (_rule: Rule, value: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!value) {
            resolve('');
        } else {
            const arr = value.split('://');
            if (arr[0] === 'http' || arr[0] === 'https') {
                resolve('');
            } else {
                reject($t('components.EditDialog.039152-25'));
            }
        }
    });
};
/**
 * 链接地址校验
 * @param _rule
 * @param value
 */
const validateAddress = (_rule: Rule, value: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!value) {
            resolve('');
        } else {
            const reg =
                /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if (reg.test(value)) {
                resolve('');
            } else {
                reject($t('components.EditDialog.039152-26'));
            }
        }
    });
};

const getTypeOption = () => {
    getDataTypeDict_api().then((resp: any) => {
        const result = resp.result as dictItemType[];
        const options:any = []
         result.forEach((item) => {
            if(item.name !== 'redis'){
                options.push({
                label: item.name,
                value: item.id,
                })
            }
        });
        form.typeOptions =  options
    });
};

const formRef = ref<FormInstance>();
const form = reactive({
    data: {
        ...props.data,
    } as sourceItemType,
    typeOptions: [] as optionItemType[],
});

watch(
    () => props.data,
    (newValue) => {
        form.data = { ...newValue, shareConfig: { ...newValue?.shareConfig } };
    },
    {
        immediate: true,
        deep: true,
    },
);

onMounted(() => {
    getTypeOption();
});

const confirm = () => {
    loading.value = true;
    formRef.value
        ?.validate()
        .then(async (_data: any) => {
            const resp = await saveDataSource_api({ ...props.data, ..._data });
            if (resp.status === 200) {
                onlyMessage($t('components.EditDialog.039152-27'));
                emits('confirm');
                formRef.value?.resetFields();
            }
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>
