<template>
    <j-modal :visible="props.visible" :title="props.title" :maskClosable="false" destroy-on-close
        :width="(divWidth - 400) + 'px'" @ok="modalState.confirm" @cancel="modalState.cancel"
        :confirmLoading="modalState.confirmLoading" cancelText="取消" okText="确定">
        <div style="margin-top: 10px">
            <j-form layout="vertical" :model="myForm" :rules="rules" ref="formRef">
                <j-row :gutter="16">
                    <j-col class="gutter-row" :span="8">
                        <j-form-item label="名称" name="name">
                            <j-input v-model:value="myForm.name" placeholder="请输入名称" />
                        </j-form-item>
                    </j-col>
                    <j-col class="gutter-row" :span="8">
                        <j-form-item label="Topic" name="topic">
                            <j-input v-model:value="myForm.topic" :disabled="!!myForm?.id" placeholder="请输入Topic" />
                        </j-form-item>
                    </j-col>
                    <j-col class="gutter-row" :span="8">
                        <j-form-item name="factoryId">
                            <template #label>
                                <span>工厂名称 </span>
                            </template>
                            <j-select showSearch v-model:value="myForm.factoryId" @change="curProductChange"
                                placeholder="请选择工厂">
                                <j-select-option v-for="item in factoryList" :value="item.id" :key="item.id"
                                    :label="item.name">{{ item.name
                                    }}</j-select-option>
                            </j-select>
                        </j-form-item>
                    </j-col>
                </j-row>
                <j-form-item label="说明" name="description">
                    <j-textarea :maxlength="160" showCount :auto-size="{ minRows: 4, maxRows: 5 }"
                        v-model:value="myForm.description" placeholder="请输入说明" />
                </j-form-item>
                <j-row :gutter="16">
                    <div style="height: 400px" class="modal-all">
                        <div class="modal-left">
                            <span class="modal-span">产品列表</span>
                            <j-table :row-selection="{
                                selectedRowKeys: productState.selectedRowKeys, onChange: onProductSelectChange, getCheckboxProps: productState.getCheckboxProps
                            }" :columns="columnsAss" :data-source="props.productList" :pagination="false"
                                :rowKey="(record: any) => record.id" :scroll="{ y: 300 }" />
                        </div>
                        <div class="modal-right">
                            <span class="modal-span">设备列表</span>
                            <j-table
                                :row-selection="{ selectedRowKeys: myState.selectedRowKeys, onChange: onSelectChange }"
                                :columns="columnsDevice" :data-source="deviceList" :rowKey="(record: any) => record.id"
                                :pagination="pagination" :scroll="{ y: 280 }">
                                <template #bodyCell="{ column, record }">
                                    <template v-if="column.key === 'state'">
                                        <BadgeStatus :status="record.state?.value" :text="record.state?.text"
                                            :statusNames="{
                                                online: 'processing',
                                                offline: 'error',
                                                notActive: 'warning',
                                            }" />
                                    </template>
                                </template>
                            </j-table>
                        </div>
                    </div>
                </j-row>
            </j-form>
        </div>
    </j-modal>
</template>
<script lang="ts" setup>
import { getImage, onlyMessage } from '@/utils/comm';
import {
    addDataSand,
    editDataSand,
    queryNoPagingPostDevice,
    _deploy,
} from '@/api/exchange/receive';
import { isTopic, queryFactoryList } from '@/api/factory/factory';
import BadgeStatus from '@/components/BadgeStatus/index.vue';

const formRef = ref();
const divWidth = ref<number>(1920);
const deviceList = ref<Record<string, any>[]>([]);

const modalState = reactive({
    confirmLoading: false,
    confirm() {
        formRef.value?.validate().then(() => {
            modalState.confirmLoading = true;
            let { id, ...addData } = myForm.value;
            if (props.isAdd === 1) {
                if (myForm.value.productId && myForm.value.deviceIds) {
                    if (myForm.value.productId.length > 0 && myForm.value.deviceIds.length > 0) {
                        addDataSand(addData).then((res: any) => {
                            if (res.status === 200) {
                                onlyMessage('添加成功！');
                                modalState.confirmLoading = false;
                                emit('handModal')
                                formRef.value?.resetFields();
                            }
                        }).catch((e: any) => {
                            onlyMessage('添加失败', 'error');
                            modalState.confirmLoading = false;
                        });
                    } else {
                        onlyMessage('请必须选择产品或设备', 'error');
                        modalState.confirmLoading = false;
                    }
                } else {
                    onlyMessage('请必须选择产品或设备', 'error');
                    modalState.confirmLoading = false;
                }
            } else {
                if (myForm.value.productId && myForm.value.deviceIds) {
                    if (myForm.value.productId.length > 0 && myForm.value.deviceIds.length > 0) {
                        editDataSand(myForm.value).then((res: any) => {
                            if (res.status === 200) {
                                onlyMessage('修改成功！');
                                modalState.confirmLoading = false;
                                emit('handModal')
                                formRef.value?.resetFields();
                            }
                        }).catch((e: any) => {
                            onlyMessage('修改失败', 'error');
                            modalState.confirmLoading = false;
                        });

                    } else {
                        onlyMessage('请必须选择产品或设备', 'error');
                        modalState.confirmLoading = false;
                    }
                } else {
                    onlyMessage('请必须选择产品或设备', 'error');
                    modalState.confirmLoading = false;
                }
            }
        });
    },
    cancel() {
        emit('handModal')
        productState.selectedRowKeys = []
        myState.selectedRowKeys = []
        formRef.value.resetFields();
    },
});

const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    visible: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '新增',
    },
    factoryList: {
        type: Object,
        default: [],
    },
    isAdd: {
        type: Number,
        default: 0,
    },
    productList: {
        type: Object,
        default: [],
    },
    form: {
        type: Object,
        default: {
            id: '',
            name: '',
            topic: '',
            productId: [],
            deviceIds: [],
            factoryId: '',
            description: '',
            type: 'receive',
            state: 'enabled',
        },
    },
})

const myForm = ref<any>(props.form)

type Key = string | number;
const productState = reactive<{
    selectedRowKeys: Key[];
    loading: boolean;
    getCheckboxProps: () => { disabled: boolean; }
}>({
    selectedRowKeys: myForm.value.productId || [], //已选择项赋值
    loading: false,
    getCheckboxProps: () => ({ disabled: false })
});

const myState = reactive<{
    selectedRowKeys: Key[];
    loading: boolean;
}>({
    selectedRowKeys: myForm.value.deviceIds || [],
    loading: false,
});

const onProductSelectChange = (selectedRowKeys: Key[]) => {
    productState.selectedRowKeys = selectedRowKeys;
    myForm.value.productId = productState.selectedRowKeys;
    myState.selectedRowKeys = []
};

const onSelectChange = (selectedRowKeys: Key[]) => {
    myState.selectedRowKeys = selectedRowKeys;
    myForm.value.deviceIds = myState.selectedRowKeys;
};

const vailTopic = async (_: Record<string, any>, value: string) => {
    if (value) {
        let updateID = myForm.value.id;
        if (updateID) {
            const resp: any = await isTopic({
                topic: value,
                id: updateID,
            });
            if (resp.status === 200 && resp.result?.passed === false) {
                return Promise.reject('Topic重复');
            } else {
                return Promise.resolve();
            }
        } else {
            const resp: any = await isTopic({
                topic: value,
            });
            if (resp.status === 200 && resp.result?.passed === false) {
                return Promise.reject('Topic重复');
            } else {
                return Promise.resolve();
            }
        }
    } else {
        return Promise.resolve();
    }
};

const rules = {
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
    topic: [
        { required: true, message: '请输入Topic', trigger: 'blur' },
        { trigger: 'blur', validator: vailTopic },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
    factoryId: [{ required: true, message: '请选择工厂', trigger: 'blur' }],
    description: [
        { max: 200, message: '最多可输入200位字符', trigger: 'change' },
    ],
};

const columnsAss = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
    },
    {
        title: '产品名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    },
]

const columnsDevice = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
    },
    {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    },
    {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        ellipsis: true,
    },
]

const pagination = {
    showTotal: (num: number, range: number[]) => {
        return `总共 ${num} 条`;
    },
    defaultPageSize: 5,
    total: deviceList.value?.length,
    pageSizeOptions: ['5', '10', '20', '50', '100'],
    showQuickJumper: true,
    showSizeChanger: true,
    size: 'small',
};

const handleResize = () => {
    divWidth.value = window.innerWidth;
}

//监听产品select选项变动,清空设备多选框
const curProductChange = (val: any) => {
    myForm.value.deviceIds = [];
    myState.selectedRowKeys = []
};

watch(
    () => props.form,
    (newValue: any) => {
        myForm.value = newValue
        productState.selectedRowKeys = newValue.productId
        myState.selectedRowKeys = newValue.deviceIds
        if (props.isAdd === 2) {
            productState.getCheckboxProps = () => ({ disabled: true })
        } else {
            productState.getCheckboxProps = () => ({ disabled: false })
        }
    }
)

watch(
    () => myForm.value.productId,
    (newValue, oldValue) => {
        if (newValue?.length !== 0 && myForm.value.factoryId) {
            const setData = {
                paging: false,
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms: [
                    {
                        terms: [
                            {
                                column: 'productId',
                                termType: 'in',
                                type: 'and',
                                value: newValue,
                            },
                            {
                                column: 'factoryId',
                                termType: 'eq',
                                type: 'and',
                                value: `${myForm.value.factoryId}`,
                            },
                        ],
                    },
                ],
            };
            queryNoPagingPostDevice(setData).then((resp) => {
                // console.log('res',resp)
                if (resp.status === 200) {
                    deviceList.value = resp.result as Record<string, any>[];
                }
            });
        } else {
            deviceList.value = [];
        }
    },
);

watch(
    () => myForm.value.factoryId,
    (newValue, oldValue) => {
        if (newValue && myForm.value.productId) {
            if (myForm.value.productId.length > 0) {
                const setData = {
                    paging: false,
                    sorts: [{ name: 'createTime', order: 'desc' }],
                    terms: [
                        {
                            terms: [
                                {
                                    column: 'productId',
                                    termType: 'in',
                                    type: 'and',
                                    value: myForm.value.productId,
                                },
                                {
                                    column: 'factoryId',
                                    termType: 'eq',
                                    type: 'and',
                                    value: `${newValue}`,
                                },
                            ],
                        },
                    ],
                };
                queryNoPagingPostDevice(setData).then((resp) => {
                    // console.log('resp',resp)
                    if (resp.status === 200) {
                        deviceList.value = resp.result as Record<string, any>[];
                    }
                });
            }
        } else {
            deviceList.value = [];
        }
    },
);

const emit = defineEmits(['handModal']);

onMounted(() => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
</script>
<style lang="less" scoped>
.modal-all {
    width: 100%;
    display: flex;
    flex-direction: row;

    .modal-left {
        width: 30%;
        height: 380px;
    }

    .modal-right {
        width: 68%;
        height: 380px;
        margin-left: 20px;
    }
}

.modal-span {
    font-size: 16px;
}
</style>