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
              :request="TemplateApi.list"
              model="table"
              :defaultParams="{
                  sorts: [{ name: 'createTime', order: 'desc' }],
              }"
              :params="params"
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
                          <PermissionButton
                              hasPermission="notice/Template:export"
                          >
                              导出
                          </PermissionButton>
                      </j-popconfirm>
                  </j-space>
              </template>
              <template #type="slotProps">
                  <span> {{ getMethodTxt(slotProps.type) }}</span>
              </template>
              <template #provider="slotProps">
                  <span>
                      {{ getProviderTxt(slotProps.type, slotProps.provider) }}
                  </span>
              </template>
          </JProTable>
      </FullPage>
  </page-container>
</template>

<script setup lang="ts">
import TemplateApi from '@/api/notice/template';
import type { ActionsType } from '@/views/device/Instance/typings';
import { NOTICE_METHOD, MSG_TYPE } from '@/views/notice/const';
import { downloadObject } from '@/utils/utils';
import { useMenuStore } from 'store/menu';
import { onlyMessage } from '@/utils/comm';

const menuStory = useMenuStore();

let providerList: any = [];
Object.keys(MSG_TYPE).forEach((key) => {
  providerList = [...providerList, ...MSG_TYPE[key]];
});

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
  {
      title: '车辆类型',
      dataIndex: 'provider',
      key: 'provider',
      scopedSlots: true,
      search: {
          type: 'select',
          options: providerList,
          handleValue: (v: any) => {
              return v;
          },
      },
  },
  {
      title: '出厂编号',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      search: {
          type: 'string',
      },
  },
  {
      title: '车辆简称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      search: {
          type: 'string',
      },
  },
  {
      title: '故障设备',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      search: {
          type: 'string',
      },
  },
  {
      title: '故障码',
      dataIndex: 'description',
      key: 'description',
      scopedSlots: true,
      ellipsis: true,
      search: {
          type: 'string',
      },
  },
  {
      title: '故障说明',
      dataIndex: 'description',
      key: 'description',
      scopedSlots: true,
      ellipsis: true,
      search: {
          type: 'string',
      },
  },
  {
      title: '型号',
      dataIndex: 'description',
      key: 'description',
      scopedSlots: true,
      ellipsis: true,
      search: {
          type: 'string',
      },
  },
  {
      title: '所属组织',
      dataIndex: 'type',
      key: 'type',
      scopedSlots: true,
      search: {
          type: 'select',
          options: NOTICE_METHOD,
          handleValue: (v: any) => {
              return v;
          },
      },
  },
  {
      title: '故障时间',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      search: {
          type: 'string',
      },
  },
  {
      title: '车辆位置',
      dataIndex: 'name',
      key: 'name',
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
  // console.log('handleSearch:', e);
  params.value = e;
  // console.log('params.value: ', params.value);
};

/**
* 根据通知方式展示对应logo
*/
const getLogo = (type: string, provider: string) => {
  return MSG_TYPE[type].find((f: any) => f.value === provider)?.logo;
};
/**
* 通知方式字段展示对应文字
*/
const getMethodTxt = (type: string) => {
  return NOTICE_METHOD.find((f) => f.value === type)?.label;
};
/**
* 根据类型展示对应文案
* @param type
* @param provider
*/
const getProviderTxt = (type: string, provider: string) => {
  return MSG_TYPE[type].find((f: any) => f.value === provider)?.label;
};

/**
* 导出
*/
const handleExport = () => {
  downloadObject(configRef.value._dataSource, `通知模板数据`);
};

const currentConfig = ref<Partial<Record<string, any>>>();
</script>

<style lang="less" scoped></style>