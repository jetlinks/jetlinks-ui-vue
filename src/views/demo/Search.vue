<template>
  <div class='search'>
    <Search
      :columns='columns'
    />
    <Search type='simple' />
  </div>
</template>

<script setup name='demoSearch'>

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    search: {
      rename: 'deviceId',
      type: 'select',
      handValue: (v) => {
        return '123'
      }
    }
  },
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    scopedSlots: true,
    search: {
      type: 'string',
    }
  },
  {
    title: '分类',
    dataIndex: 'classifiedName',
    key: 'classifiedName',
    search: {
      first: true,
      type: 'treeSelect',
      // options: async () => {
      //   return await
      // }
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
</script>

<style scoped>
.search {
  width: calc(100% - 330px);
}
</style>