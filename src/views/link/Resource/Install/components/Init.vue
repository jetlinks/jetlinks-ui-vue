<template>
    <div>
        <div class="cloud">
            <a-button
                v-if="source !== 'local'"
                class="cloudBtn"
                type="primary"
                @click="getResourceByCloud"
            >
                从云端获取
            </a-button>
            <div class="upload">
                <a-spin :spinning="loading">
                    <a-upload-dragger
                        v-model:fileList="uploadFile"
                        name="file"
                        :multiple="true"
                        :headers="{
                            [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
                        }"
                        :showUploadList="false"
                        :action="RESOURCE_UPLOAD"
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
                                        拖放安装资源或者点击上方按钮从本地文件中选取资源安装;
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a-upload-dragger>
                </a-spin>
                <List
                    v-if="fileList.length"
                    :source="source"
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
import { _queryResourceCloud, RESOURCE_UPLOAD } from '@/api/link/resource';
import { TOKEN_KEY } from '@/utils/variable';
import { LocalStore } from '@/utils/comm';
import List from './List.vue';
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
const emits = defineEmits(['update:value', 'update:source', 'close']);
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
    });
    if (res.success) {
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
