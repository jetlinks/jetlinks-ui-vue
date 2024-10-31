<template>
    <a-button type="link" @click="handleCheck">
        查看
    </a-button>
    <a-modal
        :visible="visible"
        title="查看"
        @cancel="visible = false"
        @ok="visible = false"
    >
        <div style="display: flex;justify-content: center">
            <img
                v-if="isImage"
                :src="data[dataIndex]"
                alt=""
            />
            <img
                v-else
                :src="blobUrl"
                alt=""
            />
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {downloadFileByUrl} from "@/utils/utils";
import { proxyUrl } from '@/api/device/instance';
import { useInstanceStore } from "store/instance";

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
const isImage = ref(false);
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
    const img = new Image();
    img.src = url;
    img.onload = () => {
        isImage.value = true;
        visible.value = true;
    }
    img.onerror = () => {
        isImage.value = false;
        if(instanceStore.current.accessProvider === 'agent-device-gateway') {
            visible.value = true;
            proxyUrl(instanceStore.current.id, url).then(res => {
                const blob = new Blob([res]);
                blobUrl.value = window.URL.createObjectURL(blob);
            })
        } else {
            handleDownload();
        }
    }
}

</script>

<style scoped lang="less">

</style>