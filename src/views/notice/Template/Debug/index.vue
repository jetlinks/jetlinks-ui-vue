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
        <a-form layout="vertical">
            <a-form-item label="通知配置" v-bind="validateInfos.configId">
                <a-select
                    v-model:value="formData.configId"
                    placeholder="请选择通知配置"
                >
                    <a-select-option
                        v-for="(item, index) in configList"
                        :key="index"
                        :value="item.id"
                    >
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label="变量"
                v-bind="validateInfos.variableDefinitions"
                v-if="templateDetailTable && templateDetailTable.length"
            >
                <a-table
                    ref="myTable"
                    class="debug-table"
                    :columns="columns"
                    :data-source="templateDetailTable"
                    :pagination="false"
                    :rowKey="
                        (record, index) => {
                            return record.id;
                        }
                    "
                >
                    <template #bodyCell="{ column, text, record }">
                        <template
                            v-if="['id', 'name'].includes(column.dataIndex)"
                        >
                            <span>{{ record[column.dataIndex] }}</span>
                        </template>
                        <template v-else>
                            <ValueItem
                                v-model:modelValue="record.value"
                                :itemType="record.type"
                            />
                        </template>
                    </template>
                </a-table>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { Form } from 'ant-design-vue';
import { PropType } from 'vue';
import TemplateApi from '@/api/notice/template';
import type {
    TemplateFormData,
    IVariableDefinitions,
    BindConfig,
} from '@/views/notice/Template/types';
import { message } from 'ant-design-vue';

const useForm = Form.useForm;

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
const templateDetailTable = ref<IVariableDefinitions[]>();
const getTemplateDetail = async () => {
    const { result } = await TemplateApi.getTemplateDetail(props.data.id);
    templateDetailTable.value = result.variableDefinitions.map((m: any) => ({
        ...m,
        value: undefined,
    }));
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
const formData = ref({
    configId: '',
    variableDefinitions: '',
});

// 验证规则
const formRules = ref({
    configId: [{ required: true, message: '请选择通知模板' }],
    variableDefinitions: [{ required: false, message: '该字段是必填字段' }],
});

const { resetFields, validate, validateInfos, clearValidate } = useForm(
    formData.value,
    formRules.value,
);

/**
 * 提交
 */
const btnLoading = ref(false);
const handleOk = () => {
    validate()
        .then(async () => {
            const params = {};
            templateDetailTable.value?.forEach((item) => {
                params[item.id] = item.value;
            });
            // console.log('params: ', params);
            btnLoading.value = true;
            TemplateApi.debug(params, formData.value.configId, props.data.id)
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
        .catch((err) => {
            console.log('err: ', err);
        });
};

const handleCancel = () => {
    _vis.value = false;
    templateDetailTable.value = [];
    resetFields();
};
</script>

<style lang="less" scoped></style>
