<template>
    <Card :infoData="info" @saveData="saveData" />
</template>

<script lang="ts" setup>
import Card from './component/Card.vue';
import { getModule, licenseInit, initPage } from '@/api/system/license';
import { onlyMessage } from '@/utils/comm';
let info = ref();
const saveData = (data: any) => {
    if (data) {
        save(data);
    } else {
        onlyMessage('请配置License', 'error');
    }
};
const getInfo = async () => {
    const res = await getModule();
    if (res.status === 200) {
        info.value = res.result;
    }
};
const save = async (data: any) => {
    const res: any = await licenseInit(data);
    if (res.status === 200) {
        onlyMessage('配置成功');
        const resp: any = await initPage();
        if (resp.status === 200 && !resp.result.length) {
            window.location.href = '/#/init-home';
        } else {
            window.location.href = '/';
        }
    }
};
onMounted(() => {
    getInfo();
});
</script>
<style lang="less" scoped>
</style>