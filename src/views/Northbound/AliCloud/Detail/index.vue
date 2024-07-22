<template>
            <j-card>
                <div class="box">
                    <div class="left">
                        <div class="left-content">
                            <TitleComponent data="基本信息" />
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
                                                title: '确认启用',
                                                onConfirm: onActiveProduct,
                                            }"
                                            size="small"
                                            :hasPermission="'device/Product:action'"
                                        >
                                            立即启用
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
                                            label="名称"
                                            name="name"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: '请输入名称',
                                                },
                                                {
                                                    max: 64,
                                                    message: '最多输入64个字符',
                                                },
                                            ]"
                                        >
                                            <j-input
                                                placeholder="请输入名称"
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
                                                    message: '请选择服务地址',
                                                },
                                            ]"
                                        >
                                            <template #label>
                                                <span>
                                                    服务地址
                                                    <j-tooltip
                                                        title="阿里云内部给每台机器设置的唯一编号"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </j-tooltip>
                                                </span>
                                            </template>
                                            <j-select
                                                placeholder="请选择服务地址"
                                                v-model:value="
                                                    modelRef.accessConfig
                                                        .regionId
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
                                                    >{{
                                                        item.name
                                                    }}</j-select-option
                                                >
                                            </j-select>
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="24">
                                        <j-form-item
                                            :name="[
                                                'accessConfig',
                                                'instanceId',
                                            ]"
                                        >
                                            <template #label>
                                                <span>
                                                    实例ID
                                                    <j-tooltip
                                                        title="阿里云物联网平台中的实例ID,没有则不填"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </j-tooltip>
                                                </span>
                                            </template>
                                            <j-input
                                                placeholder="请输入实例ID"
                                                v-model:value="
                                                    modelRef.accessConfig
                                                        .instanceId
                                                "
                                                @blur="productChange"
                                            />
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="24">
                                        <j-form-item
                                            :name="[
                                                'accessConfig',
                                                'accessKeyId',
                                            ]"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: '请输入accessKey',
                                                },
                                                {
                                                    max: 64,
                                                    message: '最多输入64个字符',
                                                },
                                            ]"
                                        >
                                            <template #label>
                                                <span>
                                                    accessKey
                                                    <j-tooltip
                                                        title="用于程序通知方式调用云服务API的用户标识"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </j-tooltip>
                                                </span>
                                            </template>
                                            <j-input
                                                placeholder="请输入accessKey"
                                                v-model:value="
                                                    modelRef.accessConfig
                                                        .accessKeyId
                                                "
                                                @blur="productChange"
                                            />
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="24">
                                        <j-form-item
                                            :name="[
                                                'accessConfig',
                                                'accessSecret',
                                            ]"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message:
                                                        '请输入accessSecret',
                                                },
                                                {
                                                    max: 64,
                                                    message: '最多输入64个字符',
                                                },
                                            ]"
                                        >
                                            <template #label>
                                                <span>
                                                    accessSecret
                                                    <j-tooltip
                                                        title="用于程序通知方式调用云服务费API的秘钥标识"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </j-tooltip>
                                                </span>
                                            </template>
                                            <j-input
                                                placeholder="请输入accessSecret"
                                                v-model:value="
                                                    modelRef.accessConfig
                                                        .accessSecret
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
                                                message: '请选择网桥产品',
                                            }"
                                        >
                                            <template #label>
                                                <span>
                                                    网桥产品
                                                    <j-tooltip
                                                        title="物联网平台对应的阿里云产品"
                                                    >
                                                        <AIcon
                                                            type="QuestionCircleOutlined"
                                                            style="
                                                                margin-left: 2px;
                                                            "
                                                        />
                                                    </j-tooltip>
                                                </span>
                                            </template>
                                            <j-select
                                                placeholder="请选择网桥产品"
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
                                        <p>产品映射</p>
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
                                                          `产品映射${index + 1}`
                                                        : `产品映射${index + 1}`
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
                                                            label="阿里云产品"
                                                            :name="[
                                                                'mappings',
                                                                index,
                                                                'productKey',
                                                            ]"
                                                            :rules="{
                                                                required: true,
                                                                message:
                                                                    '请选择阿里云产品',
                                                            }"
                                                        >
                                                            <j-select
                                                                placeholder="请选择阿里云产品"
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
                                                                    :key="
                                                                        i.productKey
                                                                    "
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
                                                            label="平台产品"
                                                            :name="[
                                                                'mappings',
                                                                index,
                                                                'productId',
                                                            ]"
                                                            :rules="[
                                                                {
                                                                    required: true,
                                                                    message:
                                                                        '请选择平台产品',
                                                                },
                                                                {
                                                                    validator:
                                                                        _validator,
                                                                    trigger:
                                                                        'change',
                                                                },
                                                            ]"
                                                        >
                                                            <!-- <j-select
                                                                placeholder="请选择平台产品"
                                                                v-model:value="
                                                                    item.productId
                                                                "
                                                                show-search
                                                            >
                                                                <j-select-option
                                                                    v-for="i in getPlatProduct(
                                                                        item.productId ||
                                                                            '',
                                                                    )"
                                                                    :key="i.id"
                                                                    :value="
                                                                        i?.id
                                                                    "
                                                                    :label="
                                                                        i.name
                                                                    "
                                                                    >{{
                                                                        i.name
                                                                    }}</j-select-option
                                                                >
                                                            </j-select> -->
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
                                                                @error="
                                                                    onPlatError
                                                                "
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
                                            style="
                                                width: 100%;
                                                margin-top: 10px;
                                            "
                                            @click="addItem"
                                        >
                                            <AIcon
                                                type="PlusOutlined"
                                                style="margin-left: 2px"
                                            />添加
                                        </j-button>
                                    </j-col>
                                    <j-col :span="24" style="margin-top: 20px">
                                        <j-form-item
                                            label="说明"
                                            name="description"
                                            :rules="{
                                                max: 200,
                                                message: '最多输入200个字符',
                                            }"
                                        >
                                            <j-textarea
                                                v-model:value="
                                                    modelRef.description
                                                "
                                                placeholder="请输入说明"
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
                                :tooltip="{
                                    title:
                                        data?.state?.value !== 'disabled'
                                            ? '请先禁用该数据，再删除。'
                                            : '删除',
                                }"
                                :popConfirm="{
                                    title: `确认删除`,
                                    onConfirm: deleteData,
                                }"
                                >删除
                            </PermissionButton>
                            <PermissionButton
                                v-if="data?.id"
                                type="primary"
                                ghost
                                hasPermission="Northbound/AliCloud:action"
                                :tooltip="{
                                    title:
                                        data?.state?.value !== 'disabled'
                                            ? '禁用'
                                            : '启用',
                                }"
                                :popConfirm="{
                                    title: `确认${
                                        data?.state?.value !== 'disabled'
                                            ? '禁用'
                                            : '启用'
                                    }?`,
                                    onConfirm: actionAliCloud,
                                }"
                                >{{
                                    data?.state?.value !== 'disabled'
                                        ? '禁用'
                                        : '启用'
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
                                保存
                            </PermissionButton>
                        </a-space>
                    </div>
                </div>
            </j-card>
      
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
    _undeploy
} from '@/api/northbound/alicloud';
import _ from 'lodash-es';
import { onlyMessage } from '@/utils/comm';
import MSelect from '../../components/MSelect/index.vue';
import { _deploy as deploy } from '@/api/device/product';
const props = defineProps({
    data: {
        type: Object,
    },
});
const emit = defineEmits(['refreshList']);
const formRef = ref();
const _errorSet = ref<Set<string>>(new Set());

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
    return _errorSet.value.size ? `当前选择的部分产品为禁用状态` : '';
});

const regionChange = (val: any) => {
    modelRef.accessConfig.apiEndpoint = `https://iot.${val}.aliyuncs.com`;
};
const onActiveProduct = async () => {
    [..._errorSet.value.values()].forEach(async (i: any) => {
        const resp = await deploy(i).catch((error) => {
            onlyMessage('操作失败', 'error');
        });
        if (resp?.status === 200) {
            _errorSet.value.delete(i);
            onlyMessage('操作成功！');
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
            return reject('关联产品已被删除，请重新选择');
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
                onlyMessage('操作成功！');
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
            onlyMessage('操作成功！');
            emit('refreshList', true);
        } else {
            onlyMessage('操作失败！', 'error');
        }
    });
    return response;
};

const deleteData = () => {
    const response = _delete(props.data?.id);
    response.then((resp) => {
        if (resp.status === 200) {
            onlyMessage('操作成功！');
            emit('refreshList');
        } else {
            onlyMessage('操作失败！', 'error');
        }
    });
    return response;
};
watch(
    () => props.data,
    async () => {
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
        }
    },
    { immediate: true, deep: true },
);
</script>

<style scoped lang="less">
.box {
    position: relative;
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
