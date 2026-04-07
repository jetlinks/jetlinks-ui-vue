<template>
    <div style="margin-top: 8px">
        <a-tree
            v-if="data.length"
            :fieldNames="{
                title: 'name',
                key: 'id',
                children: 'children',
            }"
            :tree-data="data"
            v-model:selectedKeys="selectedKeys"
            v-model:expanded-keys="_expanedKeys"
            @select="select"
        >
          <template #title="dt">
            <j-ellipsis>{{dt.name}}</j-ellipsis>
          </template>
        </a-tree>
        <div  v-else style="margin-top: 20%">
          <j-empty />
        </div>
    </div>
</template>

<script setup>
import {cloneDeep} from "lodash-es";

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
  expandedKeys:{
      type: Array,
      default: () => [],
  }
});
const emits = defineEmits(['select']);
const selectedKeys = ref();
const _expanedKeys = ref([])
const select = (selectedKeys) => {
    emits('select', selectedKeys[0]);
};
watch(()=>props.expandedKeys, () => {
  _expanedKeys.value = cloneDeep(props.expandedKeys);
},{
  deep: true,
})
</script>
<style lang="less" scoped>
</style>
