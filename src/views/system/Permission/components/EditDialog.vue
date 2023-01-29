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
                :rules="[
                    { required: true, message: '请输入标识(ID)' },
                    { validator: form.rules.idCheck, trigger: 'blur' },
                ]"
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
                        class="delete-btn"
                        style="padding: 0"
                        type="link"
                        @click="table.clickRemove(index)"
                    >
                        <delete-outlined />
                    </a-button>
                </template>
            </template>
        </a-table>
        <div class="pager" v-show="pager.total > pager.pageSize">
            <a-select v-model:value="pager.current" style="width: 60px">
                <a-select-option v-for="(val, i) in pageArr" :value="i + 1">{{
                    i + 1
                }}</a-select-option>
            </a-select>
            <a-pagination
                v-model:current="pager.current"
                :page-size="pager.pageSize"
                :total="pager.total"
            />
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
import { Rule } from 'ant-design-vue/es/form';

import {
    checkId_api,
    editPermission_api,
    addPermission_api,
} from '@/api/system/permission';

const defaultAction = [
    { action: 'query', name: '查询', describe: '查询' },
    { action: 'save', name: '保存', describe: '保存' },
    { action: 'delete', name: '删除', describe: '删除' },
];
const emits = defineEmits(['refresh']);
// 弹窗相关
const dialog = reactive({
    title: '',
    visible: false,
    handleOk: () => {
        formRef.value?.validate().then(() => {
            form.submit();
        });
    },
    // 控制弹窗的打开与关闭
    changeVisible: (status: boolean, defaultForm: any = {}) => {
        dialog.title = defaultForm.id ? '编辑' : '新增';
        form.data = { name: '', ...defaultForm };
        table.data = defaultForm.id ? defaultForm.actions : [...defaultAction];
        pager.total = table.data.length;
        pager.current = 1;
        dialog.visible = status;
        nextTick(() => {
            formRef.value?.clearValidate();
        });
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
    rules: {
        // 校验标识是否可用
        idCheck: (_rule: Rule, id: string, cb: Function) => {
            if (!id) return cb('请输入标识(ID)');
            if (dialog.title === '编辑') return cb();
            checkId_api({ id })
                .then((resp: any) => {
                    if (resp.status === 200 && !resp.result.passed)
                        cb(resp.result.reason);
                    else cb();
                })
                .catch(() => cb('验证失败'));

            // return new Promise((resolve) => {
            //     checkId_api({ id })
            //         .then((resp: any) => {
            //             if (resp.status === 200 && !resp.result.passed)
            //                 resolve(resp.result.reason);
            //             else resolve('');
            //         })
            //         .catch(() => resolve('验证失败'));
            // });
        },
    },
    submit: () => {
        const params = {
            ...form.data,
            actions: table.data.filter((item: any) => item.action && item.name),
        };
        const api =
            dialog.title === '编辑' ? editPermission_api : addPermission_api;

        api(params).then((resp) => {
            if (resp.status === 200) {
                message.error('操作成功');
                emits('refresh');
                dialog.visible = false;
            }
        });
    },
});

const table = reactive({
    columns: [
        {
            title: '-',
            dataIndex: 'index',
            key: 'index',
            width:80,
            align:'center'
        },
        {
            title: '操作类型',
            dataIndex: 'action',
            key: 'action',
            width: 220
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 220
        },
        {
            title: '说明',
            dataIndex: 'describe',
            key: 'describe',
            width: 220
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

    .ant-table {
        color: #ff4d4f;

        .ant-table-tbody {
            color: #ff4d4f;
        }
    }
    .delete-btn {
        color: #000000d9;
        &:hover{
            color: #415ed1;
        }
    }
    .pager {
        display: flex;
        justify-content: center;
        margin-bottom: 12px;
        .ant-pagination {
            margin-left: 8px;
            :deep(.ant-pagination-item) {
                display: none;
            }
        }
    }
}
</style>
