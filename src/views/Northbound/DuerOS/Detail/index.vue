<template>
    <j-card>
        <div class="box" v-if="!noData">
            <div class="left">
                <div class="left-content">
                    <TitleComponent data="基本信息" />
                    <j-alert
                        v-if="_error && modelRef?.id"
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
                            <j-col :span="12">
                                <j-form-item
                                    label="产品"
                                    name="id"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择产品',
                                        },
                                        {
                                            validator: _validator,
                                            trigger: 'change',
                                        },
                                    ]"
                                >
                                    <MSelect
                                        v-model:value="modelRef.id"
                                        :options="productList"
                                        @change="productChange"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    name="applianceType"
                                    :rules="{
                                        required: true,
                                        message: '请选择设备类型',
                                    }"
                                >
                                    <template #label>
                                        <span>
                                            设备类型
                                            <j-tooltip
                                                title="DuerOS平台拟定的规范"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </j-tooltip>
                                        </span>
                                    </template>
                                    <j-select
                                        placeholder="请选择设备类型"
                                        v-model:value="modelRef.applianceType"
                                        show-search
                                        @change="typeChange"
                                    >
                                        <j-select-option
                                            v-for="item in typeList"
                                            :key="item.id"
                                            :value="item.id"
                                            :label="item.name"
                                            >{{ item.name }}</j-select-option
                                        >
                                    </j-select>
                                </j-form-item>
                                <j-form-item
                                    name="productName"
                                    v-show="false"
                                    label="产品名称"
                                >
                                    <j-input
                                        v-model:value="modelRef.productName"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="24">
                                <p>动作映射</p>
                                <j-collapse
                                    v-if="modelRef.actionMappings.length"
                                    :activeKey="actionActiveKey"
                                    @change="onActionCollChange"
                                >
                                    <j-collapse-panel
                                        v-for="(
                                            item, index
                                        ) in modelRef.actionMappings"
                                        :key="index"
                                        :header="
                                            item.action
                                                ? getTypesActions(
                                                      item.action,
                                                  ).find(
                                                      (i) =>
                                                          i.id === item.action,
                                                  )?.name
                                                : `动作映射${index + 1}`
                                        "
                                    >
                                        <template #extra>
                                            <div
                                                style="width: 20px"
                                                @click.stop
                                            >
                                                <ConfirmModal
                                                    title="确认删除？"
                                                    :onConfirm="
                                                        () => delItem(index)
                                                    "
                                                >
                                                    <AIcon
                                                        type="DeleteOutlined"
                                                    />
                                                </ConfirmModal>
                                            </div>
                                        </template>
                                        <j-row :gutter="24">
                                            <j-col :span="12">
                                                <j-form-item
                                                    :name="[
                                                        'actionMappings',
                                                        index,
                                                        'action',
                                                    ]"
                                                    :rules="{
                                                        required: true,
                                                        message: '请选择动作',
                                                    }"
                                                >
                                                    <template #label>
                                                        <span>
                                                            动作
                                                            <j-tooltip
                                                                title="DuerOS平台拟定的设备类型具有的相关动作"
                                                            >
                                                                <AIcon
                                                                    type="QuestionCircleOutlined"
                                                                />
                                                            </j-tooltip>
                                                        </span>
                                                    </template>
                                                    <j-select
                                                        placeholder="请选择动作"
                                                        v-model:value="
                                                            item.action
                                                        "
                                                        show-search
                                                    >
                                                        <j-select-option
                                                            v-for="i in getTypesActions(
                                                                item.action ||
                                                                    '',
                                                            )"
                                                            :key="i.id"
                                                            :value="i.id"
                                                            :label="i.name"
                                                            >{{
                                                                i.name
                                                            }}</j-select-option
                                                        >
                                                    </j-select>
                                                </j-form-item>
                                            </j-col>
                                            <j-col :span="12">
                                                <j-form-item
                                                    :name="[
                                                        'actionMappings',
                                                        index,
                                                        'actionType',
                                                    ]"
                                                    :rules="{
                                                        required: true,
                                                        message: '请选择操作',
                                                    }"
                                                >
                                                    <template #label>
                                                        <span>
                                                            操作
                                                            <j-tooltip
                                                                title="映射物联网平台中所选产品具备的动作"
                                                            >
                                                                <AIcon
                                                                    type="QuestionCircleOutlined"
                                                                />
                                                            </j-tooltip>
                                                        </span>
                                                    </template>
                                                    <j-select
                                                        placeholder="请选择操作"
                                                        v-model:value="
                                                            item.actionType
                                                        "
                                                        show-search
                                                        @change="
                                                            () =>
                                                                onActionTypeChange(
                                                                    index,
                                                                )
                                                        "
                                                    >
                                                        <j-select-option
                                                            value="command"
                                                            >下发指令</j-select-option
                                                        >
                                                        <j-select-option
                                                            value="latestData"
                                                            >获取历史数据</j-select-option
                                                        >
                                                    </j-select>
                                                </j-form-item>
                                            </j-col>
                                            <j-col
                                                :span="24"
                                                v-if="item.actionType"
                                            >
                                                <j-form-item
                                                    :name="[
                                                        'actionMappings',
                                                        index,
                                                        'command',
                                                    ]"
                                                >
                                                    <Command
                                                        ref="command"
                                                        :metadata="
                                                            findProductMetadata
                                                        "
                                                        v-model:modelValue="
                                                            item.command
                                                        "
                                                        :actionType="
                                                            item.actionType
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
                                    style="width: 100%; margin-top: 10px"
                                    @click="addItem"
                                >
                                    <AIcon
                                        type="PlusOutlined"
                                        style="margin-left: 2px"
                                    />新增动作
                                </j-button>
                            </j-col>
                            <j-col :span="24">
                                <p style="margin-top: 20px">属性映射</p>
                                <j-collapse
                                    v-if="modelRef.propertyMappings.length"
                                    :activeKey="propertyActiveKey"
                                    @change="onPropertyCollChange"
                                >
                                    <j-collapse-panel
                                        v-for="(
                                            item, index
                                        ) in modelRef.propertyMappings"
                                        :key="index"
                                        :header="
                                            item.source
                                                ? getDuerOSProperties(
                                                      item.source,
                                                  ).find(
                                                      (i) =>
                                                          i.id === item.source,
                                                  )?.name
                                                : `属性映射${index + 1}`
                                        "
                                    >
                                        <template #extra>
                                            <div
                                                style="width: 20px"
                                                @click.stop
                                            >
                                                <ConfirmModal
                                                    title="确认删除？"
                                                    :onConfirm="
                                                        () =>
                                                            delPropertyItem(
                                                                index,
                                                            )
                                                    "
                                                >
                                                    <AIcon
                                                        type="DeleteOutlined"
                                                    />
                                                </ConfirmModal>
                                            </div>
                                        </template>
                                        <j-row :gutter="24">
                                            <j-col :span="12">
                                                <j-form-item
                                                    label="DuerOS属性"
                                                    :name="[
                                                        'propertyMappings',
                                                        index,
                                                        'source',
                                                    ]"
                                                    :rules="{
                                                        required: true,
                                                        message:
                                                            '请选择DuerOS属性',
                                                    }"
                                                >
                                                    <j-select
                                                        placeholder="请选择DuerOS属性"
                                                        v-model:value="
                                                            item.source
                                                        "
                                                        show-search
                                                    >
                                                        <j-select-option
                                                            v-for="i in getDuerOSProperties(
                                                                item.source ||
                                                                    '',
                                                            )"
                                                            :key="i.id"
                                                            :value="i.id"
                                                            >{{
                                                                i.name
                                                            }}</j-select-option
                                                        >
                                                    </j-select>
                                                </j-form-item>
                                            </j-col>
                                            <j-col :span="12">
                                                <j-form-item
                                                    label="平台属性"
                                                    :name="[
                                                        'propertyMappings',
                                                        index,
                                                        'target',
                                                    ]"
                                                    :rules="[
                                                        {
                                                            required: true,
                                                            message:
                                                                '请选择平台属性',
                                                        },
                                                    ]"
                                                >
                                                    <MSelect
                                                        v-model:value="
                                                            item.target
                                                        "
                                                        type="target"
                                                        :options="
                                                            getProductProperties(
                                                                item.target,
                                                            )
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
                                    style="width: 100%; margin-top: 10px"
                                    @click="addPropertyItem"
                                >
                                    <AIcon
                                        type="PlusOutlined"
                                        style="margin-left: 2px"
                                    />新增属性
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
                                        v-model:value="modelRef.description"
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
                        hasPermission="Northbound/DuerOS:delete"
                        danger
                        :disabled="data?.state?.value !== 'disabled'"
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
                        hasPermission="Northbound/DuerOS:action"
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
                            onConfirm: actionDuerOS,
                        }"
                        >{{
                            data?.state?.value !== 'disabled' ? '禁用' : '启用'
                        }}
                    </PermissionButton>
                    <PermissionButton
                        type="primary"
                        :loading="loading"
                        @click="saveBtn"
                        :hasPermission="[
                            'Northbound/DuerOS:add',
                            'Northbound/DuerOS:update',
                        ]"
                    >
                        保存
                    </PermissionButton>
                </a-space>
            </div>
        </div>
        <j-empty
            v-else
            style="height: calc(100vh - 300px); padding-top: 200px"
        ></j-empty>
    </j-card>
</template>

<script lang="ts" setup>
import Doc from './doc.vue';
import Command from './command/index.vue';
import {
    queryProductList,
    queryTypes,
    savePatch,
    detail,
    _undeploy,
    _deploy,
    _delete,
} from '@/api/northbound/dueros';
import _, { cloneDeep } from 'lodash-es';
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
const noData = ref(false);
const modelRef = reactive({
    id: undefined,
    name: undefined,
    applianceType: undefined,
    productName: undefined,
    actionMappings: [
        {
            actionType: undefined,
            action: undefined,
            command: {
                messageType: undefined,
                message: {
                    properties: undefined,
                    functionId: undefined,
                    inputs: [],
                },
            },
        },
    ],
    propertyMappings: [
        {
            source: undefined,
            target: undefined,
        },
    ],
    description: undefined,
});

const productList = ref<Record<string, any>[]>([]);
const typeList = ref<Record<string, any>[]>([]);
const command = ref([]);
const loading = ref<boolean>(false);
const actionActiveKey = ref<string[]>(['0']);
const propertyActiveKey = ref<string[]>(['0']);

const _error = ref<string>('');

const onPropertyCollChange = (_key: string[]) => {
    propertyActiveKey.value = _key;
};

const onActionCollChange = (_key: string[]) => {
    actionActiveKey.value = _key;
};

const onActionTypeChange = (_index: number) => {
    modelRef.actionMappings[_index].command = {
        messageType: undefined,
        message: {
            properties: undefined,
            functionId: undefined,
            inputs: [],
            value: undefined,
        },
    };
};

const addItem = () => {
    actionActiveKey.value.push(String(modelRef.actionMappings.length));
    modelRef.actionMappings.push({
        actionType: undefined,
        action: undefined,
        command: {
            messageType: undefined,
            message: {
                properties: undefined,
                functionId: undefined,
                inputs: [],
            },
        },
    });
};

const delItem = (index: number) => {
    modelRef.actionMappings.splice(index, 1);
    if (!modelRef.actionMappings.length) {
        addItem();
    }
};

const addPropertyItem = () => {
    propertyActiveKey.value.push(String(modelRef.propertyMappings.length));
    modelRef.propertyMappings.push({
        source: undefined,
        target: undefined,
    });
};

const delPropertyItem = (index: number) => {
    modelRef.propertyMappings.splice(index, 1);
    if (!modelRef.propertyMappings.length) {
        addPropertyItem();
    }
};

const productChange = (value: string) => {
    modelRef.propertyMappings = modelRef.propertyMappings?.map((item) => {
        return { source: item.source, target: undefined };
    });
    modelRef.actionMappings = modelRef.actionMappings?.map((item) => {
        return {
            ...item,
            command: {
                messageType: undefined,
                message: {
                    properties: undefined,
                    functionId: undefined,
                    inputs: [],
                    value: undefined,
                },
            },
        };
    });
    const item = productList.value.find((item) => item.id === value);
    if (item) {
        modelRef.productName = item.name;
    }
};

const typeChange = () => {
    modelRef.propertyMappings = modelRef.propertyMappings?.map((item) => {
        return { source: undefined, target: item.target };
    });
    modelRef.actionMappings = modelRef.actionMappings?.map((item) => {
        return { ...item, action: undefined };
    });
};

const findApplianceType = computed(() => {
    if (!modelRef.applianceType) return;
    return typeList.value.find((item) => item.id === modelRef.applianceType);
});

const findProduct = computed(() => {
    if (!modelRef.id) return;
    const _product = productList.value?.find(
        (item: any) => item.id === modelRef.id,
    );
    return _product;
});

const findProductMetadata = computed(() => {
    if (!modelRef.id) return;
    return (
        findProduct.value?.metadata &&
        JSON.parse(findProduct.value?.metadata || '{}')
    );
});

// 查询产品列表
const getProduct = async (id?: string) => {
    const resp = await queryProductList(id);
    if (resp.status === 200) {
        productList.value = resp?.result as Record<string, any>[];
    }
};

const getTypes = async () => {
    const resp = await queryTypes();
    if (resp.status === 200) {
        typeList.value = resp?.result as Record<string, any>[];
    }
};

const getDuerOSProperties = (val: string) => {
    const arr = modelRef.propertyMappings?.map((item) => item?.source) || [];
    const checked = _.cloneDeep(arr);
    const _index = checked.findIndex((i) => i === val);
    // 去掉重复的
    checked.splice(_index, 1);
    const targetList = findApplianceType.value?.properties;
    const list = targetList?.filter(
        (i: { id: string }) => !checked?.includes(i?.id as any),
    );
    return list || [];
};

const getProductProperties = (val: string[]) => {
    const items =
        modelRef.propertyMappings?.map((item: any) => item?.target) || [];
    const checked = items.filter((i) => i);
    const _checked: any[] = [];
    checked?.map((_item) => {
        if (!val?.includes(_item)) {
            _checked.push(_item);
        }
    });
    const sourceList = findProductMetadata.value?.properties;
    const list = sourceList?.filter(
        (i: { id: string }) => !_checked?.includes(i.id),
    );
    return list || [];
};

const getTypesActions = (val: string) => {
    const items = modelRef.actionMappings?.map((item) => item?.action) || [];
    const checked = _.cloneDeep(items);
    const _index = checked.findIndex((i) => i === val);
    checked.splice(_index, 1);
    const actionsList = findApplianceType.value?.actions || [];
    const list = actionsList?.filter(
        (i: { id: string; name: string }) => !checked?.includes(i?.id as any),
    );
    return list || [];
};

const onActiveProduct = () => {
    if (modelRef.id) {
        const response = deploy(modelRef.id);
        response.then((resp) => {
            if (resp.status === 200) {
                onlyMessage('操作成功！');
                getProduct(modelRef.id);
                _error.value = '';
            }
        });
        return response;
    }
};

const _validator = (_rule: any, value: string): Promise<any> =>
    new Promise((resolve, reject) => {
        const _item = productList.value.find((item) => item.id === value);
        if (!modelRef.id) {
            return resolve('');
        } else if (!_item && value) {
            productChange(value);
            return reject('关联产品已被删除，请重新选择');
        } else {
            if (!_item?.state) {
                _error.value = `当前选择的${_item.name}产品为禁用状态`;
            } else {
                _error.value = '';
            }
            return resolve('');
        }
    });

const saveBtn = async () => {
    const tasks: any[] = [];
    for (let i = 0; i < command.value.length; i++) {
        const res = await (command.value[i] as any)?.saveBtn();
        if (!res || (res?.errorFields && res.errorFields.length)) {
            actionActiveKey.value.push(String(i));
            tasks.push(false);
        } else {
            tasks.push(res);
        }
    }
    formRef.value
        .validate()
        .then(async (data: any) => {
            if (tasks.every((item) => item) && data) {
                loading.value = true;
                data.propertyMappings = data.propertyMappings?.map(
                    (it: any) => {
                        return {
                            source: it.source,
                            target: Array.isArray(it?.target)
                                ? it?.target
                                : [it?.target],
                        };
                    },
                );
                const resp = await savePatch(data).finally(() => {
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
            }
        })
        .catch((err: any) => {
            const _arr = err.errorFields?.map((item: any) => item.name);
            _arr?.map((item: string | any[]) => {
                if (item.length >= 3) {
                    if (
                        item[0] === 'propertyMappings' &&
                        !propertyActiveKey.value?.includes(item[1])
                    ) {
                        propertyActiveKey.value.push(item[1]);
                    }
                    if (
                        item[0] === 'actionMappings' &&
                        !actionActiveKey.value.includes(item[1])
                    ) {
                        actionActiveKey.value.push(item[1]);
                    }
                }
            });
        });
};

const actionDuerOS = () => {
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
        noData.value = false
        formRef.value?.resetFields();
        if (props.data?.id) {
            await getProduct(props.data?.id as string);
            getTypes();
            const resp = await detail(props.data?.id as string);
            const _data: any = resp.result;
            const _obj = cloneDeep(_data);
            if (_data) {
                _obj.applianceType = _obj?.applianceType?.value;
            }
            Object.assign(modelRef, _obj);
        } else {
            if (props.data?.type === 'add') {
                modelRef.id = undefined;
                modelRef.name = undefined;
                modelRef.applianceType = undefined;
                modelRef.productName = undefined;
                modelRef.actionMappings = [
                    {
                        actionType: undefined,
                        action: undefined,
                        command: {
                            messageType: undefined,
                            message: {
                                properties: undefined,
                                functionId: undefined,
                                inputs: [],
                            },
                        },
                    },
                ];
                modelRef.propertyMappings = [
                    {
                        source: undefined,
                        target: undefined,
                    },
                ];
                modelRef.description = undefined;
            }else if(props.data?.type === 'noData'){
                noData.value = true
            }
        }
    },
    { immediate: true, deep: true },
);
</script>

<style scoped lang="less">
.box {
    position: relative;
    height: 100%;
    .left {
        overflow: hidden;
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
        height: 90%;
        &::-webkit-scrollbar {
            width: 5px; /* 滚动条宽度 */
            background-color: #edf5ff; /* 滚动条背景色 */
        }
        &::-webkit-scrollbar-thumb {
            background-color: #d0d0d0; /* 滚动条拖动部分颜色 */
            border-radius: 4px; /* 滚动条拖动部分圆角 */
        }
    }
    .control {
        position: absolute;
        right: 0;
        top: 0;
    }
}
</style>
