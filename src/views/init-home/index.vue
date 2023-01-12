<!-- 系统初始化 -->
<template>
    <div class="page-container">
        <div class="container-text">
            <div class="container-title">系统初始化</div>
        </div>
        <div class="container-box">
            <div class="container-main">
                <div class="container-right">
                    <a-spin :spinning="spinning">
                        <a-collapse v-model:activeKey="activeKey" accordion>
                            <a-collapse-panel key="1">
                                <template #header>
                                    <span class="title">基本信息</span>
                                    <span class="sub-title"
                                        >配置平台名称、登录背景图、主题色等基本信息</span
                                    >
                                </template>
                                <a-form
                                    layout="vertical"
                                    ref="formBasicRef"
                                    :rules="rulesFrom"
                                    :model="form"
                                >
                                    <a-row :span="24" :gutter="24">
                                        <a-col :span="10">
                                            <a-form-item
                                                label="系统名称"
                                                name="title"
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
                                            >
                                                <a-select
                                                    v-model:value="
                                                        form.headerTheme
                                                    "
                                                >
                                                    <a-select-option
                                                        value="light"
                                                        >白色</a-select-option
                                                    >
                                                    <a-select-option
                                                        value="dark"
                                                        >黑色</a-select-option
                                                    >
                                                </a-select>
                                            </a-form-item>
                                            <a-form-item>
                                                <template #label>
                                                    <span>高德API Key</span>
                                                    <a-tooltip
                                                        title="配置后平台可调用高德地图GIS服务"
                                                    >
                                                        <img
                                                            class="img-style"
                                                            :src="
                                                                getImage(
                                                                    '/init-home/mark.png',
                                                                )
                                                            "
                                                        />
                                                    </a-tooltip>
                                                </template>
                                                <a-input
                                                    v-model:value="form.apikey"
                                                    placeholder="请输入高德API Key"
                                                />
                                            </a-form-item>
                                            <a-form-item>
                                                <template #label>
                                                    <span>base-path</span>
                                                    <a-tooltip
                                                        title="系统后台访问的url"
                                                    >
                                                        <img
                                                            class="img-style"
                                                            :src="
                                                                getImage(
                                                                    '/init-home/mark.png',
                                                                )
                                                            "
                                                        />
                                                    </a-tooltip>
                                                </template>
                                                <a-input
                                                    v-model:value="
                                                        form.basePath
                                                    "
                                                    placeholder="请输入高德API Key"
                                                />
                                            </a-form-item>
                                            <a-row :gutter="24" :span="24">
                                                <a-col>
                                                    <a-form-item
                                                        label="系统logo"
                                                    >
                                                        <div
                                                            class="upload-image-warp-logo"
                                                        >
                                                            <div
                                                                class="upload-image-border-logo"
                                                            >
                                                                <a-upload
                                                                    :showUploadList="
                                                                        false
                                                                    "
                                                                    @change="
                                                                        handleChangeLogo
                                                                    "
                                                                >
                                                                    <div
                                                                        class="upload-image-content-logo"
                                                                    >
                                                                        <div
                                                                            class="upload-image"
                                                                            v-if="
                                                                                logoValue
                                                                            "
                                                                            :style="
                                                                                logoValue
                                                                                    ? `background-image: url(${logoValue});`
                                                                                    : ''
                                                                            "
                                                                        ></div>
                                                                        <div
                                                                            v-if="
                                                                                logoValue
                                                                            "
                                                                            class="upload-image-mask"
                                                                        >
                                                                            点击修改
                                                                        </div>
                                                                        <div
                                                                            v-else
                                                                        >
                                                                            <div
                                                                                v-if="
                                                                                    logoLoading
                                                                                "
                                                                            >
                                                                                <LoadingOutlined
                                                                                    style="
                                                                                        font-size: 28px;
                                                                                    "
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                v-else
                                                                            >
                                                                                <PlusOutlined
                                                                                    style="
                                                                                        font-size: 28px;
                                                                                    "
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a-upload>
                                                                <div
                                                                    v-if="
                                                                        logoValue &&
                                                                        logoLoading
                                                                    "
                                                                >
                                                                    <div
                                                                        class="upload-loading-mask"
                                                                    >
                                                                        <LoadingOutlined
                                                                            v-if="
                                                                                logoLoading
                                                                            "
                                                                            style="
                                                                                font-size: 28px;
                                                                            "
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div
                                                            class="upload-tips"
                                                        >
                                                            推荐尺寸200*200
                                                        </div>
                                                        <div
                                                            class="upload-tips"
                                                        >
                                                            支持jpg,png
                                                        </div>
                                                    </a-form-item>
                                                </a-col>
                                                <a-col>
                                                    <a-form-item>
                                                        <template #label>
                                                            <span
                                                                >浏览器页签</span
                                                            >
                                                            <a-tooltip
                                                                title="浏览器tab页中显示的图片元素"
                                                            >
                                                                <img
                                                                    class="img-style"
                                                                    :src="
                                                                        getImage(
                                                                            '/init-home/mark.png',
                                                                        )
                                                                    "
                                                                />
                                                            </a-tooltip>
                                                        </template>
                                                        <div
                                                            class="upload-image-warp-logo"
                                                        >
                                                            <div
                                                                class="upload-image-border-logo"
                                                            >
                                                                <a-upload>
                                                                    <div
                                                                        class="upload-image-content-logo"
                                                                    >
                                                                        <div
                                                                            class="upload-image-icon"
                                                                            v-if="
                                                                                iconValue
                                                                            "
                                                                            :style="
                                                                                iconValue
                                                                                    ? `background-image: url(${iconValue});`
                                                                                    : ''
                                                                            "
                                                                        ></div>
                                                                        <div
                                                                            v-if="
                                                                                iconValue
                                                                            "
                                                                            class="upload-image-mask"
                                                                        >
                                                                            点击修改
                                                                        </div>
                                                                        <div
                                                                            v-else
                                                                        >
                                                                            <div
                                                                                v-if="
                                                                                    logoLoading
                                                                                "
                                                                            >
                                                                                <LoadingOutlined
                                                                                    style="
                                                                                        font-size: 28px;
                                                                                    "
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                v-else
                                                                            >
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

                                                        <div
                                                            class="upload-tips"
                                                        >
                                                            推荐尺寸64*64
                                                        </div>
                                                        <div
                                                            class="upload-tips"
                                                        >
                                                            支持icon格式
                                                        </div>
                                                    </a-form-item>
                                                </a-col>
                                            </a-row>
                                        </a-col>
                                        <a-col :span="14">
                                            <a-form-item label="登录背景图">
                                                <div
                                                    class="upload-image-warp-back"
                                                >
                                                    <div
                                                        class="upload-image-border-back"
                                                    >
                                                        <a-upload
                                                            @beforeUpload="
                                                                beforeBackUpload
                                                            "
                                                            @change="
                                                                changeBackUpload
                                                            "
                                                        >
                                                            <div
                                                                class="upload-image-content-back"
                                                            >
                                                                <div
                                                                    class="upload-image"
                                                                    v-if="
                                                                        backValue
                                                                    "
                                                                    :style="
                                                                        backValue
                                                                            ? `background-image: url(${backValue});`
                                                                            : ''
                                                                    "
                                                                ></div>
                                                                <div
                                                                    v-if="
                                                                        backValue
                                                                    "
                                                                    class="upload-image-mask"
                                                                >
                                                                    点击修改
                                                                </div>
                                                                <div v-else>
                                                                    <div
                                                                        v-if="
                                                                            logoLoading
                                                                        "
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
                                                    </div>
                                                </div>
                                                <div class="upload-tips">
                                                    支持4M以内的图片:支持jpg、png
                                                </div>
                                                <div class="upload-tips">
                                                    建议尺寸1400x1080
                                                </div>
                                            </a-form-item>
                                        </a-col>
                                    </a-row>
                                </a-form>
                            </a-collapse-panel>
                            <a-collapse-panel key="2">
                                <template #header>
                                    <span class="title">菜单初始化</span>
                                    <span class="sub-title"
                                        >初始化菜单数据</span
                                    >
                                </template>
                                <div class="menu-style">
                                    <div class="menu-img">
                                        <img
                                            :src="
                                                getImage('/init-home/menu.png')
                                            "
                                        />
                                    </div>
                                    <div class="menu-info">
                                        <b>系统初始化{{ count }}个菜单</b>
                                        <div>
                                            初始化后的菜单可在“菜单管理”页面进行维护管理
                                        </div>
                                    </div>
                                </div>
                            </a-collapse-panel>
                            <a-collapse-panel key="3">
                                <template #header>
                                    <span class="title">角色初始化</span>
                                    <span class="sub-title"
                                        >初始化内置角色与权限数据</span
                                    >
                                </template>
                                <div class="init-home-role">
                                    <a-checkbox-group @change="getCheckValue">
                                        <div class="init-home-role-content">
                                            <div
                                                class="role-item role-item-1"
                                                :style="
                                                    keys.includes('device')
                                                        ? 'background-color: #f5f5f5;'
                                                        : ''
                                                "
                                            >
                                                <div class="role-item-title">
                                                    <a-checkbox
                                                        :value="ROLEKEYS.device"
                                                    ></a-checkbox>
                                                    <div class="role-title">
                                                        设备接入岗
                                                    </div>
                                                </div>
                                                <div
                                                    class="role-item-content"
                                                ></div>
                                                <div class="role-item-footer">
                                                    该角色负责设备接入模块的维护管理
                                                </div>
                                            </div>
                                            <div
                                                class="role-item role-item-2"
                                                :style="
                                                    keys.includes('link')
                                                        ? 'background-color: #f5f5f5;'
                                                        : ''
                                                "
                                            >
                                                <div class="role-item-title">
                                                    <a-checkbox
                                                        :value="ROLEKEYS.link"
                                                    ></a-checkbox>
                                                    <div class="role-title">
                                                        运维管理岗
                                                    </div>
                                                </div>
                                                <div
                                                    class="role-item-content"
                                                ></div>
                                                <div class="role-item-footer">
                                                    该角色负责系统运维模块的维护管理
                                                </div>
                                            </div>
                                            <div
                                                class="role-item role-item-3"
                                                :style="
                                                    keys.includes('complex')
                                                        ? 'background-color: #f5f5f5;'
                                                        : ''
                                                "
                                            >
                                                <div class="role-item-title">
                                                    <a-checkbox
                                                        :value="
                                                            ROLEKEYS.complex
                                                        "
                                                    ></a-checkbox>
                                                    <div class="role-title">
                                                        综合管理岗
                                                    </div>
                                                </div>
                                                <div
                                                    class="role-item-content"
                                                ></div>
                                                <div class="role-item-footer">
                                                    该角色负责系统运维和设备接入模块的维护管理
                                                </div>
                                            </div>
                                        </div>
                                    </a-checkbox-group>
                                </div>
                            </a-collapse-panel>
                            <a-collapse-panel key="4">
                                <template #header>
                                    <span class="title">初始化数据</span>
                                    <span class="sub-title"
                                        >初始化设备接入示例数据</span
                                    >
                                </template>
                                <div>
                                    <img
                                        class="init-data-img"
                                        @click="showModal"
                                        :src="
                                            flag
                                                ? getImage(
                                                      '/init-home/data-enabled.png',
                                                  )
                                                : getImage(
                                                      '/init-home/data-disabled.png',
                                                  )
                                        "
                                    />
                                </div>
                                <!-- 初始数据提交表单 -->
                                <a-modal
                                    v-model:visible="visible"
                                    title="初始数据"
                                    width="52vw"
                                    :maskClosable="false"
                                    @cancel="cancel"
                                    @ok="handleOk"
                                    okText="确定"
                                    cancelText="取消"
                                    class="modal-style"
                                    v-bind="layout"
                                >
                                    <div class="data-content">
                                        <p class="data-p-style">
                                            <ExclamationCircleOutlined
                                                style="margin: 0 0 0 5px"
                                            />
                                            初始化数据包括MQTT产品、MQTT设备、MQTT类型设备接入网关、MQTT网络组件、Jetlinks
                                            官方协议
                                        </p>
                                    </div>
                                    <div style="margin-top: 20px">
                                        <a-form
                                            :model="ModalForm"
                                            :validate-messages="message"
                                            ref="formRef"
                                            :rules="rules"
                                        >
                                            <a-row :span="24" :gutter="24">
                                                <a-col :span="12">
                                                    <a-form-item name="host">
                                                        <template #label>
                                                            <span
                                                                >本地地址
                                                            </span>
                                                            <a-tooltip
                                                                title="绑定到服务器上的网卡地址,绑定到所有网卡:0.0.0.0"
                                                            >
                                                                <img
                                                                    class="img-style"
                                                                    :src="
                                                                        getImage(
                                                                            '/init-home/mark.png',
                                                                        )
                                                                    "
                                                                />
                                                            </a-tooltip>
                                                        </template>
                                                        <a-input
                                                            v-model:value="
                                                                ModalForm.host
                                                            "
                                                            :disabled="true"
                                                        />
                                                    </a-form-item>
                                                    <a-form-item
                                                        name="publicHost"
                                                    >
                                                        <template #label>
                                                            <span
                                                                >公网地址
                                                            </span>
                                                            <a-tooltip
                                                                title="对外提供访问的地址内网环境时填写服务器的内网IP地址"
                                                            >
                                                                <img
                                                                    class="img-style"
                                                                    :src="
                                                                        getImage(
                                                                            '/init-home/mark.png',
                                                                        )
                                                                    "
                                                                />
                                                            </a-tooltip>
                                                        </template>
                                                        <a-input
                                                            v-model:value="
                                                                ModalForm.publicHost
                                                            "
                                                        >
                                                        </a-input>
                                                    </a-form-item>
                                                </a-col>
                                                <a-col :span="12">
                                                    <a-form-item name="port">
                                                        <template #label>
                                                            <span
                                                                >本地端口
                                                            </span>
                                                            <a-tooltip
                                                                title="监听指定端口的请求"
                                                            >
                                                                <img
                                                                    class="img-style"
                                                                    :src="
                                                                        getImage(
                                                                            '/init-home/mark.png',
                                                                        )
                                                                    "
                                                                />
                                                            </a-tooltip>
                                                        </template>
                                                        <a-select
                                                            v-model:value="
                                                                ModalForm.port
                                                            "
                                                        ></a-select>
                                                    </a-form-item>
                                                    <a-form-item
                                                        name="publicPort"
                                                    >
                                                        <template #label>
                                                            <span
                                                                >公网端口
                                                            </span>
                                                            <a-tooltip
                                                                title="对外提供访问的端口"
                                                            >
                                                                <img
                                                                    class="img-style"
                                                                    :src="
                                                                        getImage(
                                                                            '/init-home/mark.png',
                                                                        )
                                                                    "
                                                                />
                                                            </a-tooltip>
                                                        </template>
                                                        <a-input-number
                                                            v-model:value="
                                                                ModalForm.publicPort
                                                            "
                                                            style="width: 100%"
                                                        />
                                                    </a-form-item>
                                                </a-col>
                                            </a-row>
                                        </a-form>
                                    </div>
                                </a-modal>
                            </a-collapse-panel>
                        </a-collapse>
                    </a-spin>
                    <a-button
                        type="primary"
                        class="btn-style"
                        @click="submitData"
                        >确定</a-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { getImage } from '@/utils/comm.ts';
import {
    PlusOutlined,
    ExclamationCircleOutlined,
    LoadingOutlined,
} from '@ant-design/icons-vue';
import { ROLEKEYS, RoleData } from './data/RoleData';
import type { Rule } from 'ant-design-vue/es/form';
import type {
    FormInstance,
    UploadChangeParam,
    UploadProps,
} from 'ant-design-vue';
import { modalState, formState, logoState } from './data/interface';
import BaseMenu from './data/baseMenu';
import { getSystemPermission, save } from '@/api/initHome';
const formRef = ref();
const menuRef = ref();
const formBasicRef = ref<FormInstance>();
/**
 * 表单数据
 */
const form = reactive<formState>({
    title: '',
    headerTheme: 'light',
    apikey: '',
    basePath: `${window.location.origin}/api`,
    logo: '',
    icon: '',
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
        basePath: [
            {
                required: true,
                message: '请输入base-path',
                trigger: 'blur',
            },
        ],
    },
});
const { rulesFrom } = toRefs(form);
/**
 * 校验官网地址
 */
const validateUrl = async (_rule: Rule, value: string) => {
    if (!value) {
        return Promise.reject('请输入公网地址');
    } else {
        var reg = new RegExp(
            /^(((?!(127\\.0\\.0\\.1)|(localhost)|(10\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})|(172\\.((1[6-9])|(2\\d)|(3[01]))\\.\\d{1,3}\\.\\d{1,3})|(192\\.168\\.\\d{1,3}\\.\\d{1,3})).)*)(?:(?:\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(?:\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])$/,
        );
        if (!reg.test(value)) {
            return Promise.reject('请输入正确的公网地址');
        }
        return Promise.resolve();
    }
};
/**
 * 校验数字
 */
const validateNumber = async (_rule: Rule, value: string) => {
    if (!value) {
        return Promise.reject('请输入公网端口');
    } else {
        if (Number(value) < 1 || Number(value) > 65535) {
            return Promise.reject('请输入1~65535的正整数');
        }
        return Promise.resolve();
    }
};
/**
 * 初始化弹窗表单数据
 */
const ModalForm = reactive<modalState>({
    host: '0.0.0.0',
    port: '',
    publicHost: '',
    publicPort: null,
    rules: {
        host: [
            {
                required: true,
                message: '请选择本地地址',
            },
        ],
        port: [
            {
                required: true,
                message: '请选择本地端口',
            },
        ],
        publicHost: [
            {
                required: true,
                validator: validateUrl,
                trigger: 'change',
            },
        ],
        publicPort: [
            {
                required: true,
                validator: validateNumber,
                trigger: 'change',
            },
        ],
    },
});
const { rules } = toRefs(ModalForm);

/**
 * 默认打开第一个初始菜单
 */
const activeKey = ref<string>('1');
const spinning = ref<boolean>(false);
const visible = ref<boolean>(false);
const flag = ref<boolean>(false);
/**
 * 角色勾选数据
 */
const keys = ref([]);
/**
 * 获取角色选择数据
 */
const getCheckValue = (val: any) => {
    keys.value = val;
};
/**
 * 初始数据弹窗点击事件
 */
const showModal = () => {
    if (flag) {
        flag.value = false;
        visible.value = true;
    }
};

/**
 * 提交初始数据表单
 */
const handleOk = async () => {
    const valid = await formRef.value.validate();
};

/**
 * 表单取消事件
 */
const cancel = () => {
    formRef.value.resetFields();
};

/**
 * 提交图片
 */
const logoData = reactive<logoState>({
    logoValue: '/public/logo.png',
    logoLoading: false,
    inLogo: false,
    inIcon: false,
    inBackground: false,
    iconValue: '/public/favicon.ico',
    backValue: '/public/images/login.png',
    /**
     * 图片上传改变事件
     */
    handleChangeLogo: (info) => {
        if (info.file.status === 'uploading') {
            logoData.logoLoading = true;
        }
        if (info.file.status === 'done') {
            info.file.url = info.file.response?.result;
            logoData.logoLoading = false;
            logoData.logoValue = info.file.response?.result;
        }
    },
    /**
     * 背景图片上传之前
     */
    beforeBackUpload: (file) => {},
    /**
     * 背景图片发生改变
     */
    changeBackUpload: (info) => {},
});

const {
    logoValue,
    logoLoading,
    inLogo,
    iconValue,
    inIcon,
    inBackground,
    backValue,
    handleChangeLogo,
} = toRefs(logoData);
/**
 * 提交基础表单
 */
const basicData = reactive({
    /**
     * 提交基础表单数据
     */
    saveBasicInfo: async () => {},
});

/**
 * 获取菜单数据
 */
const menuDatas = reactive({
    count: 0,
    /**
     * 获取当前系统权限信息
     */
    getSystemPermissionData: async () => {
        const resp = await getSystemPermission();
        if (resp.status === 200) {
            const newTree = menuDatas.filterMenu(
                resp.result.map((item: any) => JSON.parse(item).id),
                BaseMenu,
            );
            const _count = menuDatas.menuCount(newTree);
            menuDatas.count = _count;
            console.log(menuDatas.count, 'menuDatas.count');
        }
    },
    /**
     * 过滤菜单
     */
    filterMenu: (permissions: string[], menus: any[]) => {
        return menus.filter((item) => {
            let isShow = false;
            if (item.showPage && item.showPage.length) {
                isShow = item.showPage.every((pItem: any) => {
                    return permissions.includes(pItem);
                });
            }
            if (item.children) {
                item.children = menuDatas.filterMenu(
                    permissions,
                    item.children,
                );
            }
            return isShow || !!item.children?.length;
        });
    },
    /**
     * 计算菜单数量
     */
    menuCount: (menus: any[]) => {
        return menus.reduce((pre, next) => {
            let _count = 1;
            if (next.children) {
                _count = menuDatas.menuCount(next.children);
            }
            return pre + _count;
        }, 0);
    },
});

const { count } = toRefs(menuDatas);
/**
 * 初始化
 */
menuDatas.getSystemPermissionData();
/**
 * 提交所有数据
 */
const submit = () => {};
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
