<template>
    <a-drawer
        visible
        placement="right"
        :width="600"
        :closable="false"
        @close="$emit('closeDrawer')"
    >
        <template #title>
            <div class="deviceName">
                <Ellipsis style="max-width: 400px">{{
                    deviceData?.name
                }}</Ellipsis>
            </div>
            <div class="deviceId">
                <span> {{ $t('Summary.index.1174514-0') }} </span>
                <a @click="jumpDetail">{{ deviceData?.id }}</a>
            </div>
        </template>
        <div>
            <a-descriptions bordered :column="1">
                <a-descriptions-item :label="$t('Summary.index.1174514-1')">{{
                    PROVIDER_OPTIONS.find(
                        (i) => i.value === deviceData?.provider,
                    )?.label
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('Summary.index.1174514-2')">{{
                    deviceData?.productName
                }}</a-descriptions-item>
                <a-descriptions-item
                    v-if="deviceData?.provider === 'onvif'"
                    :label="$t('Summary.index.1174514-3')"
                    >{{ deviceData?.others?.onvifUrl }}</a-descriptions-item
                >
                <a-descriptions-item
                    v-if="deviceData?.provider === 'onvif'"
                    :label="$t('Summary.index.1174514-4')"
                    >{{
                        deviceData?.others?.onvifUsername
                    }}</a-descriptions-item
                >
                <a-descriptions-item
                    v-if="
                        ['onvif', 'gb28181-2016'].includes(deviceData?.provider)
                    "
                    :label="$t('Summary.index.1174514-5')"
                    ><div class="password">
                        <span>{{ showPassword }}</span>
                        <AIcon
                            :type="
                                visiblePassword
                                    ? 'EyeInvisibleOutlined'
                                    : 'EyeOutlined'
                            "
                            @click="visiblePassword = !visiblePassword"
                            class="passwordIcon"
                        ></AIcon></div
                ></a-descriptions-item>
                <a-descriptions-item :label="$t('Summary.index.1174514-6')">{{
                    deviceData?.description || '--'
                }}</a-descriptions-item>
            </a-descriptions>
        </div>
    </a-drawer>
</template>

<script setup>
import { useMenuStore } from 'store/menu';
import DeviceApi from '@/api/media/device';
import { PROVIDER_OPTIONS } from '../const';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
    deviceId: {
        type: Object,
    },
});
const menuStory = useMenuStore();
const deviceData = ref();

const visiblePassword = ref(false);
const showPassword = computed(() => {
    let password =
        deviceData.value?.provider === 'onvif'
            ? deviceData.value?.others?.onvifPassword
            : deviceData.value?.others?.access_pwd;
    if (!visiblePassword.value) {
        let hiddenPassword  = ''
        for (let i = 0; i < password.length; i++) {
            hiddenPassword += '*'
        }
        return hiddenPassword
    }else{
        return password
    }
});
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
        if (deviceData.value.provider !== 'media-plugin') {
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
<style lang="less" scoped>
.deviceId {
    font-size: 13px;
    span {
        color: #777777;
    }
}
.deviceName {
    font-size: 16px;
    font-weight: 600;
}
.password {
    position: relative;
    .passwordIcon {
        position: absolute;
        right: 0;
        top: 5px;
    }
}
</style>
