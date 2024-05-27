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
                :request="queryFault"
                model="table"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
                :gridColumn="3"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            :popConfirm="{
                                title: `确认导出？`,
                                onConfirm: () => handleExport(),
                            }"
                        >
                            导出
                        </PermissionButton>
                    </j-space>
                </template>
                <template #faultTime="{ faultTime }">
                    <span>
                        {{ dayjs(faultTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </span>
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { queryFault } from '@/api/data-report/faultSheet';
import dayjs from 'dayjs';
import { downloadObject } from '@/utils/utils';

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleId',
        key: 'vehicleId',
        scopedSlots: true,
    },
    {
        title: '出厂编号',
        dataIndex: '',
        key: '',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '车辆简称',
        dataIndex: '',
        key: '',
        search: {
            type: 'string',
        },
    },
    {
        title: '故障设备',
        dataIndex: '',
        key: '',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '故障码',
        dataIndex: 'faultCode',
        key: 'faultCode',
        scopedSlots: true,
    },
    {
        title: '故障说明',
        dataIndex: 'faultDescription',
        key: 'faultDescription',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '型号',
        dataIndex: '',
        key: '',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属组织',
        dataIndex: '',
        key: '',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '故障时间 ',
        dataIndex: 'faultTime',
        key: 'faultTime',
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '车辆位置',
        dataIndex: 'lngLat',
        key: 'lngLat',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
];

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

/**
 * 导出
 */
const handleExport = () => {
    downloadObject(configRef.value._dataSource, `通知模板数据`);
};
</script>

<style lang="less" scoped></style>
