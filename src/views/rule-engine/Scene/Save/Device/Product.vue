<template>
  <j-advanced-search
    :columns="columns"
    type='simple'
    @search="handleSearch"
    class="scene-search"
    target="scene-triggrt-device-device"
  />
  <j-divider style='margin: 0' />
  <j-pro-table
    ref='actionRef'
    model='CARD'
    :columns='columns'
    :params='params'
    :request='productQuery'
    :gridColumn='2'
    :gridColumns='[2,2,2]'
    :bodyStyle='{
      paddingRight: 0,
      paddingLeft: 0
    }'
  >
    <template #card="slotProps">
      <CardBox
        :value='slotProps'
        :active="rowKey === slotProps.id"
        :status="slotProps.state"
        :statusText="slotProps.state === 1 ? '正常' : '禁用'"
        :statusNames="{ 1: 'processing', 0: 'error',  }"
        @click="handleClick"
      >
        <template #img>
          <slot name="img">
            <img width='88' height='88' :src="slotProps.photoUrl || getImage('/device-product.png')" />
          </slot>
        </template>
        <template #content>
          <div style='width: calc(100% - 100px)'>
            <Ellipsis>
              <span style="font-size: 16px;font-weight: 600" >
                {{ slotProps.name }}
              </span>
            </Ellipsis>
          </div>
          <j-row>
            <j-col :span="12">
              <div class="card-item-content-text">
                设备类型
              </div>
              <div>直连设备</div>
            </j-col>
          </j-row>
        </template>
      </CardBox>
    </template>
  </j-pro-table>
</template>

<script setup lang='ts' name='Product'>
import { getProviders, queryGatewayList, queryProductList } from '@/api/device/product'
import { queryTree } from '@/api/device/category'
import { getTreeData_api } from '@/api/system/department'
import { isNoCommunity } from '@/utils/utils'
import { getImage } from '@/utils/comm'
import { accessConfigTypeFilter } from '@/utils/setting'

type Emit = {
  (e: 'update:rowKey', data: string): void
  (e: 'update:detail', data: string): void
  (e: 'change', data: string): void
}

const actionRef = ref()
const params = ref({})
const props = defineProps({
  rowKey: {
    type: String,
    default: ''
  },
  detail: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits<Emit>()
const firstFind = ref(true)

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 300,
    ellipsis: true,
    fixed: 'left',
    search: {
      type: 'string',
    },
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    search: {
      type: 'string',
      first: true
    }
  },
  {
    title: '网关类型',
    dataIndex: 'accessProvider',
    width: 150,
    ellipsis: true,
    hideInTable: true,
    search: {
      type: 'select',
      options: () => getProviders().then((resp: any) => {
        return accessConfigTypeFilter(resp.result || [])
      })
    }
  },
  {
    title: '接入方式',
    dataIndex: 'accessName',
    width: 150,
    ellipsis: true,
    search: {
      type: 'select',
      options: () => queryGatewayList().then((resp: any) =>
        resp.result.map((item: any) => ({
          label: item.name, value: item.id
        }))
      )
    }
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: 150,
    search: {
      type: 'select',
      options: [
        { label: '直连设备', value: 'device' },
        { label: '网关子设备', value: 'childrenDevice' },
        { label: '网关设备', value: 'gateway' },
      ]
    }
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: '90px',
    search: {
      type: 'select',
      options: [
        { label: '禁用', value: 0 },
        { label: '正常', value: 1 },
      ]
    }
  },
  {
    title: '说明',
    dataIndex: 'describe',
    ellipsis: true,
    width: 300,
  },
  {
    dataIndex: 'classifiedId',
    title: '分类',
    hideInTable: true,
    search: {
      type: 'treeSelect',
      options: () => {
        return new Promise((res => {
          queryTree({ paging: false }).then(resp => {
            res(resp.result)
          })
        }))
      },
      componentProps: {
        fieldNames: {
          label: 'name',
          value: 'id',
        }
      }
    }
  },
  {
    dataIndex: 'id$dim-assets',
    title: '所属组织',
    hideInTable: true,
    search: {
      type: 'treeSelect',
      options: () => new Promise((resolve) => {
        getTreeData_api({ paging: false }).then((resp: any) => {
          const formatValue = (list: any[]) => {
            return list.map((item: any) => {
              if (item.children) {
                item.children = formatValue(item.children);
              }
              return {
                ...item,
                value: JSON.stringify({
                  assetType: 'product',
                  targets: [
                    {
                      type: 'org',
                      id: item.id,
                    },
                  ],
                }),
              }
            })
          }
          resolve(formatValue(resp.result) || [])
        })
      })
    }
  }
]

const handleSearch = (p: any) => {
  params.value = p
}

const productQuery = async (p: any) => {
  const sorts: any = [];

  if (props.rowKey) {
    sorts.push({
      name: 'id',
      value: props.rowKey,
    });
  }
  sorts.push({ name: 'createTime', order: 'desc' });
  p.sorts = sorts
  const resp = await queryProductList(p)
  if (resp.success && props.rowKey && firstFind.value) {
    const productItem = (resp.result as { data: any[]}).data.find((item: any) => item.id === props.rowKey)
    emit('update:detail', productItem)
    firstFind.value = false
  }
  return {
    ...resp
  }
}

const handleClick = (detail: any) => {
  emit('update:rowKey', detail.id)
  emit('update:detail', detail)
  emit('change', detail)
}

</script>

<style scoped lang='less'>
.search {
  margin-bottom: 0;
  padding-right: 0px;
  padding-left: 0px;
}
</style>