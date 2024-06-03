<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="notice-config"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="queryData"
                model="table"
                :params="params"
                :gridColumn="3"
                :row-selection="rowSelection"
                :pagination="false"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            :popConfirm="{
                                title: `确认导出？`,
                                onConfirm: () => handleExport(),
                            }"
                        >
                            <AIcon type="ExportOutlined" />
                            导出
                        </PermissionButton>
                    </j-space>
                </template>
                <!-- 所属组织 -->
                <template #orgName="{ orgName }">
                    {{ orgName || '' }}
                </template>
                <!-- 告警时间 -->
                <template #alarmTime="{ alarmTime }">
                    {{ dayjs(alarmTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { downloadFileByUrl } from '@/utils/utils';
import { _export } from '@/api/data-report/alarmSheet';
import moment from 'moment';
import { queryAlarmData } from '@/api/data-report/alarmSheet';
import { useFilterAlarmDesc } from '@/hook/useFilterAlarmDesc';
import { FullPage } from 'components/Layout';
import dayjs from 'dayjs';
import { onlyMessage } from '@/utils/comm';
import { columns } from './columnConfig';

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

// 生成请求函数
const queryData = useFilterAlarmDesc(queryAlarmData, 'alarmTime');

/**
 * 搜索
 * @param param
 */
const handleSearch = (param: any) => {
    params.value = param;
};

// 选中的数据的id
const selectIds = ref<Array<number | string>>([]);
const type = ref<string>('xlsx');
const handleExport = async () => {
    let _params: any = null;
    if (!selectIds.value?.length) {
        // todo 没有选中则导出全部
        return;
    } else {
        _params = {
            terms: [
                {
                    column: 'id',
                    value: selectIds.value,
                    termType: 'in',
                },
            ],
        };
    }
    _export(type.value, _params).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: type.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `车辆告警数据-${moment(new Date()).format(
                    'YYYY/MM/DD HH:mm:ss',
                )}`,
                type.value,
            );
        }
    });
};

/**
 * 选中行
 */
const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
        selectIds.value = selectedRowKeys;
    },
    onSelect: (record: any, selected: boolean, selectedRows: any) => {},
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {},
};
</script>

<style lang="less" scoped></style>
