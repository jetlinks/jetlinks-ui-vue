<!-- 基础内容 -->
<template>
    <j-form layout="vertical" :model="form" ref="formBasicRef">
        <j-row :span="24" :gutter="24">
            <j-col :span="12">
                <j-form-item
                    label="系统名称"
                    name="title"
                    v-bind="validateInfos.title"
                >
                    <j-input
                        v-model:value="form.title"
                        placeholder="请输入系统名称"
                    />
                </j-form-item>
                <j-form-item
                    label="主题色"
                    name="headerTheme"
                    v-bind="validateInfos.headerTheme"
                >
                    <j-select v-model:value="form.headerTheme">
                        <j-select-option value="light">白色</j-select-option>
                        <j-select-option value="dark">黑色</j-select-option>
                    </j-select>
                </j-form-item>
                <j-form-item>
                    <template #label>
                        <span>高德API Key</span>
                        <j-tooltip title="配置后平台可调用高德地图GIS服务">
                            <img
                                class="img-style"
                                :src="'/images/init-home/mark.png'"
                            />
                        </j-tooltip>
                    </template>
                    <j-input
                        v-model:value="form.apikey"
                        placeholder="请输入高德API Key"
                    />
                </j-form-item>
                <j-form-item
                    :rules="[
                        {
                            required: true,
                            message: '选择是否为联邦架构',
                        },
                    ]"
                >
                    <template #label>
                        <span>是否为联邦架构</span>
                        <j-tooltip
                            title="需先选择是否为联邦架构,配置后可生成对应必填配置项"
                        >
                            <img
                                class="img-style"
                                :src="'/images/init-home/mark.png'"
                            />
                        </j-tooltip>
                    </template>
                    <j-radio-group
                        name="radioGroup"
                        :defaultValue="true"
                        v-model:value="form.isIOT"
                    >
                        <j-radio value="true">是</j-radio>
                        <j-radio value="false">否</j-radio>
                    </j-radio-group>
                </j-form-item>
                <j-form-item
                    name="factoryType"
                    v-show="isTypeChild"
                    :rules="facTypeRules"
                >
                    <template #label>
                        <span>工厂类型 </span>
                    </template>
                    <j-select
                        showSearch
                        v-model:value="form.factoryType"
                        placeholder="请选择工厂类型"
                    >
                        <j-select-option
                            v-for="item in factoryTypeList"
                            :value="item.value"
                            :key="item.value"
                            :label="item.name"
                            >{{ item.name }}</j-select-option
                        >
                    </j-select>
                </j-form-item>
                <j-form-item
                    name="factoryId"
                    v-show="isChild"
                    :rules="facIdRules"
                >
                    <template #label>
                        <span>工厂ID</span>
                    </template>
                    <j-input v-model:value="form.factoryId" />
                </j-form-item>
                <j-form-item
                    name="factoryKey"
                    v-show="isChild"
                    :rules="isFactoryKeyRules"
                >
                    <template #label>
                        <span>Topic</span>
                    </template>
                    <j-input v-model:value="form.factoryKey" />
                </j-form-item>
                <j-form-item name="basePath" v-bind="validateInfos.basePath">
                    <template #label>
                        <span>base-path</span>
                        <j-tooltip>
                            <template #title>
                                <div style="word-break: break-all">
                                    <div>系统后台访问的url。</div>
                                    <div>
                                        格式：{http/https}:
                                        //{前端所在服务器IP地址}:{前端暴露的服务端口}/api
                                    </div>
                                </div>
                            </template>
                            <img
                                class="img-style"
                                :src="'/images/init-home/mark.png'"
                            />
                        </j-tooltip>
                    </template>
                    <j-input
                        v-model:value="form.basePath"
                        placeholder="格式：{http/https}: //{前端所在服务器IP地址}:{前端暴露的服务端口}/api"
                    />
                </j-form-item>
                <j-row :gutter="24" :span="24">
                    <j-col>
                        <j-form-item label="系统logo">
                            <div class="upload-image-warp-logo">
                                <div class="upload-image-border-logo">
                                    <j-upload
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
                                                v-if="form.logo"
                                                :style="
                                                    form.logo
                                                        ? `background-image: url(${form.logo});`
                                                        : ''
                                                "
                                            ></div>
                                            <div
                                                v-if="form.logo"
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
                                    </j-upload>
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
                        </j-form-item>
                    </j-col>
                    <j-col>
                        <j-form-item>
                            <template #label>
                                <span>浏览器页签</span>
                                <j-tooltip title="浏览器tab页中显示的图片元素">
                                    <img
                                        class="img-style"
                                        :src="'/images/init-home/mark.png'"
                                    />
                                </j-tooltip>
                            </template>
                            <div class="upload-image-warp-logo">
                                <div class="upload-image-border-logo">
                                    <j-upload
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
                                                v-if="form.ico"
                                                :style="
                                                    form.ico
                                                        ? `background-image: url(${form.ico});`
                                                        : ''
                                                "
                                            ></div>
                                            <div
                                                v-if="form.ico"
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
                                    </j-upload>
                                </div>
                            </div>

                            <div class="upload-tips">推荐尺寸64*64</div>
                            <div class="upload-tips">支持ico格式</div>
                        </j-form-item>
                    </j-col>
                </j-row>
            </j-col>
            <j-col :span="12">
                <j-form-item label="登录背景图">
                    <div class="upload-image-warp-back">
                        <div class="upload-image-border-back">
                            <j-upload
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
                                        v-if="form.background"
                                        :style="
                                            form.background
                                                ? `background-image: url(${form.background});`
                                                : ''
                                        "
                                    ></div>
                                    <div
                                        v-if="form.background"
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
                            </j-upload>
                        </div>
                    </div>
                    <div class="upload-tips">支持4M以内的图片:支持jpg、png</div>
                    <div class="upload-tips">建议尺寸1400x1080</div>
                </j-form-item>
            </j-col>
        </j-row>
    </j-form>
</template>
<script setup lang="ts">
import { modalState, formState, logoState } from '../data/interface';
import { Form } from 'jetlinks-ui-components';
import { FILE_UPLOAD } from '@/api/comm';
import { save } from '@/api/initHome';
import { LocalStore, getImage, onlyMessage } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { SystemConst } from '@/utils/consts';
const formRef = ref();
const menuRef = ref();
const formBasicRef = ref();
const useForm = Form.useForm;
const logoLoading = ref(false);
const backLoading = ref(false);
const iconLoading = ref(false);
const imageTypes = ref(['image/jpeg', 'image/png']);
const iconTypes = ref(['image/x-icon']);
const headers = ref({ [TOKEN_KEY]: LocalStore.get(TOKEN_KEY) });
/**
 * 表单数据
 */
const form = ref<formState>({
    title: '',
    headerTheme: 'light',
    apikey: '',
    isIOT: 'true',
    basePath: `${window.location.origin}/api`,
    logo: '/logo.png',
    ico: '/favicon.ico',
    factoryId: '',
    factoryKey: '',
    factoryType: '',
    background: '/images/login.png',
});

const isTypeChild = ref(true);
const facTypeRules = ref<any>({
    required: true,
    message: '请选择工厂类型',
    trigger: 'blur',
});
const facIdRules = ref<any>([
    {
        required: true,
        message: '请填写工厂ID',
        trigger: 'blur',
    },
]);
const isChild = ref(false);
const isFactoryKeyRules = ref<any>([]);
const rulesFrom = ref({
    title: [
        {
            max: 64,
            message: '最多可输入64位',
            trigger: 'change',
        },
        {
            required: true,
            message: '请填写系统名称',
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

watch(
    () => form.value.factoryType,
    (newValue: any) => {
        if (newValue === 'sub') {
            isChild.value = true;
            isFactoryKeyRules.value = [
                {
                    required: true,
                    message: '请填写工厂Topic',
                    trigger: 'blur',
                },
            ];
        } else {
            isChild.value = false;
            isFactoryKeyRules.value = [];
        }
    },
);
watch(
    () => form.value.isIOT,
    (newValue: any) => {
        console.log('newValue', newValue);
        if (newValue === 'true') {
            isTypeChild.value = true;
            facTypeRules.value = [
                {
                    required: true,
                    message: '请选择工厂类型',
                    trigger: 'blur',
                },
            ];
            if (form.value.factoryType === 'sub') {
                isChild.value = true;
                facIdRules.value = [
                    {
                        required: true,
                        message: '请填写工厂ID',
                        trigger: 'blur',
                    },
                ];
                isFactoryKeyRules.value = [
                    {
                        required: true,
                        message: '请填写工厂Topic',
                        trigger: 'blur',
                    },
                ];
            } else {
                isChild.value = false;
                facIdRules.value = []
                isFactoryKeyRules.value = [];
            }
        } else {
            isTypeChild.value = false;
            facTypeRules.value = [];
            facIdRules.value = [];
            isChild.value = false;
            isFactoryKeyRules.value = [];
        }
    },
);

const factoryTypeList = [
    {
        value: 'general',
        name: '总工厂',
    },
    {
        value: 'sub',
        name: '子工厂',
    },
];
/**
 * 提交数据
 */
const saveBasicInfo = () => {
    return new Promise(async (resolve, reject) => {
        validate()
            .then(async () => {
                let formValues = {};
                if (form.value.factoryType !== 'sub') {
                    const { factoryKey, ...res } = form.value;
                    formValues = res;
                } else {
                    formValues = form.value;
                }
                const item = [
                    {
                        scope: 'front',
                        properties: {
                            ...formValues,
                            apikey: '',
                            'base-path': '',
                        },
                    },
                    {
                        scope: 'amap',
                        properties: {
                            apiKey: form.value.apikey,
                        },
                    },
                    {
                        scope: 'paths',
                        properties: {
                            'base-path': form.value.basePath,
                        },
                    },
                ];
                const res = await save(item);
                console.log(res);
                if (res.status === 200) {
                    resolve(true);
                    localStorage.setItem(
                        SystemConst.AMAP_KEY,
                        form.value.apikey,
                    );
                    const ico: any = document.querySelector('link[rel="icon"]');
                    if (ico !== null) {
                        ico.href = form.value.ico;
                    }
                } else {
                    resolve(false);
                }
            })
            .catch(() => {
                resolve(false);
            });
    });
};
/**
 * logo格式校验
 */
const beforeLogoUpload = (file: any) => {
    const isType: any = imageTypes.value.includes(file.type);
    if (!isType) {
        onlyMessage(`请上传.jpg.png.jfif.pjp.pjpeg.jpeg格式的图片`, 'error');
        return false;
    }
    const isSize = file.size / 1024 / 1024 < 4;
    if (!isSize) {
        onlyMessage(`图片大小必须小于${4}M`, 'error');
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
        form.value.logo = info.file.response?.result;
    }
};
/**
 * 浏览器页签上传之前
 */
const beforeIconUpload = (file: any) => {
    const isType = iconTypes.value.includes(file.type);
    if (!isType) {
        onlyMessage('请上传ico格式的图片', 'error');
        return false;
    }
    const isSize = file.size / 1024 / 1024 < 1;
    if (!isSize) {
        onlyMessage('支持1M以内的图片', 'error');
    }
    return isType && isSize;
};
/**
 * 浏览器页签发生改变
 */
const changeIconUpload = (info: any) => {
    if (info.file.status === 'uploading') {
        iconLoading.value = true;
    }
    if (info.file.status === 'done') {
        info.file.url = info.file.response?.result;
        iconLoading.value = false;
        form.value.ico = info.file.response?.result;
    }
};
/**
 * 背景图片上传之前
 */
const beforeBackUpload = (file: any) => {
    const isType = imageTypes.value.includes(file.type);
    if (!isType) {
        onlyMessage(`请上传.jpg.png.jfif.pjp.pjpeg.jpeg格式的图片`, 'error');
        return false;
    }
    const isSize = file.size / 1024 / 1024 < 4;
    if (!isSize) {
        onlyMessage(`图片大小必须小于${4}M`, 'error');
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
        form.value.background = info.file.response?.result;
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
