<template>
    <!-- <j-card> -->
        <div class="box" v-if="!noData">
            <div class="left">
                <div class="left-content">
                    <TitleComponent :data="$t('Detail.index.613238-0')" />
                    <j-alert
                        v-if="!!_error && modelRef?.id"
                        style="margin: 10px 0"
                        type="warning"
                    >
                        <template #message>
                            <div
                                style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                "
                            >
                                <span
                                    style="
                                        width: calc(100% - 100px);
                                        text-align: center;
                                    "
                                    >{{ _error }}</span
                                >
                                <PermissionButton
                                    :popConfirm="{
                                        title: $t('Detail.index.613238-1'),
                                        onConfirm: onActiveProduct,
                                    }"
                                    size="small"
                                    :hasPermission="'device/Product:action'"
                                >
                                    {{ $t('Detail.index.613238-2') }}
                                </PermissionButton>
                            </div>
                        </template>
                    </j-alert>
                    <j-form
                        :layout="'vertical'"
                        ref="formRef"
                        :model="modelRef"
                    >
                        <j-row :gutter="24">
                            <j-col :span="24">
                                <j-form-item
                                    :label="$t('Detail.index.613238-3')"
                                    name="name"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Detail.index.613238-4'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Detail.index.613238-5'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        :placeholder="$t('Detail.index.613238-4')"
                                        v-model:value="modelRef.name"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="24">
                                <j-form-item
                                    :name="['accessConfig', 'regionId']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Detail.index.613238-6'),
                                        },
                                    ]"
                                >
                                    <template #label>
                                        <span>
                                            {{ $t('Detail.index.613238-7') }}
                                            <j-tooltip
                                                :title="$t('Detail.index.613238-8')"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </j-tooltip>
                                        </span>
                                    </template>
                                    <j-select
                                        :placeholder="$t('Detail.index.613238-6')"
                                        v-model:value="
                                            modelRef.accessConfig.regionId
                                        "
                                        show-search
                                        @change="regionChange"
                                        @blur="productChange"
                                    >
                                        <j-select-option
                                            v-for="item in regionsList"
                                            :key="item.id"
                                            :value="item.id"
                                            :label="item.name"
                                            >{{ item.name }}</j-select-option
                                        >
                                    </j-select>
                                </j-form-item>
                            </j-col>
                            <j-col :span="24">
                                <j-form-item
                                    :name="['accessConfig', 'instanceId']"
                                >
                                    <template #label>
                                        <span>
                                            {{ $t('Detail.index.613238-9') }}
                                            <j-tooltip
                                                :title="$t('Detail.index.613238-10')"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </j-tooltip>
                                        </span>
                                    </template>
                                    <j-input
                                        :placeholder="$t('Detail.index.613238-11')"
                                        v-model:value="
                                            modelRef.accessConfig.instanceId
                                        "
                                        @blur="productChange"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="24">
                                <j-form-item
                                    :name="['accessConfig', 'accessKeyId']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Detail.index.613238-12'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Detail.index.613238-5'),
                                        },
                                    ]"
                                >
                                    <template #label>
                                        <span>
                                            accessKey
                                            <j-tooltip
                                                :title="$t('Detail.index.613238-13')"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </j-tooltip>
                                        </span>
                                    </template>
                                    <j-input
                                        :placeholder="$t('Detail.index.613238-12')"
                                        v-model:value="
                                            modelRef.accessConfig.accessKeyId
                                        "
                                        @blur="productChange"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="24">
                                <j-form-item
                                    :name="['accessConfig', 'accessSecret']"
                                    :rules="[
                                        {
                                            required: true,
                                            message: $t('Detail.index.613238-14'),
                                        },
                                        {
                                            max: 64,
                                            message: $t('Detail.index.613238-5'),
                                        },
                                    ]"
                                >
                                    <template #label>
                                        <span>
                                            accessSecret
                                            <j-tooltip
                                                :title="$t('Detail.index.613238-15')"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </j-tooltip>
                                        </span>
                                    </template>
                                    <j-input
                                        :placeholder="$t('Detail.index.613238-14')"
                                        v-model:value="
                                            modelRef.accessConfig.accessSecret
                                        "
                                        @blur="productChange"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="24">
                                <j-form-item
                                    name="bridgeProductKey"
                                    :rules="{
                                        required: true,
                                        message: $t('Detail.index.613238-16'),
                                    }"
                                >
                                    <template #label>
                                        <span>
                                            {{ $t('Detail.index.613238-17') }}
                                            <j-tooltip
                                                :title="$t('Detail.index.613238-18')"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </j-tooltip>
                                        </span>
                                    </template>
                                    <j-select
                                        :placeholder="$t('Detail.index.613238-16')"
                                        v-model:value="
                                            modelRef.bridgeProductKey
                                        "
                                        show-search
                                    >
                                        <j-select-option
                                            v-for="item in aliyunProductList"
                                            :key="item.productKey"
                                            :value="item.productKey"
                                            :label="item.productName"
                                            >{{
                                                item.productName
                                            }}</j-select-option
                                        >
                                    </j-select>
                                </j-form-item>
                            </j-col>
                            <j-col :span="24">
                                <p>{{ $t('Detail.index.613238-19') }}</p>
                                <j-collapse
                                    v-if="modelRef.mappings.length"
                                    :activeKey="activeKey"
                                    @change="onCollChange"
                                >
                                    <j-collapse-panel
                                        v-for="(
                                            item, index
                                        ) in modelRef.mappings"
                                        :key="index"
                                        :forceRender="false"
                                        :header="
                                            item.productKey
                                                ? aliyunProductList.find(
                                                      (i) =>
                                                          i.productKey ===
                                                          item.productKey,
                                                  )?.productName ||
                                                  `{{ $t('Detail.index.613238-19') }}${index + 1}`
                                                : `{{ $t('Detail.index.613238-19') }}${index + 1}`
                                        "
                                    >
                                        <template #extra
                                            ><AIcon
                                                type="DeleteOutlined"
                                                @click="delItem(index)"
                                        /></template>
                                        <j-row :gutter="24">
                                            <j-col :span="12">
                                                <j-form-item
                                                    :label="$t('Detail.index.613238-21')"
                                                    :name="[
                                                        'mappings',
                                                        index,
                                                        'productKey',
                                                    ]"
                                                    :rules="{
                                                        required: true,
                                                        message:
                                                            $t('Detail.index.613238-22'),
                                                    }"
                                                >
                                                    <j-select
                                                        :placeholder="$t('Detail.index.613238-22')"
                                                        v-model:value="
                                                            item.productKey
                                                        "
                                                        show-search
                                                    >
                                                        <j-select-option
                                                            v-for="i in getAliyunProductList(
                                                                item?.productKey ||
                                                                    '',
                                                            )"
                                                            :key="i.productKey"
                                                            :value="
                                                                i.productKey
                                                            "
                                                            :label="
                                                                i.productName
                                                            "
                                                            >{{
                                                                i.productName
                                                            }}</j-select-option
                                                        >
                                                    </j-select>
                                                </j-form-item>
                                            </j-col>
                                            <j-col :span="12">
                                                <j-form-item
                                                    :label="$t('Detail.index.613238-23')"
                                                    :name="[
                                                        'mappings',
                                                        index,
                                                        'productId',
                                                    ]"
                                                    :rules="[
                                                        {
                                                            required: true,
                                                            message:
                                                                $t('Detail.index.613238-24'),
                                                        },
                                                        {
                                                            validator:
                                                                _validator,
                                                            trigger: 'change',
                                                        },
                                                    ]"
                                                >
                                                    <MSelect
                                                        v-model:value="
                                                            item.productId
                                                        "
                                                        :options="
                                                            getPlatProduct(
                                                                item.productId ||
                                                                    '',
                                                            )
                                                        "
                                                        @error="onPlatError"
                                                    />
                                                </j-form-item>
                                            </j-col>
                                        </j-row>
                                    </j-collapse-panel>
                                </j-collapse>
                                <j-card v-else>
                                    <j-empty />
                                </j-card>
                            </j-col>
                            <j-col :span="24">
                                <j-button
                                    type="dashed"
                                    style="width: 100%; margin-top: 10px"
                                    @click="addItem"
                                >
                                    <AIcon
                                        type="PlusOutlined"
                                        style="margin-left: 2px"
                                    />{{ $t('Detail.index.613238-25') }}
                                </j-button>
                            </j-col>
                            <j-col :span="24" style="margin-top: 20px">
                                <j-form-item
                                    :label="$t('Detail.index.613238-26')"
                                    name="description"
                                    :rules="{
                                        max: 200,
                                        message: $t('Detail.index.613238-27'),
                                    }"
                                >
                                    <j-textarea
                                        v-model:value="modelRef.description"
                                        :placeholder="$t('Detail.index.613238-28')"
                                        showCount
                                        :maxlength="200"
                                    />
                                </j-form-item>
                            </j-col>
                        </j-row>
                    </j-form>
                </div>
            </div>
            <div class="right">
                <Doc />
            </div>
            <div class="control">
                <a-space>
                    <PermissionButton
                        v-if="data?.id"
                        hasPermission="Northbound/AliCloud:delete"
                        danger
                        :disabled="data?.state?.value !== 'disabled'"
                        :tooltip="{
                            title:
                                data?.state?.value !== 'disabled'
                                    ? $t('Detail.index.613238-29')
                                    : $t('Detail.index.613238-30'),
                        }"
                        :popConfirm="{
                            title: $t('Detail.index.613238-31'),
                            onConfirm: deleteData,
                        }"
                        >{{ $t('Detail.index.613238-30') }}
                    </PermissionButton>
                    <PermissionButton
                        v-if="data?.id"
                        type="primary"
                        ghost
                        hasPermission="Northbound/AliCloud:action"
                        :tooltip="{
                            title:
                                data?.state?.value !== 'disabled'
                                    ? $t('Detail.index.613238-32')
                                    : $t('Detail.index.613238-33'),
                        }"
                        :popConfirm="{
                            title: `${
                                data?.state?.value !== 'disabled'
                                    ? $t('Detail.index.613238-34')
                                    : $t('Detail.index.613238-41')
                            }`,
                            onConfirm: actionAliCloud,
                        }"
                        >{{
                            data?.state?.value !== 'disabled' ? $t('Detail.index.613238-32') : $t('Detail.index.613238-33')
                        }}
                    </PermissionButton>
                    <PermissionButton
                        type="primary"
                        :loading="loading"
                        @click="saveBtn"
                        :hasPermission="[
                            'Northbound/AliCloud:add',
                            'Northbound/AliCloud:update',
                        ]"
                    >
                        {{ $t('Detail.index.613238-35') }}
                    </PermissionButton>
                </a-space>
            </div>
        </div>
        <j-empty
            v-else
            style="height: calc(100vh - 300px); padding-top: 200px"
        ></j-empty>
    <!-- </j-card> -->
</template>

<script lang="ts" setup>
import Doc from './doc.vue';
import {
    savePatch,
    detail,
    getRegionsList,
    getAliyunProductsList,
    queryProductList,
    _delete,
    _deploy,
    _undeploy,
} from '@/api/northbound/alicloud';
import _ from 'lodash-es';
import { onlyMessage } from '@/utils/comm';
import MSelect from '../../components/MSelect/index.vue';
import { _deploy as deploy } from '@/api/device/product';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
    data: {
        type: Object,
    },
});
const emit = defineEmits(['refreshList']);
const formRef = ref();
const _errorSet = ref<Set<string>>(new Set());
const noData = ref(false);
const modelRef = reactive<any>({
    id: undefined,
    name: undefined,
    accessConfig: {
        regionId: undefined,
        instanceId: undefined,
        accessKeyId: undefined,
        accessSecret: undefined,
        apiEndpoint: undefined,
    },
    bridgeProductKey: undefined,
    bridgeProductName: undefined,
    mappings: [
        {
            productKey: undefined,
            productId: undefined,
        },
    ],
    description: undefined,
});

const addItem = () => {
    activeKey.value.push(String(modelRef.mappings.length));
    modelRef.mappings.push({
        productKey: undefined,
        productId: undefined,
    });
};

const delItem = (index: number) => {
    modelRef.mappings.splice(index, 1);
};

const productList = ref<Record<string, any>[]>([]);
const regionsList = ref<Record<string, any>[]>([]);
const aliyunProductList = ref<Record<string, any>[]>([]);
const loading = ref<boolean>(false);
const activeKey = ref<string[]>(['0']);

const queryRegionsList = async () => {
    const resp = await getRegionsList();
    if (resp.status === 200) {
        regionsList.value = resp.result as Record<string, any>[];
    }
};
const getProduct = async () => {
    const resp = await queryProductList({
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
    });
    if (resp.status === 200) {
        productList.value = resp?.result as Record<string, any>[];
    }
};

const getAliyunProduct = async (data: any) => {
    if (data.regionId && data.accessKeyId && data.accessSecret) {
        const resp: any = await getAliyunProductsList(data);
        if (resp.status === 200) {
            aliyunProductList.value = resp?.result?.data as Record<
                string,
                any
            >[];
        }
    }
};

const productChange = () => {
    const data = modelRef.accessConfig;
    getAliyunProduct(data);
};

const getPlatProduct = (val: string) => {
    const arr = modelRef.mappings.map((item) => item?.productId) || [];
    const checked = _.cloneDeep(arr);
    const _index = checked.findIndex((i) => i === val);
    checked.splice(_index, 1);
    const list = productList.value.filter(
        (i: any) => !checked.includes(i?.id as any),
    );
    return list || [];
};

const getAliyunProductList = (val: string) => {
    const items = modelRef.mappings.map((item) => item?.productKey) || [];
    const checked = _.cloneDeep(items);
    const _index = checked.findIndex((i) => i === val);
    checked.splice(_index, 1);
    const list = aliyunProductList.value?.filter(
        (i: any) => !checked.includes(i?.productKey as any),
    );
    return list || [];
};

const onCollChange = (_key: string[]) => {
    activeKey.value = _key;
};

const _error = computed(() => {
    return _errorSet.value.size ? $t('Detail.index.613238-36') : '';
});

const regionChange = (val: any) => {
    modelRef.accessConfig.apiEndpoint = `https://iot.${val}.aliyuncs.com`;
};
const onActiveProduct = async () => {
    [..._errorSet.value.values()].forEach(async (i: any) => {
        const resp = await deploy(i).catch((error) => {
            onlyMessage($t('Detail.index.613238-37'), 'error');
        });
        if (resp?.status === 200) {
            _errorSet.value.delete(i);
            onlyMessage($t('Detail.index.613238-38'));
        }
    });
    await getProduct();
};

const onPlatError = (val: any) => {
    const _item = productList.value.find((item) => item.id === val);
    if (val && _item && !_item?.state) {
        _errorSet.value.add(val);
    }
};

const _validator = (_rule: any, value: string): Promise<any> =>
    new Promise((resolve, reject) => {
        const _item = productList.value.find((item) => item.id === value);
        if (!modelRef.id || modelRef.id === ':id') {
            return resolve('');
        } else if (!_item && value) {
            return reject($t('Detail.index.613238-39'));
        }
        return resolve('');
    });

const saveBtn = () => {
    formRef.value
        .validate()
        .then(async (data: any) => {
            console.log(data, 'data');
            const product = (aliyunProductList.value || []).find(
                (item: any) => item?.productKey === data?.bridgeProductKey,
            );
            data.bridgeProductName = product?.productName || '';
            data.accessConfig.apiEndpoint = modelRef.accessConfig.apiEndpoint;
            loading.value = true;
            const resp = await savePatch({
                ...toRaw(modelRef),
                ...data,
            }).finally(() => {
                loading.value = false;
            });
            if (resp.status === 200) {
                onlyMessage($t('Detail.index.613238-38'));
                if (props.data?.id) {
                    emit('refreshList', true);
                } else {
                    emit('refreshList');
                }
            }
        })
        .catch((err: any) => {
            const _arr = err.errorFields.map((i: any) => i.name);
            _arr.map((item: string | any[]) => {
                if (item.length === 3 && !activeKey.value.includes(item[1])) {
                    activeKey.value.push(item[1]);
                }
            });
        });
};

const actionAliCloud = () => {
    let response = undefined;
    if (props.data?.state?.value !== 'disabled') {
        response = _undeploy(props.data?.id);
    } else {
        response = _deploy(props.data?.id);
    }
    response.then((res) => {
        if (res && res.status === 200) {
            onlyMessage($t('Detail.index.613238-38'));
            emit('refreshList', true);
        } else {
            onlyMessage($t('Detail.index.613238-40'), 'error');
        }
    });
    return response;
};

const deleteData = () => {
    const response = _delete(props.data?.id);
    response.then((resp) => {
        if (resp.status === 200) {
            onlyMessage($t('Detail.index.613238-38'));
            emit('refreshList');
        } else {
            onlyMessage($t('Detail.index.613238-40'), 'error');
        }
    });
    return response;
};
watch(
    () => props.data,
    async () => {
        _errorSet.value?.clear();
        noData.value = false;
        formRef.value?.resetFields();
        if (props.data?.id) {
            queryRegionsList();
            await getProduct();
            const resp = await detail(props.data?.id as string);
            const _data: any = resp.result;
            if (_data) {
                getAliyunProduct(_data?.accessConfig);
            }
            Object.assign(modelRef, _data);
            activeKey.value = (_data?.mappings || []).map(
                (_: any, index: number) => index,
            );
        } else {
            if (props.data?.type === 'add') {
                modelRef.id = undefined;
                modelRef.name = undefined;
                modelRef.accessConfig = {
                    regionId: undefined,
                    instanceId: undefined,
                    accessKeyId: undefined,
                    accessSecret: undefined,
                    apiEndpoint: undefined,
                };
                modelRef.bridgeProductKey = undefined;
                modelRef.bridgeProductName = undefined;
                modelRef.mappings = [
                    {
                        productKey: undefined,
                        productId: undefined,
                    },
                ];
                modelRef.description = undefined;
            } else if (props.data?.type === 'noData') {
                noData.value = true;
            }
        }
    },
    { immediate: true, deep: true },
);
</script>

<style scoped lang="less">
.box {
    position: relative;
    margin: 20px;
    .left {
        .left-content {
            width: 66%;
            padding: 0 20px;
            height: calc(100vh - 300px);
            overflow-y: auto;
            &::-webkit-scrollbar {
                width: 5px; /* 滚动条宽度 */
                background-color: #edf5ff; /* 滚动条背景色 */
            }
            &::-webkit-scrollbar-thumb {
                background-color: #d0d0d0; /* 滚动条拖动部分颜色 */
                border-radius: 4px; /* 滚动条拖动部分圆角 */
            }
        }
    }
    .right {
        width: 33%;
        position: absolute;
        right: 0;
        top: 40px;
        overflow-y: auto;
        height: 95%;
    }
    .control {
        position: absolute;
        right: 0;
        top: 0;
    }
}
</style>
