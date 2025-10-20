<template>
  <j-page-container>
    <CrudTable
        :request="query"
        :columns="columns"
        target="device-instance"
        :actions="otherActions"
        :schema="schema"
        :permission="permission"
        :imgUrl="(slotProps) => slotProps?.photoUrl || device.deviceCard"
        :contentList="(dt) => getContentList(dt)"
        :updateRequest="update"
        :handleRequestData="handleRequestData"
        :defaultParams="{
            sorts: [{ name: 'createTime', order: 'desc' }, { name: 'name', order: 'desc'}],
        }"
        :deleteRequest="_delete"
        :status="(slotProps) => slotProps.state?.value"
        :statusText="(slotProps) => slotProps.state?.text"
        :statusNames="{
            online: 'processing',
            offline: 'error',
            notActive: 'warning',
        }"
        @itemClick="onItemClick"
        ref="tableRef"
        :showSelect="true"
    >
      <template #createTime="slotProps">
        <span>{{
            slotProps?.createTime
                ? dayjs(slotProps.createTime).format(
                    'YYYY-MM-DD HH:mm:ss',
                )
                : ''
          }}</span>
      </template>
      <template #state="slotProps">
        <j-badge-status
            :status="slotProps.state?.value"
            :text="slotProps.state?.text"
            :statusNames="{
                online: 'processing',
                offline: 'error',
                notActive: 'warning',
            }"
        />
      </template>
    </CrudTable>
  </j-page-container>
</template>

<script setup>
import {query, update, _delete} from '@device-manager-ui/api/instance';
import CrudTable from '@/components/CrudTable/index.vue'
import {useI18n} from "vue-i18n";
import {device} from "@device-manager-ui/assets";
import {queryNoPagingPost} from "@device-manager-ui/api/product";
import dayjs from "dayjs";

const {t: $t} = useI18n();

// 权限
const permission = 'device/Instance'

// 表格的columns和搜索组件的columns
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    search: {
      type: 'string',
      defaultTermType: 'eq',
    },
  },
  {
    title: $t('Instance.index.133466-4'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
      first: true,
    },
  },
  {
    title: $t('Instance.index.133466-5'),
    dataIndex: 'createTime',
    key: 'createTime',
    scopedSlots: true,
    width: 200,
    search: {
      type: 'date',
    },
  },
  {
    title: $t('Instance.index.133466-6'),
    dataIndex: 'state',
    key: 'state',
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        {label: $t('Instance.index.133466-7'), value: 'notActive'},
        {label: $t('Instance.index.133466-8'), value: 'offline'},
        {label: $t('Instance.index.133466-9'), value: 'online'},
      ],
    },
  },
  {
    dataIndex: 'deviceType',
    title: $t('Instance.index.133466-1'),
    valueType: 'select',
    hideInTable: true,
    search: {
      type: 'select',
      options: [
        {label: $t('Instance.index.133466-12'), value: 'device'},
        {label: $t('Instance.index.133466-13'), value: 'childrenDevice'},
        {label: $t('Instance.index.133466-14'), value: 'gateway'},
      ],
    },
  },
  {
    title: $t('Instance.index.133466-18'),
    dataIndex: 'describe',
    key: 'describe',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Instance.index.133466-19'),
    key: 'actions',
    fixed: 'right',
    width: 200,
    scopedSlots: true,
  },
]

// 新增和编辑弹窗的字段schema
const schema = [
  {
    label: 'ID',
    name: 'id',
    rules: [
      {
        required: true,
        message: '请输入ID'
      }
    ],
    componentProps: {
      placeholder: '请输入ID'
    },
    getDisabled: (data) => !!data?.id
  },
  {
    label: '名称',
    name: 'name',
    componentProps: {
      placeholder: '请输入名称'
    }
  },
  {
    label: '所属产品',
    name: 'productId',
    itemType: 'select',
    componentProps: {
      placeholder: '请选择',
      options: () => {
        return new Promise(async (resolve) => {
          const resp = await queryNoPagingPost({
            paging: false,
            sorts: [{name: 'createTime', order: 'desc'}],
            terms: [
              {
                terms: [
                  {
                    termType: 'eq',
                    column: 'state',
                    value: 1,
                  },
                ],
              },
            ],
          })
          const arr = []
          if (resp.success) {
            resp.result.map(item => {
              arr.push({
                ...item,
                label: item.name,
                value: item.id,
              })
            })
          }
          resolve(arr)
        })
      }
    }
  },
  {
    label: '说明',
    name: 'describe',
    itemType: 'textarea',
    componentProps: {
      placeholder: '请输入说明',
      showCount: true,
      maxlength: 200,
    }
  },
]

// 除了增删改查其他的按钮操作
const otherActions = [
  {
    key: 'action',
    text: (data) => {
      return data.state?.value !== 'notActive' ? $t('Instance.index.133466-7') : $t('Instance.index.133466-22')
    },
    tooltip: {
      title: (data) => {
        return data.state?.value !== 'notActive' ? $t('Instance.index.133466-7') : $t('Instance.index.133466-22')
      },
    },
    icon: (data) => {
      return data.state.value !== 'notActive'
          ? 'StopOutlined'
          : 'CheckCircleOutlined'
    },
    hasPermission: `${permission}:action`,
    popConfirm: {
      title: (data) => {
        return `${$t('Instance.index.133466-23', [data.state.value !== 'notActive' ? $t('Instance.index.133466-7') : $t('Instance.index.133466-22')])}`
      },
      onConfirm: async () => {
        console.log('onConfirm')
      },
    },
  },
];

const tableRef = ref()

// card的content的字段展示，复杂的可以自己写插槽
const getContentList = (dt) => {
  return [
    {
      text: $t('Instance.index.133466-1'),
      value: dt.deviceType?.text
    },
    {
      text: $t('Instance.index.133466-2'),
      value: dt.productName
    },
  ]
}

// 处理编辑和新增的字段
const handleRequestData = (dt) => {
  return {
    id: dt.id,
    productId: dt.productId,
    productName: dt.productName,
    name: dt.name,
    describe: dt.describe,
  }
}

// 点击事件
const onItemClick = (dt) => {
  console.log(dt, 'dt')
  // console.log(tableRef.value, '123')
}
</script>

