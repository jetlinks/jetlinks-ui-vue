<template>
    <div class="permiss-tree-container">
        <a-table :data-source="dataSource">
            <a-table-column key="menu" data-index="menu">
                <template #title><span style="">菜单权限</span></template>
            </a-table-column>
            <a-table-column key="action" title="操作权限" data-index="action" />
            <a-table-column key="data" data-index="data">
                <template #title>
                    <span style="">数据权限</span>
                    <a-checkbox v-model:checked="checked">批量设置</a-checkbox>
                    <a-select
                        v-show="checked"
                        v-model:value="selectValue"
                        :size="'middle'"
                        style="width: 200px"
                        :options="options"
                    ></a-select>
                </template>
            </a-table-column>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { getPrimissTree_api } from '@/api/system/role';

const route = useRoute();
const props = defineProps({
    selectItems: Array,
});
const dataSource = ref([]);
const checked = ref<boolean>(false);
const options = [
    {
        label: '全部数据',
        value: '1',
    },
    {
        label: '所在组织及下级组织',
        value: '2',
    },
    {
        label: '所在组织',
        value: '3',
    },
    {
        label: '自己创建的',
        value: '4',
    },
];
const selectValue = ref<string>('');

const getAllPermiss = () => {
    const id = route.params.id as string;
    getPrimissTree_api(id).then((resp) => {
        console.log(resp);
    });
};

getAllPermiss();
</script>

<style lang="less" scoped>
.permiss-tree-container {
}
</style>
