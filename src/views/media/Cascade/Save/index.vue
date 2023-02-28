<!-- 国标级联新增/编辑 -->
<template>
    <page-container>
        <a-card>
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form ref="formRef" layout="vertical" :model="formData">
                        <a-row :gutter="24">
                            <TitleComponent data="基本信息" />
                            <a-col :span="12">
                                <a-form-item
                                    label="名称"
                                    name="cascadeName"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入名称',
                                        },
                                        {
                                            max: 84,
                                            message: '最多可输入84个字符',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="formData.cascadeName"
                                        placeholder="请输入名称"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="代理视频流"
                                    name="proxyStream"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择代理视频流',
                                        },
                                    ]"
                                >
                                    <a-radio-group
                                        button-style="solid"
                                        v-model:value="formData.proxyStream"
                                    >
                                        <a-radio-button :value="true">
                                            启用
                                        </a-radio-button>
                                        <a-radio-button :value="false">
                                            禁用
                                        </a-radio-button>
                                    </a-radio-group>
                                </a-form-item>
                            </a-col>

                            <TitleComponent data="信令服务配置" />
                            <a-col :span="12">
                                <a-form-item
                                    name="clusterNodeId"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择集群节点',
                                        },
                                    ]"
                                >
                                    <template #label>
                                        <span>
                                            集群节点
                                            <a-tooltip
                                                title="使用此集群节点级联到上级平台"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </a-tooltip>
                                        </span>
                                    </template>
                                    <a-select
                                        v-model:value="formData.clusterNodeId"
                                        placeholder="请选择集群节点"
                                        :options="clustersList"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="信令名称"
                                    name="name"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入信令名称',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="formData.name"
                                        placeholder="请输入信令名称"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-item
                                    label="上级SIP ID"
                                    name="sipId"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入上级SIP ID',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="formData.sipId"
                                        placeholder="请输入上级SIP ID"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="上级SIP域"
                                    name="domain"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入上级平台SIP域',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="formData.domain"
                                        placeholder="请输入上级平台SIP域"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="上级SIP 地址"
                                    name="remoteAddress"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入上级SIP 地址',
                                        },
                                        {
                                            validator: checkSIP,
                                        },
                                    ]"
                                >
                                    <a-row :gutter="10">
                                        <a-col :span="14">
                                            <a-input
                                                v-model:value="
                                                    formData.remoteAddress
                                                "
                                                placeholder="请输入IP地址"
                                            />
                                        </a-col>
                                        <a-col :span="10">
                                            <a-input-number
                                                :min="1"
                                                :max="65535"
                                                v-model:value="
                                                    formData.remotePort
                                                "
                                                placeholder="请输入端口"
                                                style="width: 100%"
                                            />
                                        </a-col>
                                    </a-row>
                                </a-form-item>
                            </a-col>

                            <a-col :span="24">
                                <a-form-item
                                    label="本地SIP ID"
                                    name="localSipId"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入网关侧的SIP ID',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="formData.localSipId"
                                        placeholder="网关侧的SIP ID"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    name="host"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择SIP本地地址',
                                        },
                                        {
                                            validator: checkLocalSIP,
                                        },
                                    ]"
                                >
                                    <template #label>
                                        <span>
                                            SIP本地地址
                                            <a-tooltip
                                                title="使用指定的网卡和端口进行请求"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </a-tooltip>
                                        </span>
                                    </template>
                                    <a-row :gutter="10">
                                        <a-col :span="14">
                                            <a-select
                                                v-model:value="formData.host"
                                                placeholder="请选择IP地址"
                                                :options="allList"
                                            />
                                        </a-col>
                                        <a-col :span="10">
                                            <a-select
                                                v-model:value="formData.port"
                                                placeholder="请选择端口"
                                                :options="allListPorts"
                                            />
                                        </a-col>
                                    </a-row>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="SIP远程地址"
                                    name="publicHost"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入SIP远程地址',
                                        },
                                        {
                                            validator: checkPublicSIP,
                                        },
                                    ]"
                                >
                                    <a-row :gutter="10">
                                        <a-col :span="14">
                                            <a-input
                                                v-model:value="
                                                    formData.publicHost
                                                "
                                                placeholder="请输入IP地址"
                                            />
                                        </a-col>
                                        <a-col :span="10">
                                            <a-input-number
                                                :min="1"
                                                :max="65535"
                                                v-model:value="
                                                    formData.publicPort
                                                "
                                                placeholder="请输入端口"
                                                style="width: 100%"
                                            />
                                        </a-col>
                                    </a-row>
                                </a-form-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-item
                                    label="传输协议"
                                    name="transport"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择传输协议',
                                        },
                                    ]"
                                >
                                    <a-radio-group
                                        button-style="solid"
                                        v-model:value="formData.transport"
                                        @change="setPorts"
                                    >
                                        <a-radio-button value="UDP">
                                            UDP
                                        </a-radio-button>
                                        <a-radio-button value="TCP">
                                            TCP
                                        </a-radio-button>
                                    </a-radio-group>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="用户"
                                    name="user"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入用户',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="formData.user"
                                        placeholder="请输入用户"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="接入密码"
                                    name="password"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入接入密码',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input-password
                                        v-model:value="formData.password"
                                        placeholder="请输入接入密码"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="厂商"
                                    name="manufacturer"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入厂商',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="formData.manufacturer"
                                        placeholder="请输入厂商"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="型号"
                                    name="model"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入型号',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="formData.model"
                                        placeholder="请输入型号"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="版本号"
                                    name="firmware"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入版本号',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="formData.firmware"
                                        placeholder="请输入版本号"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="心跳周期（秒）"
                                    name="keepaliveInterval"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入心跳周期',
                                        },
                                    ]"
                                >
                                    <a-input-number
                                        :min="1"
                                        :max="10000"
                                        v-model:value="
                                            formData.keepaliveInterval
                                        "
                                        placeholder="请输入心跳周期"
                                        style="width: 100%"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="注册间隔（秒）"
                                    name="registerInterval"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入注册间隔',
                                        },
                                    ]"
                                >
                                    <a-input-number
                                        :min="1"
                                        :max="10000"
                                        v-model:value="
                                            formData.registerInterval
                                        "
                                        placeholder="请输入注册间隔"
                                        style="width: 100%"
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-form-item>
                            <a-button
                                type="primary"
                                @click="handleSubmit"
                                :loading="btnLoading"
                            >
                                保存
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-col>
                <a-col :span="12">
                    <div class="doc">
                        <h1>1.概述</h1>
                        <div>
                            配置国标级联，平台可以将已经接入到自身的摄像头共享给第三方调用播放。
                        </div>
                        <div>
                            <a-alert
                                message="注：该配置只用于将本平台向上级联至第三方平台，如需第三方平台向上级联至本平台，请在“视频设备”页面新增设备时选择“GB/T28181”接入方式。"
                                type="info"
                                show-icon
                            />
                        </div>
                        <h1>2.配置说明</h1>
                        <div>
                            以下配置说明以将本平台数据级联到LiveGBS平台为例。
                        </div>
                        <h2>1、上级SIP ID</h2>
                        <div>请填写第三方平台中配置的<b>SIP ID</b>。</div>
                        <div class="image">
                            <a-image
                                width="100%"
                                :src="getImage('/northbound/doc2.png')"
                            />
                        </div>
                        <h2>2、上级SIP 域</h2>
                        <div>请填写第三方平台中配置的<b>SIP ID域</b>。</div>
                        <div class="image">
                            <a-image
                                width="100%"
                                :src="getImage('/northbound/doc1.png')"
                            />
                        </div>
                        <h2>3、上级SIP 地址</h2>
                        <div>请填写第三方平台中配置的<b>SIP ID地址</b>。</div>
                        <div class="image">
                            <a-image
                                width="100%"
                                :src="getImage('/northbound/doc3.png')"
                            />
                        </div>
                        <h2>4、本地SIP ID</h2>
                        <div>
                            请填写本地的<b>SIP ID地址</b>。
                            地址由中心编码(8位)、行业编码(2位)、类型编码(3位)和序号(7位)四个码段共20位十
                            进制数字字符构成。详细规则请参见《GB/T28181-2016》中附录D部分。
                        </div>
                        <h2>5、SIP本地地址</h2>
                        <div>
                            请选择<b>指定的网卡和端口</b>，如有疑问请联系系统运维人员。
                        </div>
                        <h2>6、用户</h2>
                        <div>
                            部分平台有基于用户和接入密码的特殊认证。通常情况下,请填写<b
                                >本地SIP ID</b
                            >值。
                        </div>
                        <h2>7、接入密码</h2>
                        <div>
                            需与上级平台设置的接入密码一致，用于身份认证。
                        </div>
                        <h2>8、厂商/型号/版本号</h2>
                        <div>
                            本平台将以“设备”的身份级联到上级平台，请设置本平台在上级平台中显示的厂商、型号、版本号。
                        </div>
                        <h2>9、心跳周期</h2>
                        <div>
                            需与上级平台设置的心跳周期保持一致，通常默认60秒。
                        </div>
                        <h2>10、注册间隔</h2>
                        <div>
                            若SIP代理通过注册方式校时,其注册间隔时间宜设置为小于
                            SIP代理与 SIP服务器出现1s误 差所经过的运行时间。
                        </div>
                    </div>
                </a-col>
            </a-row>
        </a-card>
    </page-container>
</template>

<script setup lang="ts">
import { getImage } from '@/utils/comm';
import { message } from 'ant-design-vue';
import CascadeApi from '@/api/media/cascade';

const router = useRouter();
const route = useRoute();

// 表单数据
const formData = ref({
    id: route.query.id || undefined,
    // name: '',
    cascadeName: '',
    proxyStream: false,
    // 以下字段, 提交时需提取到sipConfigs[{}]字段当中
    clusterNodeId: '',
    name: '',
    sipId: '',
    domain: '',
    remoteAddress: '',
    remotePort: undefined,
    localSipId: '',
    host: '',
    port: undefined,
    // remotePublic: {
    //     host: '',
    //     port: undefined,
    // },
    publicHost: '',
    publicPort: undefined,
    transport: 'UDP',
    user: '',
    password: '',
    manufacturer: '',
    model: '',
    firmware: '',
    keepaliveInterval: '60',
    registerInterval: '3600',
});

/**
 * 获取集群节点
 */
const clustersList = ref([]);
const getClustersList = async () => {
    const { result } = await CascadeApi.clusters();
    clustersList.value = result.map((m: any) => ({
        label: m.name,
        value: m.id,
    }));
};
getClustersList();
/**
 * SIP本地地址
 */
const allList = ref<any[]>([]);
const getAllList = async () => {
    const { result } = await CascadeApi.all();
    allList.value = result.map((m: any) => ({
        label: m.host,
        value: m.host,
    }));
    setPorts();
};
getAllList();

/**
 * 传输协议改变, 获取对应的端口
 */
const allListPorts = ref([]);
const setPorts = () => {
    allListPorts.value = allList.value.find(
        (f: any) => f.host === formData.value.host,
    )?.ports[formData.value.transport || ''];
};

/**
 * 获取详情
 */
const getDetail = async () => {
    if (!route.query.id) return;
    const res = await CascadeApi.detail(route.query.id as string);
    const { id, name, proxyStream, sipConfigs } = res.result;
    formData.value = {
        id,
        cascadeName: name,
        proxyStream,
        clusterNodeId: sipConfigs[0]?.clusterNodeId,
        name: sipConfigs[0]?.name,
        sipId: sipConfigs[0]?.sipId,
        domain: sipConfigs[0]?.domain,
        remoteAddress: sipConfigs[0]?.remoteAddress,
        remotePort: sipConfigs[0]?.remotePort,
        localSipId: sipConfigs[0]?.localSipId,
        host: sipConfigs[0]?.host,
        port: sipConfigs[0]?.port,
        publicHost: sipConfigs[0]?.publicHost,
        publicPort: sipConfigs[0]?.publicPort,
        transport: sipConfigs[0]?.transport,
        user: sipConfigs[0]?.user,
        password: sipConfigs[0]?.password,
        manufacturer: sipConfigs[0]?.manufacturer,
        model: sipConfigs[0]?.model,
        firmware: sipConfigs[0]?.firmware,
        keepaliveInterval: sipConfigs[0]?.keepaliveInterval,
        registerInterval: sipConfigs[0]?.registerInterval,
    };

    console.log('formData.value: ', formData.value);
};

onMounted(() => {
    getDetail();
});

const regDomain =
    /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
/**
 * 上级SIP地址 字段验证
 * @param _
 * @param value 此处绑定的是 remoteAddress
 */
const checkSIP = (_: any, value: string) => {
    return checkHost(value, formData.value.remotePort);
};
/**
 * SIP远程地址 字段验证
 * @param _
 * @param value 此处绑定的是 publicHost
 */
const checkPublicSIP = (_: any, value: string) => {
    return checkHost(value, formData.value.publicPort);
};

/**
 * 字段验证
 * @param host ip
 * @param port 端口
 */
const checkHost = (host: string, port: string | number | undefined) => {
    if (!host) {
        return Promise.resolve();
    } else if (!host) {
        return Promise.reject(new Error('请输入IP 地址'));
    } else if (host && !regDomain.test(host)) {
        return Promise.reject(new Error('请输入正确的IP地址'));
    } else if (!port) {
        return Promise.reject(new Error('请输入端口'));
    } else if ((host && Number(host) < 1) || Number(host) > 65535) {
        return Promise.reject(new Error('端口请输入1~65535之间的正整数'));
    }
    return Promise.resolve();
};

/**
 * SIP本地地址 字段验证
 * @param _
 * @param value
 */
const checkLocalSIP = (_: any, value: string) => {
    if (!value) {
        return Promise.resolve();
    } else if (!value) {
        return Promise.reject(new Error('请选择IP地址'));
    } else if (!formData.value.port) {
        return Promise.reject(new Error('请选择端口'));
    }
    return Promise.resolve();
};

/**
 * 表单提交
 */
const formRef = ref();
const btnLoading = ref<boolean>(false);
const handleSubmit = () => {
    // console.log('formData.value: ', formData.value);
    formRef.value
        .validate()
        .then(async () => {
            const {
                id,
                cascadeName,
                proxyStream,
                publicHost,
                publicPort,
                ...extraFormData
            } = formData.value;
            const params = {
                id,
                name: cascadeName,
                proxyStream,
                sipConfigs: [
                    {
                        ...extraFormData,
                        remotePublic: {
                            host: publicHost,
                            port: publicPort,
                        },
                    },
                ],
            };
            btnLoading.value = true;
            const res = formData.value.id
                ? await CascadeApi.update(params)
                : await CascadeApi.save(params);
            btnLoading.value = false;
            if (res.success) {
                message.success('操作成功');
                router.back();
            } else {
                message.error('操作失败');
            }
        })
        .catch((err: any) => {
            console.log('err: ', err);
        });
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
