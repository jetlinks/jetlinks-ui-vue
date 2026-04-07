<template>
    <div>
        <div class="cloud">
            <a-button
                v-if="source !== 'local'"
                class="cloudBtn"
                type="primary"
                @click="getResourceByCloud"
            >
                {{ $t('components.Init.399777-0') }}
            </a-button>
            <div class="upload">
                <a-spin :spinning="loading">
                    <a-upload-dragger
                        v-model:fileList="uploadFile"
                        name="file"
                        :multiple="true"
                        :headers="getUploadHeaders()"
                        :showUploadList="false"
                        :action="RESOURCE_UPLOAD()"
                        @change="handleChange"
                        @drop="handleDrop"
                    >
                        <div
                            :style="{
                                height: fileList.length
                                    ? 180 + 'px'
                                    : 400 + 'px',
                                padding: 10 + 'px',
                                display: relative,
                            }"
                        >
                            <div class="noData">
                                <AIcon
                                    type="CloudUploadOutlined"
                                    style="font-size: 60px"
                                />
                                <div class="tips">
                                    <div>
                                        {{ $t('components.Init.399777-1') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a-upload-dragger>
                </a-spin>
                <List
                    v-if="fileList.length"
                    :source="source"
                    :loading="loading"
                    v-model:value="fileList"
                    :resourceVersionMap="resourceVersionMap"
                    @cancel="emits('close')"
                    @refresh="emits('refresh')"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { _queryResourceCloud, RESOURCE_UPLOAD } from '@device-manager-ui/api/resource/resource';
import { onlyMessage } from "@jetlinks-web/utils";
import List from './List.vue';
import { useI18n } from 'vue-i18n';
import {getUploadHeaders} from "@jetlinks-web-core/utils";

const { t: $t } = useI18n();
const props = defineProps({
    source: {
        type: String,
        default: '',
    },
    value: {
        type: Array,
        default: () => [],
    },
    resourceVersionMap: {
        type: Object,
        default: () => {},
    },
});
const emits = defineEmits(['update:value', 'update:source', 'close','getByCloudError']);
const fileList = ref([]);
const uploadFile = ref([]);
const loading = ref(false);
const source = ref('');
const handleChange = ({ file }) => {
    source.value = 'local';
    if (file.status === 'uploading') {
        loading.value = true;
    }
    if (file.status === 'done') {
        loading.value = false;
        fileList.value = [...fileList.value, ...(file.response?.result || [])];
        emits('update:value', fileList.value);
        emits('update:source', source.value);
    }
    if(file.status === 'error') {
      onlyMessage($t('components.Init.399777-2'),'error');
      loading.value = false;
    }
};

const getResourceByCloud = async () => {
    source.value = 'cloud';
    const res = await _queryResourceCloud({
        paging: false,
        sorts: [
            {
                name: 'createTime',
                order: 'desc',
            },
        ],
        terms: [
            {
                column: 'state',
                termType: 'eq',
                value: 'success',
            },
        ],
    }).catch((err)=>{
      emits('getByCloudError',err.response?.data?.message)
      emits('update:source', source.value);
    });
    if (res?.success) {
        fileList.value = res.result;
        emits('update:value', fileList.value);
        emits('update:source', source.value);
    }
};

const handleDrop = () => {};

watch(
    () => props.source,
    () => {
        source.value = props.source;
    },
    {
        immediate: true,
    },
);
</script>

<style lang="less" scoped>
.cloud {
    text-align: right;
}

.upload {
    margin-top: 12px;

    .tips {
        text-align: center;
        font-size: 12px;
        margin-top: 24px;
    }

    .noData {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%); /* 将子元素的中心点移到父容器的中心 */
    }

    .header {
        display: flex;
        justify-content: space-between;
    }

    .uploadList {
        height: calc(100% - 20px);
        overflow: auto;
    }
}
</style>
