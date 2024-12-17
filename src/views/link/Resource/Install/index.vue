<template>
    <a-modal title="安装资源" visible @cancel="emits('close')" :maskClosable="false" :width="800">
        <template #footer>
            <div v-if="uploadFileList.length">
                <a-button>取消</a-button>
                <a-button>全部安装</a-button>
            </div>
        </template>
        <div class="upload_container" v-if="false">
            <div class="cloud" v-if="!uploadFileList.length">
                <a-button class="cloudBtn" type="primary">从云端获取</a-button>
            </div>
            <div class="upload">
                <a-upload-dragger v-model:fileList="fileList" name="file" :multiple="true" :maxCount="10"
                    :action="FILE_UPLOAD" @change="handleChange" @drop="handleDrop">
                    <div style="height: 400px; padding: 0 10px">
                        <div v-if="!uploadFileList.length" class="noData">
                            <AIcon type="PlusSquareOutlined" style="font-size: 100px" />
                            <div class="tips">
                                <div>拖放安装资源或者点击上方按钮从本地文件中选取资源安装;</div>
                                <div>单次支持最多选取10个资源文件</div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="header">
                                <div>
                                    您可继续拖放资源或从本地文件中选取资源
                                </div>
                                <div>
                                    <a-button type="primary">继续添加</a-button>
                                </div>
                            </div>
                            <div class="uploadList">
                                <UploadFile :data="uploadFileList"></UploadFile>
                            </div>
                        </div>
                    </div>
                </a-upload-dragger>
            </div>
        </div>
        <InstallAll></InstallAll>
    </a-modal>
</template>

<script setup>
import { FILE_UPLOAD } from '@/api/comm';
import { getImage } from '@/utils/comm';
import UploadFile from './components/UploadFile.vue';
import InstallAll from './components/InstallAll.vue';
const emits = defineEmits(['close'])
const fileList = ref()
const handleChange = () => {

}
const uploadFileList = ref([
])
</script>
<style lang='less' scoped>
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
        margin-top: 20%;
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