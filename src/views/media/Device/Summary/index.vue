<template>
    <a-drawer
        visible
        placement="right"
        :width="600"
        :maskClosable="false"
        @close="$emit('closeDrawer')"
    >
        <div>
            <div>{{ deviceData?.name }}</div>
            <div>
                设备ID：
                <a @click="jumpDetail">{{ deviceData?.id }}</a>
            </div>
            <a-descriptions bordered :column="1">
                <a-descriptions-item label="接入方式">{{
                    deviceData?.provider
                }}</a-descriptions-item>
                <a-descriptions-item label="所属产品">{{
                    deviceData?.productName
                }}</a-descriptions-item>
                <a-descriptions-item
                    v-if="deviceData?.provider === 'onvif'"
                    label="接入地址"
                    >{{ deviceData?.others?.onvifUrl }}</a-descriptions-item
                >
                <a-descriptions-item
                    v-if="deviceData?.provider === 'onvif'"
                    label="接入账户"
                    >{{
                        deviceData?.others?.onvifUsername
                    }}</a-descriptions-item
                >
                <a-descriptions-item
                    v-if="
                        ['onvif', 'gb28181-2016'].includes(deviceData?.provider)
                    "
                    label="接入密码"
                    >{{ deviceData?.provider=== 'onvif' ?  deviceData?.others?.onvifPassword : deviceData?.others?.access_pwd}}</a-descriptions-item
                >
                <a-descriptions-item label="说明">{{
                    deviceData?.description || '--'
                }}</a-descriptions-item>
            </a-descriptions>
        </div>
    </a-drawer>
</template>

<script setup>
import { useMenuStore } from 'store/menu';
import DeviceApi from '@/api/media/device';
const props = defineProps({
    deviceId: {
        type: Object,
    },
});
const menuStory = useMenuStore();
const deviceData = ref();
const jumpDetail = (data) => {
    menuStory.jumpPage('device/Instance/Detail', { id: props.deviceId });
};
const getProductList = async () => {
    const params = {
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [{ column: 'id', value: deviceData.value?.productId }],
    };
    const res = await DeviceApi.queryProductList(params);
    if (res.success) {
        deviceData.value.productName = res.result?.[0]?.name;
        if (deviceData.value.channel !== 'media-plugin') {
            deviceData.value.others.access_pwd = deviceData.value.others
                .access_pwd
                ? deviceData.value.others.access_pwd
                : res.result?.[0]?.configuration?.access_pwd;
        }
    }
};
/**
 * 获取详情
 */
const getDetail = async () => {
    const res = await DeviceApi.detail(props.deviceId);
    if (res.success) {
        deviceData.value = res.result;
        await getProductList();
    }
};
onMounted(() => {
    getDetail();
});
</script>
<style lang="less" scoped></style>
