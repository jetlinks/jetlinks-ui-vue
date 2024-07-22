<template>
    <PermissionButton
        type="primary"
        @click="handleAdd"
        block
        ghost
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
                    <Ellipsis style="width: 100% ">
                        {{ i.name }}
                    </Ellipsis>
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
        if (treeData.value.length) {
            !changeSelect ?  selectItem(treeData.value[0]) : selectItem(treeData.value.find((i)=>{
                return selectedId.value = i.id
            }))
        }else{
            selectedId.value = '';
            emit("viewData",{
                type:'noData'
            })
        }
    }
};
const selectItem = (data) => {
    selectedId.value = data.id;
    emit('viewData', data);
};
const handleAdd = () => {
    selectedId.value = '';
    emit('viewData', {
        type:'add'
    });
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
.listContainer {
    margin-top: 10px;
    height: calc(100% - 50px);
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 5px; /* 滚动条宽度 */
        background-color: #edf5ff; /* 滚动条背景色 */
    }
    &::-webkit-scrollbar-thumb {
        background-color: #d0d0d0; /* 滚动条拖动部分颜色 */
        border-radius: 4px; /* 滚动条拖动部分圆角 */
    }
}
.itemText{
    width: calc(100% - 50px)
}
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
