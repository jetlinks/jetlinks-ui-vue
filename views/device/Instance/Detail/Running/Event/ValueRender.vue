<template>
    <a-button type="link" @click="handleCheck">
        {{ $t('Product.index.660348-12') }}
    </a-button>
    <a-modal
        :open="visible"
        :title="$t('Product.index.660348-12')"
        @cancel="visible = false"
        @ok="visible = false"
    >
        <img
            style="width: 100%;object-fit: contain;"
            :src="blobUrl"
            alt=""
        />
    </a-modal>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {downloadFileByUrl} from "@jetlinks-web/utils";
import { proxyUrl } from '../../../../../../api/instance';
import { useInstanceStore } from "../../../../../../store/instance";

const props = defineProps({
    data: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({}),
    },
    dataIndex: {
        type: String,
        default: '',
    }
})

const visible = ref(false);
const instanceStore = useInstanceStore();
const handleDownload = () => {
    const link = new URL(props.data[props.dataIndex]);
    const path = link.pathname;
    const extension = path.split('.').pop().toLowerCase();
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = () => {
        const blob = xhr.response;
        const url = window.URL.createObjectURL(blob);
        downloadFileByUrl(url, path, extension);
    }
    xhr.open('GET', props.data[props.dataIndex]);
    xhr.send();
}

const blobUrl = ref();
const handleCheck = () => {
    const url = props.data[props.dataIndex];
    if(instanceStore.current.accessProvider === 'agent-device-gateway') {
        visible.value = true;
        proxyUrl(instanceStore?.current.deviceType.value === 'childrenDevice' ? instanceStore.current?.parentId : instanceStore.current.id, url).then(res => {
            const blob = new Blob([res]);
            blobUrl.value = window.URL.createObjectURL(blob);
        })
    } else {
        handleDownload();
    }
}

</script>

<style scoped lang="less">

</style>