<!-- 新增、编辑产品 -->
<template>
    <a-modal
        :title="props.title"
        :maskClosable="false"
        destroy-on-close
        v-model:visible="visible"
        @ok="submitData"
        @cancel="close"
        okText="确定"
        cancelText="取消"
        v-bind="layout"
        width="650px"
    >
        <div style="margin-top: 10px">
            <a-form :layout="'vertical'">
                <a-row type="flex">
                    <a-col flex="180px">
                        <a-form-item>
                            <div class="upload-image-warp-logo">
                                <div class="upload-image-border-logo">
                                    <a-upload
                                        name="file"
                                        :action="FILE_UPLOAD"
                                        :headers="headers"
                                        :showUploadList="false"
                                        :beforeUpload="beforeUpload"
                                        @change="handleChange"
                                        :accept="
                                            imageTypes && imageTypes.length
                                                ? imageTypes.toString()
                                                : ''
                                        "
                                    >
                                        <div class="upload-image-content-logo">
                                            <div
                                                class="loading-logo"
                                                v-if="logoLoading"
                                            >
                                                <LoadingOutlined
                                                    style="font-size: 28px"
                                                />
                                            </div>
                                            <div
                                                class="upload-image"
                                                v-if="photoValue"
                                                :style="
                                                    photoValue
                                                        ? `background-image: url(${photoValue});`
                                                        : ''
                                                "
                                            ></div>
                                            <div
                                                v-if="photoValue"
                                                class="upload-image-mask"
                                            >
                                                点击修改
                                            </div>
                                            <div v-else>
                                                <div v-if="logoLoading">
                                                    <LoadingOutlined
                                                        style="font-size: 28px"
                                                    />
                                                </div>
                                                <div v-else>
                                                    <PlusOutlined
                                                        style="font-size: 28px"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </a-upload>
                                    <div v-if="logoLoading">
                                        <div class="upload-loading-mask">
                                            <LoadingOutlined
                                                v-if="logoLoading"
                                                style="font-size: 28px"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a-form-item>
                    </a-col>
                    <a-col flex="auto">
                        <a-form-item>
                            <template #label>
                                <span>ID</span>
                                <a-tooltip
                                    title="若不填写，系统将自动生成唯一ID"
                                >
                                    <img
                                        class="img-style"
                                        :src="getImage('/init-home/mark.png')"
                                    />
                                </a-tooltip>
                            </template>
                            <a-input
                                v-model:value="modelRef.id"
                                placeholder="请输入ID"
                            />
                        </a-form-item>
                        <a-form-item label="名称">
                            <a-input
                                v-model:value="modelRef.name"
                                placeholder="请输入名称"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="产品分类">
                    <a-tree-select
                        showSearch
                        v-model:value="modelRef.productId"
                        placeholder="请选择产品分类"
                    >
                    </a-tree-select>
                </a-form-item>
                <a-form-item label="设备类型">
                    <a-row :span="24" :gutter="20">
                        <a-col
                            :span="8"
                            v-for="item in deviceList"
                            :key="item.value"
                        >
                            <ChooseCard
                                :value="item"
                                v-bind="item"
                                @click="handleClick"
                                :active="_selectedRowKeys.includes(item.value)"
                            >
                                <template #img>
                                    <slot name="img">
                                        <img
                                            v-if="item.value === 'device'"
                                            :src="
                                                getImage('/device-type-1.png')
                                            "
                                        />
                                        <img
                                            v-if="
                                                item.value === 'childrenDevice'
                                            "
                                            :src="
                                                getImage('/device-type-2.png')
                                            "
                                        />
                                        <img
                                            v-if="item.value === 'gateway'"
                                            :src="
                                                getImage(
                                                    '/device/device-type-3.png',
                                                )
                                            "
                                        />
                                    </slot>
                                </template>
                                <template #content>
                                    <span
                                        class="card-style"
                                        :style="
                                            _selectedRowKeys.includes(
                                                item.value,
                                            )
                                                ? 'color: #10239e'
                                                : ''
                                        "
                                        >{{
                                            item.value === 'device'
                                                ? '直连设备'
                                                : item.value ===
                                                  'childrenDevice'
                                                ? '网关子设备'
                                                : item.value === 'gateway'
                                                ? '网关设备'
                                                : ''
                                        }}</span
                                    >
                                </template>
                            </ChooseCard>
                        </a-col>
                    </a-row>
                </a-form-item>
                <a-form-item label="说明">
                    <a-textarea
                        v-model:value="modelRef.describe"
                        placeholder="请输入说明"
                    />
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { queryTree } from '@/api/device/category';
import { Form } from 'ant-design-vue';
import { getImage } from '@/utils/comm.ts';
import { message } from 'ant-design-vue';
import ChooseCard from '../ChooseCard/index.vue';
import { FILE_UPLOAD } from '@/api/comm';

const emit = defineEmits(['close', 'save']);
const props = defineProps({
    title: {
        type: String,
        defult: '',
    },
    isAdd: {
        type: Number,
        default: 0,
    },
});
const treeList = ref<Record<string, any>[]>([]);
const visible = ref(false);
const logoLoading = ref(false);
const useForm = Form.useForm;
const _selectedRowKeys = ref([]);
const photoValue = ref('/images/device-product.png');
const imageTypes = reactive([
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/jfif',
    'image/pjp',
    'image/pjpeg',
]);
const deviceList = ref([
    {
        label: '直连设备',
        value: 'device',
    },
    {
        label: '网关子设备',
        value: 'childrenDevice',
    },
    {
        label: '网关设备',
        value: 'gateway',
    },
]);

const modelRef = reactive({
    id: '',
    name: '',
    classifiedId: '',
    classifiedName: '',
    deviceType: '',
    describe: '',
    photoUrl: '',
});

watch(
    () => props.isAdd,
    () => {
        queryTree({ paging: false }).then((resp) => {
            if (resp.status === 200) {
                treeList.value = resp.result;
            }
        });
    },
    { immediate: true, deep: true },
);
/**
 * 显示弹窗
 */
const show = () => {
    visible.value = true;
};

/**
 * 关闭弹窗
 */
const close = () => {
    visible.value = false;
};
/**
 * 卡片点击事件
 */
const handleClick = (dt: any) => {
    _selectedRowKeys.value = dt;
};
/**
 * 文件上传之前
 */
const beforeUpload = (file: any) => {
    const isType: any = imageTypes.includes(file.type);
    if (!isType) {
        message.error(`请上传.jpg.png.jfif.pjp.pjpeg.jpeg格式的图片`);
        return false;
    }
    const isSize = file.size / 1024 / 1024 < 4;
    if (!isSize) {
        message.error(`图片大小必须小于${4}M`);
    }
    return isType && isSize;
};

/**
 * 文件改变事件
 */
const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
        logoLoading.value = true;
    }
    if (info.file.status === 'done') {
        info.file.url = info.file.response?.result;
        logoLoading.value = false;
        logoLoading.value = info.file.response?.result;
    }
};
defineExpose({
    show: show,
});
</script>
<style scoped lang="less">
.card-style {
    position: relative;
    top: 8px;
}
.upload-image-warp-logo {
    display: flex;
    justify-content: flex-start;
    .upload-image-border-logo {
        position: relative;
        overflow: hidden;
        border: 1px dashed #d9d9d9;
        transition: all 0.3s;
        width: 160px;
        height: 150px;
        &:hover {
            border: 1px dashed #1890ff;
            display: flex;
        }
        .upload-image-content-logo {
            align-items: center;
            justify-content: center;
            position: relative;
            display: flex;
            flex-direction: column;
            width: 160px;
            height: 150px;
            padding: 8px;
            background-color: rgba(0, 0, 0, 0.06);
            cursor: pointer;
            .loading-logo {
                position: absolute;
                top: 50%;
            }
            .loading-icon {
                position: absolute;
            }
            .upload-image {
                width: 100%;
                height: 100%;
                background-repeat: no-repeat;
                background-position: 50%;
                background-size: cover;
            }
            .upload-image-icon {
                width: 100%;
                height: 100%;
                background-repeat: no-repeat;
                background-position: 50%;
                background-size: inherit;
            }
            .upload-image-mask {
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0;
                left: 0;
                display: none;
                width: 100%;
                height: 100%;
                color: #fff;
                font-size: 16px;
                background-color: rgba(0, 0, 0, 0.35);
            }
            &:hover .upload-image-mask {
                display: flex;
            }
        }
    }
}
</style>
