<!-- 通知模板详情 -->
<template>
    <page-container>
        <a-card>
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form layout="vertical">
                        <a-form-item
                            label="接入方式"
                            v-bind="validateInfos.channel"
                        >
                            <RadioCard
                                layout="horizontal"
                                :options="PROVIDER_OPTIONS"
                                :checkStyle="true"
                                :disabled="!!route.query.id"
                                v-model="formData.channel"
                            />
                        </a-form-item>
                        <a-row :gutter="24">
                            <a-col :span="8">
                                <JUpload
                                    v-model:modelValue="formData.photoUrl"
                                    :bgImage="formData.photoUrl"
                                />
                            </a-col>
                            <a-col :span="16">
                                <a-form-item
                                    label="ID"
                                    v-bind="validateInfos.id"
                                >
                                    <a-input
                                        v-model:value="formData.id"
                                        placeholder="请输入"
                                        :disabled="!!route.query.id"
                                    />
                                </a-form-item>
                                <a-form-item
                                    label="设备名称"
                                    v-bind="validateInfos.name"
                                >
                                    <a-input
                                        v-model:value="formData.name"
                                        placeholder="请输入名称"
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-form-item
                            label="所属产品"
                            v-bind="validateInfos.productId"
                        >
                            <a-row :gutter="[0, 10]">
                                <a-col :span="22">
                                    <a-select
                                        v-model:value="formData.productId"
                                        placeholder="请选择所属产品"
                                        :disabled="!!route.query.id"
                                    >
                                        <a-select-option
                                            v-for="(item, index) in productList"
                                            :key="index"
                                            :value="item.id"
                                        >
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-col>
                                <a-col :span="2">
                                    <a-button
                                        type="link"
                                        @click="saveProductVis = true"
                                    >
                                        <AIcon type="PlusOutlined" />
                                    </a-button>
                                </a-col>
                            </a-row>
                        </a-form-item>
                        <a-form-item
                            label="接入密码"
                            v-bind="validateInfos['others.access_pwd']"
                            v-if="formData.channel === 'gb28181-2016'"
                        >
                            <a-input-password
                                v-model:value="formData.others.access_pwd"
                                placeholder="请输入接入密码"
                            />
                        </a-form-item>
                        <template v-if="!!route.query.id">
                            <a-form-item
                                label="流传输模式"
                                v-bind="validateInfos.streamMode"
                            >
                                <a-radio-group
                                    button-style="solid"
                                    v-model:value="formData.streamMode"
                                >
                                    <a-radio-button value="UDP">
                                        UDP
                                    </a-radio-button>
                                    <a-radio-button value="TCP_PASSIVE">
                                        TCP被动
                                    </a-radio-button>
                                </a-radio-group>
                            </a-form-item>
                            <a-form-item label="设备厂商">
                                <a-input
                                    v-model:value="formData.manufacturer"
                                    placeholder="请输入设备厂商"
                                />
                            </a-form-item>
                            <a-form-item label="设备型号">
                                <a-input
                                    v-model:value="formData.model"
                                    placeholder="请输入设备型号"
                                />
                            </a-form-item>
                            <a-form-item label="固件版本">
                                <a-input
                                    v-model:value="formData.firmware"
                                    placeholder="请输入固件版本"
                                />
                            </a-form-item>
                        </template>

                        <a-form-item label="说明">
                            <a-textarea
                                v-model:value="formData.description"
                                show-count
                                :maxlength="200"
                                :rows="5"
                                placeholder="请输入说明"
                            />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ offset: 0, span: 3 }">
                            <a-button
                                type="primary"
                                @click="handleSubmit"
                                :loading="btnLoading"
                                style="width: 100%"
                            >
                                保存
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-col>
                <a-col :span="12">
                    <div v-if="1" class="doc" style="height: 800">
                        <h1>1.概述</h1>
                        <div>
                            视频设备通过GB/T28181接入平台整体分为2部分，包括平台端配置和设备端配置，不同的设备端配置的路径或页面存在差异，但配置项基本大同小异。
                        </div>
                        <h1>2.配置说明</h1>
                        <h1>平台端配置</h1>
                        <h2>1、ID</h2>
                        <div>设备唯一标识，请填写设备端配置的设备编号。</div>
                        <h2>2、所属产品</h2>
                        <div>
                            只能选择接入方式为GB/T28281的产品，若当前无对应产品，可点击右侧快速添加按钮，填写产品名称和选择GB/T28181类型的网关完成产品创建
                        </div>
                        <h2>3、接入密码</h2>
                        <div>
                            配置接入密码，设备端配置的密码需与该密码一致。该字段可在产品-设备接入页面进行统一配置，配置后所有设备将继承产品配置。设备单独修改后将脱离继承关系。
                        </div>
                        <h1>设备端配置</h1>
                        <div>
                            各个厂家、不同设备型号的设备端配置页面布局存在差异，但配置项基本大同小异，此处以大华摄像头为例作为接入配置示例
                        </div>
                        <div class="image">
                            <a-image
                                width="100%"
                                :src="getImage('/media/doc1.png')"
                            />
                        </div>
                        <h2>1、SIP服务器编号/SIP域</h2>
                        <div>
                            SIP服务器编号填入该设备所属产品-接入方式页面“连接信息”的SIP。
                            SIP域通常为SIP服务器编号的前10位。
                        </div>
                        <div class="image">
                            <a-image
                                width="100%"
                                :src="getImage('/media/doc2.png')"
                            />
                        </div>
                        <h2>2、SIP服务器IP/端口</h2>
                        <div>
                            SIP服务器IP/端口填入该设备所属产品-接入方式页面中“连接信息”的IP/端口。
                        </div>
                        <div class="image">
                            <a-image
                                width="100%"
                                :src="getImage('/media/doc3.png')"
                            />
                        </div>
                        <h2>3、设备编号</h2>
                        <div>
                            设备编号为设备唯一性标识，物联网平台的设备接入没有校验该字段，输入任意数字均不影响设备接入平台。
                        </div>
                        <h2>4、注册密码</h2>
                        <div>
                            填入该设备所属产品-接入方式页面中“GB28281配置”处的接入密码
                        </div>
                        <div class="image">
                            <a-image
                                width="100%"
                                :src="getImage('/media/doc4.png')"
                            />
                        </div>
                        <h2>5、其他字段</h2>
                        <div>不影响设备接入平台，可保持设备初始化值。</div>
                    </div>

                    <div v-else class="doc" style="height: 600">
                        <h1>1.概述</h1>
                        <div>
                            视频设备通过RTSP、RTMP固定地址接入平台分为2步。
                        </div>
                        <div>1、添加视频设备</div>
                        <div>2、添加视频下的通道地址。</div>
                        <div>
                            注：当前页面为新增视频设备，新增完成后点击设备的“通道”按钮，添加通道。
                        </div>
                        <h1>2.配置说明</h1>
                        <h2>1、ID</h2>
                        <div>
                            设备唯一标识，若不填写，系统将自动生成唯一标识。
                        </div>
                        <h2>2、所属产品</h2>
                        <div>
                            只能选择接入方式为固定地址的产品，若当前无对应产品，可点击右侧快速添加按钮，填写产品名称和选择固定地址类型的网关完成产品创建。
                        </div>
                    </div>
                </a-col>
            </a-row>
        </a-card>

        <SaveProduct
            v-model:visible="saveProductVis"
            v-model:productId="formData.productId"
            :channel="formData.channel"
            @close="getProductList"
        />
    </page-container>
</template>

<script setup lang="ts">
import { getImage } from '@/utils/comm';
import { Form } from 'ant-design-vue';
import { message } from 'ant-design-vue';

import DeviceApi from '@/api/media/device';

import { PROVIDER_OPTIONS } from '@/views/media/Device/const';
import type { ProductType } from '@/views/media/Device/typings';
import SaveProduct from './SaveProduct.vue';

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
};

onMounted(() => {
    getDetail();
});

/**
 * 表单提交
 */
const btnLoading = ref<boolean>(false);
const handleSubmit = () => {
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
