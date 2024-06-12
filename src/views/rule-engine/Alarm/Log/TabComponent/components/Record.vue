<template>
    <a-table :dataSource="dataSource" :columns="columns"> </a-table>
</template>

<script  setup>
import { queryHandleHistory } from '@/api/rule-engine/log';
const dataSource = ref()
const queryList = async () => {
    const res = await queryHandleHistory({
        sorts: [{ name: 'createTime', order: 'desc' }],
        pageIndex: 0,
        pageSize: 51,
    });
    if (res.success) {
      if(res.result.data?.length > 50){
        
      }
    }
};
onMounted(() => {
    queryList();
});
</script>
<style lang="less" scoped></style>

