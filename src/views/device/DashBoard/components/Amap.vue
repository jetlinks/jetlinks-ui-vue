<template>
    <div style="width: 100%; height: 400px">
        <el-amap 
        >
        </el-amap>
    </div>
</template>

<script lang="ts" setup>
import { initAMapApiLoader } from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css';
initAMapApiLoader({
    // key: '95fa72137f4263f8e64ae01f766ad09c',
    key: 'a0415acfc35af15f10221bfa5a6850b4',
    securityJsCode: 'cae6108ec3dd222f946d1a7237c78be0',
});
</script>
<style scoped>
</style>