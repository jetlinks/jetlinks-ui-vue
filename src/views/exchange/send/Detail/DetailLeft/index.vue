<template>
    <div class="left-contain">
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

const selectRow = (rowkey: any) => {
    emit('selectData', rowkey);
}

const emit = defineEmits(['selectData']);
</script>
<style lang="less" scoped>
.controls {
    margin: 10px 0;
}

.listBox {
    margin: 10px 0;
}

</style>
