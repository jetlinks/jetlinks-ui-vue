<template>
    <a-modal
        v-model:visible="dialog.visible"
        :title="dialog.title"
        width="1000px"
        @ok="dialog.handleOk"
        class="edit-dialog-container"
    >
        <a-form ref="formRef" :model="form.data" layout="vertical">
            <a-form-item
                name="id"
                :rules="[{ required: true, message: '请输入标识' }]"
                class="question-item"
            >
                <template #label>
                    <span>标识</span>
                    <span class="required-icon">*</span>
                    <a-tooltip placement="top">
                        <template #title>
                            <span>标识ID需与代码中的标识ID一致</span>
                        </template>
                        <question-circle-outlined style="color: #00000073" />
                    </a-tooltip>
                </template>
                <a-input
                    v-model:value="form.data.id"
                    placeholder="请输入标识(ID)"
                    :maxlength="64"
                    :disabled="dialog.title === '编辑'"
                />
            </a-form-item>
            <a-form-item
                name="name"
                label="名称"
                :rules="[{ required: true, message: '请输入名称' }]"
            >
                <a-input
                    v-model:value="form.data.name"
                    placeholder="请输入名称"
                    :maxlength="64"
                />
            </a-form-item>
        </a-form>

        <a-table
            :columns="table.columns"
            :data-source="actionTableData"
            :pagination="false"
        >
            <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'index'">
                    {{
                        `#${
                            (pager.current - 1) * pager.pageSize + (index + 1)
                        }.`
                    }}
                </template>
                <template
                    v-else-if="column.key !== 'index' && column.key !== 'act'"
                >
                    <a-input v-model:value="record[column.key]" />
                </template>
                <template v-else-if="column.key === 'act'">
                    <a-button
                        style="padding: 0"
                        type="link"
                        @click="table.clickRemove(index)"
                    >
                        <delete-outlined />
                    </a-button>
                </template>
            </template>
        </a-table>
        <div class="pager">
            <a-pagination
                v-model:current="pager.current"
                :page-size="pager.pageSize"
                :total="pager.total"
            />
            <a-select v-model:value="pager.current" style="width: 60px">
                <a-select-option v-for="(val,i) in pageArr" :value="i + 1">{{
                    i + 1
                }}</a-select-option>
            </a-select>
        </div>

        <a-button type="dashed" style="width: 100%" @click="table.clickAdd">
            <plus-outlined /> 添加
        </a-button>

        <template #footer>
            <a-button key="back" @click="dialog.visible = false">取消</a-button>
            <a-button
                key="submit"
                type="primary"
                :loading="form.loading"
                @click="dialog.handleOk"
                >确定</a-button
            >
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { FormInstance, message } from 'ant-design-vue';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

const defaultAction = [
    { action: 'query', name: '查询', describe: '查询' },
    { action: 'save', name: '保存', describe: '保存' },
    { action: 'delete', name: '删除', describe: '删除' },
];
// 弹窗相关
const dialog = reactive({
    title: '',
    visible: false,
    handleOk: () => {
        formRef.value?.validate().then(() => console.log('success'));
    },
    // 控制弹窗的打开与关闭
    changeVisible: (status: boolean, defaultForm: any = {}) => {
        form.data = { name: '', description: '', ...defaultForm };
        dialog.title = defaultForm.id ? '编辑' : '新增';
        table.data = defaultForm.id ? defaultForm.actions : [...defaultAction];
        pager.total = table.data.length;
        pager.current = 1;
        dialog.visible = status;
    },
});
// 表单相关
const formRef = ref<FormInstance>();
const form = reactive({
    loading: false,
    data: {
        name: '',
        id: '',
    },
});

const table = reactive({
    columns: [
        {
            title: '-',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: '操作类型',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '说明',
            dataIndex: 'describe',
            key: 'describe',
        },
        {
            title: '操作',
            dataIndex: 'act',
            key: 'act',
        },
    ],
    data: <any>[],
    clickRemove: (index: number) => {
        pager.total -= 1;
        table.data.splice(index, 1);

        // 当删除的刚好为本页的最后一项时，返回到上一页
        if (pager.current > 1 && pager.total % pager.pageSize === 0)
            pager.current -= 1;
    },
    clickAdd: () => {
        table.data.push({});
        pager.total += 1;

        // 当添加的项需要新加一页才能显示时，跳转到最后一页
        if (pager.total % pager.pageSize === 1) {
            pager.current = Math.ceil(pager.total / pager.pageSize);
        }
    },
});

const pager = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
});
const pageArr = computed(() => {
    const maxPageNum = Math.ceil(pager.total / pager.pageSize);
    return new Array(maxPageNum).fill(1);
});
const actionTableData = computed(() => {
    const startIndex = (pager.current - 1) * pager.pageSize;
    const endIndex = Math.min(
        pager.current * pager.pageSize,
        table.data.length,
    );
    console.log(startIndex, endIndex);

    return table.data.slice(startIndex, endIndex);
});

// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: dialog.changeVisible,
});
</script>

<style lang="less" scoped>
.edit-dialog-container {
    .question-item {
        :deep(.ant-form-item-required) {
            &::before {
                display: none;
            }
            .required-icon {
                display: inline-block;
                margin-right: 4px;
                margin-left: 2px;
                color: #ff4d4f;
                font-size: 14px;
                font-family: SimSun, sans-serif;
                line-height: 1;
            }
        }
    }
}
</style>
