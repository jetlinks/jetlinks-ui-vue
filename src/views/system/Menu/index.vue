<template>
  <j-page-container>
    <div class="menu-container">
      <pro-search
        :labelWidth="56"
        :columns="columns"
        target="category"
        @search="handleSearch"
      />
      <FullPage>
        <j-pro-table
          ref="tableRef"
          :columns="columns"
          :request="getList"
          :params="queryParams"
          type="TREE"
          mode="TABLE"
          noPagination
          v-model:expandedRowKeys="expandedRowKeys"
          :scroll="{ y: 'calc(100% - 60px)' }"
        >
          <template #headerLeftRender>
            <j-permission-button
              type="primary"
              :hasPermission="`${permission}:add`"
              @click="toDetails({})"
            >
              <AIcon type="PlusOutlined" />新增
            </j-permission-button>
          </template>
          <template #createTime="slotProps">
            <span v-time-format="'YYYY-MM-DD HH:mm:ss'">
              {{ slotProps.createTime }}
            </span>
          </template>
          <template #action="slotProps">
            <a-space :size="16">
              <j-permission-button
                type="link"
                :hasPermission="`${permission}:add`"
                @click="toDetails(slotProps)"
                style="padding: 0"
                :tooltip="{ title: '编辑' }"
              >
                <AIcon type="EditOutlined" />
              </j-permission-button>

              <j-permission-button
                type="link"
                :hasPermission="`${permission}:add`"
                :tooltip="{ title: '新增子菜单' }"
                style="padding: 0"
                @click="addChildren(slotProps)"
              >
                <AIcon type="PlusCircleOutlined" />
              </j-permission-button>
              <j-permission-button
                type="link"
                :hasPermission="`${permission}:delete`"
                :tooltip="{ title: '删除' }"
                danger
                style="padding: 0"
                :popConfirm="{
                  title: `是否删除该菜单`,
                  onConfirm: () => clickDel(slotProps),
                }"
              >
                <AIcon type="DeleteOutlined" />
              </j-permission-button>
            </a-space>
          </template>
        </j-pro-table>
      </FullPage>
    </div>
  </j-page-container>
</template>

<script setup lang="ts" name="Menu">
import { getMenuTree, delMenu } from '@/api/system/menu'
import { useMenuStore } from '@/store/menu'
import { onlyMessage } from '@jetlinks-web/utils'
import {OWNER_KEY} from "@/utils/consts";

const permission = 'system/Menu'

const menuStore = useMenuStore()

const columns = [
  {
    title: '编码',
    dataIndex: 'code',
    key: 'code',
    ellipsis: true,
    fixed: 'left',
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入编码',
      },
    },
    width: 300,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入名称',
      },
    },
  },
  {
    title: '页面地址',
    dataIndex: 'url',
    key: 'url',
    ellipsis: true,
    search: {
      type: 'string',
      componentProps: {
        placeholder: '请输入页面地址',
      },
    },
  },
  {
    title: '排序',
    dataIndex: 'sortIndex',
    key: 'sortIndex',
    ellipsis: true,
    search: {
      type: 'number',
      componentProps: {
        placeholder: '请输入排序',
      },
    },
    width: 80,
  },
  {
    title: '说明',
    dataIndex: 'describe',
    key: 'describe',
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    search: {
      type: 'date',
    },
    width: 200,
    scopedSlots: true,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    scopedSlots: true,
    width: 140,
  },
]
const queryParams = ref({ terms: [] })
const expandedRowKeys = ref<string[]>([])
const tableRef = ref<Record<string, any>>({}) // 表格实例
const total = ref<number>(0)

const handleSearch = (e: any) => {
  queryParams.value = e
  if (!e.length) {
    expandedRowKeys.value = []
  }
}

const getList = async (_params: any) => {
  //过滤非集成的菜单
  const item = {
    terms: [
      {
        terms: [
          {
            column: 'owner',
            termType: 'eq',
            value: OWNER_KEY,
          },
          {
            column: 'owner',
            termType: 'isnull',
            value: '1',
            type: 'or',
          },
        ],
      },
      {
        type: 'or',
        terms: [
          {
            value: '%show":false%',
            termType: 'nlike',
            column: 'options',
          },
        ],
      }
    ],
  }
  const params = {
    ..._params,
    terms:
      _params.terms && _params.length !== 0 ? [..._params.terms, item] : [item],
    sorts: [{ name: 'sortIndex', order: 'asc' }],
    paging: false,
  }
  const resp: any = await getMenuTree(params)
  const lastItem = resp.result[resp.result.length - 1]
  total.value = lastItem ? lastItem.sortIndex + 1 : 1

  return {
    code: resp.message,
    result: resp.result,
    status: resp.status,
    success: resp.status === 200
  }
}
const addChildren = (row: any) => {
  const sortIndex = row?.children?.length || 0
  menuStore.jumpPage('system/Menu/Detail', {
    params: {
      id: ':id',
    },
    query: {
      pid: row.id,
      basePath: row.url || '',
      sortIndex: sortIndex + 1,
    },
  })
}
// 跳转至详情页
const toDetails = (row: any) => {
  menuStore.jumpPage('system/Menu/Detail', {
    params: {
      id: row.id || ':id',
    },
    query: {
      pid: row.id,
      basePath: row.url || '',
      sortIndex: total.value,
    },
  })
}
// 删除
const clickDel = (row: any) => {
  delMenu(row.id).then((resp: any) => {
    if (resp.status === 200) {
      tableRef.value?.reload()
      onlyMessage('操作成功!')
    }
  })
}
</script>
