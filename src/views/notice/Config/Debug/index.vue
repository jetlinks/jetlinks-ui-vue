<template>
    <a-modal
        v-model:visible="_vis"
        title="调试"
        cancelText="取消"
        okText="确定"
        @ok="handleOk"
        @cancel="handleCancel"
        :confirmLoading="btnLoading"
    >
        <a-form ref="formRef" layout="vertical" :model="formData">
            <a-form-item
                label="通知模版"
                name="templateId"
                :rules="{ required: true, message: '该字段为必填字段' }"
            >
                <a-select
                    v-model:value="formData.templateId"
                    placeholder="请选择通知模版"
                    @change="getTemplateDetail"
                >
                    <a-select-option
                        v-for="(item, index) in templateList"
                        :key="index"
                        :value="item.id"
                    >
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label="变量"
                v-if="
                    formData.templateDetailTable &&
                    formData.templateDetailTable.length
                "
            >
                <a-table
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
                            <a-form-item
                                :name="['templateDetailTable', index, 'value']"
                                :rules="{
                                    required: true,
                                    message: '该字段为必填字段',
                                }"
                            >
                                <ValueItem
                                    v-model:modelValue="record.value"
                                    :itemType="record.type"
                                />
                            </a-form-item>
                        </template>
                    </template>
                </a-table>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import ConfigApi from '@/api/notice/config';
import type {
    TemplateFormData,
    IVariableDefinitions,
} from '@/views/notice/Template/types';
import { message } from 'ant-design-vue';

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
const templateList = ref<TemplateFormData[]>([]);
const getTemplateList = async () => {
    const params = {
        terms: [
            { column: 'type', value: props.data.type },
            { column: 'provider', value: props.data.provider },
        ],
    };
    const { result } = await ConfigApi.getTemplate(params, props.data.id);
    templateList.value = result;
};

watch(
    () => _vis.value,
    (val) => {
        if (val) getTemplateList();
    },
);

/**
 * 获取模板详情
 */
const getTemplateDetail = async () => {
    const { result } = await ConfigApi.getTemplateDetail(
        formData.value.templateId,
    );
    formData.value.templateDetailTable = result.variableDefinitions.map(
        (m: any) => ({
            ...m,
            value: undefined,
        }),
    );
};

const columns = [
    {
        title: '变量',
        dataIndex: 'id',
        scopedSlots: { customRender: 'id' },
    },
    {
        title: '名称',
        dataIndex: 'name',
        scopedSlots: { customRender: 'name' },
    },
    {
        title: '值',
        dataIndex: 'type',
        width: 160,
        scopedSlots: { customRender: 'type' },
    },
];

// 表单数据
const formData = ref<{
    templateId: string;
    variableDefinitions: string;
    templateDetailTable: IVariableDefinitions[];
}>({
    templateId: '',
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
            ConfigApi.debug(params, props.data.id, formData.value.templateId)
                .then((res) => {
                    if (res.success) {
                        message.success('操作成功');
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
