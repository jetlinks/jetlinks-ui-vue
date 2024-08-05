<template>
    <j-modal
        visible
        :title="dialogTitle"
        :maskClosable="false"
        width="675px"
        @ok="confirm"
        @cancel="emits('update:visible', false)"
        :confirmLoading="loading"
        class="edit-dialog-container"
    >
        <j-form ref="formRef" :model="form.data" layout="vertical">
            <j-form-item
                name="relation"
                :label="$t('components.EditDialog.635691-0')"
                :rules="[
                    { required: true, message: $t('components.EditDialog.635691-1') },
                    { max: 64, message: $t('components.EditDialog.635691-2') },
                    { validator: form.rules.checkRelation, trigger: 'change' },
                ]"
            >
                <j-input
                    v-model:value="form.data.relation"
                    :placeholder="$t('components.EditDialog.635691-1')"
                    :disabled="!!form.data.id"
                />
            </j-form-item>

            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item
                        name="objectType"
                        :label="$t('components.EditDialog.635691-3')"
                        :rules="[{ required: true, message: $t('components.EditDialog.635691-4') }]"
                    >
                        <j-select
                            v-model:value="form.data.objectType"
                            :disabled="!!form.data.id"
                            @change="form.handleObjectTypeChange"
                            :placeholder="$t('components.EditDialog.635691-4')"
                        >
                            <j-select-option
                                v-for="item in form.objectList"
                                :value="item.id"
                            >
                                {{ item.name }}
                            </j-select-option>
                        </j-select>
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="targetType"
                        :label="$t('components.EditDialog.635691-5')"
                        :rules="[{ required: true, message: $t('components.EditDialog.635691-6') }]"
                    >
                        <j-select
                            v-model:value="form.data.targetType"
                            :disabled="!!form.data.id"
                            @change="form.rules.checkUnique"
                            :placeholder="$t('components.EditDialog.635691-6')"
                        >
                            <j-select-option
                                v-for="item in targetList"
                                :value="item.id"
                            >
                                {{ item.name }}
                            </j-select-option>
                        </j-select>
                    </j-form-item>
                </j-col>
            </j-row>
            <j-form-item
                :label="$t('components.EditDialog.635691-7')"
                name="name"
                :rules="[
                    { required: true, message: $t('components.EditDialog.635691-8') },
                    { max: 64, message: $t('components.EditDialog.635691-2') },
                    { required: true , validator:validateName, trigger: 'blur',}
                ]"
            >
                <j-input
                    v-model:value="form.data.name"
                    :placeholder="$t('components.EditDialog.635691-8')"
                />
                <span class="example">{{ $t('components.EditDialog.635691-9') }}</span>
            </j-form-item>
          
            <j-form-item
                :label="$t('components.EditDialog.635691-10')"
                name="reverseName"
                :rules="[
                    { required: true, message: $t('components.EditDialog.635691-8') },
                    { max: 64, message: $t('components.EditDialog.635691-2') },
                    { required: true , validator:validateName, trigger: 'blur',}
                ]"
            >
                <j-input
                    v-model:value="form.data.reverseName"
                    :placeholder="$t('components.EditDialog.635691-8')"
                />
                <span class="example">{{ $t('components.EditDialog.635691-11') }}</span>
            </j-form-item>
            <j-form-item name="description" :label="$t('components.EditDialog.635691-12')">
                <j-textarea
                    v-model:value="form.data.description"
                    :placeholder="$t('components.EditDialog.635691-13')"
                    show-count
                    :maxlength="200"
                />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { FormInstance } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';

import {
    getObjectList_api,
    addRelation_api,
    editRelation_api,
    validateField,
} from '@/api/system/relationship';
import { dictItemType } from '../../DataSource/typing';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const emits = defineEmits(['refresh', 'update:visible']);
const props = defineProps<{
    visible: boolean;
    data: formType;
}>();
// 弹窗相关
const loading = ref(false);
const targetList = ref([])
const dialogTitle = computed(() => (props.data.id ? $t('components.EditDialog.635691-14') : $t('components.EditDialog.635691-15')));
const confirm = () => {
    loading.value = true;
    formRef.value
        ?.validate()
        .then(() => form.submit())
        .then((resp: any) => {
            if (resp.status === 200) {
                onlyMessage($t('components.EditDialog.635691-16'));
                emits('refresh');
                emits('update:visible', false);
            }
        })
        .finally(() => (loading.value = false));
};

const formRef = ref<FormInstance>();
const form = reactive({
    data: props.data,
    rules: {
        /**
         * 验证标识
         * @param _rule
         * @param value
         */
        checkRelation: async (_rule: Rule, value: string) => {
            const reg = new RegExp('^[0-9a-zA-Z_\\\\-]+$');
            if (!value) return Promise.reject('');
            if (!reg.test(value))
                return Promise.reject(
                    $t('components.EditDialog.635691-17'),
                );
            return form.rules.checkUnique();
        },
        /**
         * 验证标识唯一性
         * @param value
         */
        checkUnique: () => {
            if (
                props.data?.id ||
                !form.data.relation ||
                !form.data.objectType ||
                !form.data.targetType
            )
                return;
            return new Promise(async (resolve, reject) => {
                const { result } = await validateField({
                    relation: form.data.relation,
                    objectType: form.data.objectType,
                    targetType: form.data.targetType,
                });
                result.passed ? resolve('') : reject(result.reason);
            });
        },
    },
    handleObjectTypeChange: () => {
        form.data.targetType = undefined;
        form.rules.checkUnique();
    },
    objectList: [] as any[],

    getObjectList: () => {
        getObjectList_api().then((resp: any) => {
            form.objectList = resp.result;
            targetList.value = resp.result
        });
    },
    submit: () => {
        const params = {
            ...form.data,
            objectTypeName: form.objectList.find(
                (item) => item.id === form.data.objectType,
            )?.name,
            targetTypeName: targetList.value.find(
                (item: dictItemType) => item.id === form.data.targetType,
            )?.name,
        };
        const api = props.data.id ? editRelation_api : addRelation_api;
        return api(params);
    },
});
const validateName = async(_:any,value:any)=>{
   if(!value){
    return Promise.resolve()
   }
   return form.data.reverseName === form.data.name ? Promise.reject($t('components.EditDialog.635691-18')) : Promise.resolve()
}
form.getObjectList();

type formType = {
    name: string;
    reverseName: string;
    relation: string;
    objectType: string | undefined;
    targetType: string | undefined;
    description: string;
    id?: string;
};
</script>
<style scoped lang="less">
.example {
    color: rgb(192, 192, 192);
    font-size: 12px;
}
</style>
