<template>
    <page-container>
        <pro-search :columns="columnsConfig" @search="handleProSearch" />

        <full-page>
            <JProTable
                ref="tableRef"
                model="table"
                :columns="columnsConfig"
                :request="queryData"
                :params="globParams"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
            >
                <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        @click="tableHandler.openDialog('add')"
                    >
                        <AIcon type="PlusOutlined" />新增
                    </PermissionButton>
                </template>

                <!-- 动态生成时间相关的插槽 -->
                <template
                    v-for="column in dateColumns"
                    v-slot:[getSlotName(column)]="scope"
                >
                    {{ formatTimestamp(scope, column) }}
                </template>

                <template #status="{ status }">
                    <BadgeStatus
                        :status="status"
                        :text="status === 0 ? '正常' : '禁用'"
                        :statusNames="{
                            1: 'error',
                            0: 'success',
                        }"
                    ></BadgeStatus
                ></template>

                <template #action="actionScope">
                    <j-space style="gap: 0">
                        <PermissionButton
                            type="link"
                            :tooltip="{ title: '编辑' }"
                            @click="
                                tableHandler.openDialog('edit', actionScope)
                            "
                        >
                            <AIcon type="EditOutlined" />
                        </PermissionButton>
                        <PermissionButton
                            type="link"
                            :tooltip="{
                                title: actionScope.status
                                    ? '请先禁用，再删除'
                                    : '删除',
                            }"
                            :popConfirm="{
                                title: '确认删除?',
                                onConfirm: () =>
                                    tableHandler.deleteRow(actionScope.id),
                            }"
                            :disabled="!actionScope.status"
                        >
                            <AIcon type="DeleteOutlined" />
                        </PermissionButton>
                    </j-space>
                </template>
            </JProTable>
        </full-page>
        <EditConfigModal
            v-if="modal.visible"
            :type="modal.type"
            :encrypt-type-map="encryptTypeMap"
            :propFormData="modal.data"
            @update:visible="modal.onUpdate"
            @confirm="tableHandler.refreshTable"
        />
    </page-container>
</template>

<script setup lang="ts">
import { FullPage } from 'components/Layout';
import { columnsConfig } from './columnConfig';
import PermissionButton from 'components/PermissionButton/index.vue';
import { onlyMessage } from '@/utils/comm';
import {
    deleteSingleConfig,
    queryConfigList,
    queryDictWithEncryptType,
    updateSingleConfig,
} from '@/api/system/push';
import dayjs from 'dayjs';
import EditConfigModal from '@/views/system/Push/components/EditConfigModal.vue';

// 全局搜索参数
const globParams = ref<any>();
// 表格ref
const tableRef = ref<any>();

// 时间格式的列
const dateColumns = [
    'efficaciousStartTime',
    'efficaciousEndTime',
    // 'createTime',
    // 'modifyTime',
];

// 加密类型name和value的映射
const encryptTypeMap = ref<{ value: string; name: string }[]>([]);

// 请求加密类型的字典，将其映射为type-->name
queryDictWithEncryptType().then((res) => {
    (res.result as any).data.forEach((item: any) => {
        encryptTypeMap.value.push({ value: item.value, name: item.name });
    });
});

// 获取插槽的名字，勿删，有使用未被编辑器识别
const getSlotName = (column: string) => column;

/**
 * @function formatTimestamp 格式化时间戳
 * @param scope 作用域插槽的作用域
 * @param column 列名
 */
const formatTimestamp = (scope: any, column: string) => {
    if (scope[column]) {
        const timestamp =
            typeof scope[column] === 'string'
                ? Number(scope[column])
                : scope[column];
        return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
    } else {
        return '--';
    }
};

/**
 * @function filterResult 过滤请求结果中的encryptType字段
 * @param result
 */
const filterResult = (result: any) => {
    result.data = result.data.map((item: any) => {
        if (item.encryptType || item.encryptType === 0) {
            const target = encryptTypeMap.value.find(
                (encryptItem) => encryptItem.value === String(item.encryptType),
            );
            item.encryptType = target ? target.name : '--';
        }
        return item;
    });
    return result;
};

/**
 * @function queryData 包装后的请求函数
 */
const queryData = async (_param: any) => {
    const resp = await queryConfigList(_param);
    if (resp.status === 200) {
        return {
            code: 200,
            result: filterResult(resp.result),
            status: 200,
        };
    } else {
        return {
            code: 200,
            result: { data: [] },
            status: 200,
        };
    }
};

// modal框的类型
type modalType = '' | 'add' | 'edit';

// modal框的相关配置
const modal = reactive({
    visible: false,
    data: {},
    type: '' as modalType,
    onUpdate(payload: boolean) {
        modal.visible = payload;
    },
});

// table相关的方法
const tableHandler = {
    // 打开弹窗
    openDialog: (type: modalType, row?: any) => {
        // modalType.value = type;
        modal.type = type;
        if (type === 'add') {
            modal.data = {
                address: '',
                deviceRuleCode: '',
                username: '',
                password: '',
                encryptType: undefined,
                // publicKey: '',
                // efficaciousStartTime: '',
                // efficaciousEndTime: '',
            };
        } else {
            modal.data = {
                id: row.id,
                // address: row.address,
                deviceRuleCode: row.deviceRuleCode,
                username: row.username,
                password: row.password,
                // encryptType: row.encryptType,
                // publicKey: row.publicKey,
                // efficaciousStartTime: row.efficaciousStartTime,
                // efficaciousEndTime: row.efficaciousEndTime,
            };
        }
        modal.visible = true;
    },
    // 删除
    deleteRow: (id: string) => {
        deleteSingleConfig(id).then(() => {
            onlyMessage('操作成功');
            tableHandler.refreshTable();
        });
    },
    // 刷新列表
    refreshTable: () => {
        tableRef.value.reload();
    },
};

/**
 * 搜索
 * @param _params
 */
const handleProSearch = (_params: any) => {
    globParams.value = _params;
};
</script>

<style scoped lang="less">
:deep(.ant-table-cell) {
    .ant-btn {
        padding: 0;
        margin-right: 16px;
    }
}
</style>
