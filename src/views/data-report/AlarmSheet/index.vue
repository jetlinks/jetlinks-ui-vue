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
      >
        <template #headerTitle>
          <j-space>
            <PermissionButton
                :popConfirm="{
                                title: `确认导出？`,
                                onConfirm: () => handleExport(),
                            }"
            >
              <AIcon type="ExportOutlined"/>
              导出
            </PermissionButton>
          </j-space>
        </template>

        <template #alarmTime="{ alarmTime }">
          {{ dayjs(alarmTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </JProTable>
    </FullPage>
  </page-container>
</template>

<script setup lang="ts">
import {downloadFileByUrl} from '@/utils/utils';
import {PageIndex, query} from '@/api/data-report/commonApi';
import dayjs from 'dayjs';
import {FullPage} from 'components/Layout';
import {getDicList, _export} from '@/api/data-report/alarmSheet';
import moment from "moment";

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

// 存储告警信息
const dicMap = new Map<string, any>();
// 处理告警信息
(async () => {
  const res: any = await getDicList({
    sorts: [
      {
        name: 'ordinal',
        order: 'desc',
      },
    ],
  });
  if (res.status === 200) {
    const data = res.result.data;
    data &&
    data.forEach((dic: any) => {
      dicMap.set(dic.dictId, {
        id: dic.dictId,
        value: dic.value,
        desc: dic.text,
      });
    });
  }
})();

/**
 * @function queryData 请求数据
 * @param _params
 */
const queryData = async (_params: any) => {
  // 1.处理表格组件传递的参数
  const data = {..._params};
  const resp: any = await query(PageIndex.AlarmSheet, data);
  if (resp.status === 200) {
    const records = resp.result.data;
    // 为表格记录对象添加描述字段
    records.forEach((record: any) => {
      if (record.alarmDictionaryKey) {
        record['description'] = dicMap.get(
            record.alarmDictionaryKey,
        )?.desc;
      }
    });
    return {
      // 仿造请求结果返回给表格
      code: resp.status,
      result: resp.result,
      status: resp.status,
    };
  } else {
    return {
      code: 200,
      result: {
        data: [],
        pageIndex: 0,
        pageSize: 0,
        total: 0,
      },
      status: 200,
    };
  }
};

const columns = [
  {
    title: '车辆类型',
    dataIndex: 'vehicleTypeEnum',
    key: 'vehicleTypeEnum',
    ellipsis: true,
    scopedSlots: true,
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
    title: '型号',
    dataIndex: 'modelNumber',
    key: 'modelNumber',
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
  },
  {
    title: '告警时间',
    dataIndex: 'alarmTime',
    key: 'alarmTime',
    scopedSlots: true,
  },
  {
    title: '车辆位置',
    dataIndex: 'lngLat',
    key: 'lngLat',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'string',
    },
  },
  {
    title: '告警设备',
    dataIndex: 'alarmDeviceName',
    key: 'alarmDeviceName',
    scopedSlots: true,
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: '告警说明 ',
    dataIndex: 'description',
    key: 'description',
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
const handleSearch = (params: any) => {
  params.value = params;
};

/**
 * 导出
 */

const type = ref<string>('xlsx');

const handleExport = async (_params: any) => {
  const data = {..._params};
  _export(type.value, data).then((res: any) => {
    if (res) {
      const blob = new Blob([res.data], {type: type.value});
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

const rowSelection = {
  onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
    console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
    );
  },
  onSelect: (record: any, selected: boolean, selectedRows: any) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
    console.log(selected, selectedRows, changeRows);
  },
};
</script>

<style lang="less" scoped></style>
