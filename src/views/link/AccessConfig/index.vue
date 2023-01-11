<template>
    <a-button type="primary" @click="handlAdd">新增</a-button>
</template>
<script lang="ts" setup name="AccessConfigPage">
const router = useRouter();

// const handlAdd = () => {
//     router.push({
//         path: '/link/accessConfig/detail/add',
//         query: {
//             id: '1610475400026861568',
//         },
//     });
// };
const handlAdd = () => {
  router.push('/link/accessConfig/detail/add');
}
</script>
