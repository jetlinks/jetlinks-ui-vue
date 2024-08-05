<template>
    <j-modal
        visible
        :title="dialogTitle"
        width="1000px"
        @ok="confirm"
        @cancel="emits('update:visible', false)"
        :confirmLoading="loading"
        destroyOnClose
        class="edit-dialog-container"
    >
        <j-form ref="formRef" :model="form.data" layout="vertical">
            <j-form-item
                name="id"
                :rules="[
                    { required: true, message: '' },
                    { validator: form.rules.idCheck, trigger: 'blur' },
                ]"
                class="question-item"
            >
                <template #label>
                    <span>{{ $t('components.EditDialog.153828-0') }}</span>
                    <span class="required-icon">*</span>
                    <j-tooltip placement="top">
                        <template #title>
                            <span>{{ $t('components.EditDialog.153828-1') }}</span>
                        </template>
                        <AIcon
                            type="QuestionCircleOutlined"
                            style="color: #00000073"
                        />
                    </j-tooltip>
                </template>
                <j-input
                    v-model:value="form.data.id"
                    :placeholder="$t('components.EditDialog.153828-2')"
                    :disabled="dialogTitle === $t('components.EditDialog.153828-3')"
                />
            </j-form-item>
            <j-form-item
                name="name"
                :label="$t('components.EditDialog.153828-4')"
                :rules="[
                    { required: true, message: $t('components.EditDialog.153828-5') },
                    {
                        max: 64,
                        message: $t('components.EditDialog.153828-6'),
                    },
                ]"
            >
                <j-input
                    v-model:value="form.data.name"
                    :placeholder="$t('components.EditDialog.153828-5')"
                />
            </j-form-item>

            <!-- 操作权限列表 -->
            <j-table
                :columns="table.columns"
                :data-source="form.data.actionTableData"
                :pagination="false"
            >
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.key === 'index'">
                        {{
                            `#${
                                (pager.current - 1) * pager.pageSize +
                                (index + 1)
                            }.`
                        }}
                    </template>
                    <template
                        v-else-if="
                            column.key !== 'index' && column.key !== 'act'
                        "
                    >
                        <j-form-item
                            :name="['actionTableData', index, column.key]"
                            :rules="[
                                {
                                    required: column.key !== 'describe',
                                    message: $t('components.EditDialog.153828-7', [column.title]),
                                },
                                {
                                    max: 64,
                                    message: $t('components.EditDialog.153828-6'),
                                },
                            ]"
                        >
                            <j-input v-model:value="record[column.key]" />
                        </j-form-item>
                    </template>
                    <template v-else-if="column.key === 'act'">
                        <j-button
                            class="delete-btn"
                            style="padding: 0"
                            type="link"
                            @click="table.clickRemove(index)"
                        >
                            <AIcon type="DeleteOutlined" />
                        </j-button>
                    </template>
                </template>
            </j-table>
        </j-form>

        <div class="pager" v-show="pager.total > pager.pageSize">
            <j-select v-model:value="pager.current" style="width: 60px">
                <j-select-option v-for="(val, i) in pageArr" :value="i + 1">{{
                    i + 1
                }}</j-select-option>
            </j-select>
            <j-pagination
                v-model:current="pager.current"
                :page-size="pager.pageSize"
                :total="pager.total"
            />
        </div>

        <j-button type="dashed" style="width: 100%" @click="table.clickAdd">
            <AIcon type="PlusOutlined" /> {{ $t('components.EditDialog.153828-8') }}
        </j-button>
    </j-modal>
</template>

<script setup lang="ts">
import { FormInstance } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';

import {
    checkId_api,
    editPermission_api,
    addPermission_api,
} from '@/api/system/permission';
import { cloneDeep } from 'lodash-es';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const defaultAction = [
    { action: 'query', name: $t('components.EditDialog.153828-9'), describe: $t('components.EditDialog.153828-9') },
    { action: 'save', name: $t('components.EditDialog.153828-10'), describe: $t('components.EditDialog.153828-10') },
    { action: 'delete', name: $t('components.EditDialog.153828-11'), describe: $t('components.EditDialog.153828-11') },
];
const emits = defineEmits(['refresh', 'update:visible']);
const props = defineProps<{
    data: any;
    visible: boolean;
}>();

const loading = ref(false);
const dialogTitle = computed(() => (props.data?.id ? $t('components.EditDialog.153828-3') : $t('components.EditDialog.153828-12')));
const confirm = () => {
    loading.value = true;
    formRef.value
        ?.validate()
        .then(() => form.submit())
        .then((resp) => {
            if (resp.status === 200) {
                onlyMessage($t('components.EditDialog.153828-13'));
                emits('refresh');
                emits('update:visible', false);
            }
        })
        .finally(() => (loading.value = false));
};
// 表单相关
const formRef = ref<FormInstance>();
const form = reactive({
    data: {
        name: '',
        id: '',
        ...props?.data,
        actionTableData: computed(() => {
            const startIndex = (pager.current - 1) * pager.pageSize;
            const endIndex = Math.min(
                pager.current * pager.pageSize,
                table.data.length,
            );
            console.log(startIndex, endIndex);

            return table.data.slice(startIndex, endIndex);
        }),
    },
    rules: {
        // 校验标识是否可用
        idCheck: async (_rule: Rule, id: string): Promise<any> => {
            if (!id) return Promise.reject($t('components.EditDialog.153828-2'));
            else if (id.length > 64)
                return Promise.reject($t('components.EditDialog.153828-6'));
            else if (!/^[a-zA-Z0-9_\-]+$/.test(id))
                return Promise.reject($t('components.EditDialog.153828-15'));
            else if (props.data?.id && props.data?.id === form.data?.id)
                return Promise.resolve();
            else {
                const resp: any = await checkId_api({ id });
                if (resp.result.passed) return Promise.resolve();
                else return Promise.reject($t('components.EditDialog.153828-16'));
            }
        },
    },
    submit: () => {
        const params = {
            ...form.data,
            actions: table.data.filter((item: any) => item.action && item.name),
        };
        const api = props.data?.id ? editPermission_api : addPermission_api;

        return api(params);
    },
});

const table = reactive({
    columns: <any>[
        {
            title: '-',
            dataIndex: 'index',
            key: 'index',
            width: 80,
            align: 'center',
        },
        {
            title: $t('components.EditDialog.153828-17'),
            dataIndex: 'action',
            key: 'action',
            width: 220,
        },
        {
            title: $t('components.EditDialog.153828-4'),
            dataIndex: 'name',
            key: 'name',
            width: 220,
        },
        {
            title: $t('components.EditDialog.153828-18'),
            dataIndex: 'describe',
            key: 'describe',
            width: 220,
        },
        {
            title: $t('components.EditDialog.153828-19'),
            dataIndex: 'act',
            key: 'act',
        },
    ],
    data: props.data?.id ? cloneDeep([...(props.data?.actions || [])]) : [...defaultAction],
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
    pageSize: 12,
    total: table.data.length,
});
const pageArr = computed(() => {
    const maxPageNum = Math.ceil(pager.total / pager.pageSize);
    return new Array(maxPageNum).fill(1);
});
// const actionTableData = computed(() => {
//     const startIndex = (pager.current - 1) * pager.pageSize;
//     const endIndex = Math.min(
//         pager.current * pager.pageSize,
//         table.data.length,
//     );
//     console.log(startIndex, endIndex);

//     return table.data.slice(startIndex, endIndex);
// });
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
        &:hover {
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
