<template>
    <PermissionButton
        type="primary"
        @click="handleAdd"
        block
        hasPermission="Northbound/DuerOS:add"
    >
        <template #icon><AIcon type="PlusOutlined" /></template>
        新增
    </PermissionButton>
    <div class="listContainer">
        <template v-if="treeData?.length">
            <div
                v-for="i in treeData"
                class="listItem"
                @click="() => selectItem(i)"
                :class="{ selected: i.id === selectedId }"
            >
                <div class="itemText">
                    {{ i.name }}
                </div>
                <div
                    class="status"
                    :style="{
                        color:
                            i.state?.value === 'disabled' ? 'red' : '#70b603',
                    }"
                >
                    {{ i.state?.value === 'disabled' ? '禁用' : '启用' }}
                </div>
            </div>
        </template>
        <j-empty v-else style="margin-top: 200px"></j-empty>
    </div>
</template>

<script setup>
import { queryPaginateNot } from '@/api/northbound/alicloud';
import { defineExpose } from 'vue';
const props = defineProps({
    params: {
        type: Object,
    },
});
const emit = defineEmits(['viewData']);
const treeData = ref();
const selectedId = ref();
const queryList = async (changeSelect = false) => {
    const queryParams = props.params
        ? {
              paging: false,
              sorts: [{ name: 'createTime', order: 'desc' }],
              ...props.params,
          }
        : {
              paging: false,
              sorts: [{ name: 'createTime', order: 'desc' }],
          };
    const res = await queryPaginateNot(queryParams);
    if (res.success) {
        treeData.value = res.result;
        if (treeData.value.length && !changeSelect) {
            selectItem(treeData.value[0]);
        }
    }
};
const selectItem = (data) => {
    selectedId.value = data.id;
    emit('viewData', data);
};
const handleAdd = () => {
    selectedId.value = '';
    emit('viewData', {});
};

const refresh = (changeSelect) => {
    queryList(changeSelect);
};

watch(
    () => props.params,
    () => {
        queryList();
    },
    {
        deep: true,
        immediate: true,
    },
);

defineExpose({
    refresh,
});
</script>
<style lang="less" scoped>
.listItem {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    cursor: pointer;
    padding: 5px;
}
.selected {
    background-color: #f2f2f2;
}
</style>
