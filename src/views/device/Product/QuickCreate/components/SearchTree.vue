<template>
    <a-input placeholder="请输入关键词"></a-input>
    <a-tree :fieldNames="{
        title: 'name',
        key: 'id',
        children: 'children'
    }" :tree-data="data">

    </a-tree>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Object,
        default: () => {

        }
    }
})
</script>
<style lang='less' scoped></style>