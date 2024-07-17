<template>
  <div class="table-search">
    <div>
      <div>
        <a-spin>
          <span>查找</span>
          <a-input />
          <a-button>查抄全部</a-button>
          <a-button>上一个</a-button>
          <a-button>下一个</a-button>
        </a-spin>
      </div>
      <div>
        <a-button>关闭</a-button>
      </div>
    </div>
    <div>
      <a-table

      >

      </a-table>
      查找到 {{ }} 条相关属性
    </div>
  </div>
</template>

<script setup name="MetadataTableSearch">

import {useTableDataSource} from "components/Metadata/Table/context";

const dataSource = useTableDataSource()

</script>

<style scoped lang="less">

</style>
