<template>
    <a-card class="basis-container">
        <a-form
            layout="vertical"
            ref="formBasicRef"
            :rules="rulesFrom"
            :model="formValue"
        >
            <a-row :span="24" :gutter="24">
                <a-col :span="10">
                    <a-form-item label="系统名称" name="title">
                        <a-input
                            v-model:value="formValue.title"
                            :maxlength="64"
                            placeholder="请输入系统名称"
                        />
                    </a-form-item>
                    <a-form-item label="主题色" name="headerTheme">
                        <a-select v-model:value="formValue.headerTheme">
                            <a-select-option value="light"
                                >白色</a-select-option
                            >
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
                            v-model:value="formValue.apiKey"
                            placeholder="请输入高德API Key"
                        />
                    </a-form-item>
                    <a-form-item name="'base-path'">
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
                            v-model:value="formValue['base-path']"
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
                                            :action="action"
                                            :headers="headers"
                                            :showUploadList="false"
                                            :beforeUpload="
                                                uploader.beforeLogoUpload
                                            "
                                            @change="uploader.handleChangeLogo"
                                            :accept="
                                                uploader.imageTypes.toString()
                                            "
                                        >
                                            <div
                                                class="upload-image-content-logo"
                                            >
                                                <div
                                                    class="loading-logo"
                                                    v-if="form.logoLoading"
                                                >
                                                    <LoadingOutlined
                                                        style="font-size: 28px"
                                                    />
                                                </div>
                                                <div
                                                    class="upload-image"
                                                    style="height: 100%"
                                                    v-if="formValue.logo"
                                                    :style="
                                                        formValue.logo
                                                            ? `background-image: url(${formValue.logo});`
                                                            : ''
                                                    "
                                                ></div>
                                                <div
                                                    v-if="formValue.logo"
                                                    class="upload-image-mask"
                                                >
                                                    点击修改
                                                </div>
                                                <div v-else>
                                                    <div
                                                        v-if="form.logoLoading"
                                                    >
                                                        <LoadingOutlined
                                                            style="
                                                                font-size: 28px;
                                                            "
                                                        />
                                                    </div>
                                                    <div v-else>
                                                        <PlusOutlined
                                                            style="
                                                                font-size: 28px;
                                                            "
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </a-upload>
                                        <div v-if="form.logoLoading">
                                            <div class="upload-loading-mask">
                                                <LoadingOutlined
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
                                    <a-tooltip
                                        title="浏览器tab页中显示的图片元素"
                                    >
                                        <img
                                            class="img-style"
                                            :src="
                                                getImage('/init-home/mark.png')
                                            "
                                        />
                                    </a-tooltip>
                                </template>
                                <div class="upload-image-warp-logo">
                                    <div class="upload-image-border-logo">
                                        <a-upload
                                            name="file"
                                            :action="action"
                                            :headers="headers"
                                            :showUploadList="false"
                                            :beforeUpload="
                                                uploader.beforeIconUpload
                                            "
                                            @change="uploader.changeIconUpload"
                                            :accept="
                                                uploader.imageTypes.toString()
                                            "
                                        >
                                            <div
                                                class="upload-image-content-logo"
                                            >
                                                <div
                                                    v-if="form.iconLoading"
                                                    class="loading-icon"
                                                >
                                                    <LoadingOutlined
                                                        style="font-size: 28px"
                                                    />
                                                </div>
                                                <div
                                                    class="upload-image-icon"
                                                    v-if="formValue.ico"
                                                    :style="
                                                        formValue.ico
                                                            ? `background-image: url(${formValue.ico});`
                                                            : ''
                                                    "
                                                ></div>
                                                <div
                                                    v-if="formValue.ico"
                                                    class="upload-image-mask"
                                                >
                                                    点击修改
                                                </div>
                                                <div v-else>
                                                    <div>
                                                        <PlusOutlined
                                                            style="
                                                                font-size: 28px;
                                                            "
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
                                    :action="action"
                                    :headers="headers"
                                    :beforeUpload="uploader.beforeBackUpload"
                                    :showUploadList="false"
                                    @change="uploader.changeBackUpload"
                                    :accept="uploader.imageTypes.toString()"
                                >
                                    <div class="upload-image-content-back">
                                        <div
                                            v-if="form.backLoading"
                                            class="loading-back"
                                        >
                                            <LoadingOutlined
                                                style="font-size: 28px"
                                            />
                                        </div>
                                        <div
                                            class="upload-image"
                                            v-if="formValue.backgroud"
                                            :style="
                                                formValue.backgroud
                                                    ? `background-image: url(${formValue.backgroud});`
                                                    : ''
                                            "
                                        ></div>
                                        <div
                                            v-if="formValue.backgroud"
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
                        <div class="upload-tips">
                            支持4M以内的图片:支持jpg、png
                        </div>
                        <div class="upload-tips">建议尺寸1400x1080</div>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <a-button
            type="primary"
            @click="form.clickSave"
            :disabled="
                form.saveLoading ||
                form.logoLoading ||
                form.iconLoading ||
                form.backLoading
            "
            >保存</a-button
        >
    </a-card>
</template>

<script setup lang="ts" name="Basis">
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { formType, uploaderType } from './index';
import { getImage } from '@/utils/comm.ts';
import { message } from 'ant-design-vue';
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import { LocalStore } from '@/utils/comm';

import { save_api, getDetails_api } from '@/api/system/basis';
import { usePermissionStore } from '@/store/permission';

const action = ref<string>(`${BASE_API_PATH}/file/static`);
const headers = ref({ [TOKEN_KEY]: LocalStore.get(TOKEN_KEY) });
const formBasicRef = ref();
const form = reactive<formType>({
    formValue: {
        title: '',
        headerTheme: 'light',
        apiKey: '',
        'base-path': `${window.location.origin}/api`,
        logo: '/public/logo.png',
        ico: '/public/favicon.ico',
        backgroud: '/public/images/login.png',
    },
    rulesFrom: {
        title: [
            {
                required: true,
                message: '请选择本地地址',
                trigger: 'blur',
            },
        ],
        headerTheme: [
            {
                required: true,
                message: '请选择主题色',
                trigger: 'blur',
            },
        ],
        'base-path': [
            {
                required: true,
                message: '请输入base-path',
                trigger: 'blur',
            },
        ],
    },
    logoLoading: false, // logo加载状态
    backLoading: false, // 背景图加载状态
    iconLoading: false, // 页签加载状态
    saveLoading: false,
    getDetails: () => {
        const params = ['front', 'amap', 'paths'];
        getDetails_api(params).then((resp: any) => {
            console.log(resp);

            const basis = resp.result?.filter(
                (item: any) => item.scope === 'front',
            );
            const api = resp.result?.filter(
                (item: any) => item.scope === 'amap',
            );
            const basePath = resp.result?.filter(
                (item: any) => item.scope === 'paths',
            );
            console.log();

            form.formValue = {
                ...basis[0].properties,
                apiKey: api[0].properties.apiKey,
                'base-path': basePath[0].properties['base-path'],
                logo: form.formValue.logo || '/public/logo.png',
                ico: form.formValue.ico || '/public/favicon.ico',
                backgroud:
                    form.formValue.backgroud || '/public/images/login.png',
            };
            // localStorage.setItem(
            //     SystemConst.AMAP_KEY,
            //     api[0].properties.apiKey,
            // );
        });
    },
    clickSave: () => {
        const hasPermission = usePermissionStore().hasPermission;
        if(hasPermission(`system/Basis:update`) ){
			formBasicRef.value.validate().then(() => {
                form.saveLoading = true;
                const params = [
                    {
                        scope: 'front',
                        properties: {
                            ...form.formValue,
                            apiKey: '',
                            'base-path': '',
                        },
                    },
                    {
                        scope: 'amap',
                        properties: {
                            apiKey: form.formValue.apiKey,
                        },
                    },
                    {
                        scope: 'paths',
                        properties: {
                            'base-path': form.formValue['base-path'],
                        },
                    },
                ];

                save_api(params)
                    .then((resp) => {
                        if (resp.status === 200) {
                            message.success('保存成功');
                            form.getDetails();
                        }
                    })
                    .finally(() => (form.saveLoading = false));
            });
		}else {
			message.warning('暂无权限，请联系管理员');
		}

           
    },
});
const { formValue, rulesFrom } = toRefs(form);

const uploader: uploaderType = {
    imageTypes: ['image/jpeg', 'image/png'],
    iconTypes: ['image/x-icon'],
    // logo格式校验
    beforeLogoUpload: (file) => {
        const isType = uploader.imageTypes.includes(file.type);
        if (!isType) {
            message.error(`请上传.jpg.png.jfif.pjp.pjpeg.jpeg格式的图片`);
            return false;
        }
        const isSize = file.size / 1024 / 1024 < 4;
        if (!isSize) {
            message.error(`图片大小必须小于${4}M`);
        }
        return isType && isSize;
    },
    // logo上传改变事件
    handleChangeLogo: (info) => {
        if (info.file.status === 'uploading') {
            form.logoLoading = true;
        } else if (info.file.status === 'done') {
            info.file.url = info.file.response?.result;
            form.logoLoading = false;
            form.formValue.logo = info.file.response?.result;
        } else if (info.file.status === 'error') {
            console.log(info.file);
            form.logoLoading = false;
            message.error('系统logo上传失败，请稍后再试');
        }
    },
    // 背景图片上传之前
    beforeBackUpload: (file) => {
        const isType = uploader.imageTypes.includes(file.type);
        if (!isType) {
            message.error(`请上传.jpg.png.jfif.pjp.pjpeg.jpeg格式的图片`);
            return false;
        }
        const isSize = file.size / 1024 / 1024 < 4;
        if (!isSize) {
            message.error(`图片大小必须小于${4}M`);
        }
        return isType && isSize;
    },
    // 背景图片发生改变
    changeBackUpload: (info) => {
        if (info.file.status === 'uploading') {
            form.backLoading = true;
        } else if (info.file.status === 'done') {
            console.log(info);

            info.file.url = info.file.response?.result;
            form.backLoading = false;
            form.formValue.backgroud = info.file.response?.result;
        } else if (info.file.status === 'error') {
            console.log(info.file);
            form.logoLoading = false;
            message.error('背景图上传失败，请稍后再试');
        }
    },
    // 上传之前
    beforeIconUpload: (file) => {
        const isType = uploader.iconTypes.includes(file.type);
        if (!isType) {
            message.error(`请上传ico格式的图片`);
            return false;
        }
        const isSize = file.size / 1024 / 1024 < 1;
        if (!isSize) {
            message.error(`图片大小必须小于${1}M`);
        }
        return isType && isSize;
    },
    // 图标发生改变
    changeIconUpload: (info) => {
        if (info.file.status === 'uploading') {
            form.iconLoading = true;
        } else if (info.file.status === 'done') {
            info.file.url = info.file.response?.result;
            form.iconLoading = true;
            form.formValue.ico = info.file.response?.result;
        } else if (info.file.status === 'error') {
            console.log(info.file);
            form.logoLoading = false;
            message.error('浏览器页签上传失败，请稍后再试');
        }
    },
};

form.getDetails();
</script>

<style lang="less" scoped>
.basis-container {
    .img-style {
        width: 16px;
        height: 16px;
        margin-left: 5px;
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
    .upload-image {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: cover;
    }
    .upload-tips {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        line-height: 1.5715;
    }
}
</style>
