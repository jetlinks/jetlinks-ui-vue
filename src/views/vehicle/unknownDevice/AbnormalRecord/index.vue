<template>
    <div>
        <page-container>
            <pro-search
                :columns="columns"
                target="dataUpload-config"
                @search="handleSearch"
            ></pro-search>
            <Full-page>
                <PTable
                    ref="configRef"
                    :columns="columns"
                    :request="queryData"
                    :defaultParams="{
                        // terms: [
                        //     {
                        //         terms: [
                        //             {
                        //                 termType: 'eq',
                        //                 column: 'deviceId',
                        //                 value: route.query.id,
                        //             },
                        //         ],
                        //     },
                        // ],
                        sorts: [{ name: 'reportTime', order: 'desc' }],
                    }"
                    model="table"
                    v-model:params="globParams"
                    :gridColumn="3"
                >
                    <template #headerTitle>
                        <j-space>
                            <j-popconfirm
                                title="确认导出？"
                                ok-text="确定"
                                cancel-text="取消"
                                @confirm="handleExport"
                            >
                                <PermissionButton>
                                    <AIcon type="ExportOutlined" />
                                    导出
                                </PermissionButton>
                            </j-popconfirm>
                        </j-space>
                    </template>

                    <template #action="slotProps">
                        <a-button
                            danger
                            type="text"
                            @click="handelDetail(slotProps)"
                        >
                            查看</a-button
                        >
                    </template>

                    <template #cleaningTime="{ cleaningTime }">
                        {{
                            dayjs(Number(cleaningTime)).format(
                                'YYYY-MM-DD HH:mm:ss',
                            )
                        }}
                    </template>
                    <template #orgName="{ orgName }">
                        {{ orgName || '--' }}
                    </template>
                </PTable>
            </Full-page>
        </page-container>
    </div>
</template>

<script setup lang="ts">
import PTable from '@/components/PTable/index.vue';
import dayjs from 'dayjs';
import { vehicleTypeEnum } from '@/api/data-report/commonApi';
import { Modal, Textarea } from 'jetlinks-ui-components';

// const route = useRoute();

const dataInfo = ref();

const visible = ref(false);


const globParams = ref<Record<string, any>>({});
const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleTypeEnum',
        key: 'vehicleTypeEnum',
        ellipsis: true,
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
        title: '清洗时间',
        dataIndex: 'cleaningTime',
        key: 'cleaningTime',
        ellipsis: true,
        scopedSlots: true,
        width: 200,
        search: {
            type: 'string',
        },
    },
    {
        title: '清洗字段',
        dataIndex: 'cleaningField',
        key: 'cleaningField',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '上报值',
        dataIndex: 'reportedValue',
        key: 'reportedValue',
        ellipsis: true,
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
        title: '查看',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];

const queryData = async () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
        data.push({
            vehicleTypeEnum: `内燃柴油车${i}`,
            factoryNumber: `13025YB5115`,
            simpleName: `000007014${i}`,
            subEquipment: `电池${i}`,
            cleaningTime: 1718789760000,
            cleaningField: '温度',
            reportedValue: '120',
            modelNumber: 'QYCD25-QCG',
            orgName: '组织A',
        });
    }
    return {
        message: 'success',
        result: {
            pageIndex: 0,
            pageSize: 12,
            total: 12,
            data: data,
        },
        status: 200,
    };
};

const handleSearch = (e: any) => {};

const handleExport = () => {};

const handelDetail = (data: any) => {
    let content = '';
    try {
        content = JSON.stringify(data, null, 2);
    } catch (error) {
        console.log('error');
        content = data.content;
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

</script>

<style lang="less" scoped></style>
