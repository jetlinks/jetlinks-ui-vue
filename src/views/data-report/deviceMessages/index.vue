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
          :request="queryDeviceLogs"
          model="table"
          :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
          :params="params"
          :gridColumn="3"
          :row-selection="rowSelection"
      >
        <template #headerTitle>
          <j-space>
            <j-popconfirm
                title="确认导出？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleExport"
            >
              <PermissionButton
                  hasPermission="notice/Template:export"
              >
                <AIcon type="ExportOutlined"/>
                <span>导出</span>
              </PermissionButton>
            </j-popconfirm>
          </j-space>
        </template>

        <template #createTime="slotProps">
          {{
            slotProps.createTime
                ? moment(slotProps.createTime).format(
                    'YYYY-MM-DD HH:mm:ss',
                )
                : ''
          }}
        </template>
        <template #type="slotProps">
          {{ slotProps.type.text }}
        </template>
        <template #action="slotProps">
          <a @click="handelDetail(slotProps)" style="color: #f84914"
          >详情
          </a>
        </template>
      </JProTable>
    </FullPage>
  </page-container>
</template>

<script setup lang="ts">
import {deviceLogsExport, queryDeviceLogs,} from '@/api/data-report/deviceMessages';
import {downloadFileByUrl} from '@/utils/utils';
import {onlyMessage} from '@/utils/comm';
import moment from 'moment';

import {Modal, Textarea} from 'jetlinks-ui-components';

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const selectIds = ref<Array<number | string>>([]);

const columns = [
  {
    title: 'ID',
    dataIndex: 'deviceId',
    key: 'deviceId',
    width: 180,
    ellipsis: true,
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
    scopedSlots: true,
    search: {
      type: 'string',
    },
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        {label: '直连设备', value: 'device'},
        {label: '网关子设备', value: 'childrenDevice'},
        {label: '网关设备', value: 'gateway'},
      ],
    },
  },
  {
    title: '时间',
    dataIndex: 'createTime',
    key: 'createTime',
    scopedSlots: true,
    ellipsis: true,
    search: {
      type: 'date',
    },
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 120,
    scopedSlots: true,
    ellipsis: true,
  },
];

const handelDetail = (data: any) => {
  let content = '';
  try {
    content = JSON.stringify(JSON.parse(data.content), null, 2);
  } catch (error) {
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

/**
 * 搜索
 * @param param
 */
const handleSearch = (param: any) => {
  params.value = param;
};

// /**
//  * 通知设备id获取设备名称
//  */
// const getDeviceName = async (id: string) => {
//     const res: any = await getVehicleDevice(id);
//     console.log('result', res.result);
//     if (res.result) {
//         return res.result.name;
//     } else {
//         return '';
//     }
// };

/**
 * 导出
 */
const type = ref<string>('xlsx');
const handleExport = async () => {
  if (!selectIds.value?.length) {
    onlyMessage('请勾选需要导出的数据', 'error');
    return;
  }
  const _params = {
    terms: [
      {
        column: '_id',
        value: selectIds.value,
        termType: 'in',
      },
    ],
  };

  deviceLogsExport(type.value, _params).then((res: any) => {
    if (res) {
      const blob = new Blob([res.data], {type: type.value});
      const url = URL.createObjectURL(blob);
      downloadFileByUrl(
          url,
          `设备消息数据-${moment(new Date()).format(
              'YYYY/MM/DD HH:mm:ss',
          )}`,
          type.value,
      );
    }
  });
};

const rowSelection = {
  onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
    console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
    );
    selectIds.value = selectedRowKeys;
  },
  onSelect: (record: any, selected: boolean, selectedRows: any) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
    console.log(selected, selectedRows, changeRows);
  },
};

// const request = (params: Record<string, any>) =>
//     new Promise((resolve) => {
//         queryDeviceLogs({
//             firstPageIndex: params.pageIndex,
//             pageIndex: params.pageIndex,
//             pageSize: params.pageSize,
//             sorts: params.sorts,
//             terms: params.terms,
//         })
//             .then((response: any) => {
//                 console.log(response, 'response');
//                 resolve({
//                     result: {
//                         data: response.result?.data,
//                         pageIndex: params.pageIndex || 0,
//                         pageSize: params.pageSize || 20,
//                         total: response.result?.total,
//                     },
//                     status: response.status,
//                 });
//             })
//             .catch((error: any) => {
//                 console.log(error);
//             });
//     });
</script>

<style lang="less" scoped></style>
