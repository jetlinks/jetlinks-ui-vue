<template>
  <div class='search'>
    <Search
      :columns='columns'
      target='device-instance-search'
      @search='search'
    />
    <Search
      type='simple'
      :columns='columns'
      target='product'
      @search='search'
    />
  </div>
</template>

<script setup name='demoSearch'>

import { category } from '../../api/device/product'

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    search: {
      rename: 'deviceId',
      type: 'select',
      options: [
        {
          label: '测试1',
          value: 'test1'
        },
        {
          label: '测试2',
          value: 'test2'
        },
        {
          label: '测试3',
          value: 'test3'
        },
      ],
      handleValue: (v) => {
        return '123'
      }
    }
  },
  {
    title: '序号',
    dataIndex: 'sortIndex',
    key: 'sortIndex',
    scopedSlots: true,
    search: {
      type: 'number',
    }
  },
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    search: {
      type: 'string',
    }
  },
  {
    title: '时间',
    dataIndex: 'date',
    key: 'date',
    search: {
      type: 'date',
    }
  },
  {
    title: '时间2',
    dataIndex: 'date2',
    key: 'date2',
    search: {
      type: 'time',
      defaultTermType: 'lt'
    }
  },
  {
    title: '分类',
    dataIndex: 'classifiedName',
    key: 'classifiedName',
    search: {
      first: true,
      type: 'treeSelect',
      options: async () => {
        return new Promise((res) => {
          category().then(resp => {
            res(resp.result)
          })
        })
      }
    }
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 250,
    scopedSlots: true,
  }
]
const search = (params) => {
  console.log(params)
}
</script>

<style scoped>
.search {
  width: calc(100% - 330px);
}
</style>