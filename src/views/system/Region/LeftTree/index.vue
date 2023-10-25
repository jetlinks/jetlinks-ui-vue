<template>
    <j-tree
        class="draggable-tree"
        draggable
        block-node
        v-if="treeData.length"
        :tree-data="treeData"
        @dragenter="onDragEnter"
        @drop="onDrop"
    />
    <j-empty v-else style="margin-top: 150px" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const treeData = ref([]);

const onDragEnter = (info) => {
    // console.log(info);
};

const onDrop = (info) => {
    // console.log(info);
    // const dropKey = info.node.key;
    // const dragKey = info.dragNode.key;
    // const dropPos = info.node.pos.split('-');
    // const dropPosition =
    //     info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // const loop = (data: any, key: string | number, callback: any) => {
    //     data.forEach((item, index) => {
    //         if (item.key === key) {
    //             return callback(item, index, data);
    //         }
    //         if (item.children) {
    //             return loop(item.children, key, callback);
    //         }
    //     });
    // };
    // const data = [...gData.value];
    // // Find dragObject
    // let dragObj: TreeDataItem;
    // loop(
    //     data,
    //     dragKey,
    //     (item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
    //         arr.splice(index, 1);
    //         dragObj = item;
    //     },
    // );
    // if (!info.dropToGap) {
    //     // Drop on the content
    //     loop(data, dropKey, (item: TreeDataItem) => {
    //         item.children = item.children || [];
    //         /// where to insert 示例添加到头部，可以是随意位置
    //         item.children.unshift(dragObj);
    //     });
    // } else if (
    //     (info.node.children || []).length > 0 && // Has children
    //     info.node.expanded && // Is expanded
    //     dropPosition === 1 // On the bottom gap
    // ) {
    //     loop(data, dropKey, (item: TreeDataItem) => {
    //         item.children = item.children || [];
    //         // where to insert 示例添加到头部，可以是随意位置
    //         item.children.unshift(dragObj);
    //     });
    // } else {
    //     let ar: TreeProps['treeData'] = [];
    //     let i = 0;
    //     loop(
    //         data,
    //         dropKey,
    //         (
    //             _item: TreeDataItem,
    //             index: number,
    //             arr: TreeProps['treeData'],
    //         ) => {
    //             ar = arr;
    //             i = index;
    //         },
    //     );
    //     if (dropPosition === -1) {
    //         ar.splice(i, 0, dragObj);
    //     } else {
    //         ar.splice(i + 1, 0, dragObj);
    //     }
    // }
    // gData.value = data;
};
</script>
  
  