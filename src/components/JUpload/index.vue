<template>
    <a-upload
        v-model:file-list="fileList"
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        :before-upload="beforeUpload"
        @change="handleChange"
    >
        <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
        <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">Upload</div>
        </div>
    </a-upload>
</template>

<script lang="ts" setup>
import { message, UploadChangeParam, UploadProps } from 'ant-design-vue';

const handleChange = (info: UploadChangeParam) => {
    //   if (info.file.status === 'uploading') {
    //     loading.value = true;
    //     return;
    //   }
    //   if (info.file.status === 'done') {
    //     // Get this url from response in real world.
    //     getBase64(info.file.originFileObj, (base64Url: string) => {
    //       imageUrl.value = base64Url;
    //       loading.value = false;
    //     });
    //   }
    //   if (info.file.status === 'error') {
    //     loading.value = false;
    //     message.error('upload error');
    //   }
};

const beforeUpload = (file: UploadProps['fileList'][number]) => {
    //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    //   if (!isJpgOrPng) {
    //     message.error('You can only upload JPG file!');
    //   }
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isLt2M) {
    //     message.error('Image must smaller than 2MB!');
    //   }
    //   return isJpgOrPng && isLt2M;
};
</script>

<style lang="less" scoped>
.avatar-uploader {
    width: 160px;
    height: 160px;
    padding: 8px;
    background-color: rgba(0,0,0,.06);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    :deep(.ant-upload.ant-upload-select-picture-card) {
        width: 100%;
        height: 100%;
    }
}
</style>