<!-- 调试 -->
<template>
    <j-modal
        v-model:visible="_vis"
        :title="$t('Debug.index.214683-0')"
        :cancelText="$t('Debug.index.214683-1')"
        :okText="$t('Debug.index.214683-2')"
        @ok="handleOk"
        @cancel="handleCancel"
        :confirmLoading="btnLoading"
    >
        <j-form ref="formRef" layout="vertical" :model="formData">
            <j-form-item
                :label="$t('Debug.index.214683-3')"
                name="configId"
                :rules="{ required: true, message: $t('Debug.index.214683-4') }"
            >
                <j-select
                    v-model:value="formData.configId"
                    :placeholder="$t('Debug.index.214683-4')"
                >
                    <j-select-option
                        v-for="(item, index) in configList"
                        :key="index"
                        :value="item.id"
                    >
                        {{ item.name }}
                    </j-select-option>
                </j-select>
            </j-form-item>
            <j-form-item
                :label="$t('Debug.index.214683-5')"
                v-if="
                    formData.templateDetailTable &&
                    formData.templateDetailTable.length
                "
            >
                <j-table
                    row-key="id"
                    :columns="columns"
                    :data-source="formData.templateDetailTable"
                    :pagination="false"
                    bordered
                >
                    <template #bodyCell="{ column, record, index }">
                        <template
                            v-if="['id', 'name'].includes(column.dataIndex)"
                        >
                            <span>{{ record[column.dataIndex] }}</span>
                        </template>
                        <template v-else>
                            <j-form-item
                                :name="['templateDetailTable', index, 'value']"
                                :rules="[
                                    {
                                        required: record.required,
                                        message: $t('Debug.index.214683-6'),
                                    },
                                    ...record.otherRules,
                                ]"
                            >
                                <template
                                    v-if="
                                        data.type === 'dingTalk' ||
                                        data.type === 'weixin'
                                    "
                                >
                                    <ToUser
                                        v-if="record.type === 'user'"
                                        v-model:toUser="record.value"
                                        :type="data.type"
                                        :config-id="formData.configId"
                                    />
                                    <ToOrg
                                        v-else-if="record.type === 'org'"
                                        :type="data.type"
                                        :config-id="formData.configId"
                                        v-model:toParty="record.value"
                                    />
                                    <ToTag
                                        v-else-if="record.type === 'tag'"
                                        :type="data.type"
                                        :config-id="formData.configId"
                                        v-model:toTag="record.value"
                                    />
                                    <ValueItem
                                        v-else
                                        v-model:modelValue="record.value"
                                        :itemType="record.type"
                                    />
                                </template>
                                <template v-else>
                                    <ValueItem
                                        v-model:modelValue="record.value"
                                        :itemType="record.type"
                                    />
                                </template>
                            </j-form-item>
                        </template>
                    </template>
                </j-table>
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import TemplateApi from '@/api/notice/template';
import type {
    TemplateFormData,
    IVariableDefinitions,
    BindConfig,
} from '@/views/notice/Template/types';

import ToUser from '../Detail/components/ToUser.vue';
import ToOrg from '../Detail/components/ToOrg.vue';
import ToTag from '../Detail/components/ToTag.vue';
import type { Rule } from 'ant-design-vue/es/form';
import { phoneRegEx } from '@/utils/validate';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
type Emits = {
    (e: 'update:visible', data: boolean): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    data: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});

const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

/**
 * 获取通知模板
 */
const configList = ref<BindConfig[]>([]);
const getConfigList = async () => {
    const params = {
        terms: [
            { column: 'type', value: props.data.type },
            { column: 'provider', value: props.data.provider },
        ],
    };
    const { result } = await TemplateApi.getConfig(params);
    configList.value = result;
    // 设置默认配置
    if (configList.value.length) formData.value.configId = props.data.configId;
};

watch(
    () => _vis.value,
    (val) => {
        if (val) {
            getConfigList();
            getTemplateDetail();
        }
    },
);

/**
 * 获取模板详情
 */
const getTemplateDetail = async () => {
    const { result } = await TemplateApi.getTemplateDetail(props.data.id);
    formData.value.templateDetailTable = result.variableDefinitions.map(
        (m: any) => ({
            ...m,
            type: m.expands?.businessType ? m.expands.businessType : m.type,
            value: undefined,
            // 电话字段校验
            otherRules:
                m.id === 'calledNumber' || m.id === 'phoneNumber'
                    ? [
                          {
                              max: 64,
                              message: $t('Debug.index.214683-7'),
                              trigger: 'change',
                          },
                          {
                              trigger: 'change',
                              validator(_rule: Rule, value: string) {
                                  if (!value) return Promise.resolve();
                                  if (!phoneRegEx(value))
                                      return Promise.reject($t('Debug.index.214683-8'));
                                  return Promise.resolve();
                              },
                          },
                      ]
                    : [],
        }),
    );
};

const columns = [
    {
        title: $t('Debug.index.214683-5'),
        dataIndex: 'id',
        width: 100,
        ellipsis: true,
        scopedSlots: { customRender: 'id' },
    },
    {
        title: $t('Debug.index.214683-9'),
        dataIndex: 'name',
        scopedSlots: { customRender: 'name' },
    },
    {
        title: $t('Debug.index.214683-10'),
        dataIndex: 'type',
        width: 160,
        scopedSlots: { customRender: 'type' },
    },
];

// 表单数据
const formData = ref<{
    configId: string;
    variableDefinitions: string;
    templateDetailTable: IVariableDefinitions[];
}>({
    configId: '',
    variableDefinitions: '',
    templateDetailTable: [],
});

/**
 * 提交
 */
const formRef = ref();
const btnLoading = ref(false);
const handleOk = () => {
    formRef.value
        .validate()
        .then(async () => {
            const params = {};
            formData.value.templateDetailTable?.forEach((item) => {
                params[item.id] = item.value;
            });
            // console.log('params: ', params);
            btnLoading.value = true;
            TemplateApi.debug(params, formData.value.configId, props.data.id)
                .then((res) => {
                    if (res.success) {
                        onlyMessage($t('Debug.index.214683-11'));
                        handleCancel();
                    }
                })
                .finally(() => {
                    btnLoading.value = false;
                });
        })
        .catch((err: any) => {
            console.log('err: ', err);
        });
};

const handleCancel = () => {
    _vis.value = false;
    formRef.value.resetFields();
    formData.value.templateDetailTable = [];
};
</script>

<style lang="less" scoped>
:deep(.ant-table-cell .ant-form-item) {
    margin-bottom: 0;
}
</style>
