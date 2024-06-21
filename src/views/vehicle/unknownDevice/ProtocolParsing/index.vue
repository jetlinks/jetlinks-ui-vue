<template>
    <div>
        <pro-search
            :columns="columns"
            target="dataUpload-config"
            @search="handleSearch"
        ></pro-search>
        <PTable
            ref="tableRef"
            :columns="columns"
            model="table"
            :request="queryData"
            :defaultParams="{
                sorts: [{ name: 'reportTime', order: 'desc' }],
            }"
            v-model:params="globParams"
            :gridColumn="3"
        >
            <template #headerTitle>
                <j-space>
                    <PermissionButton
                        :popConfirm="{
                            title: '确认导出',
                            onConfirm: () => handleExport(),
                        }"
                    >
                        <AIcon type="ExportOutlined" />
                        导出
                    </PermissionButton>
                </j-space>
            </template>
            <template #abnormalTime="{abnormalTime}">
              {{
                        abnormalTime
                            ? moment(Number(abnormalTime)).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : ''
                    }}
            </template>
            <template #action="slotProps">
                <a @click="handelDetail(slotProps)" style="color: #f84914"
                    >查看
                </a>
            </template>
        </PTable>
    </div>
</template>

<script setup lang="ts">
import { vehicleTypeEnum } from '@/api/data-report/commonApi';
import { Modal, Textarea } from 'ant-design-vue';
import PTable from '@/components/PTable/index.vue';
import { onlyMessage } from '@/utils/comm';
import moment from 'moment';
const tableRef = ref<Record<string, any>>({});

// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

const handelDetail = (data: any) => {
    let content = '';
    try {
        content = JSON.stringify(data.errorMessage, null, 2);
    } catch (error) {
        content = data.errorMessage;
    }
    Modal.info({
        title: '详细信息',
        width: 700,
        content: h(Textarea, {
            bordered: false,
            rows: 15,
            value: content,
        }),
    });
};

/**
 * @function handleExport 导出
 */
const handleExport = () => {
    onlyMessage('导出成功');
};

const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleTypeEnum',
        key: 'vehicleTypeEnum',
        scopedSlots: true,
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    vehicleTypeEnum().then((resp: any) => {
                        resolve(
                            resp.result.map((item: any) => ({
                                label: item.text,
                                value: item.value,
                            })),
                        );
                    });
                }),
        },
    },
    {
        title: '出厂编号',
        dataIndex: 'factoryNumber',
        key: 'factoryNumber',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '车辆简称',
        dataIndex: 'simpleName',
        key: 'simpleName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },

    {
        title: '子设备',
        dataIndex: 'subEquipment',
        key: 'subEquipment',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '异常时间',
        dataIndex: 'abnormalTime',
        key: 'abnormalTime',
        ellipsis: true,
        scopedSlots: true,
        width: 200,
        search: {
            type: 'date',
        },
    },
    {
        title: '异常说明',
        dataIndex: 'errorMessage',
        key: 'errorMessage',
        ellipsis: true,
        scopedSlots: true,
        width: 200,
        search: {
            type: 'string',
        },
    },
    {
        title: '型号',
        dataIndex: 'modelNumber',
        key: 'modelNumber',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属组织',
        dataIndex: 'orgName',
        key: 'orgName',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];

const queryData = async () => {
    const data: any[] = [];
    for (let i = 0; i < 12; i++) {
        data.push({
            id: `${i}`,
            vehicleTypeEnum: `内燃柴油车${i}`,
            factoryNumber: `出厂编号${i}`,
            simpleName: `90923${i}`,
            subEquipment: `电池${i}`,
            abnormalTime: 1718955275000,
            errorMessage: "{errorMessage:'异常'}",
            modelNumber: '型号',
            orgName: '所属组织',
        });
    }
    return new Promise((resolve) => {
        resolve({
            message: 'success',
            result: {
                pageIndex: 0,
                pageSize: 12,
                total: 100,
                data: data,
            },
            status: 200,
            timestamp: 1718783580064,
        });
    });
};

const handleSearch = (params: any) => {
    globParams.value = params;
};
</script>

<style lang="less" scoped></style>
