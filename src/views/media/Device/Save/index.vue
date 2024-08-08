<!-- 视频设备新增/编辑 -->
<template>
    <page-container>
        <j-card>
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form ref="formRef" :model="formData" layout="vertical">
                        <j-form-item
                            :label="$t('Save.index.117444-0')"
                            name="channel"
                            :rules="{
                                required: true,
                                message: $t('Save.index.117444-1'),
                            }"
                        >
                            <RadioCard
                                layout="horizontal"
                                :options="PROVIDER_OPTIONS"
                                :checkStyle="true"
                                :disabled="!!route.query.id"
                                v-model="formData.channel"
                                @change="handleChannelChange"
                            />
                        </j-form-item>
                        <j-row :gutter="24">
                            <j-col :span="8">
                                <JProUpload
                                    v-model:modelValue="formData.photoUrl"
                                />
                            </j-col>
                            <j-col :span="16">
                                <j-form-item
                                    label="ID"
                                    name="id"
                                    :rules="[
                                        {
                                            required:
                                                formData.channel ===
                                                'gb28181-2016',
                                            message: $t('Save.index.117444-2'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.117444-3'),
                                        },
                                        {
                                            pattern: /^[a-zA-Z0-9_\-]+$/,
                                            message:
                                                $t('Save.index.117444-4'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.id"
                                        :placeholder="$t('Save.index.117444-2')"
                                        :disabled="!!route.query.id"
                                    />
                                </j-form-item>
                                <j-form-item
                                    :label="$t('Save.index.117444-5')"
                                    name="name"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Save.index.117444-6'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Save.index.117444-7'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.name"
                                        :placeholder="$t('Save.index.117444-6')"
                                    />
                                </j-form-item>
                            </j-col>
                        </j-row>
                        <j-form-item
                            :label="$t('Save.index.117444-8')"
                            name="productId"
                            :rules="{
                                required: true,
                                message: $t('Save.index.117444-9'),
                            }"
                        >
                            <j-row :gutter="[0, 10]">
                                <j-col :span="!!route.query.id ? 24 : 22">
                                    <j-select
                                        v-model:value="formData.productId"
                                        :placeholder="$t('Save.index.117444-9')"
                                        :disabled="!!route.query.id"
                                        showSearch
                                        @change="handleProductChange"
                                    >
                                        <j-select-option
                                            v-for="(item, index) in productList"
                                            :key="index"
                                            :value="item.id"
                                            :label="item.name"
                                        >
                                            {{ item.name }}
                                        </j-select-option>
                                    </j-select>
                                </j-col>
                                <j-col :span="2" v-if="!route.query.id">
                                    <PermissionButton
                                        type="link"
                                        @click="saveProductVis = true"
                                        hasPermission="device/Product:add"
                                    >
                                        <AIcon type="PlusOutlined" />
                                    </PermissionButton>
                                </j-col>
                            </j-row>
                        </j-form-item>
                        <j-form-item
                            :label="$t('Save.index.117444-10')"
                            :name="['others', 'access_pwd']"
                            :rules="[
                                {
                                    required: true,
                                    message: $t('Save.index.117444-11'),
                                },
                                {
                                    max: 64,
                                    message: $t('Save.index.117444-7'),
                                },
                            ]"
                            v-if="formData.channel === 'gb28181-2016'"
                        >
                            <j-input-password
                                v-model:value="formData.others.access_pwd"
                                :placeholder="$t('Save.index.117444-11')"
                            />
                        </j-form-item>
                        <template v-if="formData.channel === 'onvif'">
                            <j-form-item
                                :label="$t('Save.index.117444-12')"
                                :name="['others', 'onvifUrl']"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Save.index.117444-13'),
                                    },
                                    {
                                        max: 64,
                                        message: $t('Save.index.117444-7'),
                                    },
                                ]"
                            >
                                <j-input
                                    v-model:value="formData.others.onvifUrl"
                                    :placeholder="$t('Save.index.117444-13')"
                                ></j-input>
                            </j-form-item>
                            <j-form-item
                                :label="$t('Save.index.117444-14')"
                                :name="['others', 'onvifUsername']"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Save.index.117444-15'),
                                    },
                                    {
                                        max: 64,
                                        message: $t('Save.index.117444-7'),
                                    },
                                ]"
                            >
                                <j-input
                                    v-model:value="
                                        formData.others.onvifUsername
                                    "
                                    :placeholder="$t('Save.index.117444-15')"
                                ></j-input>
                            </j-form-item>
                            <j-form-item
                                :label="$t('Save.index.117444-10')"
                                :name="['others', 'onvifPassword']"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Save.index.117444-11'),
                                    },
                                    {
                                        max: 64,
                                        message: $t('Save.index.117444-7'),
                                    },
                                ]"
                            >
                                <j-input-password
                                    v-model:value="
                                        formData.others.onvifPassword
                                    "
                                    :placeholder="$t('Save.index.117444-11')"
                                ></j-input-password>
                            </j-form-item>
                        </template>
                        <template v-if="formData.channel === 'media-plugin'">
                            <j-form-item
                                :name="['others', item.property]"
                                v-for="item in metadata?.properties || []"
                                :key="item"
                                :label="item.name"
                                :rules="[
                                    {
                                        required:
                                            !!item?.type?.expands?.required,
                                        message: `${
                                            item.type.type === 'enum' ||
                                            'boolean'
                                                ? $t('Save.index.117444-16')
                                                : $t('Save.index.117444-17')
                                        }${item.name}`,
                                    },
                                ]"
                            >
                                <j-input
                                    :placeholder="$t('Save.index.117444-17')"
                                    v-if="item.type.type === 'string'"
                                    v-model:value="
                                        formData.others[item.property]
                                    "
                                ></j-input>
                                <j-input-password
                                    :placeholder="$t('Save.index.117444-17')"
                                    v-if="item.type.type === 'password'"
                                    v-model:value="
                                        formData.others[item.property]
                                    "
                                ></j-input-password>
                                <j-select
                                    :placeholder="$t('Save.index.117444-16')"
                                    v-if="
                                        item.type.type === 'enum' ||
                                        item.type.type === 'boolean'
                                    "
                                    v-model:value="
                                        formData.others[item.property]
                                    "
                                    :options="getOptions(item)"
                                >
                                </j-select>
                                <j-input-number
                                    v-if="
                                        [
                                            'int',
                                            'float',
                                            'double',
                                            'long',
                                        ].includes(item.type.type)
                                    "
                                    v-model:value="
                                        formData.others[item.property]
                                    "
                                    :placeholder="$t('Save.index.117444-17')"
                                ></j-input-number>
                            </j-form-item>
                        </template>
                        <template v-if="!!route.query.id">
                            <j-form-item
                                v-if="formData.channel === 'gb28181-2016'"
                                :label="$t('Save.index.117444-18')"
                                name="streamMode"
                                :rules="{
                                    required: true,
                                    message: $t('Save.index.117444-19'),
                                }"
                            >
                                <j-radio-group
                                    button-style="solid"
                                    v-model:value="formData.streamMode"
                                >
                                    <j-radio-button value="UDP">
                                        UDP
                                    </j-radio-button>
                                    <j-radio-button value="TCP_PASSIVE">
                                        {{ $t('Save.index.117444-20') }}
                                    </j-radio-button>
                                </j-radio-group>
                            </j-form-item>
                            <j-form-item
                                :label="$t('Save.index.117444-21')"
                                name="manufacturer"
                                :rules="[
                                    {
                                        max: 64,
                                        message: $t('Save.index.117444-22'),
                                        trigger: 'change',
                                    },
                                ]"
                            >
                                <j-input
                                    v-model:value="formData.manufacturer"
                                    :placeholder="$t('Save.index.117444-23')"
                                />
                            </j-form-item>
                            <j-form-item
                                :label="$t('Save.index.117444-24')"
                                name="model"
                                :rules="[
                                    {
                                        max: 64,
                                        message: $t('Save.index.117444-22'),
                                        trigger: 'change',
                                    },
                                ]"
                            >
                                <j-input
                                    v-model:value="formData.model"
                                    :placeholder="$t('Save.index.117444-25')"
                                />
                            </j-form-item>
                            <j-form-item
                                :label="$t('Save.index.117444-26')"
                                name="firmware"
                                :rules="[
                                    {
                                        max: 64,
                                        message: $t('Save.index.117444-22'),
                                        trigger: 'change',
                                    },
                                ]"
                            >
                                <j-input
                                    v-model:value="formData.firmware"
                                    :placeholder="$t('Save.index.117444-27')"
                                />
                            </j-form-item>
                        </template>
                        <j-form-item :label="$t('Save.index.117444-28')">
                            <j-textarea
                                v-model:value="formData.description"
                                show-count
                                :maxlength="200"
                                :rows="5"
                                :placeholder="$t('Save.index.117444-29')"
                            />
                        </j-form-item>
                        <j-form-item>
                            <j-button
                                type="primary"
                                @click="handleSubmit"
                                :loading="btnLoading"
                            >
                                {{ $t('Save.index.117444-30') }}
                            </j-button>
                        </j-form-item>
                    </j-form>
                </j-col>
                <j-col :span="12">
                    <div
                        v-if="formData.channel === 'gb28181-2016'"
                        class="doc"
                        style="height: 800"
                    >
                        <h1>{{ $t('Save.index.117444-31') }}</h1>
                        <div>
                            {{ $t('Save.index.117444-32') }}
                        </div>
                        <h1>{{ $t('Save.index.117444-33') }}</h1>
                        <h1>{{ $t('Save.index.117444-34') }}</h1>
                        <h2>1、ID</h2>
                        <div>{{ $t('Save.index.117444-35') }}</div>
                        <h2>2、{{ $t('Save.index.117444-8') }}</h2>
                        <div>
                            {{ $t('Save.index.117444-37') }}
                        </div>
                        <h2>3、{{ $t('Save.index.117444-10') }}</h2>
                        <div>
                            {{ $t('Save.index.117444-39') }}
                        </div>
                        <h1>{{ $t('Save.index.117444-40') }}</h1>
                        <div>
                            {{ $t('Save.index.117444-41') }}
                        </div>
                        <div class="image">
                            <j-image
                                width="100%"
                                :src="getImage('/media/doc1.png')"
                            />
                        </div>
                        <h2>{{ $t('Save.index.117444-42') }}</h2>
                        <div>
                            {{ $t('Save.index.117444-43') }}
                            {{ $t('Save.index.117444-44') }}
                        </div>
                        <div class="image">
                            <j-image
                                width="100%"
                                :src="getImage('/media/doc2.png')"
                            />
                        </div>
                        <h2>{{ $t('Save.index.117444-45') }}</h2>
                        <div>
                            {{ $t('Save.index.117444-46') }}
                        </div>
                        <div class="image">
                            <j-image
                                width="100%"
                                :src="getImage('/media/doc3.png')"
                            />
                        </div>
                        <h2>{{ $t('Save.index.117444-47') }}</h2>
                        <div>
                            {{ $t('Save.index.117444-48') }}
                        </div>
                        <h2>{{ $t('Save.index.117444-49') }}</h2>
                        <div>
                            {{ $t('Save.index.117444-50') }}
                        </div>
                        <div class="image">
                            <j-image
                                width="100%"
                                :src="getImage('/media/doc4.png')"
                            />
                        </div>
                        <h2>{{ $t('Save.index.117444-51') }}</h2>
                        <div>{{ $t('Save.index.117444-52') }}</div>
                    </div>

                    <div v-else-if="formData.channel === 'fixed-media'" class="doc" style="height: 600">
                        <h1>{{ $t('Save.index.117444-31') }}</h1>
                        <div>
                            {{ $t('Save.index.117444-53') }}
                        </div>
                        <div>{{ $t('Save.index.117444-54') }}</div>
                        <div>{{ $t('Save.index.117444-55') }}</div>
                        <div>
                            {{ $t('Save.index.117444-56') }}
                        </div>
                        <h1>{{ $t('Save.index.117444-33') }}</h1>
                        <h2>1、ID</h2>
                        <div>
                            {{ $t('Save.index.117444-57') }}
                        </div>
                        <h2>2、{{ $t('Save.index.117444-8') }}</h2>
                        <div>
                            {{ $t('Save.index.117444-58') }}
                        </div>
                    </div>
                    <div v-else-if="formData.channel === 'onvif'" class="doc" style="height: 600">
                        <h1>{{ $t('Save.index.117444-31') }}</h1>
                        <div>
                            {{ $t('Save.index.117444-59') }}
                        </div>
                        <h1>{{ $t('Save.index.117444-33') }}</h1>
                        <div>
                            {{ $t('Save.index.117444-40') }}
                        </div>
                        <div>{{ $t('Save.index.117444-60') }}</div>
                        <div class="image">
                            <j-image
                                width="100%"
                                :src="getImage('/media/doc5.png')"
                            />
                        </div>
                        <div>{{ $t('Save.index.117444-34') }}</div>
                        <div>{{ $t('Save.index.117444-64') }}</div>
                        <div>{{ $t('Save.index.117444-65') }}</div>
                        <div>{{ $t('Save.index.117444-66') }}</div>
                        <div>{{ $t('Save.index.117444-67') }}</div>
                        <div class="image">
                            <j-image
                                width="100%"
                                :src="getImage('/media/doc6.png')"
                            />
                        </div>
                        <div>{{ $t('Save.index.117444-68') }}</div>
                        <div>{{ $t('Save.index.117444-69') }}</div>
                        <div class="image">
                            <j-image
                                width="100%"
                                :src="getImage('/media/doc7.png')"
                            />
                        </div>
                        <h1>{{ $t('Save.index.117444-70') }}</h1>
                    </div>
                    <div v-else-if="formData.channel === 'media-plugin'" class="doc" style="height: 600">
                        <h1>{{ $t('Save.index.117444-31') }}</h1>
                        <div>
                            {{ $t('Save.index.117444-71') }}
                        </div>
                        <h1>{{ $t('Save.index.117444-33') }}</h1>
                        <div>2.1{{ $t('Save.index.117444-34') }}</div>
                        <div>{{ $t('Save.index.117444-64') }}</div>
                        <div>{{ $t('Save.index.117444-65') }}</div>
                        <div>{{ $t('Save.index.117444-73') }}</div>
                        <h1>{{ $t('Save.index.117444-70') }}</h1>
                    </div>
                </j-col>
            </j-row>
        </j-card>

        <SaveProduct
            v-model:visible="saveProductVis"
            v-model:productId="formData.productId"
            v-model:password="formData.others.access_pwd"
            :channel="formData.channel"
            @close="getProductList"
        />
    </page-container>
</template>

<script setup lang="ts">
import { getImage, onlyMessage } from '@/utils/comm';
import DeviceApi from '@/api/media/device';
import { PROVIDER_OPTIONS } from '@/views/media/Device/const';
import type { ProductType } from '@/views/media/Device/typings';
import SaveProduct from './SaveProduct.vue';
import { notification } from 'jetlinks-ui-components';
import { omit } from 'lodash-es';
import { queryDeviceConfig } from '@/api/device/instance';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const route = useRoute();

// 表单数据
const formData = ref<any>({
    id: '',
    name: '',
    channel: 'gb28181-2016',
    photoUrl: getImage('/device-media.png'),
    productId: undefined,
    description: '',
    others: {
        access_pwd: '',
        onvifUrl: '',
        onvifPassword: '',
        onvifUsername: '',
    },
    // 编辑字段
    streamMode: '',
    manufacturer: '',
    model: '',
    firmware: '',
});

const metadata = ref<any>({
    properties: [],
});
const handleChannelChange = () => {
    formData.value.productId = undefined;
    getProductList();
};

/**
 * 获取所属产品
 */
const productList = ref<ProductType[]>([]);
const getProductList = async () => {
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
    if(result.length && !route.query.id){
        formData.value.productId = result[0]?.id
        formData.value.others.access_pwd = result[0]?.configuration?.access_pwd
        formData.value.streamMode = result[0]?.configuration?.stream_mode
    }
   
};

const handleProductChange = () => {
    formData.value.others.access_pwd =
        productList.value.find((f: any) => f.id === formData.value.productId)
            ?.configuration.access_pwd || '';
    formData.value.streamMode =
        productList.value.find((f: any) => f.id === formData.value.productId)
            ?.configuration.stream_mode || '';
};

//获取物模型下拉选项
const getOptions = (i: any) => {
    if (i.type.type === 'enum') {
        return (i.type?.elements || []).map((item) => {
            return {
                label: item?.text,
                value: item?.value,
            };
        });
    } else if (i.type.type === 'boolean') {
        return [
            {
                label: i.type?.falseText,
                value: i.type?.falseValue,
            },
            {
                label: i.type?.trueText,
                value: i.type?.trueValue,
            },
        ];
    }
    return undefined;
};
/**
 * 新增产品
 */
const saveProductVis = ref(false);

/**
 * 获取详情
 */
const getDetail = async () => {
    const res = await DeviceApi.detail(route.query.id as string);
    Object.assign(formData.value, res.result);
    formData.value.channel = res.result.provider;
    await getProductList();
    if (formData.value.productId) {
        const productData = productList.value.find((i: any) => {
            return i.id === formData.value.productId;
        });
        if (productData && formData.value.channel !== 'media-plugin') {
            formData.value.others.access_pwd = formData.value.others.access_pwd
                ? formData.value.others.access_pwd
                : productData?.configuration?.access_pwd;
            formData.value.streamMode = formData.value.streamMode
                ? formData.value.streamMode
                : productData?.configuration?.stream_mode;
        }
        if (productData && formData.value.channel === 'media-plugin') {
            if(!res.result.others || JSON.stringify(res.result?.others) === "{}"){
                formData.value.others = productData?.configuration;
            }
            const resp: any = await queryDeviceConfig(formData.value.id);
            if (resp.success) {
                metadata.value = resp?.result[0] || {
                    properties: [],
                };
            }
        }
    }
};

onMounted(async () => {
    if (!route.query.id) {
        getProductList();
    } else {
        getDetail();
    }
});

/**
 * 表单提交
 */
const btnLoading = ref<boolean>(false);
const formRef = ref();
const handleSubmit = () => {
    let {
        others,
        id,
        streamMode,
        manufacturer,
        model,
        firmware,
        ...extraParams
    } = formData.value;
    let params: any;
    if (formData.value.channel === 'fixed-media') {
        // 固定地址
        params = !id
            ? extraParams
            : { id, streamMode, manufacturer, model, firmware, ...extraParams };
    } else if (formData.value.channel === 'gb28181-2016') {
        // 国标
        others = omit(others, ['onvifUrl', 'onvifPassword', 'onvifUsername']);
        const getParams = () => {
            if (others?.stream_mode) {
                others.stream_mode = streamMode;
            }
            return {
                others,
                id,
                streamMode,
                manufacturer,
                model,
                firmware,
                ...extraParams,
            };
        };
        params = !id ? { others, id, ...extraParams } : getParams();
    } else if (formData.value.channel === 'onvif') {
        others = omit(others, ['access_pwd']);
        params = !id
            ? { others, ...extraParams }
            : {
                  id,
                  streamMode,
                  manufacturer,
                  model,
                  firmware,
                  others,
                  ...extraParams,
              };
    } else if (formData.value.channel === 'media-plugin') {
        params = !id
            ? extraParams
            : {
                  id,
                  streamMode,
                  manufacturer,
                  model,
                  firmware,
                  others,
                  ...extraParams,
              };
    }

    formRef.value
        ?.validate()
        .then(async () => {
            btnLoading.value = true;
            let res;
            if (!route.query.id) {
                const resp: any = await DeviceApi.validateId(id);
                if (resp.status === 200 && resp?.result?.passed) {
                    res = await DeviceApi.save(params);
                } else {
                    notification.error({
                        key: 'error',
                        message: $t('Save.index.117444-74'),
                    });
                }
            } else {
                res = await DeviceApi.update(params);
            }
            if (res?.success) {
                onlyMessage($t('Save.index.117444-75'));
                history.back();
            }
        })
        .catch((err: any) => {
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
