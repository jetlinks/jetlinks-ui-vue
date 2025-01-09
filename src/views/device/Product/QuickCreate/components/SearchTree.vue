<template>
    <div style="margin-top: 8px">
        <a-tree
            :fieldNames="{
                title: 'name',
                key: 'id',
                children: 'children',
            }"
            :tree-data="data"
            v-model:selectedKeys="selectedKeys"
            @select="select"
        >
        </a-tree>
    </div>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const emits = defineEmits(['select']);
const selectedKeys = ref();
const select = (selectedKeys) => {
    emits('select', selectedKeys);
};
</script>
<style lang="less" scoped></style>
