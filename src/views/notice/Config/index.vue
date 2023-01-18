<!-- 通知配置 -->
<template>
    <div class="page-container">通知配置</div>
</template>

<script setup lang="ts">
import configApi from '@/api/notice/config';

const getList = async () => {
    const res = await configApi.list({
        current: 1,
        pageIndex: 0,
        pageSize: 12,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [],
    });
    console.log('res: ', res);
};
getList();
</script>

<style lang="less" scoped></style>
