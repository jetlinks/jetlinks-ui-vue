<!-- 国标级联新增/编辑 -->
<template>
    <page-container>
        <a-card>
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form layout="vertical" :model="formData">
                        <a-row :gutter="24">
                            <TitleComponent data="基本信息" />
                            <a-col :span="12">
                                <a-form-item
                                    label="名称"
                                    name="name"
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
                                        v-model:value="formData.name"
                                        placeholder="请输入名称"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="代理视频流"
                                    name="name"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择代理视频流',
                                        },
                                    ]"
                                >
                                    <a-radio-group
                                        button-style="solid"
                                        v-model:value="formData.name"
                                    >
                                        <a-radio-button value="enabled">
                                            启用
                                        </a-radio-button>
                                        <a-radio-button value="disabled">
                                            禁用
                                        </a-radio-button>
                                    </a-radio-group>
                                </a-form-item>
                            </a-col>

                            <TitleComponent data="信令服务配置" />
                            <a-col :span="12">
                                <a-form-item
                                    label="集群节点"
                                    name="name"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择集群节点',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="formData.name"
                                        placeholder="请选择集群节点"
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
                                    name="name"
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
                                        v-model:value="formData.name"
                                        placeholder="请输入上级SIP ID"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="上级SIP域"
                                    name="name"
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
                                        v-model:value="formData.name"
                                        placeholder="请输入上级平台SIP域"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="上级SIP 地址"
                                    name="name"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入上级SIP 地址',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-row :gutter="10">
                                        <a-col :span="14">
                                            <a-input
                                                v-model:value="formData.name"
                                                placeholder="请输入IP地址"
                                            />
                                        </a-col>
                                        <a-col :span="10">
                                            <a-input
                                                v-model:value="formData.name"
                                                placeholder="请输入端口"
                                            />
                                        </a-col>
                                    </a-row>
                                </a-form-item>
                            </a-col>

                            <a-col :span="24">
                                <a-form-item
                                    label="本地SIP ID"
                                    name="name"
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
                                        v-model:value="formData.name"
                                        placeholder="网关侧的SIP ID"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="SIP本地地址"
                                    name="name"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入SIP本地地址',
                                        },
                                    ]"
                                >
                                    <a-row :gutter="10">
                                        <a-col :span="14">
                                            <a-select
                                                v-model:value="formData.name"
                                                placeholder="请选择IP地址"
                                            >
                                                <a-select-option value="1">
                                                    1
                                                </a-select-option>
                                            </a-select>
                                        </a-col>
                                        <a-col :span="10">
                                            <a-select
                                                v-model:value="formData.name"
                                                placeholder="请选择端口"
                                            >
                                                <a-select-option value="1">
                                                    1
                                                </a-select-option>
                                            </a-select>
                                        </a-col>
                                    </a-row>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="SIP远程地址"
                                    name="name"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入SIP远程地址',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-row :gutter="10">
                                        <a-col :span="14">
                                            <a-input
                                                v-model:value="formData.name"
                                                placeholder="请输入IP地址"
                                            />
                                        </a-col>
                                        <a-col :span="10">
                                            <a-input
                                                v-model:value="formData.name"
                                                placeholder="请输入端口"
                                            />
                                        </a-col>
                                    </a-row>
                                </a-form-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-item
                                    label="传输协议"
                                    name="name"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择传输协议',
                                        },
                                    ]"
                                >
                                    <a-radio-group
                                        button-style="solid"
                                        v-model:value="formData.name"
                                    >
                                        <a-radio-button value="UDP">
                                            UDP
                                        </a-radio-button>
                                        <a-radio-button value="TCP_PASSIVE">
                                            TCP
                                        </a-radio-button>
                                    </a-radio-group>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="用户"
                                    name="name"
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
                                        v-model:value="formData.name"
                                        placeholder="请输入用户"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="接入密码"
                                    name="name"
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
                                    <a-input
                                        v-model:value="formData.name"
                                        placeholder="请输入接入密码"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="厂商"
                                    name="name"
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
                                        v-model:value="formData.name"
                                        placeholder="请输入厂商"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="型号"
                                    name="name"
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
                                        v-model:value="formData.name"
                                        placeholder="请输入型号"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="版本号"
                                    name="name"
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
                                        v-model:value="formData.name"
                                        placeholder="请输入版本号"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="心跳周期（秒）"
                                    name="name"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入心跳周期（秒）',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input-number
                                        v-model:value="formData.name"
                                        placeholder="请输入心跳周期（秒）"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="注册间隔（秒）"
                                    name="name"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入注册间隔（秒）',
                                        },
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input-number
                                        v-model:value="formData.name"
                                        placeholder="请输入注册间隔（秒）"
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
import { Form } from 'ant-design-vue';
import { message } from 'ant-design-vue';

import DeviceApi from '@/api/media/device';

import { PROVIDER_OPTIONS } from '@/views/media/Device/const';
import type { ProductType } from '@/views/media/Device/typings';

const router = useRouter();
const route = useRoute();
const useForm = Form.useForm;

// 表单数据
const formData = ref({
    id: '',
    name: '',
    channel: 'gb28181-2016',
    photoUrl: getImage('/device-media.png'),
    productId: '',
    others: {
        access_pwd: '',
    },
    description: '',
    // 编辑字段
    streamMode: 'UDP',
    manufacturer: '',
    model: '',
    firmware: '',
});

// 验证规则
const formRules = ref({
    id: [
        {
            required: true,
            message: '请输入ID',
        },
        { max: 64, message: '最多输入64个字符' },
        {
            pattern: /^[a-zA-Z0-9_\-]+$/,
            message: '请输入英文或者数字或者-或者_',
        },
    ],
    name: [
        { required: true, message: '请输入名称' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    productId: [{ required: true, message: '请选择所属产品' }],
    channel: [{ required: true, message: '请选择接入方式' }],
    'others.access_pwd': [{ required: true, message: '请输入接入密码' }],
    description: [{ max: 200, message: '最多可输入200个字符' }],
    streamMode: [{ required: true, message: '请选择流传输模式' }],
});

watch(
    () => formData.value.channel,
    (val) => {
        formRules.value['id'][0].required = val === 'gb28181-2016';
        formRules.value['others.access_pwd'][0].required =
            val === 'gb28181-2016';
        validate();
        getProductList();
    },
);

const { resetFields, validate, validateInfos, clearValidate } = useForm(
    formData.value,
    formRules.value,
);

const clearValid = () => {
    setTimeout(() => {
        clearValidate();
    }, 200);
};

/**
 * 获取所属产品
 */
const productList = ref<ProductType[]>([]);
const getProductList = async () => {
    // console.log('formData.productId: ', formData.value.productId);
    const params = {
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
            { column: 'accessProvider', value: formData.value.channel },
            { column: 'state', value: 1 },
        ],
    };
    const { result } = await DeviceApi.queryProductList(params);
    productList.value = result;
};
getProductList();

/**
 * 新增产品
 */
const saveProductVis = ref(false);

/**
 * 获取详情
 */
const getDetail = async () => {
    const res = await DeviceApi.detail(route.query.id as string);
    // console.log('res: ', res);
    // formData.value = res.result;
    Object.assign(formData.value, res.result);
    formData.value.channel = res.result.provider;

    console.log('formData.value: ', formData.value);
};

onMounted(() => {
    getDetail();
});

/**
 * 表单提交
 */
const btnLoading = ref<boolean>(false);
const handleSubmit = () => {
    // console.log('formData.value: ', formData.value);
    validate()
        .then(async () => {
            btnLoading.value = true;
            let res;
            if (!route.query.id) {
                res = await DeviceApi.save(formData.value);
            } else {
                res = await DeviceApi.update(formData.value);
            }
            if (res?.success) {
                message.success('保存成功');
                router.back();
            }
        })
        .catch((err) => {
            console.log('err: ', err);
        })
        .finally(() => {
            btnLoading.value = false;
        });
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
