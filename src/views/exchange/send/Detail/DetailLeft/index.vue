<template>
    <div class="left-contain">
        <j-input
            placeholder="搜索"
            v-model:value="searchValue"
            @pressEnter="search"
        >
            <template #suffix>
                <AIcon type="SearchOutlined" @click="search" />
            </template>
        </j-input>
        <div class="listBox">
            <j-tree :tree-data="props.productListData" v-if="props.productListData.length"
                :fieldNames="{ title: 'name', key: 'id', children: 'children' }"
                :showLine="{ showLeafIcon: false }" @select="selectRow">
            </j-tree>
            <j-empty v-else style="margin-top: 100px" />
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    productListData: {
        type: Object,
        default: [],
    },
})

const searchValue = ref()
const productList = ref<any>([])

watch(props.productListData,(newValue: any)=>{
    productList.value = newValue
})

const search = () => {
    emit('searchValue', searchValue.value);
};

const selectRow = (rowkey: any) => {
    emit('selectData', rowkey);
}

const emit = defineEmits(['selectData','searchValue']);
</script>
<style lang="less" scoped>
.controls {
    margin: 10px 0;
}

.listBox {
    margin: 10px 0;
}

</style>
