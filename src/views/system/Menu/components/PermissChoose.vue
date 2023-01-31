<template>
    <div class="permission-choose-container">
        <a-input
            v-model:value="searchValue"
            style="width: 300px"
            allowClear
            placeholder="请输入权限名称"
        />



    </div>
</template>

<script setup lang="ts">
import { exportPermission_api } from '@/api/system/permission';

const props = defineProps({
    value: Array,
});
const searchValue = ref<string>('');

const permission = reactive({
    list: [] as permissionType[],
    // 获取权限列表
    getList: () => {
        
        exportPermission_api({ paging: false }).then((resp) => {
            permission.list = resp.result as permissionType[]
        });
    },
});

permission.getList()




type permissionType = {
    id: string;
    name: string;
    actions: object[]
}

</script>

<style scoped></style>
