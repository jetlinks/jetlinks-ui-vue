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
                                <Basic ref="basicRef" />
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
                                    @ok="saveCurrentData"
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
                                            layout="vertical"
                                            :model="modalForm"
                                            ref="formRef"
                                            :rules="rulesModle"
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
                                                                modalForm.host
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
                                                                modalForm.publicHost
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
                                                                modalForm.port
                                                            "
                                                        >
                                                            <a-select-option
                                                                v-for="item in optionPorts"
                                                                :key="item"
                                                                :value="
                                                                    item.value
                                                                "
                                                                :label="
                                                                    item.label
                                                                "
                                                                >{{
                                                                    item.label
                                                                }}</a-select-option
                                                            >
                                                        </a-select>
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
                                                                modalForm.publicPort
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
                        :loading="
                            isSucessBasic === 2 ||
                            isSucessInit === 2 ||
                            isSucessRole === 2
                        "
                        >确定</a-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { getImage } from '@/utils/comm.ts';
import Basic from './Basic/index.vue';
import {
    PlusOutlined,
    ExclamationCircleOutlined,
    LoadingOutlined,
} from '@ant-design/icons-vue';
import RoleMenuData, { ROLEKEYS, RoleData } from './data/RoleData';
import type { Rule } from 'ant-design-vue/es/form';
import type {
    FormInstance,
    UploadChangeParam,
    UploadProps,
} from 'ant-design-vue';
import { modalState, formState, logoState } from './data/interface';
import BaseMenu from './data/baseMenu';
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
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import { FILE_UPLOAD } from '@/api/comm';
import { LocalStore } from '@/utils/comm';
import { message } from 'ant-design-vue';
import { Form } from 'ant-design-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
const formRef = ref();
const menuRef = ref();
const formBasicRef = ref();
const basicRef = ref();
const useForm = Form.useForm;
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
 * 校验官网地址
 */
const validateUrl = async (_rule: Rule, value: string) => {
    if (!value) {
        return Promise.reject('请输入公网地址');
    } else {
        var reg = new RegExp(
            /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/,
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
const modalForm = reactive<modalState>({
    host: '0.0.0.0',
    port: '',
    publicHost: '',
    publicPort: null,
});
const rulesModle = ref({
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
});

// const { resetFields, validate, validateInfos } = useForm(
//     modalForm.value,
//     rulesModle.value,
// );
/**
 * 默认打开第一个初始菜单
 */
const activeKey = ref<string>('1');
const spinning = ref<boolean>(false);
const visible = ref<boolean>(false);
const flag = ref<boolean>(false);
// const action = ref<string>(`${BASE_API_PATH}/file/static`);
const headers = ref({ [TOKEN_KEY]: LocalStore.get(TOKEN_KEY) });
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
    backLoading: false,
    iconLoading: false,
    inLogo: false,
    inIcon: false,
    inBackground: false,
    backSize: 4,
    logoSize: 1,
    iconValue: '/public/favicon.ico',
    backValue: '/public/images/login.png',
    imageTypes: ['image/jpeg', 'image/png'],
    iconTypes: ['image/x-icon'],
    /**
     * logo格式校验
     */
    beforeLogoUpload: (file) => {
        const isType: any = logoData.imageTypes.includes(file.type);
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
    /*
     * logo上传改变事件
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
    beforeBackUpload: (file) => {
        const isType = logoData.imageTypes.includes(file.type);
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
    /**
     * 背景图片发生改变
     */
    changeBackUpload: (info) => {
        if (info.file.status === 'uploading') {
            logoData.backLoading = true;
        }
        if (info.file.status === 'done') {
            info.file.url = info.file.response?.result;
            logoData.backLoading = false;
            logoData.backValue = info.file.response?.result;
        }
    },
    /**
     * 上传之前
     */
    beforeIconUpload: (file) => {
        const isType = logoData.iconTypes.includes(file.type);
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
    /**
     * 图标发生改变
     */
    changeIconUpload: (info) => {
        if (info.file.status === 'uploading') {
            logoData.iconLoading = true;
        }
        if (info.file.status === 'done') {
            info.file.url = info.file.response?.result;
            logoData.iconLoading = true;
            logoData.iconValue = info.file.response?.result;
        }
    },
});

const {
    logoValue,
    logoLoading,
    iconLoading,
    backLoading,
    inLogo,
    iconValue,
    inIcon,
    inBackground,
    backValue,
    handleChangeLogo,
    beforeBackUpload,
    changeBackUpload,
    beforeLogoUpload,
    beforeIconUpload,
    changeIconUpload,
    imageTypes,
    iconTypes,
} = toRefs(logoData);
/**
 * 提交基础表单
 */
const basicData = reactive({
    isSucessBasic: 0,
    /**
     * 提交基础表单数据
     */
    saveBasicInfo: async () => {
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
                    basicData.isSucessBasic = 3;
                } else {
                    basicData.isSucessBasic = 2;
                }
            })
            .catch((error: ValidateErrorEntity<formState>) => {
                basicData.isSucessBasic = 2;
            });
    },
});
const { isSucessBasic } = toRefs(basicData);

/**
 * 提交角色数据
 */
const roleData = reactive({
    isSucessRole: 0,
    /**
     * 根据菜单找角色
     */
    findMenuByRole: (menu: any[], code: string): any => {
        let _item = null;
        menu.some((item) => {
            if (item.code === code) {
                _item = item;
                return true;
            }

            if (item.children) {
                const childrenItem = roleData.findMenuByRole(
                    item.children,
                    code,
                );
                if (childrenItem) {
                    _item = childrenItem;
                    return true;
                }
                return false;
            }

            return null;
        });
        return _item;
    },
    /**
     * 保存角色
     */
    addRoleData: async () => {
        return new Promise((resolve) => {
            if (!keys.value.length) {
                return resolve(true);
            }
            let Count = 0;
            keys.value.forEach(async (item, index) => {
                const _itemData = RoleData[item];
                // 添加该角色
                const res = await addRole(_itemData);
                if (res.status === 200) {
                    const menuTree = await getRoleMenu(res.result.id);
                    if (menuTree.status === 200) {
                        const _roleData = (RoleMenuData[item] as []).filter(
                            (roleItem: any) => {
                                const _menu = roleData.findMenuByRole(
                                    menuTree.result,
                                    roleItem.code,
                                );
                                if (_menu) {
                                    roleItem.id = _menu.id;
                                    roleItem.parentId = _menu.parentId;
                                    roleItem.createTime = _menu.createTime;
                                    return true;
                                }
                                return false;
                            },
                        );
                        //更新权限
                        const roleRes = await updateRoleMenu(res.result.id, {
                            menus: _roleData,
                        });
                        if (roleRes.status === 200) {
                            Count += 1;
                        }
                        if (index === keys.value.length - 1) {
                            resolve(Count === keys.value.length);
                        }
                    } else if (index === keys.value.length - 1) {
                        resolve(Count === keys.value.length);
                    }
                } else if (index === keys.value.length - 1) {
                    resolve(Count === keys.value.length);
                    roleData.isSucessRole = 2;
                }
            });
        });
    },
});
const { isSucessRole } = toRefs(roleData);
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
 * 提交初始化数据
 */
const initialization = reactive({
    isSucessInit: 0,
    optionPorts: [],
    /**
     * 查询端口数据
     */
    getCurrentPort: async () => {
        const resp = await getResourcesCurrent();
        const current = resp?.result;
        const _host =
            current.find((item: any) => item.host === '0.0.0.0')?.ports[
                'TCP'
            ] || [];
        initialization.optionPorts = _host?.map((p: any) => ({
            label: p,
            value: p,
        }));
    },
    /**
     * 提交初始数据表单
     */

    saveCurrentData: async () => {
        formRef.value
            .validate()
            .then(async () => {
                try {
                    // 新增网络组件
                    const network = await saveNetwork({
                        type: 'MQTT_SERVER',
                        shareCluster: true,
                        name: 'MQTT网络组件',
                        configuration: {
                            host: '0.0.0.0',
                            secure: false,
                            port: modalForm.port,
                            publicHost: modalForm.publicHost,
                            publicPort: modalForm.publicPort,
                        },
                    });
                    // 保存协议
                    const protocol = await saveProtocol();
                    let protocolItem: any = undefined;
                    if (protocol.status === 200) {
                        const proid = await getProtocol();
                        if (proid.status === 200) {
                            protocolItem = (proid?.result || []).find(
                                (it: any) => it.name === 'JetLinks官方协议',
                            );
                        }
                    }
                    // 新增设备接入网关
                    const accessConfig = await saveAccessConfig({
                        name: 'MQTT类型设备接入网关',
                        provider: 'mqtt-server-gateway',
                        protocol: protocolItem?.id,
                        transport: 'MQTT',
                        channel: 'network',
                        channelId: network?.result?.id,
                    });
                    // 新增产品
                    const product = await saveProduct({
                        name: 'MQTT产品',
                        messageProtocol: protocolItem?.id,
                        protocolName: protocolItem?.name,
                        transportProtocol: 'MQTT',
                        deviceType: 'device',
                        accessId: accessConfig.result?.id,
                        accessName: accessConfig.result?.name,
                        accessProvider: 'mqtt-server-gateway',
                    });
                    // 新增设备
                    const device = await saveDevice({
                        name: 'MQTT设备',
                        productId: product?.result?.id,
                        productName: product?.result?.name,
                    });
                    if (device.status === 200) {
                        await changeDeploy(product.result.id);
                        await deployDevice(device.result.id);
                    }
                    flag.value = true;
                    visible.value = false;
                    initialization.isSucessInit = 3;
                } catch (e) {
                    initialization.isSucessInit = 2;
                }
            })
            .catch((error: ValidateErrorEntity<modalState>) => {
                initialization.isSucessInit = 2;
            });
    },
});
const { optionPorts, saveCurrentData, isSucessInit } = toRefs(initialization);

/**
 * 初始化
 */
menuDatas.getSystemPermissionData();
initialization.getCurrentPort();
/**
 * 跳转首页
 */
const jump = () => {
    window.location.href = '/';
};
/**
 * 提交所有数据
 */
const submitData = async () => {
    if (keys.value.length > 0) {
        roleData.addRoleData();
    }
    basicRef.value.submitBasic();
    // basicData.saveBasicInfo();
    // 当前数据是否成功提交
    if (
        basicData.isSucessBasic === 3 &&
        roleData.isSucessRole === 3 &&
        initialization.isSucessInit === 3
    ) {
        message.success('保存成功');
        // 记录初始化数据，跳转首页
        const res = await saveInit();
        if (res.status === 200) {
            jump();
        }
    }
};
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
