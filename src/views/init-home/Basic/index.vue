<!-- 基础内容 -->
<template>
    <a-form layout="vertical" :model="form" ref="formBasicRef">
        <a-row :span="24" :gutter="24">
            <a-col :span="10">
                <a-form-item
                    label="系统名称"
                    name="title"
                    v-bind="validateInfos.title"
                >
                    <a-input
                        v-model:value="form.title"
                        :maxlength="64"
                        placeholder="请输入系统名称"
                    />
                </a-form-item>
                <a-form-item
                    label="主题色"
                    name="headerTheme"
                    v-bind="validateInfos.headerTheme"
                >
                    <a-select v-model:value="form.headerTheme">
                        <a-select-option value="light">白色</a-select-option>
                        <a-select-option value="dark">黑色</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item>
                    <template #label>
                        <span>高德API Key</span>
                        <a-tooltip title="配置后平台可调用高德地图GIS服务">
                            <img
                                class="img-style"
                                :src="getImage('/init-home/mark.png')"
                            />
                        </a-tooltip>
                    </template>
                    <a-input
                        v-model:value="form.apikey"
                        placeholder="请输入高德API Key"
                    />
                </a-form-item>
                <a-form-item name="basePath" v-bind="validateInfos.basePath">
                    <template #label>
                        <span>base-path</span>
                        <a-tooltip title="系统后台访问的url">
                            <img
                                class="img-style"
                                :src="getImage('/init-home/mark.png')"
                            />
                        </a-tooltip>
                    </template>
                    <a-input
                        v-model:value="form.basePath"
                        placeholder="请输入高德API Key"
                    />
                </a-form-item>
                <a-row :gutter="24" :span="24">
                    <a-col>
                        <a-form-item label="系统logo">
                            <div class="upload-image-warp-logo">
                                <div class="upload-image-border-logo">
                                    <a-upload
                                        name="file"
                                        :action="FILE_UPLOAD"
                                        :headers="headers"
                                        :showUploadList="false"
                                        :beforeUpload="beforeLogoUpload"
                                        @change="handleChangeLogo"
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
                                                v-if="logoValue"
                                                :style="
                                                    logoValue
                                                        ? `background-image: url(${logoValue});`
                                                        : ''
                                                "
                                            ></div>
                                            <div
                                                v-if="logoValue"
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

                            <div class="upload-tips">推荐尺寸200*200</div>
                            <div class="upload-tips">支持jpg,png</div>
                        </a-form-item>
                    </a-col>
                    <a-col>
                        <a-form-item>
                            <template #label>
                                <span>浏览器页签</span>
                                <a-tooltip title="浏览器tab页中显示的图片元素">
                                    <img
                                        class="img-style"
                                        :src="getImage('/init-home/mark.png')"
                                    />
                                </a-tooltip>
                            </template>
                            <div class="upload-image-warp-logo">
                                <div class="upload-image-border-logo">
                                    <a-upload
                                        name="file"
                                        :action="FILE_UPLOAD"
                                        :headers="headers"
                                        :showUploadList="false"
                                        :beforeUpload="beforeIconUpload"
                                        @change="changeIconUpload"
                                        :accept="
                                            iconTypes && iconTypes.length
                                                ? iconTypes.toString()
                                                : ''
                                        "
                                    >
                                        <div class="upload-image-content-logo">
                                            <div
                                                v-if="iconLoading"
                                                class="loading-icon"
                                            >
                                                <LoadingOutlined
                                                    style="font-size: 28px"
                                                />
                                            </div>
                                            <div
                                                class="upload-image-icon"
                                                v-if="iconValue"
                                                :style="
                                                    iconValue
                                                        ? `background-image: url(${iconValue});`
                                                        : ''
                                                "
                                            ></div>
                                            <div
                                                v-if="iconValue"
                                                class="upload-image-mask"
                                            >
                                                点击修改
                                            </div>
                                            <div v-else>
                                                <div>
                                                    <PlusOutlined
                                                        style="font-size: 28px"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </a-upload>
                                </div>
                            </div>

                            <div class="upload-tips">推荐尺寸64*64</div>
                            <div class="upload-tips">支持icon格式</div>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-col>
            <a-col :span="14">
                <a-form-item label="登录背景图">
                    <div class="upload-image-warp-back">
                        <div class="upload-image-border-back">
                            <a-upload
                                name="file"
                                :action="FILE_UPLOAD"
                                :headers="headers"
                                :beforeUpload="beforeBackUpload"
                                :showUploadList="false"
                                @change="changeBackUpload"
                                :accept="
                                    imageTypes && imageTypes.length
                                        ? imageTypes.toString()
                                        : ''
                                "
                            >
                                <div class="upload-image-content-back">
                                    <div
                                        v-if="backLoading"
                                        class="loading-back"
                                    >
                                        <LoadingOutlined
                                            style="font-size: 28px"
                                        />
                                    </div>
                                    <div
                                        class="upload-image"
                                        v-if="backValue"
                                        :style="
                                            backValue
                                                ? `background-image: url(${backValue});`
                                                : ''
                                        "
                                    ></div>
                                    <div
                                        v-if="backValue"
                                        class="upload-image-mask"
                                    >
                                        点击修改
                                    </div>
                                    <div v-else>
                                        <div>
                                            <PlusOutlined
                                                style="font-size: 28px"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </a-upload>
                        </div>
                    </div>
                    <div class="upload-tips">支持4M以内的图片:支持jpg、png</div>
                    <div class="upload-tips">建议尺寸1400x1080</div>
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
</template>
<script setup lang="ts">
import { modalState, formState, logoState } from '../data/interface';
import { getImage } from '@/utils/comm.ts';
import { Form } from 'ant-design-vue';
import {
    getSystemPermission,
    save,
    addRole,
    getRoleMenu,
    updateRoleMenu,
    getResourcesCurrent,
    saveNetwork,
    saveProtocol,
    getProtocol,
    saveAccessConfig,
    saveProduct,
    saveDevice,
    changeDeploy,
    deployDevice,
    saveInit,
} from '@/api/initHome';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { message } from 'ant-design-vue';
const formRef = ref();
const menuRef = ref();
const formBasicRef = ref();
const useForm = Form.useForm;
const iconValue = ref('/public/favicon.ico');
const backValue = ref('/public/images/login.png');
const logoValue = ref('/public/logo.png');
const logoLoading = ref(false);
const backLoading = ref(false);
const iconLoading = ref(false);
const imageTypes = ref(['image/jpeg', 'image/png']);
const iconTypes = ref(['image/x-icon']);
/**
 * 表单数据
 */
const form = ref<formState>({
    title: '',
    headerTheme: 'light',
    apikey: '',
    basePath: `${window.location.origin}/api`,
    logo: '',
    icon: '',
});
const rulesFrom = ref({
    title: [
        {
            required: true,
            message: '请输入系统名称',
            trigger: 'change',
        },
    ],
    headerTheme: [
        {
            required: true,
            message: '请选择主题色',
            trigger: 'blur',
        },
    ],
    basePath: [
        {
            required: true,
            message: '请输入base-path',
            trigger: 'blur',
        },
    ],
});
const { resetFields, validate, validateInfos } = useForm(
    form.value,
    rulesFrom.value,
);
/**
 * 提交数据
 */
const saveBasicInfo = async () => {
    validate()
        .then(async () => {
            const item = [
                {
                    scope: 'front',
                    properties: {
                        ...form,
                        apikey: '',
                        'base-path': '',
                    },
                },
                {
                    scope: 'amap',
                    properties: {
                        api: form.apikey,
                    },
                },
                {
                    scope: 'paths',
                    properties: {
                        'base-path': form.basePath,
                    },
                },
            ];
            const res = await save(item);
            if (res.status === 200) {
                const ico: any = document.querySelector('link[rel="icon"]');
                if (ico !== null) {
                    ico.href = form.icon;
                }
            }
            //     basicData.isSucessBasic = 3;
            // } else {
            //     basicData.isSucessBasic = 2;
            // }
        })
        .catch((error: ValidateErrorEntity<formState>) => {
            // basicData.isSucessBasic = 2;
        });
};
/**
 * logo格式校验
 */
const beforeLogoUpload = (file: any) => {
    const isType: any = imageTypes.value.includes(file.type);
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

/*
 * logo上传改变事件
 */
const handleChangeLogo = (info: any) => {
    if (info.file.status === 'uploading') {
        logoLoading.value = true;
    }
    if (info.file.status === 'done') {
        info.file.url = info.file.response?.result;
        logoLoading.value = false;
        logoValue.value = info.file.response?.result;
    }
};

/**
 * 背景图片上传之前
 */
const beforeBackUpload = (file: any) => {
    const isType = imageTypes.value.includes(file.type);
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
 * 背景图片发生改变
 */
const changeBackUpload = (info: any) => {
    if (info.file.status === 'uploading') {
        backLoading.value = true;
    }
    if (info.file.status === 'done') {
        info.file.url = info.file.response?.result;
        backLoading.value = false;
        backValue.value = info.file.response?.result;
    }
};
defineExpose({
    submitBasic: saveBasicInfo,
});
</script>
<style scoped lang="less">
.page-container {
    width: 100%;
    height: 100vh;
    padding: 32px 128px 64px;
    overflow: hidden;
    background-image: url(/images/init-home/background.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .container-text {
        font-weight: 700;
        font-size: 16px;
        .container-title {
            position: relative;
            padding-left: 10px;
            color: rgba(0, 0, 0, 0.8);
            font-weight: 600;
            line-height: 1;
            &:before {
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background-color: #1d39c4;
                border-radius: 0 3px 3px 0;
                content: '';
            }
        }
    }
    .container-box {
        width: 100%;
        height: 100%;
        padding: 24px;
        background: #fff;
        .container-main {
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 100%;
            overflow-y: auto;
            .container-right {
                width: calc(100% - 70px);
                .title {
                    font-size: 15px;
                }
                .sub-title {
                    margin-top: 2px;
                    margin-left: 8px;
                    color: #666;
                    font-size: 12px;
                    opacity: 0.85;
                }
                .img-style {
                    width: 16px;
                    height: 16px;
                    margin-left: 5px;
                }
                .menu-style {
                    display: flex;
                    align-items: center;
                    .menu-img {
                        margin-right: 16px;
                    }
                }
                .init-home-role {
                    .init-home-role-content {
                        display: flex;
                        grid-gap: 24px;
                        gap: 24px;
                    }
                    .role-item-1 {
                        background-image: url(/images/init-home/role1.png);
                    }
                    .role-item-2 {
                        background-image: url(/images/init-home/role2.png);
                    }
                    .role-item-3 {
                        background-image: url(/images/init-home/role3.png);
                    }
                    .role-item {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        margin-bottom: 30px;
                        padding: 24px;
                        background-repeat: no-repeat;
                        background-position: 50%;
                        background-size: 370px;
                        border: 1px solid #f5f5f5;
                        .role-item-title {
                            display: flex;
                            .role-title {
                                flex: 1 1 auto;
                                font-weight: 700;
                                font-size: 16px;
                            }
                        }
                        .role-item-content {
                            width: 250px;
                            height: 260px;
                            margin-top: 24px;
                        }
                        .role-item-footer {
                            position: absolute;
                            bottom: -30px;
                            left: 0;
                            width: 100%;
                            color: #999;
                            font-size: 12px;
                            text-align: center;
                        }
                    }
                }
                .init-data-img {
                    width: 300px;
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

                .upload-image-warp-back {
                    display: flex;
                    justify-content: flex-start;
                    .upload-image-border-back {
                        position: relative;
                        overflow: hidden;
                        border: 1px dashed #d9d9d9;
                        transition: all 0.3s;
                        width: 570px;
                        height: 415px;
                        &:hover {
                            border: 1px dashed #1890ff;
                            display: flex;
                        }
                        .upload-image-content-back {
                            align-items: center;
                            justify-content: center;
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            width: 570px;
                            height: 415px;
                            padding: 8px;
                            background-color: rgba(0, 0, 0, 0.06);
                            cursor: pointer;
                            .loading-back {
                                position: absolute;
                            }
                            .upload-image {
                                width: 100%;
                                height: 100%;
                                background-repeat: no-repeat;
                                background-position: 50%;
                                background-size: cover;
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
                .upload-tips {
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 14px;
                    line-height: 1.5715;
                }
                // .uplod-style {
                //     :deep(.ant-upload.ant-upload-select-picture-card) {
                //         width: 180px;
                //         height: 180px;
                //     }
                // }
                .btn-style {
                    margin-top: 20px;
                    color: #fff;
                    border-color: #1d39c4;
                    background: #1d39c4;
                }
            }
        }
    }
    .modal-style {
        .data-content {
            background: rgb(236, 237, 238);
            .data-p-style {
                padding: 10px;
            }
        }
    }
    ::-webkit-scrollbar {
        width: 12px;
    }

    /* 滚动槽 */
    ::-webkit-scrollbar-track {
        background: #f2f2f2;
        border-radius: 8px;
    }

    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        background: #cecece;
        border-radius: 8px;
    }
}
</style>
