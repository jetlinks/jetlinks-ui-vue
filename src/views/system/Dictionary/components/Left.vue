<template>
  <div class="left-contain">
    <j-input placeholder="字典名称">
        <template #suffix>
            <AIcon type="SearchOutlined" />
        </template>
    </j-input>
    <div class="controls">
        <j-button type="primary">新增字典</j-button>
        <j-button type="text">下载</j-button>
        <j-button type="text">导入</j-button>
    </div>
    <div>
        <j-list>
            <template #renderItem="{ item }">
                
            </template>
        </j-list>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>
<style lang="less" scoped>
.controls{
    margin: 10px 0;
}
</style>