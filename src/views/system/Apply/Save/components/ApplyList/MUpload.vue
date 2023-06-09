<template>
    <div class="upload-image-warp" @click.stop>
        <div class="upload-image-border" :style="borderStyle" @click.stop>
            <j-upload
                name="file"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :before-upload="beforeUpload"
                :action="FILE_UPLOAD"
                :headers="{
                    'X-Access-Token': LocalStore.get(TOKEN_KEY),
                }"
                v-bind="props"
            >
                <div class="upload-image-content" :style="props.style">
                    <template v-if="imageUrl">
                        <img :src="imageUrl" width="100%" class="upload-image" />
                        <div v-if="imageUrl === defaultValue" class="upload-image-mask">替换图标</div>
                        <div v-else @click.stop="onDelete" class="upload-image-mask">删除图标</div>
                    </template>
                    <template v-else>
                        <AIcon
                            type="LoadingOutlined"
                            v-if="loading"
                            style="font-size: 20px"
                        />
                    </template>
                </div>
            </j-upload>
            <div class="upload-loading-mask" v-if="props.disabled"></div>
            <div class="upload-loading-mask" v-if="imageUrl && loading">
                <AIcon type="LoadingOutlined" style="font-size: 20px" />
            </div>
        </div>
    </div>
  <ImageCropper
    v-if="cropperVisible"
    :img="cropperImg"
    @cancel="cropperVisible = false"
    @ok="saveImage"
  />
</template>

<script lang="ts" setup name='JProUpload'>
import { UploadProps } from 'ant-design-vue';
import { message } from 'jetlinks-ui-components';
import { FILE_UPLOAD } from '@/api/comm';
import { TOKEN_KEY } from '@/utils/variable';
import {getBase64, LocalStore} from '@/utils/comm';
import { CSSProperties } from 'vue';
import ImageCropper from '@/components/Upload/Cropper.vue';

type Emits = {
    (e: 'update:modelValue', data: string): void;
    (e: 'change', data: string): void;
};
interface JUploadProps extends UploadProps {
    modelValue: string;
    disabled?: boolean;
    types?: string[];
    errorMessage?: string;
    size?: number;
    style?: CSSProperties;
    // bgImage?: string;
    borderStyle?:CSSProperties;
    defaultValue?: string;
}

const emit = defineEmits<Emits>();

const props: JUploadProps = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    // bgImage: {
    //     type: String,
    //     default: '',
    // },
    accept:{
        type: String,
        default: undefined
    },
    borderStyle: {
        type: Object,
        default: undefined
    },
    defaultValue: {
        type: String,
        default: '',
    }
});

const loading = ref<boolean>(false);
const imageUrl = ref<string>(props?.modelValue || '');
const imageTypes = props.types ? props.types : ['image/jpeg', 'image/png'];

const cropperImg = ref()
const cropperVisible = ref(false)

watch(
    () => props.modelValue,
    (newValue) => {
        imageUrl.value = newValue;
    },
    {
        deep: true,
        immediate: true,
    },
);

const onDelete = () => {
    emit('update:modelValue', props.defaultValue || '');
    emit('change', props.defaultValue || '');
}

const beforeUpload = (file: UploadProps['fileList'][number]) => {
    const isType = imageTypes.includes(file.type);
    const maxSize = props.size || 2 // 最大值
    if (!isType) {
        if (props.errorMessage) {
            message.error(props.errorMessage);
        } else {
            message.error(`请上传正确格式的图片`);
        }
        return false;
    }
    const isSize = file.size / 1024 / 1024 < maxSize;
    if (!isSize) {
        message.error(`图片大小必须小于${maxSize}M`);
    }

    getBase64(file, (base64Url) => {
      cropperImg.value = base64Url
      cropperVisible.value = true
    })

    return false;
};


const saveImage = (url: string) => {
  cropperVisible.value = false
  imageUrl.value = url
  emit('update:modelValue', url);
  emit('change', url);
}
</script>

<style lang="less" scoped>
@border: 1px dashed @border-color-base;
@mask-color: rgba(#000, 0.35);
@with: 150px;
@height: 150px;

.flex-center() {
    align-items: center;
    justify-content: center;
}

.upload-image-warp {
    display: flex;
    justify-content: flex-start;

    .upload-image-border {
        position: relative;
        width: @with;
        height: @height;
        overflow: hidden;
        //border-radius: 50%;
        // border: @border;
        transition: all 0.3s;

        &:hover {
            border-color: @primary-color-hover;
        }

        :deep(.ant-upload-picture-card-wrapper) {
            width: 100%;
            height: 100%;
        }
        :deep(.ant-upload) {
            width: 100%;
            height: 100%;
        }

        .upload-image-content {
            .flex-center();

            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            background-color: rgba(#000, 0.06);
            cursor: pointer;
            padding: 8px;

            .upload-image-mask {
                .flex-center();

                position: absolute;
                top: 0;
                left: 0;
                display: none;
                width: 100%;
                height: 100%;
                color: #fff;
                font-size: 16px;
                background-color: @mask-color;
            }

            .upload-image {
                width: 100%;
                height: 100%;
                //border-radius: 50%;
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
            }

            &:hover .upload-image-mask {
                display: flex;
            }
        }
    }

    .upload-loading-mask {
        .flex-center();

        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        width: 100%;
        height: 100%;
        color: #fff;
        background-color: @mask-color;
    }
}
</style>
